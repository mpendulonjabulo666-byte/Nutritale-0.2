import type { Catalogue } from '@nutritale/catalogue-search';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import type { Env } from './env.js';
import { createErrorHandler, notFound } from './errors.js';
import { limiter } from './http/rateLimit.js';
import { requestId } from './http/requestId.js';
import { authRouter } from './routes/auth.js';
import { catalogueRouter } from './routes/catalogue.js';
import { meRouter } from './routes/me.js';
import { createMemoryRepos } from './storage/memory.js';
import type { Repos } from './storage/types.js';

export type AppConfig = Pick<
  Env,
  | 'CORS_ORIGINS'
  | 'RATE_LIMIT_WINDOW_MS'
  | 'RATE_LIMIT_MAX'
  | 'AUTH_RATE_LIMIT_WINDOW_MS'
  | 'AUTH_RATE_LIMIT_MAX'
  | 'CATALOGUE_RATE_LIMIT_WINDOW_MS'
  | 'CATALOGUE_RATE_LIMIT_MAX'
  | 'JSON_BODY_LIMIT'
  | 'JWT_SECRET'
>;

export interface AppOptions {
  /** Storage. Defaults to fresh in-memory repositories (tests). `server.ts` always passes them. */
  repos?: Repos;
  /** Ingredient catalogue. Defaults to the seed in @nutritale/catalogue-search. */
  catalogue?: Catalogue;
  /** Clock, so tests can expire tokens. */
  now?: () => Date;
  /** Extra routes, mounted before the 404 and error handlers (used by tests). */
  extend?: (app: Express) => void;
  logError?: (err: unknown) => void;
}

export function createApp(config: AppConfig, options: AppOptions = {}): Express {
  const repos = options.repos ?? createMemoryRepos();
  const now = options.now ?? (() => new Date());
  const deps = { repos, secret: config.JWT_SECRET, now };

  const app = express();
  app.disable('x-powered-by');
  app.use(requestId);
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        // Requests without an Origin header (curl, server-to-server, mobile apps) are allowed.
        if (!origin || config.CORS_ORIGINS.includes(origin)) callback(null, true);
        else callback(null, false);
      },
      exposedHeaders: ['X-Request-Id'],
    }),
  );
  app.use(limiter(config.RATE_LIMIT_WINDOW_MS, config.RATE_LIMIT_MAX));
  app.use(express.json({ limit: config.JSON_BODY_LIMIT }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/auth', authRouter(deps, limiter(config.AUTH_RATE_LIMIT_WINDOW_MS, config.AUTH_RATE_LIMIT_MAX)));
  app.use('/me', meRouter(deps));
  app.use('/catalogue', catalogueRouter(limiter(config.CATALOGUE_RATE_LIMIT_WINDOW_MS, config.CATALOGUE_RATE_LIMIT_MAX), options.catalogue));

  options.extend?.(app);

  app.use(notFound);
  app.use(createErrorHandler(options.logError));
  return app;
}
