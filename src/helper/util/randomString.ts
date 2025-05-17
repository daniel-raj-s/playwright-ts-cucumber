import { randomBytes } from 'crypto';

const DEFAULT_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a random string of the given length using the supplied character set.
 * @param length - Desired length of the output string.
 * @param chars - Characters to use. Defaults to alphanumeric.
 */
export function randomString(length: number, chars: string = DEFAULT_CHARACTERS): string {
  if (length <= 0) return '';
  const bytes = randomBytes(length);
  return Array.from(bytes, b => chars[b % chars.length]).join('');
}

/**
 * Generates a random integer between min and max (inclusive).
 * @param min - Lower bound (inclusive).
 * @param max - Upper bound (inclusive).
 */
export function randomNumber(min: number = 0, max: number = 100): number {
  if (min > max) [min, max] = [max, min];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random floating-point number between min (inclusive) and max (exclusive).
 */
export function randomFloat(min: number = 0, max: number = 1): number {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random boolean value.
 */
export function randomBoolean(): boolean {
  return Math.random() < 0.5;
}

/**
 * Picks a random element from the provided array.
 */
export function randomArrayElement<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns a new array with the elements shuffled.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}