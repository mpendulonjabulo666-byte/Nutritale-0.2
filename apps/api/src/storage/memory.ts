import { randomUUID } from 'node:crypto';
import {
  EmailTakenError,
  type NewUser,
  type RefreshTokenRecord,
  type Repos,
  type SessionRepo,
  type UserRecord,
  type UserRepo,
  type UserUpdate,
} from './types.js';

function cloneUser(user: UserRecord): UserRecord {
  return { ...user, preferences: { allergens: [...user.preferences.allergens], diets: [...user.preferences.diets] } };
}

/** In-memory users. For tests and local runs only (STORAGE=memory). */
export class MemoryUserRepo implements UserRepo {
  private readonly byId = new Map<string, UserRecord>();

  async create(input: NewUser, now: Date): Promise<UserRecord> {
    const emailLower = input.email.toLowerCase();
    for (const user of this.byId.values()) if (user.emailLower === emailLower) throw new EmailTakenError();
    const user: UserRecord = {
      id: randomUUID(),
      email: input.email,
      emailLower,
      passwordHash: input.passwordHash,
      firstName: input.firstName,
      market: input.market,
      locale: input.locale,
      preferences: { allergens: [], diets: [] },
      createdAt: now,
      updatedAt: now,
    };
    this.byId.set(user.id, user);
    return cloneUser(user);
  }

  async findById(id: string): Promise<UserRecord | null> {
    const user = this.byId.get(id);
    return user ? cloneUser(user) : null;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const emailLower = email.toLowerCase();
    for (const user of this.byId.values()) if (user.emailLower === emailLower) return cloneUser(user);
    return null;
  }

  async update(id: string, update: UserUpdate, now: Date): Promise<UserRecord | null> {
    const user = this.byId.get(id);
    if (!user) return null;
    const next: UserRecord = {
      ...user,
      market: update.market ?? user.market,
      locale: update.locale ?? user.locale,
      preferences: update.preferences
        ? { allergens: [...update.preferences.allergens], diets: [...update.preferences.diets] }
        : user.preferences,
      updatedAt: now,
    };
    this.byId.set(id, next);
    return cloneUser(next);
  }

  async delete(id: string): Promise<boolean> {
    return this.byId.delete(id);
  }

  /** Test helper. */
  size(): number {
    return this.byId.size;
  }
}

/** In-memory refresh tokens. For tests and local runs only (STORAGE=memory). */
export class MemorySessionRepo implements SessionRepo {
  private readonly byHash = new Map<string, RefreshTokenRecord>();

  async insert(token: Omit<RefreshTokenRecord, 'id'>): Promise<RefreshTokenRecord> {
    if (this.byHash.has(token.tokenHash)) throw new Error('Duplicate refresh token hash');
    const record: RefreshTokenRecord = { ...token, id: randomUUID() };
    this.byHash.set(record.tokenHash, record);
    return { ...record };
  }

  async findByHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const record = this.byHash.get(tokenHash);
    return record ? { ...record } : null;
  }

  async revokeIfActive(tokenHash: string, now: Date): Promise<boolean> {
    const record = this.byHash.get(tokenHash);
    if (!record || record.revokedAt) return false;
    record.revokedAt = now;
    return true;
  }

  async revokeFamily(familyId: string, now: Date): Promise<void> {
    for (const record of this.byHash.values()) {
      if (record.familyId === familyId && !record.revokedAt) record.revokedAt = now;
    }
  }

  async isFamilyActive(familyId: string, now: Date): Promise<boolean> {
    for (const record of this.byHash.values()) {
      if (record.familyId === familyId && !record.revokedAt && record.expiresAt > now) return true;
    }
    return false;
  }

  async deleteByUser(userId: string): Promise<void> {
    for (const [hash, record] of this.byHash) if (record.userId === userId) this.byHash.delete(hash);
  }

  /** Test helper. */
  countForUser(userId: string): number {
    let n = 0;
    for (const record of this.byHash.values()) if (record.userId === userId) n += 1;
    return n;
  }
}

export function createMemoryRepos(): Repos & { users: MemoryUserRepo; sessions: MemorySessionRepo } {
  return { users: new MemoryUserRepo(), sessions: new MemorySessionRepo() };
}
