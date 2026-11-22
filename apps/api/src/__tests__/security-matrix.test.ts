import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { signAccessToken } from '../auth/tokens.js';
import { expectCleanError, TEST_SECRET } from './helpers.js';
import { bearer, PASSWORD, setup, type TestUser } from './setup.js';

/**
 * SECURITY_AUDIT.md section 4: the twelve cases, run against every protected route.
 * Case 5 (wrong role) does not apply: V1 has no roles. Cases 7-9 do not apply to routes
 * without a body (GET /me); they are skipped there and say so in the test name.
 */

type Method = 'get' | 'patch' | 'delete' | 'post';

interface RouteCase {
  name: string;
  method: Method;
  path: string;
  okStatus: number;
  validBody?: () => Record<string, unknown>;
  invalidBody?: Record<string, unknown>;
  missingFields?: Record<string, unknown>;
  wrongTypes?: Record<string, unknown>;
}

const routes: RouteCase[] = [
  { name: 'GET /me', method: 'get', path: '/me', okStatus: 200 },
  {
    name: 'PATCH /me/preferences',
    method: 'patch',
    path: '/me/preferences',
    okStatus: 200,
    validBody: () => ({ allergens: ['milk'], diets: ['vegetarian'] }),
    invalidBody: { allergens: ['not-an-allergen'] },
    missingFields: {},
    wrongTypes: { allergens: 'milk', diets: 5 },
  },
  {
    name: 'DELETE /me',
    method: 'delete',
    path: '/me',
    okStatus: 204,
    validBody: () => ({ password: PASSWORD }),
    invalidBody: { password: '' },
    missingFields: {},
    wrongTypes: { password: 1234567890 },
  },
  {
    name: 'POST /auth/logout',
    method: 'post',
    path: '/auth/logout',
    okStatus: 204,
    validBody: () => ({}),
    invalidBody: { refreshToken: 'nope' },
    wrongTypes: { everything: [1, 2, 3] },
  },
];

function send(app: ReturnType<typeof setup>['app'], route: RouteCase, headers: Record<string, string>, body?: unknown, path = route.path) {
  const req = request(app)[route.method](path).set(headers);
  return body === undefined ? req : req.send(body as object);
}

const b64 = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');

for (const route of routes) {
  describe(`${route.name}: 12-case matrix`, () => {
    const validBody = route.validBody?.();

    it('case 1: valid authentication succeeds', async () => {
      const t = setup();
      const u = await t.register();
      const res = await send(t.app, route, bearer(u.accessToken), validBody);
      expect(res.status).toBe(route.okStatus);
      expect(res.text).not.toMatch(/passwordHash|\$argon2/);
    });

    it('case 2: missing authentication is 401', async () => {
      const t = setup();
      await t.register();
      expectCleanError(await send(t.app, route, {}, validBody), 401, 'unauthorized');
      expectCleanError(await send(t.app, route, { Authorization: 'Bearer' }, validBody), 401, 'unauthorized');
      expectCleanError(await send(t.app, route, { Authorization: 'Basic dXNlcjpwYXNz' }, validBody), 401, 'unauthorized');
    });

    it('case 3: expired access token is 401', async () => {
      const t = setup();
      const u = await t.register();
      t.advance(15 * 60 * 1000 + 1000);
      expectCleanError(await send(t.app, route, bearer(u.accessToken), validBody), 401, 'unauthorized');
    });

    it('case 4: invalid tokens are 401 (wrong secret, tampered payload, alg none, garbage)', async () => {
      const t = setup();
      const a = await t.register();
      const b = await t.register();
      const [header, , sig] = a.accessToken.split('.');
      const claimsOfB = JSON.parse(Buffer.from(b.accessToken.split('.')[1]!, 'base64url').toString());
      const tampered = `${header}.${b64(claimsOfB)}.${sig}`;
      const wrongSecret = await signAccessToken({ sub: a.id, sid: 'x' }, 'another-secret-that-is-long-enough-0123456789', t.clock.now);
      const algNone = `${b64({ alg: 'none', typ: 'JWT' })}.${b64(claimsOfB)}.`;
      const hs512 = `${b64({ alg: 'HS512', typ: 'JWT' })}.${b64(claimsOfB)}.${sig}`;
      for (const token of [tampered, wrongSecret, algNone, hs512, 'not-a-token', 'a.b.c']) {
        expectCleanError(await send(t.app, route, bearer(token), validBody), 401, 'unauthorized');
      }
    });

    it('case 5: wrong role is not applicable (no roles in V1); a role parameter is rejected', async () => {
      const t = setup();
      const u = await t.register();
      const res = await send(t.app, route, bearer(u.accessToken), validBody, `${route.path}?role=admin`);
      expectCleanError(res, 400, 'validation_error');
    });

    it("case 6: another user's record cannot be reached", async () => {
      const t = setup();
      const a = await t.register();
      const b = await t.register();
      // No route takes a user id; trying to pass one is rejected.
      expectCleanError(await send(t.app, route, bearer(a.accessToken), validBody, `${route.path}?userId=${b.id}`), 400, 'validation_error');
      if (route.method !== 'get') {
        expectCleanError(await send(t.app, route, bearer(a.accessToken), { ...validBody, userId: b.id }), 400, 'validation_error');
      }
      // A acts on A only; B is unchanged and still signed in.
      const okA = await send(t.app, route, bearer(a.accessToken), validBody);
      expect(okA.status).toBe(route.okStatus);
      const meB = await request(t.app).get('/me').set(bearer(b.accessToken));
      expect(meB.status).toBe(200);
      expect(meB.body.user.id).toBe(b.id);
      expect(meB.body.user.preferences).toEqual({ allergens: [], diets: [] });
    });

    if (route.invalidBody) {
      it('case 7: invalid request body is 400', async () => {
        const t = setup();
        const u = await t.register();
        expectCleanError(await send(t.app, route, bearer(u.accessToken), route.invalidBody), 400);
        const malformed = await request(t.app)[route.method](route.path).set(bearer(u.accessToken)).set('Content-Type', 'application/json').send('{"bad json');
        expectCleanError(malformed, 400);
      });
    } else {
      it.skip('case 7: not applicable (route has no body)', () => {});
    }

    if (route.missingFields) {
      it('case 8: missing required fields is 400', async () => {
        const t = setup();
        const u = await t.register();
        expectCleanError(await send(t.app, route, bearer(u.accessToken), route.missingFields), 400, 'validation_error');
      });
    } else {
      it.skip('case 8: not applicable (no required fields)', () => {});
    }

    if (route.wrongTypes) {
      it('case 9: wrong data types are 400', async () => {
        const t = setup();
        const u = await t.register();
        expectCleanError(await send(t.app, route, bearer(u.accessToken), route.wrongTypes), 400, 'validation_error');
      });
    } else {
      it.skip('case 9: not applicable (route has no body)', () => {});
    }

    it('case 10: unexpected extra parameters are rejected (strict)', async () => {
      const t = setup();
      const u = await t.register();
      expectCleanError(await send(t.app, route, bearer(u.accessToken), validBody, `${route.path}?extra=1`), 400, 'validation_error');
      if (route.method !== 'get') {
        expectCleanError(await send(t.app, route, bearer(u.accessToken), { ...validBody, isAdmin: true }), 400, 'validation_error');
        expectCleanError(await send(t.app, route, bearer(u.accessToken), { ...validBody, $where: '1' }), 400, 'validation_error');
      }
    });

    it('case 11: rate limit returns 429 in the JSON error shape', async () => {
      const t = setup({ RATE_LIMIT_MAX: 3 });
      const u: TestUser = await t.register(); // request 1
      await send(t.app, route, bearer(u.accessToken), validBody, `${route.path}?x=1`); // 2
      await send(t.app, route, bearer(u.accessToken), validBody, `${route.path}?x=2`); // 3
      expectCleanError(await send(t.app, route, bearer(u.accessToken), validBody), 429, 'rate_limited');
    });

    it('case 12: error bodies leak nothing and carry a request id', async () => {
      const t = setup();
      const u = await t.register();
      const responses = [
        await send(t.app, route, {}, validBody),
        await send(t.app, route, bearer('x.y.z'), validBody),
        await send(t.app, route, bearer(u.accessToken), validBody, `${route.path}?bad=1`),
        await request(t.app)[route.method](route.path).set(bearer(u.accessToken)).set('Content-Type', 'application/json').send('{"oops'),
      ];
      for (const res of responses) {
        expect(res.status).toBeGreaterThanOrEqual(400);
        expectCleanError(res, res.status);
        expect(res.text).not.toContain(TEST_SECRET);
      }
    });
  });
}
