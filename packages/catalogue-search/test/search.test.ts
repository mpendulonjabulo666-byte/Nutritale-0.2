import { describe, expect, it } from 'vitest';
import {
  editDistance,
  foldPlural,
  normalise,
  search,
  seedCatalogue as catalogue,
  substitutesFor,
  type Ingredient,
} from '../src/index';

const za = { locale: 'en-ZA', catalogue } as const;
const us = { locale: 'en-US', catalogue } as const;
const gb = { locale: 'en-GB', catalogue } as const;

describe('normalise', () => {
  it('lower-cases, strips diacritics and keeps letters only', () => {
    expect(normalise('Chick Peas')).toBe(normalise('chickpeas'));
    expect(normalise('Jalapeño')).toBe('jalapeno');
    expect(normalise("Confectioners' sugar")).toBe('confectionerssugar');
  });

  it('folds simple plurals the same way on both sides', () => {
    expect(foldPlural('tomatoes')).toBe('tomato');
    expect(foldPlural('tomatos')).toBe('tomato');
    expect(foldPlural('olives')).toBe('olive');
    expect(foldPlural('peaches')).toBe('peach');
    expect(foldPlural('glass')).toBe('glass');
    expect(foldPlural('hummus')).toBe('hummus');
    expect(foldPlural('egg')).toBe('egg');
  });

  it('counts a swap of two letters as one edit (Damerau)', () => {
    expect(editDistance('brinjol', 'brinjal')).toBe(1);
    expect(editDistance('smap', 'samp')).toBe(1);
    expect(editDistance('abc', 'abc')).toBe(0);
  });
});

describe('search ladder', () => {
  it('milk is an exact match, not a buttermilk prefix hit', () => {
    const r = search('milk', { locale: 'en-ZA', catalogue });
    expect(r.status).toBe('exact');
    expect(r.results[0]?.displayName).toBe('Milk');
  });

  it('dhania reaches Coriander in en-ZA via an alias', () => {
    const r = search('dhania', za);
    expect(r.status).toBe('alias');
    expect(r.results[0]?.ingredient.id).toBe('coriander');
    expect(r.results[0]?.displayName).toBe('Coriander');
    expect(r.results[0]?.matchedTerm).toBe('dhania');
  });

  it('cilantro reaches Coriander and displays Cilantro in en-US', () => {
    const r = search('cilantro', us);
    expect(r.status).toBe('exact');
    expect(r.results[0]?.ingredient.id).toBe('coriander');
    expect(r.results[0]?.displayName).toBe('Cilantro');
  });

  it('cilantro in en-GB still reaches Coriander, shown as Coriander', () => {
    const r = search('cilantro', gb);
    expect(r.status).toBe('alias');
    expect(r.results[0]?.displayName).toBe('Coriander');
  });

  it('brinjol gives "did you mean" Brinjal in en-ZA and Eggplant in en-US', () => {
    const rz = search('brinjol', za);
    expect(rz.status).toBe('fuzzy');
    expect(rz.didYouMean?.displayName).toBe('Brinjal');
    expect(rz.canAddCustom).toBe(true);
    const ru = search('brinjol', us);
    expect(ru.status).toBe('fuzzy');
    expect(ru.didYouMean?.displayName).toBe('Eggplant');
    expect(ru.didYouMean?.ingredient.id).toBe('aubergine');
  });

  it('tomatos finds Tomatoes', () => {
    const r = search('tomatos', za);
    expect(r.status).toBe('exact');
    expect(r.results[0]?.displayName).toBe('Tomatoes');
  });

  it('chick peas finds Chickpeas', () => {
    const r = search('chick peas', za);
    expect(r.status).toBe('exact');
    expect(r.results[0]?.displayName).toBe('Chickpeas');
  });

  it('mealie meal finds Maize meal', () => {
    const r = search('mealie meal', za);
    expect(r.status).toBe('alias');
    expect(r.results[0]?.displayName).toBe('Maize meal');
  });

  it('xyzberry is unknown with 3 suggestions and add-custom', () => {
    const r = search('xyzberry', za);
    expect(r.status).toBe('unknown');
    expect(r.results).toEqual([]);
    expect(r.suggestions).toHaveLength(3);
    expect(new Set(r.suggestions).size).toBe(3);
    expect(r.canAddCustom).toBe(true);
  });

  it('handles plurals in the query and the catalogue', () => {
    expect(search('tomato', za).results[0]?.displayName).toBe('Tomatoes');
    expect(search('tomatoes', za).results[0]?.displayName).toBe('Tomatoes');
    expect(search('egg', za).results[0]?.displayName).toBe('Eggs');
    expect(search('potatoes', za).results[0]?.displayName).toBe('Potato');
    expect(search('prawn', us).results[0]?.displayName).toBe('Shrimp');
    expect(search('chickpea', za).status).toBe('exact');
  });

  it('ignores diacritics: jalapeno and jalapeño both match', () => {
    const a = search('jalapeno', za);
    const b = search('jalapeño', za);
    const c = search('JALAPEÑOS', za);
    for (const r of [a, b, c]) {
      expect(r.status).toBe('exact');
      expect(r.results[0]?.displayName).toBe('Jalapeño');
    }
  });

  it('prefers aliases from the user locale, then *, then others', () => {
    // 'aubergine' is the '*' name; for en-ZA it is an alias (display Brinjal)
    const r = search('aubergine', za);
    expect(r.status).toBe('alias');
    expect(r.results[0]?.displayName).toBe('Brinjal');
    // own-locale alias scores above another locale's alias
    const own = search('dhania', za).results[0]!;
    const other = search('dhania', us).results[0]!;
    expect(own.score).toBeGreaterThan(other.score);
    expect(other.displayName).toBe('Cilantro');
  });

  it('covers the other locale pairs', () => {
    expect(search('zucchini', za).results[0]?.displayName).toBe('Baby marrow');
    expect(search('baby marrow', us).results[0]?.displayName).toBe('Zucchini');
    expect(search('garbanzo beans', gb).results[0]?.displayName).toBe('Chickpeas');
    expect(search('scallion', za).results[0]?.displayName).toBe('Spring onion');
    expect(search('baking soda', gb).results[0]?.displayName).toBe('Bicarbonate of soda');
    expect(search('all-purpose flour', za).results[0]?.displayName).toBe('Cake flour');
    expect(search('ground beef', gb).results[0]?.displayName).toBe('Beef mince');
    expect(search('arugula', za).results[0]?.displayName).toBe('Rocket');
    expect(search('icing sugar', us).results[0]?.displayName).toBe('Powdered sugar');
    expect(search('maas', za).results[0]?.displayName).toBe('Amasi');
  });

  it('prefix needs 2+ letters, contains needs 3+', () => {
    const p = search('ro', za);
    expect(p.status).toBe('prefix');
    expect(p.results.map((x) => x.displayName)).toContain('Rocket');
    const c = search('nut', za);
    expect(c.status).toBe('contains');
    expect(c.results[0]?.displayName).toBe('Butternut');
    expect(search('ut', za).results.every((x) => x.matchType !== 'contains')).toBe(true);
  });

  it('returns at most 8 results, and honours a smaller limit', () => {
    const big: Ingredient[] = Array.from({ length: 20 }, (_, i) => ({
      id: `t${i}`,
      names: { '*': `Test item ${i}` },
      category: 'Test',
      aliases: [],
      substitutes: [],
    }));
    expect(search('test', { catalogue: big }).results).toHaveLength(8);
    expect(search('test', { catalogue: big, limit: 50 }).results).toHaveLength(8);
    expect(search('test', { catalogue: big, limit: 3 }).results).toHaveLength(3);
    expect(search('a', za).results.length).toBeLessThanOrEqual(8);
  });

  it('empty or punctuation-only queries give status empty without throwing', () => {
    for (const q of ['', '   ', '!!!', '123']) {
      const r = search(q, za);
      expect(r.status).toBe('empty');
      expect(r.results).toEqual([]);
      expect(r.canAddCustom).toBe(false);
    }
    expect(() => search(undefined as unknown as string, za)).not.toThrow();
    expect(search(undefined as unknown as string, za).status).toBe('empty');
  });

  it('works with an empty catalogue', () => {
    const r = search('tomato', { catalogue: [] });
    expect(r.status).toBe('unknown');
    expect(r.suggestions).toEqual([]);
    expect(r.canAddCustom).toBe(true);
  });

  it('a new locale is data only', () => {
    const fr: Ingredient[] = [
      {
        id: 'coriander',
        names: { '*': 'Coriander', fr: 'Coriandre' },
        category: 'Herbs',
        aliases: [{ locale: 'fr', term: 'persil arabe' }],
        substitutes: [],
      },
    ];
    const r = search('coriandre', { locale: 'fr-FR', catalogue: fr });
    expect(r.status).toBe('exact');
    expect(r.results[0]?.displayName).toBe('Coriandre');
    expect(search('persil arabe', { locale: 'fr-FR', catalogue: fr }).status).toBe('alias');
  });

  it('runs 1,000 searches over the seed in under 500 ms', () => {
    const queries = ['dhania', 'brinjol', 'tomatos', 'chick peas', 'mealie meal', 'xyzberry', 'ro', 'nut', 'jalapeño', 'cilantro'];
    search('warm-up', za);
    const t0 = performance.now();
    for (let i = 0; i < 1000; i++) search(queries[i % queries.length]!, i % 2 ? za : us);
    const ms = performance.now() - t0;
    console.log(`[timing] 1,000 searches over ${catalogue.length} ingredients: ${ms.toFixed(1)} ms`);
    expect(ms).toBeLessThan(500);
  });
});

describe('substitutesFor', () => {
  it('returns swaps with locale display names and notes', () => {
    const subs = substitutesFor('amasi', catalogue, 'en-US');
    expect(subs.map((s) => s.displayName)).toEqual(['Buttermilk', 'Plain yogurt']);
    expect(subs.every((s) => s.note.length > 0)).toBe(true);
    expect(substitutesFor('courgette', catalogue, 'en-US')[0]?.displayName).toBe('Eggplant');
  });

  it('returns [] for an unknown id', () => {
    expect(substitutesFor('nope', catalogue, 'en-ZA')).toEqual([]);
  });
});

describe('seed catalogue integrity', () => {
  it('has about 40 ingredients with unique ids and a * name', () => {
    expect(catalogue.length).toBeGreaterThanOrEqual(38);
    expect(new Set(catalogue.map((i) => i.id)).size).toBe(catalogue.length);
    for (const i of catalogue) expect(i.names['*']).toBeTruthy();
  });

  it('every substitute points at a real ingredient and has a note', () => {
    const ids = new Set(catalogue.map((i) => i.id));
    for (const i of catalogue) {
      for (const s of i.substitutes) {
        expect(ids.has(s.id), `${i.id} -> ${s.id}`).toBe(true);
        expect(s.id).not.toBe(i.id);
        expect(s.note.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('substitute notes make no health claims', () => {
    const banned = /\b(healthy|healthier|low[- ]fat|low[- ]carb|source of|light|diet|calorie|nutritious|weight)\b/i;
    for (const i of catalogue) for (const s of i.substitutes) expect(s.note).not.toMatch(banned);
  });

  it('no two ingredients share an exact name key', () => {
    const seen = new Map<string, string>();
    for (const i of catalogue) {
      for (const n of Object.values(i.names)) {
        const k = normalise(n);
        const prev = seen.get(k);
        if (prev && prev !== i.id) throw new Error(`${n} used by ${prev} and ${i.id}`);
        seen.set(k, i.id);
      }
    }
  });
});
