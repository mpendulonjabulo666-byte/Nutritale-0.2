import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const JWT_ISSUER = 'nutritale-api';
export const JWT_AUDIENCE = 'nutritale-app';

export interface AccessClaims {
  /** user id */
  sub: string;
  /** session (refresh-token family) id */
  sid: string;
}

function key(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

/** HS256 JWT, 15 minutes. Only `sub` and `sid` are put in it: no email, no profile data. */
export async function signAccessToken(claims: AccessClaims, secret: string, now: Date, ttlSeconds = ACCESS_TOKEN_TTL_SECONDS): Promise<string> {
  const iat = Math.floor(now.getTime() / 1000);
  return new SignJWT({ sid: claims.sid })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(claims.sub)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt(iat)
    .setExpirationTime(iat + ttlSeconds)
    .setJti(randomUUID())
    .sign(key(secret));
}

/** Returns the claims, or null for any problem (bad signature, expired, wrong alg, issuer or audience). */
export async function verifyAccessToken(token: string, secret: string, now: Date): Promise<AccessClaims | null> {
  try {
    const { payload } = await jwtVerify(token, key(secret), {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      currentDate: now,
      clockTolerance: 0,
      requiredClaims: ['sub', 'exp', 'iat'],
    });
    if (typeof payload.sub !== 'string' || typeof payload.sid !== 'string') return null;
    return { sub: payload.sub, sid: payload.sid };
  } catch {
    return null;
  }
}

/** 32 random bytes, base64url (43 characters). Only its hash is stored. */
export function newRefreshToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}
