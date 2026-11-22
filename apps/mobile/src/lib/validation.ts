import { en } from '@/copy/en';

/** Same rule as the prototype: something@something.something, no spaces. */
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Minimum password length for new accounts (prototype register screen). */
export const MIN_PASSWORD_LENGTH = 10;

export function emailError(value: string): string | undefined {
  const email = value.trim();
  if (!email) return en.signIn.errEmailEmpty;
  if (!EMAIL_PATTERN.test(email)) return en.signIn.errEmailFormat;
  return undefined;
}

export function newPasswordError(value: string): string | undefined {
  return value.length < MIN_PASSWORD_LENGTH ? en.register.errPasswordShort : undefined;
}
