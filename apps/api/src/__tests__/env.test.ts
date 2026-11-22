import { describe, expect, it } from 'vitest';
import { loadEnv } from '../env.js';

const placeholderUri = 'mongodb+srv://user:placeholder@cluster.example.invalid/';
const JWT_SECRET = 'test-only-secret-not-used-anywhere-0123456789';

describe('loadEnv', () => {
  it('parses a valid environment and splits the CORS allow-list', () => {
    const env = loadEnv({ MONGODB_URI: placeholderUri, MONGODB_DB: 'nutritale', JWT_SECRET, CORS_ORIGINS: 'http://a.test, http://b.test' });
    expect(env.MONGODB_DB).toBe('nutritale');
    expect(env.CORS_ORIGINS).toEqual(['http://a.test', 'http://b.test']);
    expect(env.PORT).toBe(4000);
    expect(env.STORAGE).toBe('mongo');
  });

  it('fails when MONGODB_URI or MONGODB_DB is missing', () => {
    expect(() => loadEnv({ MONGODB_DB: 'x', JWT_SECRET })).toThrow(/MONGODB_URI/);
    expect(() => loadEnv({ MONGODB_URI: placeholderUri, JWT_SECRET })).toThrow(/MONGODB_DB/);
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

  it('needs JWT_SECRET of at least 32 characters and never prints it', () => {
    expect(() => loadEnv({ MONGODB_URI: placeholderUri, MONGODB_DB: 'x' })).toThrow(/JWT_SECRET/);
    try {
      loadEnv({ MONGODB_URI: placeholderUri, MONGODB_DB: 'x', JWT_SECRET: 'short-secret-value' });
      expect.unreachable();
    } catch (err) {
      expect(String(err)).toMatch(/JWT_SECRET must be at least 32 characters/);
      expect(String(err)).not.toContain('short-secret-value');
    }
  });

  it('STORAGE=memory needs no MongoDB settings, and is refused in production', () => {
    const env = loadEnv({ STORAGE: 'memory', JWT_SECRET });
    expect(env.STORAGE).toBe('memory');
    expect(env.MONGODB_URI).toBeUndefined();
    expect(() => loadEnv({ STORAGE: 'memory', NODE_ENV: 'production', JWT_SECRET })).toThrow(/STORAGE=memory is not allowed/);
  });

  it('sets the tighter auth rate-limit defaults', () => {
    const env = loadEnv({ STORAGE: 'memory', JWT_SECRET });
    expect(env.AUTH_RATE_LIMIT_MAX).toBeLessThan(env.RATE_LIMIT_MAX);
  });
});
