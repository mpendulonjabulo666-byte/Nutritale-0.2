import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { hashRefreshToken } from '../auth/tokens.js';
import { expectCleanError } from './helpers.js';
import { bearer, PASSWORD, setup } from './setup.js';

const valid = { email: 'Thandi@Example.test', password: PASSWORD, firstName: 'Thandi', market: 'ZA', locale: 'en-ZA' };

describe('POST /auth/register', () => {
  it('creates a user, returns tokens and never the password or its hash', async () => {
    const t = setup();
    const res = await request(t.app).post('/auth/register').send(valid);
    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({ email: 'Thandi@Example.test', firstName: 'Thandi', market: 'ZA', locale: 'en-ZA' });
    expect(Object.keys(res.body.user).sort()).toEqual(['createdAt', 'email', 'firstName', 'id', 'locale', 'market', 'preferences']);
    expect(res.body.tokenType).toBe('Bearer');
    expect(res.body.expiresIn).toBe(900);
    expect(res.body.refreshToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(res.text).not.toContain(PASSWORD);
    expect(res.text).not.toMatch(/passwordHash|\$argon2/);
  });

  it('stores an Argon2id hash, not the password', async () => {
    const t = setup();
    await request(t.app).post('/auth/register').send(valid);
    const stored = await t.repos.users.findByEmail('thandi@example.test');
    expect(stored?.passwordHash).toMatch(/^\$argon2id\$v=19\$m=19456,t=2,p=1\$/);
    expect(stored?.passwordHash).not.toContain(PASSWORD);
  });

  it('stores only the SHA-256 hash of the refresh token', async () => {
    const t = setup();
    const res = await request(t.app).post('/auth/register').send(valid);
    const raw: string = res.body.refreshToken;
    expect(await t.repos.sessions.findByHash(raw)).toBeNull();
    const rec = await t.repos.sessions.findByHash(hashRefreshToken(raw));
    expect(rec?.tokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(rec!.expiresAt.getTime() - rec!.createdAt.getTime()).toBe(30 * 24 * 60 * 60 * 1000);
  });

  it('refuses a second account for the same email, ignoring case', async () => {
    const t = setup();
    await request(t.app).post('/auth/register').send(valid);
    const res = await request(t.app).post('/auth/register').send({ ...valid, email: 'THANDI@example.TEST' });
    expectCleanError(res, 409, 'email_taken');
  });

  it.each([
    ['password under 10 characters', { ...valid, password: '123456789' }],
    ['bad email', { ...valid, email: 'not-an-email' }],
    ['unknown market', { ...valid, market: 'XX' }],
    ['unknown locale', { ...valid, locale: 'fr-FR' }],
    ['empty first name', { ...valid, firstName: '   ' }],
    ['missing fields', { email: valid.email }],
    ['wrong types', { ...valid, password: 12345678901, market: ['ZA'] }],
    ['extra field', { ...valid, role: 'admin' }],
    ['operator object instead of a string', { ...valid, email: { $ne: null } }],
  ])('rejects %s with 400', async (_name, body) => {
    const t = setup();
    expectCleanError(await request(t.app).post('/auth/register').send(body), 400, 'validation_error');
  });
});

describe('POST /auth/login', () => {
  it('signs in with any case of the email', async () => {
    const t = setup();
    await t.register('mixed@example.test');
    const res = await request(t.app).post('/auth/login').send({ email: 'MIXED@example.test', password: PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTypeOf('string');
    expect(res.text).not.toMatch(/passwordHash|\$argon2/);
    expect(res.text).not.toContain(PASSWORD);
  });

  it('gives the same status and body for an unknown email and a wrong password (no enumeration)', async () => {
    const t = setup();
    await t.register('known@example.test');
    const unknown = await request(t.app).post('/auth/login').send({ email: 'nobody@example.test', password: PASSWORD });
    const wrong = await request(t.app).post('/auth/login').send({ email: 'known@example.test', password: 'wrong-password-1' });
    const short = await request(t.app).post('/auth/login').send({ email: 'known@example.test', password: 'x' });
    expectCleanError(unknown, 401, 'invalid_credentials');
    expect(wrong.status).toBe(unknown.status);
    expect(wrong.body).toEqual(unknown.body);
    expect(short.body).toEqual(unknown.body);
    expect(unknown.body.error.message).toBe('Email or password is incorrect');
  });

  it('rejects operator injection and extra fields', async () => {
    const t = setup();
    await t.register('known@example.test');
    expectCleanError(await request(t.app).post('/auth/login').send({ email: 'known@example.test', password: { $ne: '' } }), 400, 'validation_error');
    expectCleanError(await request(t.app).post('/auth/login').send({ email: 'known@example.test', password: PASSWORD, admin: true }), 400, 'validation_error');
  });

  it('has a tighter rate limit than the global one, shared with register and refresh', async () => {
    const t = setup({ AUTH_RATE_LIMIT_MAX: 3, RATE_LIMIT_MAX: 100 });
    await t.register('a@example.test'); // 1
    await request(t.app).post('/auth/login').send({ email: 'a@example.test', password: 'wrong-password-1' }); // 2
    await request(t.app).post('/auth/refresh').send({ refreshToken: 'x'.repeat(43) }); // 3
    const limited = await request(t.app).post('/auth/login').send({ email: 'a@example.test', password: PASSWORD });
    expectCleanError(limited, 429, 'rate_limited');
    // The global limit is not reached, so other routes still answer.
    expect((await request(t.app).get('/health')).status).toBe(200);
  });
});

describe('POST /auth/refresh', () => {
  it('rotates: returns a new pair and revokes the old refresh token', async () => {
    const t = setup();
    const u = await t.register();
    const first = await request(t.app).post('/auth/refresh').send({ refreshToken: u.refreshToken });
    expect(first.status).toBe(200);
    expect(first.body.refreshToken).not.toBe(u.refreshToken);
    expect(first.body.accessToken).toBeTypeOf('string');
    const old = await t.repos.sessions.findByHash(hashRefreshToken(u.refreshToken));
    expect(old?.revokedAt).toBeInstanceOf(Date);
    const me = await request(t.app).get('/me').set(bearer(first.body.accessToken));
    expect(me.status).toBe(200);
  });

  it('reuse of a revoked token revokes the whole session family', async () => {
    const t = setup();
    const u = await t.register();
    const rotated = await request(t.app).post('/auth/refresh').send({ refreshToken: u.refreshToken });
    expect(rotated.status).toBe(200);
    // An attacker replays the old token.
    expectCleanError(await request(t.app).post('/auth/refresh').send({ refreshToken: u.refreshToken }), 401, 'invalid_refresh_token');
    // The legitimate new tokens are now dead too.
    expectCleanError(await request(t.app).post('/auth/refresh').send({ refreshToken: rotated.body.refreshToken }), 401, 'invalid_refresh_token');
    expectCleanError(await request(t.app).get('/me').set(bearer(rotated.body.accessToken)), 401, 'unauthorized');
    expectCleanError(await request(t.app).get('/me').set(bearer(u.accessToken)), 401, 'unauthorized');
  });

  it('reuse in one session does not touch another session of the same user', async () => {
    const t = setup();
    const u = await t.register();
    const other = await request(t.app).post('/auth/login').send({ email: u.email, password: PASSWORD });
    await request(t.app).post('/auth/refresh').send({ refreshToken: u.refreshToken });
    await request(t.app).post('/auth/refresh').send({ refreshToken: u.refreshToken }); // reuse
    expect((await request(t.app).get('/me').set(bearer(other.body.accessToken))).status).toBe(200);
  });

  it('refuses an expired refresh token (after 30 days)', async () => {
    const t = setup();
    const u = await t.register();
    t.advance(30 * 24 * 60 * 60 * 1000 + 1);
    expectCleanError(await request(t.app).post('/auth/refresh').send({ refreshToken: u.refreshToken }), 401, 'invalid_refresh_token');
  });

  it('refuses unknown, malformed and extra-field bodies', async () => {
    const t = setup();
    const u = await t.register();
    expectCleanError(await request(t.app).post('/auth/refresh').send({ refreshToken: 'A'.repeat(43) }), 401, 'invalid_refresh_token');
    expectCleanError(await request(t.app).post('/auth/refresh').send({ refreshToken: 'short' }), 400, 'validation_error');
    expectCleanError(await request(t.app).post('/auth/refresh').send({}), 400, 'validation_error');
    expectCleanError(await request(t.app).post('/auth/refresh').send({ refreshToken: u.refreshToken, x: 1 }), 400, 'validation_error');
  });
});

describe('POST /auth/logout', () => {
  it('revokes the session: the access token and the refresh token stop working at once', async () => {
    const t = setup();
    const u = await t.register();
    const res = await request(t.app).post('/auth/logout').set(bearer(u.accessToken));
    expect(res.status).toBe(204);
    expectCleanError(await request(t.app).get('/me').set(bearer(u.accessToken)), 401, 'unauthorized');
    expectCleanError(await request(t.app).post('/auth/refresh').send({ refreshToken: u.refreshToken }), 401, 'invalid_refresh_token');
  });

  it('logs out one session only', async () => {
    const t = setup();
    const u = await t.register();
    const other = await request(t.app).post('/auth/login').send({ email: u.email, password: PASSWORD });
    await request(t.app).post('/auth/logout').set(bearer(u.accessToken));
    expect((await request(t.app).get('/me').set(bearer(other.body.accessToken))).status).toBe(200);
  });
});
