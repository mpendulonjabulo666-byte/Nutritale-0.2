import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp, type AppConfig } from '../app.js';
import { HttpError } from '../errors.js';

const config: AppConfig = {
  CORS_ORIGINS: ['http://localhost:3000'],
  RATE_LIMIT_WINDOW_MS: 60_000,
  RATE_LIMIT_MAX: 1000,
  JSON_BODY_LIMIT: '1kb',
};

function appWithFailingRoutes(logError = vi.fn()) {
  return createApp(config, {
    logError,
    extend(app) {
      app.get('/boom', () => {
        throw new Error('secret internal detail: db password at line 42');
      });
      app.get('/teapot', () => {
        throw new HttpError(418, 'Short and stout');
      });
      app.post('/echo', (req, res) => {
        res.json(req.body);
      });
    },
  });
}

describe('GET /health', () => {
  it('returns 200 and status ok', async () => {
    const res = await request(createApp(config)).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('sets security headers from helmet and hides x-powered-by', async () => {
    const res = await request(createApp(config)).get('/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('allows an allow-listed origin and refuses others', async () => {
    const ok = await request(createApp(config)).get('/health').set('Origin', 'http://localhost:3000');
    expect(ok.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    const bad = await request(createApp(config)).get('/health').set('Origin', 'https://evil.example');
    expect(bad.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('applies the rate limit', async () => {
    const app = createApp({ ...config, RATE_LIMIT_MAX: 2 });
    await request(app).get('/health');
    await request(app).get('/health');
    const third = await request(app).get('/health');
    expect(third.status).toBe(429);
  });
});

describe('error handler', () => {
  it('returns a generic 500 with no stack trace or internal message', async () => {
    const logError = vi.fn();
    const res = await request(appWithFailingRoutes(logError)).get('/boom');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: { code: 'internal_error', message: 'Internal server error' } });
    const raw = JSON.stringify(res.body) + res.text;
    expect(raw).not.toMatch(/secret internal detail|stack|at line|\.ts:/);
    expect(logError).toHaveBeenCalledOnce();
  });

  it('passes through our own HttpError message', async () => {
    const res = await request(appWithFailingRoutes()).get('/teapot');
    expect(res.status).toBe(418);
    expect(res.body.error.message).toBe('Short and stout');
  });

  it('returns 404 JSON for unknown routes', async () => {
    const res = await request(appWithFailingRoutes()).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('not_found');
  });

  it('rejects malformed JSON with a generic 400 and no parser details', async () => {
    const res = await request(appWithFailingRoutes())
      .post('/echo')
      .set('Content-Type', 'application/json')
      .send('{"bad json');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: { code: 'request_error', message: 'Bad request' } });
  });

  it('rejects bodies over the JSON size limit with 413', async () => {
    const res = await request(appWithFailingRoutes())
      .post('/echo')
      .send({ text: 'x'.repeat(5000) });
    expect(res.status).toBe(413);
    expect(res.body.error.message).toBe('Request body too large');
  });
});
