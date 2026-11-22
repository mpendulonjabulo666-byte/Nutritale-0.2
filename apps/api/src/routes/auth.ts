import { randomUUID } from 'node:crypto';
import { Router, type RequestHandler } from 'express';
import { burnPasswordCheck, hashPassword, verifyPassword } from '../auth/passwords.js';
import { authOf, requireAuth } from '../auth/requireAuth.js';
import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_MS, hashRefreshToken, newRefreshToken, signAccessToken } from '../auth/tokens.js';
import { HttpError } from '../errors.js';
import { parse } from '../http/validate.js';
import { EmailTakenError, toPublicUser, type Repos, type UserRecord } from '../storage/types.js';
import { emptyBody, loginBody, refreshBody, registerBody } from './schemas.js';

export interface RouteDeps {
  repos: Repos;
  secret: string;
  now: () => Date;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

const invalidCredentials = () => new HttpError(401, 'Email or password is incorrect', 'invalid_credentials');
const invalidRefresh = () => new HttpError(401, 'Refresh token is invalid or expired', 'invalid_refresh_token');

async function issueTokens(deps: RouteDeps, userId: string, familyId: string, now: Date): Promise<TokenPair> {
  const refreshToken = newRefreshToken();
  await deps.repos.sessions.insert({
    familyId,
    userId,
    tokenHash: hashRefreshToken(refreshToken),
    createdAt: now,
    expiresAt: new Date(now.getTime() + REFRESH_TOKEN_TTL_MS),
    revokedAt: null,
  });
  const accessToken = await signAccessToken({ sub: userId, sid: familyId }, deps.secret, now);
  return { accessToken, refreshToken, tokenType: 'Bearer', expiresIn: ACCESS_TOKEN_TTL_SECONDS };
}

/** Auth routes. `authLimit` is the tighter per-IP limiter for register, login and refresh. */
export function authRouter(deps: RouteDeps, authLimit: RequestHandler): Router {
  const router = Router();
  const { users, sessions } = deps.repos;

  router.post('/register', authLimit, async (req, res) => {
    const body = parse(registerBody, req.body);
    const now = deps.now();
    const passwordHash = await hashPassword(body.password);
    let user: UserRecord;
    try {
      user = await users.create({ email: body.email, passwordHash, firstName: body.firstName, market: body.market, locale: body.locale }, now);
    } catch (err) {
      if (err instanceof EmailTakenError) throw new HttpError(409, 'An account with this email already exists', 'email_taken');
      throw err;
    }
    const tokens = await issueTokens(deps, user.id, randomUUID(), now);
    res.status(201).json({ user: toPublicUser(user), ...tokens });
  });

  router.post('/login', authLimit, async (req, res) => {
    const body = parse(loginBody, req.body);
    const user = await users.findByEmail(body.email);
    if (!user) {
      await burnPasswordCheck(body.password);
      throw invalidCredentials();
    }
    if (!(await verifyPassword(user.passwordHash, body.password))) throw invalidCredentials();
    const tokens = await issueTokens(deps, user.id, randomUUID(), deps.now());
    res.status(200).json({ user: toPublicUser(user), ...tokens });
  });

  router.post('/refresh', authLimit, async (req, res) => {
    const body = parse(refreshBody, req.body);
    const now = deps.now();
    const hash = hashRefreshToken(body.refreshToken);
    const record = await sessions.findByHash(hash);
    if (!record) throw invalidRefresh();
    if (record.revokedAt) {
      // A revoked token came back: someone kept a copy. Kill the whole session family.
      await sessions.revokeFamily(record.familyId, now);
      throw invalidRefresh();
    }
    if (record.expiresAt <= now) {
      await sessions.revokeFamily(record.familyId, now);
      throw invalidRefresh();
    }
    if (!(await sessions.revokeIfActive(hash, now))) {
      // Lost a race with a parallel refresh of the same token: treat as reuse.
      await sessions.revokeFamily(record.familyId, now);
      throw invalidRefresh();
    }
    const user = await users.findById(record.userId);
    if (!user) {
      await sessions.revokeFamily(record.familyId, now);
      throw invalidRefresh();
    }
    const tokens = await issueTokens(deps, user.id, record.familyId, now);
    res.status(200).json(tokens);
  });

  router.post('/logout', requireAuth({ secret: deps.secret, sessions, now: deps.now }), async (req, res) => {
    parse(emptyBody, req.body);
    parse(emptyBody, req.query, 'query');
    const auth = authOf(res);
    await sessions.revokeFamily(auth.sid, deps.now());
    res.status(204).end();
  });

  return router;
}
