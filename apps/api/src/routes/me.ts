import { getMarket } from '@nutritale/markets';
import { Router } from 'express';
import { verifyPassword } from '../auth/passwords.js';
import { authOf, requireAuth } from '../auth/requireAuth.js';
import { HttpError } from '../errors.js';
import { parse } from '../http/validate.js';
import { toPublicUser } from '../storage/types.js';
import type { RouteDeps } from './auth.js';
import { deleteMeBody, emptyBody, preferencesBody } from './schemas.js';

/**
 * Routes for the signed-in user. None takes a user id from the request: the id always comes
 * from the verified access token, so one user cannot name another user's record.
 */
export function meRouter(deps: RouteDeps): Router {
  const router = Router();
  const { users, sessions } = deps.repos;
  router.use(requireAuth({ secret: deps.secret, sessions, now: deps.now }));
  // No /me route takes query parameters; any are rejected (for example `?userId=`).
  router.use((req, _res, next) => {
    parse(emptyBody, req.query, 'query');
    next();
  });

  const unauthorized = () => new HttpError(401, 'Authentication required', 'unauthorized');

  router.get('/', async (_req, res) => {
    const user = await users.findById(authOf(res).sub);
    if (!user) throw unauthorized();
    res.json({ user: toPublicUser(user) });
  });

  router.patch('/preferences', async (req, res) => {
    const body = parse(preferencesBody, req.body);
    const auth = authOf(res);
    const user = await users.findById(auth.sub);
    if (!user) throw unauthorized();
    const marketCode = body.market ?? user.market;
    const market = getMarket(marketCode);
    if (!market) throw new HttpError(400, 'Invalid request body', 'validation_error');
    const allergens = body.allergens ?? user.preferences.allergens;
    const allowed = new Set<string>(market.allergenRule.allergens);
    if (allergens.some((id) => !allowed.has(id))) {
      throw new HttpError(400, "Allergen is not in this market's allergen list", 'allergen_not_in_market');
    }
    const updated = await users.update(
      auth.sub,
      {
        market: body.market,
        locale: body.locale,
        preferences: { allergens: [...new Set(allergens)], diets: [...new Set(body.diets ?? user.preferences.diets)] },
      },
      deps.now(),
    );
    if (!updated) throw unauthorized();
    res.json({ user: toPublicUser(updated) });
  });

  router.delete('/', async (req, res) => {
    const body = parse(deleteMeBody, req.body);
    const auth = authOf(res);
    const user = await users.findById(auth.sub);
    if (!user) throw unauthorized();
    if (!(await verifyPassword(user.passwordHash, body.password))) {
      throw new HttpError(403, 'Password is incorrect', 'password_incorrect');
    }
    await sessions.deleteByUser(user.id);
    await users.delete(user.id);
    res.status(204).end();
  });

  return router;
}
