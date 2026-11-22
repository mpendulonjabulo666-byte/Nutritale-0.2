import { z } from 'zod';

/**
 * Environment validation. Values come only from process.env (never hard-coded).
 * MONGODB_URI and MONGODB_DB are validated but the skeleton does not connect to a database yet.
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

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  MONGODB_URI: z
    .string()
    .min(1, 'MONGODB_URI is required')
    .refine((value) => /^mongodb(\+srv)?:\/\//.test(value), 'MONGODB_URI must start with mongodb:// or mongodb+srv://'),
  MONGODB_DB: z.string().min(1, 'MONGODB_DB is required'),
  CORS_ORIGINS: csv,
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
  JSON_BODY_LIMIT: z.string().default('100kb'),
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
