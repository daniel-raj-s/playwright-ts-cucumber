/**
 * Converts a month abbreviation (e.g., "Jan", "FEB", "mar") to its 1-based month number.
 * Throws an error if the input is not a valid month abbreviation.
 * @param month - Three-letter month abbreviation.
 * @returns Month number from 1 (January) to 12 (December).
 */
export function monthAbbreviationToNumber(month: string): number {
  const normalized = month.trim().slice(0, 3).toLowerCase();
  const map: Record<string, number> = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
  };
  const num = map[normalized];
  if (!num) {
    throw new Error(`Invalid month abbreviation: "${month}"`);
  }
  return num;
}

/**
 * Pads a number to two digits with leading zero if necessary.
 * @param value - The number to pad.
 * @returns Two-digit string.
 */
export function formatTwoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Formats a date as "DD-MMM-YYYY".
 * You can optionally add an offset in days.
 * @param date - The base Date object. Defaults to now.
 * @param offsetDays - Number of days to add (can be negative). Defaults to 0.
 * @returns Formatted date string.
 */
export function formatDate(date: Date = new Date(), offsetDays = 0): string {
  const d = new Date(date);
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const day = formatTwoDigits(d.getDate());
  const month = d.toLocaleString("default", { month: "short" });
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Returns today's date formatted as "DD-MMM-YYYY".
 */
export function getFormattedCurrentDate(): string {
  return formatDate();
}
