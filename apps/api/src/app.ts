import cors from 'cors';
import express, { type Express } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import type { Env } from './env.js';
import { createErrorHandler, notFound } from './errors.js';

export type AppConfig = Pick<Env, 'CORS_ORIGINS' | 'RATE_LIMIT_WINDOW_MS' | 'RATE_LIMIT_MAX' | 'JSON_BODY_LIMIT'>;

export interface AppOptions {
  /** Extra routes, mounted before the 404 and error handlers (used by tests). */
  extend?: (app: Express) => void;
  logError?: (err: unknown) => void;
}

export function createApp(config: AppConfig, options: AppOptions = {}): Express {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        // Requests without an Origin header (curl, server-to-server, mobile apps) are allowed.
        if (!origin || config.CORS_ORIGINS.includes(origin)) callback(null, true);
        else callback(null, false);
      },
    }),
  );
  app.use(
    rateLimit({
      windowMs: config.RATE_LIMIT_WINDOW_MS,
      limit: config.RATE_LIMIT_MAX,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
    }),
  );
  app.use(express.json({ limit: config.JSON_BODY_LIMIT }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  options.extend?.(app);

  app.use(notFound);
  app.use(createErrorHandler(options.logError));
  return app;
}
