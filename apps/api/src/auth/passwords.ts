import { hash, verify, type Algorithm, type Options } from '@node-rs/argon2';

/**
 * Argon2id via `@node-rs/argon2` (prebuilt Rust binaries, no node-gyp build step, no
 * install scripts). Parameters follow the OWASP Password Storage Cheat Sheet minimum
 * for Argon2id: 19 MiB memory, 2 iterations, 1 lane.
 * `Algorithm` is a const enum in the typings, which `isolatedModules` cannot read,
 * so its value (Argon2id = 2) is written here and checked by a test (`$argon2id$` prefix).
 */
const ARGON2ID = 2 as Algorithm;

export const ARGON2_OPTIONS: Options = {
  algorithm: ARGON2ID,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  try {
    return await verify(passwordHash, password);
  } catch {
    return false;
  }
}

let dummyHash: Promise<string> | undefined;

/**
 * Runs a full Argon2 verify against a throw-away hash, so a login for an unknown email
 * takes about as long as a login with a wrong password (no timing hint that the email exists).
 */
export async function burnPasswordCheck(password: string): Promise<void> {
  dummyHash ??= hashPassword('nutritale-dummy-password-for-timing');
  await verifyPassword(await dummyHash, password);
}
