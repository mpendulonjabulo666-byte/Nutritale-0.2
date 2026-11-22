import request from 'supertest';
import { createApp, type AppConfig } from '../app.js';
import { createMemoryRepos } from '../storage/memory.js';
import { testConfig } from './helpers.js';

export const PASSWORD = 'correct-horse-battery';

export interface TestUser {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

/** A fresh app with in-memory repos and a clock the test can move. */
export function setup(overrides: Partial<AppConfig> = {}) {
  const repos = createMemoryRepos();
  const clock = { now: new Date('2026-11-22T10:00:00Z') };
  const app = createApp({ ...testConfig, ...overrides }, { repos, now: () => clock.now, logError: () => {} });

  let n = 0;
  async function register(email = `user${++n}@example.test`, extra: Record<string, unknown> = {}): Promise<TestUser> {
    const res = await request(app)
      .post('/auth/register')
      .send({ email, password: PASSWORD, firstName: 'Thandi', market: 'ZA', locale: 'en-ZA', ...extra });
    if (res.status !== 201) throw new Error(`register failed: ${res.status} ${res.text}`);
    return { id: res.body.user.id, email, accessToken: res.body.accessToken, refreshToken: res.body.refreshToken };
  }

  function advance(ms: number): void {
    clock.now = new Date(clock.now.getTime() + ms);
  }

  return { app, repos, clock, register, advance };
}

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });
