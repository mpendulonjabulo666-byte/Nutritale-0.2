import { allAllergenIds, markets, type AllergenId } from '@nutritale/markets';
import { z } from 'zod';
import { DIET_IDS } from '../storage/types.js';

/** Every schema is `.strict()`: unknown fields are rejected, not silently dropped. */

export const MARKET_CODES = markets.map((m) => String(m.code));
export const LOCALES = [...new Set(markets.map((m) => m.locale))];

const marketCode = z.string().refine((v) => MARKET_CODES.includes(v));
const locale = z.string().refine((v) => LOCALES.includes(v));
const email = z.string().trim().max(254).pipe(z.email());
/** 10 to 128 characters. The upper bound stops very long inputs from tying up Argon2. */
const newPassword = z.string().min(10).max(128);
/** Login accepts any length up to the same cap, so the 401 does not reveal the length rule. */
const anyPassword = z.string().min(1).max(128);
const allergenId = z.enum(allAllergenIds as [AllergenId, ...AllergenId[]]);
const refreshToken = z.string().regex(/^[A-Za-z0-9_-]{43}$/);

export const registerBody = z
  .object({
    email,
    password: newPassword,
    firstName: z.string().trim().min(1).max(50),
    market: marketCode,
    locale,
  })
  .strict();

export const loginBody = z.object({ email, password: anyPassword }).strict();

export const refreshBody = z.object({ refreshToken }).strict();

export const emptyBody = z.object({}).strict();

export const deleteMeBody = z.object({ password: anyPassword }).strict();

export const preferencesBody = z
  .object({
    market: marketCode.optional(),
    locale: locale.optional(),
    allergens: z.array(allergenId).max(allAllergenIds.length).optional(),
    diets: z.array(z.enum(DIET_IDS)).max(DIET_IDS.length).optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0);

export const searchQuery = z
  .object({
    q: z.string().max(64),
    locale: locale.optional(),
  })
  .strict();

export const localeQuery = z.object({ locale: locale.optional() }).strict();

export const ingredientIdParams = z.object({ id: z.string().regex(/^[a-z0-9-]{1,64}$/) }).strict();
