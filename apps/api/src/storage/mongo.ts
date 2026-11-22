import { randomUUID } from 'node:crypto';
import { MongoClient, MongoServerError, type Collection, type Db } from 'mongodb';
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

/**
 * MongoDB repositories (official `mongodb` driver).
 * Every query is built from typed, zod-validated string values; no request object is ever
 * passed into a filter, so operator injection (`{ "$ne": null }`) cannot reach the driver.
 */

type UserDoc = Omit<UserRecord, 'id'> & { _id: string };
type TokenDoc = Omit<RefreshTokenRecord, 'id'> & { _id: string };

const DUPLICATE_KEY = 11000;

function isDuplicateKey(err: unknown): boolean {
  return err instanceof MongoServerError && err.code === DUPLICATE_KEY;
}

function toUser(doc: UserDoc): UserRecord {
  const { _id, ...rest } = doc;
  return { id: _id, ...rest };
}

function toToken(doc: TokenDoc): RefreshTokenRecord {
  const { _id, ...rest } = doc;
  return { id: _id, ...rest };
}

export class MongoUserRepo implements UserRepo {
  constructor(private readonly users: Collection<UserDoc>) {}

  async create(input: NewUser, now: Date): Promise<UserRecord> {
    const doc: UserDoc = {
      _id: randomUUID(),
      email: input.email,
      emailLower: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      firstName: input.firstName,
      market: input.market,
      locale: input.locale,
      preferences: { allergens: [], diets: [] },
      createdAt: now,
      updatedAt: now,
    };
    try {
      await this.users.insertOne(doc);
    } catch (err) {
      if (isDuplicateKey(err)) throw new EmailTakenError();
      throw err;
    }
    return toUser(doc);
  }

  async findById(id: string): Promise<UserRecord | null> {
    const doc = await this.users.findOne({ _id: String(id) });
    return doc ? toUser(doc) : null;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const doc = await this.users.findOne({ emailLower: String(email).toLowerCase() });
    return doc ? toUser(doc) : null;
  }

  async update(id: string, update: UserUpdate, now: Date): Promise<UserRecord | null> {
    const set: Partial<UserDoc> = { updatedAt: now };
    if (update.market !== undefined) set.market = update.market;
    if (update.locale !== undefined) set.locale = update.locale;
    if (update.preferences !== undefined) set.preferences = update.preferences;
    const doc = await this.users.findOneAndUpdate({ _id: String(id) }, { $set: set }, { returnDocument: 'after' });
    return doc ? toUser(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.users.deleteOne({ _id: String(id) });
    return result.deletedCount === 1;
  }
}

export class MongoSessionRepo implements SessionRepo {
  constructor(private readonly sessions: Collection<TokenDoc>) {}

  async insert(token: Omit<RefreshTokenRecord, 'id'>): Promise<RefreshTokenRecord> {
    const doc: TokenDoc = { _id: randomUUID(), ...token };
    await this.sessions.insertOne(doc);
    return toToken(doc);
  }

  async findByHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const doc = await this.sessions.findOne({ tokenHash: String(tokenHash) });
    return doc ? toToken(doc) : null;
  }

  async revokeIfActive(tokenHash: string, now: Date): Promise<boolean> {
    const result = await this.sessions.updateOne({ tokenHash: String(tokenHash), revokedAt: null }, { $set: { revokedAt: now } });
    return result.modifiedCount === 1;
  }

  async revokeFamily(familyId: string, now: Date): Promise<void> {
    await this.sessions.updateMany({ familyId: String(familyId), revokedAt: null }, { $set: { revokedAt: now } });
  }

  async isFamilyActive(familyId: string, now: Date): Promise<boolean> {
    const doc = await this.sessions.findOne({ familyId: String(familyId), revokedAt: null, expiresAt: { $gt: now } }, { projection: { _id: 1 } });
    return doc !== null;
  }

  async deleteByUser(userId: string): Promise<void> {
    await this.sessions.deleteMany({ userId: String(userId) });
  }
}

/** Creates the indexes the repositories rely on. Safe to run on every start. */
export async function ensureIndexes(db: Db): Promise<void> {
  await db.collection<UserDoc>('users').createIndex({ emailLower: 1 }, { unique: true, name: 'users_emailLower_unique' });
  const sessions = db.collection<TokenDoc>('sessions');
  await sessions.createIndex({ tokenHash: 1 }, { unique: true, name: 'sessions_tokenHash_unique' });
  await sessions.createIndex({ familyId: 1 }, { name: 'sessions_familyId' });
  await sessions.createIndex({ userId: 1 }, { name: 'sessions_userId' });
  // Expired refresh tokens are removed by MongoDB's TTL monitor (runs about once a minute).
  await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'sessions_expiresAt_ttl' });
}

export function createMongoRepos(db: Db): Repos {
  return {
    users: new MongoUserRepo(db.collection<UserDoc>('users')),
    sessions: new MongoSessionRepo(db.collection<TokenDoc>('sessions')),
  };
}

/** Connects only when called; the URI comes from the environment, never from code. */
export async function connectMongo(uri: string, dbName: string): Promise<{ client: MongoClient; db: Db; repos: Repos }> {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 });
  await client.connect();
  const db = client.db(dbName);
  await ensureIndexes(db);
  return { client, db, repos: createMongoRepos(db) };
}
