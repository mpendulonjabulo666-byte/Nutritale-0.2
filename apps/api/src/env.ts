import { z } from 'zod';

/**
 * Environment validation. Values come only from process.env (never hard-coded).
 * STORAGE picks the repositories: `mongo` (default) needs MONGODB_URI and MONGODB_DB;
 * `memory` keeps everything in process memory (tests and local Postman runs only) and is
 * refused when NODE_ENV=production.
 */
const csv = z
  .string()
  .default('')
  .transform((value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0),
  );

const positiveInt = z.coerce.number().int().positive();

export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    STORAGE: z.enum(['mongo', 'memory']).default('mongo'),
    MONGODB_URI: z
      .string()
      .min(1, 'MONGODB_URI is required')
      .refine((value) => /^mongodb(\+srv)?:\/\//.test(value), 'MONGODB_URI must start with mongodb:// or mongodb+srv://')
      .optional(),
    MONGODB_DB: z.string().min(1, 'MONGODB_DB is required').optional(),
    JWT_SECRET: z.string({ error: 'JWT_SECRET is required' }).min(32, 'JWT_SECRET must be at least 32 characters'),
    CORS_ORIGINS: csv,
    RATE_LIMIT_WINDOW_MS: positiveInt.default(15 * 60 * 1000),
    RATE_LIMIT_MAX: positiveInt.default(300),
    /** Tighter limit shared by POST /auth/register, /auth/login and /auth/refresh, per IP. */
    AUTH_RATE_LIMIT_WINDOW_MS: positiveInt.default(15 * 60 * 1000),
    AUTH_RATE_LIMIT_MAX: positiveInt.default(20),
    /** Limit for the public catalogue routes, per IP. */
    CATALOGUE_RATE_LIMIT_WINDOW_MS: positiveInt.default(60 * 1000),
    CATALOGUE_RATE_LIMIT_MAX: positiveInt.default(60),
    JSON_BODY_LIMIT: z.string().default('100kb'),
  })
  .superRefine((env, ctx) => {
    if (env.STORAGE === 'mongo') {
      if (!env.MONGODB_URI) ctx.addIssue({ code: 'custom', path: ['MONGODB_URI'], message: 'MONGODB_URI is required when STORAGE=mongo' });
      if (!env.MONGODB_DB) ctx.addIssue({ code: 'custom', path: ['MONGODB_DB'], message: 'MONGODB_DB is required when STORAGE=mongo' });
    }
    if (env.STORAGE === 'memory' && env.NODE_ENV === 'production') {
      ctx.addIssue({ code: 'custom', path: ['STORAGE'], message: 'STORAGE=memory is not allowed when NODE_ENV=production' });
    }
  });

export type Env = z.infer<typeof envSchema>;

/** Parse env. On failure, report only the variable names and messages, never the values. */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    throw new Error(`Invalid environment: ${problems}`);
  }
  return result.data;
}
