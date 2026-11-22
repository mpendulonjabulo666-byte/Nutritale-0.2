import type { RequestHandler, Response } from 'express';
import { HttpError } from '../errors.js';
import type { SessionRepo } from '../storage/types.js';
import { type AccessClaims, verifyAccessToken } from './tokens.js';

export interface AuthDeps {
  secret: string;
  sessions: SessionRepo;
  now: () => Date;
}

const unauthorized = () => new HttpError(401, 'Authentication required', 'unauthorized');

/**
 * Requires `Authorization: Bearer <access token>`. The token must verify (HS256, issuer,
 * audience, not expired) and its session must still be active, so logout and reuse
 * detection take effect at once rather than when the 15-minute token runs out.
 * The same 401 body is sent for every failure.
 */
export function requireAuth(deps: AuthDeps): RequestHandler {
  return async (req, res, next) => {
    const header = req.get('authorization') ?? '';
    const match = /^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/.exec(header);
    if (!match?.[1]) return next(unauthorized());
    const now = deps.now();
    const claims = await verifyAccessToken(match[1], deps.secret, now);
    if (!claims) return next(unauthorized());
    if (!(await deps.sessions.isFamilyActive(claims.sid, now))) return next(unauthorized());
    res.locals.auth = claims;
    next();
  };
}

export function authOf(res: Response): AccessClaims {
  const auth = res.locals.auth as AccessClaims | undefined;
  if (!auth) throw new HttpError(401, 'Authentication required', 'unauthorized');
  return auth;
}
