import { describe, expect, it } from 'vitest';
import { loadEnv } from '../env.js';

const placeholderUri = 'mongodb+srv://user:placeholder@cluster.example.invalid/';

describe('loadEnv', () => {
  it('parses a valid environment and splits the CORS allow-list', () => {
    const env = loadEnv({ MONGODB_URI: placeholderUri, MONGODB_DB: 'nutritale', CORS_ORIGINS: 'http://a.test, http://b.test' });
    expect(env.MONGODB_DB).toBe('nutritale');
    expect(env.CORS_ORIGINS).toEqual(['http://a.test', 'http://b.test']);
    expect(env.PORT).toBe(4000);
  });

  it('fails when MONGODB_URI or MONGODB_DB is missing', () => {
    expect(() => loadEnv({ MONGODB_DB: 'x' })).toThrow(/MONGODB_URI/);
    expect(() => loadEnv({ MONGODB_URI: placeholderUri })).toThrow(/MONGODB_DB/);
  });

  it('never puts the secret value in the error message', () => {
    const secret = 'postgres://user:not-a-real-password@example.invalid/db';
    try {
      loadEnv({ MONGODB_URI: secret, MONGODB_DB: 'x' });
      expect.unreachable();
    } catch (err) {
      expect(String(err)).not.toContain('not-a-real-password');
    }
  });
});
