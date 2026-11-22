import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { expectCleanError } from './helpers.js';
import { bearer, PASSWORD, setup } from './setup.js';

describe('GET /me', () => {
  it('returns the signed-in user without the password hash', async () => {
    const t = setup();
    const u = await t.register('me@example.test');
    const res = await request(t.app).get('/me').set(bearer(u.accessToken));
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ id: u.id, email: 'me@example.test', market: 'ZA', locale: 'en-ZA', preferences: { allergens: [], diets: [] } });
    expect(res.text).not.toMatch(/passwordHash|\$argon2/);
    expect(res.text).not.toContain(PASSWORD);
  });
});

describe('PATCH /me/preferences', () => {
  it("saves allergens from the user's market, diets, and de-duplicates", async () => {
    const t = setup();
    const u = await t.register();
    const res = await request(t.app)
      .patch('/me/preferences')
      .set(bearer(u.accessToken))
      .send({ allergens: ['milk', 'peanuts', 'milk'], diets: ['halaal', 'vegetarian'] });
    expect(res.status).toBe(200);
    expect(res.body.user.preferences).toEqual({ allergens: ['milk', 'peanuts'], diets: ['halaal', 'vegetarian'] });
  });

  it("refuses an allergen that is not in the market's list (sesame is not in ZA's R146 list)", async () => {
    const t = setup();
    const u = await t.register();
    const res = await request(t.app).patch('/me/preferences').set(bearer(u.accessToken)).send({ allergens: ['sesame'] });
    expectCleanError(res, 400, 'allergen_not_in_market');
  });

  it('checks allergens against the new market when the market changes in the same request', async () => {
    const t = setup();
    const u = await t.register();
    const res = await request(t.app)
      .patch('/me/preferences')
      .set(bearer(u.accessToken))
      .send({ market: 'US', locale: 'en-US', allergens: ['sesame', 'wheat'] });
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ market: 'US', locale: 'en-US', preferences: { allergens: ['sesame', 'wheat'] } });
    // Moving back to ZA while keeping sesame is refused, not silently dropped.
    const back = await request(t.app).patch('/me/preferences').set(bearer(u.accessToken)).send({ market: 'ZA' });
    expectCleanError(back, 400, 'allergen_not_in_market');
  });

  it('rejects unknown diets, unknown markets and locales', async () => {
    const t = setup();
    const u = await t.register();
    for (const body of [{ diets: ['keto'] }, { market: 'XX' }, { locale: 'xx-XX' }]) {
      expectCleanError(await request(t.app).patch('/me/preferences').set(bearer(u.accessToken)).send(body), 400, 'validation_error');
    }
  });
});

describe('DELETE /me (account deletion)', () => {
  it('removes the user and every session; the tokens stop working', async () => {
    const t = setup();
    const u = await t.register();
    await request(t.app).post('/auth/login').send({ email: u.email, password: PASSWORD });
    expect(t.repos.sessions.countForUser(u.id)).toBe(2);
    const res = await request(t.app).delete('/me').set(bearer(u.accessToken)).send({ password: PASSWORD });
    expect(res.status).toBe(204);
    expect(await t.repos.users.findById(u.id)).toBeNull();
    expect(t.repos.sessions.countForUser(u.id)).toBe(0);
    expectCleanError(await request(t.app).get('/me').set(bearer(u.accessToken)), 401, 'unauthorized');
    expectCleanError(await request(t.app).post('/auth/refresh').send({ refreshToken: u.refreshToken }), 401, 'invalid_refresh_token');
    expectCleanError(await request(t.app).post('/auth/login').send({ email: u.email, password: PASSWORD }), 401, 'invalid_credentials');
  });

  it('needs the password again, and keeps the account on a wrong one', async () => {
    const t = setup();
    const u = await t.register();
    expectCleanError(await request(t.app).delete('/me').set(bearer(u.accessToken)).send({ password: 'wrong-password-1' }), 403, 'password_incorrect');
    expect(await t.repos.users.findById(u.id)).not.toBeNull();
  });

  it('the email can register again after deletion', async () => {
    const t = setup();
    const u = await t.register('again@example.test');
    await request(t.app).delete('/me').set(bearer(u.accessToken)).send({ password: PASSWORD });
    await expect(t.register('again@example.test')).resolves.toMatchObject({ email: 'again@example.test' });
  });
});
