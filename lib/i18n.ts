/**
 * i18n configuration: supported locales for the family hotel site.
 * FR-007, FR-008: English (primary), French, Chinese Simplified, Chinese Traditional.
 */

export const locales = ["en", "fr", "zh-Hans", "zh-Hant"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh-Hans";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  "zh-Hans": "简体",
  "zh-Hant": "繁體",
};

/** Short or icon-like label per locale for nav (e.g. flag emoji). */
export const localeIcons: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  "zh-Hans": "简",
  "zh-Hant": "繁",
};

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
