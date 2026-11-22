import { search, seedCatalogue, substitutesFor, type Catalogue, type Ingredient } from '@nutritale/catalogue-search';
import { Router, type RequestHandler } from 'express';
import { HttpError } from '../errors.js';
import { parse } from '../http/validate.js';
import { ingredientIdParams, localeQuery, searchQuery } from './schemas.js';

const MAX_RESULTS = 8;

/** The fields of an ingredient a client needs. Internal data (aliases list, substitutes) stays here. */
function ingredientView(ingredient: Ingredient, displayName: string) {
  return { id: ingredient.id, name: displayName, category: ingredient.category };
}

/**
 * Public catalogue routes (no sign-in), behind their own rate limit.
 * Uses the in-memory seed from @nutritale/catalogue-search; server-side indexing is decision D10 (OPEN).
 */
export function catalogueRouter(limit: RequestHandler, catalogue: Catalogue = seedCatalogue): Router {
  const router = Router();
  router.use(limit);

  router.get('/search', (req, res) => {
    const query = parse(searchQuery, req.query, 'query');
    const locale = query.locale ?? '*';
    const r = search(query.q, { locale, catalogue, limit: MAX_RESULTS });
    res.json({
      status: r.status,
      results: r.results.slice(0, MAX_RESULTS).map((x) => ({
        ...ingredientView(x.ingredient, x.displayName),
        matchType: x.matchType,
        matchedTerm: x.matchedTerm,
      })),
      didYouMean: r.didYouMean ? ingredientView(r.didYouMean.ingredient, r.didYouMean.displayName) : null,
      suggestions: r.suggestions,
      canAddCustom: r.canAddCustom,
    });
  });

  router.get('/:id/substitutes', (req, res) => {
    const { id } = parse(ingredientIdParams, req.params, 'params');
    const query = parse(localeQuery, req.query, 'query');
    if (!catalogue.some((i) => i.id === id)) throw new HttpError(404, 'Ingredient not found', 'not_found');
    const subs = substitutesFor(id, catalogue, query.locale ?? '*');
    res.json({ id, substitutes: subs.map((s) => ({ ...ingredientView(s.ingredient, s.displayName), note: s.note })) });
  });

  return router;
}
