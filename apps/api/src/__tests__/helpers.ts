import request from 'supertest';
import type { AppConfig } from '../app.js';

/** Test-only secret. Not used anywhere else. */
export const TEST_SECRET = 'test-only-secret-not-used-anywhere-0123456789';

export const testConfig: AppConfig = {
  CORS_ORIGINS: ['http://localhost:3000'],
  RATE_LIMIT_WINDOW_MS: 60_000,
  RATE_LIMIT_MAX: 1000,
  AUTH_RATE_LIMIT_WINDOW_MS: 60_000,
  AUTH_RATE_LIMIT_MAX: 1000,
  CATALOGUE_RATE_LIMIT_WINDOW_MS: 60_000,
  CATALOGUE_RATE_LIMIT_MAX: 1000,
  JSON_BODY_LIMIT: '1kb',
  JWT_SECRET: TEST_SECRET,
};

/** Asserts the one error shape and that nothing internal leaks into the body. */
export function expectCleanError(res: request.Response, status: number, code?: string): void {
  if (res.status !== status) throw new Error(`expected ${status}, got ${res.status}: ${res.text}`);
  const body = res.body as { error?: { code?: unknown; message?: unknown } };
  const keys = Object.keys(body);
  if (keys.length !== 1 || keys[0] !== 'error') throw new Error(`body is not { error }: ${res.text}`);
  const errKeys = Object.keys(body.error ?? {}).sort();
  if (errKeys.join(',') !== 'code,message') throw new Error(`error has keys ${errKeys.join(',')}`);
  if (typeof body.error?.code !== 'string' || typeof body.error.message !== 'string') throw new Error('code/message not strings');
  if (code && body.error.code !== code) throw new Error(`expected code ${code}, got ${String(body.error.code)}`);
  if (/stack|at .*\.(ts|js):|node_modules|Mongo|zod|ZodError|argon|jose|JWS|JWT|passwordHash|\$argon2/i.test(res.text)) {
    throw new Error(`error body leaks internals: ${res.text}`);
  }
  if (typeof res.headers['x-request-id'] !== 'string') throw new Error('missing X-Request-Id header');
}
