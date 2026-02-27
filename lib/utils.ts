/** Merge class names (simple version without clsx dependency) */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Format a number in the given locale */
export function formatNumber(n: number, locale: string): string {
  return n.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US');
}

/** Saudi cities list */
export const SAUDI_CITIES = [
  'Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah',
  'Tabuk', 'Abha', 'Khobar', 'Jubail', 'Yanbu', 'Other',
] as const;

export type SaudiCity = typeof SAUDI_CITIES[number];
