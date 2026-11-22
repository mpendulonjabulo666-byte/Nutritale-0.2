import type { AllergenId, MarketCode } from '@nutritale/markets';

/** Diet choices shown in the prototype (`design/prototype/Profile.dc.html`). */
export const DIET_IDS = ['vegetarian', 'vegan', 'halaal', 'no-pork', 'kid-friendly'] as const;
export type DietId = (typeof DIET_IDS)[number];

export interface UserPreferences {
  allergens: AllergenId[];
  diets: DietId[];
}

/** Stored user. `passwordHash` never leaves the API: use `toPublicUser` for responses. */
export interface UserRecord {
  id: string;
  /** As typed, trimmed. */
  email: string;
  /** Lower-cased email; unique. */
  emailLower: string;
  passwordHash: string;
  firstName: string;
  market: MarketCode;
  locale: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUser {
  email: string;
  passwordHash: string;
  firstName: string;
  market: MarketCode;
  locale: string;
}

export interface UserUpdate {
  market?: MarketCode;
  locale?: string;
  preferences?: UserPreferences;
}

export class EmailTakenError extends Error {
  constructor() {
    super('Email already registered');
    this.name = 'EmailTakenError';
  }
}

export interface UserRepo {
  /** Throws EmailTakenError when the lower-cased email exists. */
  create(user: NewUser, now: Date): Promise<UserRecord>;
  findById(id: string): Promise<UserRecord | null>;
  findByEmail(email: string): Promise<UserRecord | null>;
  update(id: string, update: UserUpdate, now: Date): Promise<UserRecord | null>;
  /** Returns true when a user was removed. */
  delete(id: string): Promise<boolean>;
}

/**
 * One refresh token. Tokens issued from one login share a `familyId` (the session).
 * Only the SHA-256 hash of the token is stored.
 */
export interface RefreshTokenRecord {
  id: string;
  familyId: string;
  userId: string;
  tokenHash: string;
  createdAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface SessionRepo {
  /** Throws if `tokenHash` already exists (unique index). */
  insert(token: Omit<RefreshTokenRecord, 'id'>): Promise<RefreshTokenRecord>;
  findByHash(tokenHash: string): Promise<RefreshTokenRecord | null>;
  /**
   * Atomically revokes the token if it is not revoked yet. Returns false when it was
   * already revoked (so two parallel refreshes cannot both succeed).
   */
  revokeIfActive(tokenHash: string, now: Date): Promise<boolean>;
  /** Revokes every token in the family (logout, or reuse of a revoked token). */
  revokeFamily(familyId: string, now: Date): Promise<void>;
  /** True while the family has at least one token that is not revoked and not expired. */
  isFamilyActive(familyId: string, now: Date): Promise<boolean>;
  deleteByUser(userId: string): Promise<void>;
}

export interface Repos {
  users: UserRepo;
  sessions: SessionRepo;
}

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  market: MarketCode;
  locale: string;
  preferences: UserPreferences;
  createdAt: string;
}

/** The only shape of a user that is ever sent to a client. No password hash. */
export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    market: user.market,
    locale: user.locale,
    preferences: { allergens: [...user.preferences.allergens], diets: [...user.preferences.diets] },
    createdAt: user.createdAt.toISOString(),
  };
}
