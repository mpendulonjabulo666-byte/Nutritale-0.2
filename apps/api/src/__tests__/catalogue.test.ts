import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { Ingredient } from '@nutritale/catalogue-search';
import { createApp } from '../app.js';
import { expectCleanError, testConfig } from './helpers.js';
import { setup } from './setup.js';

const get = (t: ReturnType<typeof setup>, path: string) => request(t.app).get(path);

describe('GET /catalogue/search', () => {
  it('is public and finds a local alias with the local name (dhania in en-ZA)', async () => {
    const t = setup();
    const res = await get(t, '/catalogue/search?q=dhania&locale=en-ZA');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('alias');
    expect(res.body.results[0]).toEqual({ id: 'coriander', name: 'Coriander', category: 'Herbs', matchType: 'alias', matchedTerm: 'dhania' });
  });

  it('shows names per locale (Cilantro in en-US)', async () => {
    const res = await get(setup(), '/catalogue/search?q=coriander&locale=en-US');
    expect(res.body.results[0].name).toBe('Cilantro');
  });

  it('offers "did you mean" for a typo', async () => {
    const res = await get(setup(), '/catalogue/search?q=brinjol&locale=en-ZA');
    expect(res.body.status).toBe('fuzzy');
    expect(res.body.didYouMean).toMatchObject({ id: 'aubergine', name: 'Brinjal' });
    expect(res.body.canAddCustom).toBe(true);
  });

  it('never a dead end: an unknown word gets suggestions and "add as my own"', async () => {
    const res = await get(setup(), '/catalogue/search?q=xyzberry&locale=en-ZA');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('unknown');
    expect(res.body.results).toEqual([]);
    expect(res.body.suggestions.length).toBeGreaterThan(0);
    expect(res.body.canAddCustom).toBe(true);
  });

  it('returns at most 8 results (20 matching ingredients) and no internal fields', async () => {
    const letters = 'abcdefghijklmnopqrst';
    const big: Ingredient[] = [...letters].map((l) => ({
      id: `pepper-${l}`,
      names: { '*': `Pepper ${l.toUpperCase()}` },
      category: 'Test',
      aliases: [],
      substitutes: [],
    }));
    const app = createApp(testConfig, { catalogue: big });
    const res = await request(app).get('/catalogue/search?q=pep');
    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(8);
    expect(res.text).not.toMatch(/"aliases"|"substitutes"|"names"/);
  });

  it('an empty query answers status "empty", not an error', async () => {
    const res = await get(setup(), '/catalogue/search?q=');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('empty');
  });

  it.each([
    ['q over 64 characters', `/catalogue/search?q=${'a'.repeat(65)}`],
    ['missing q', '/catalogue/search'],
    ['repeated q (array)', '/catalogue/search?q=a&q=b'],
    ['unknown locale', '/catalogue/search?q=salt&locale=zz-ZZ'],
    ['extra parameter', '/catalogue/search?q=salt&debug=1'],
  ])('rejects %s with 400', async (_name, path) => {
    expectCleanError(await get(setup(), path), 400, 'validation_error');
  });

  it('accepts exactly 64 characters', async () => {
    expect((await get(setup(), `/catalogue/search?q=${'a'.repeat(64)}`)).status).toBe(200);
  });

  it('has its own rate limit with a JSON 429', async () => {
    const t = setup({ CATALOGUE_RATE_LIMIT_MAX: 2 });
    await get(t, '/catalogue/search?q=salt');
    await get(t, '/catalogue/search?q=salt');
    expectCleanError(await get(t, '/catalogue/search?q=salt'), 429, 'rate_limited');
  });
});

describe('GET /catalogue/:id/substitutes', () => {
  it('returns swaps with names in the locale and a cooking note', async () => {
    const res = await get(setup(), '/catalogue/amasi/substitutes?locale=en-US');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('amasi');
    expect(res.body.substitutes[0]).toMatchObject({ id: expect.any(String), name: 'Buttermilk', note: expect.any(String) });
  });

  it('404 for an unknown id, 400 for a malformed id or extra parameter', async () => {
    const t = setup();
    expectCleanError(await get(t, '/catalogue/no-such-thing/substitutes'), 404, 'not_found');
    expectCleanError(await get(t, '/catalogue/BAD$ID/substitutes'), 400, 'validation_error');
    expectCleanError(await get(t, '/catalogue/amasi/substitutes?x=1'), 400, 'validation_error');
  });
});
