import type { z } from 'zod';
import { HttpError } from '../errors.js';

/**
 * Parses input with a zod schema. On failure throws a 400 with a fixed message: zod's own
 * messages (which can echo input) are never sent to the client.
 */
export function parse<S extends z.ZodType>(schema: S, input: unknown, what: 'body' | 'query' | 'params' = 'body'): z.infer<S> {
  const result = schema.safeParse(input ?? {});
  if (!result.success) throw new HttpError(400, `Invalid request ${what}`, 'validation_error');
  return result.data;
}
