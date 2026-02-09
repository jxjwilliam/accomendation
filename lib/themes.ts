/**
 * Theme definitions aligned with tweakcn.com/editor/theme.
 * Applied via data-theme on <html>. Elegant Luxury = default (no data-theme).
 */

export const themeIds = ["elegant-luxury", "sunset-horizon", "ocean-breeze", "candyland"] as const;
export type ThemeId = (typeof themeIds)[number];

export const themeLabels: Record<ThemeId, string> = {
  "elegant-luxury": "Elegant Luxury",
  "sunset-horizon": "Sunset Horizon",
  "ocean-breeze": "Ocean Breeze",
  "candyland": "Candyland",
};

export const defaultThemeId: ThemeId = "elegant-luxury";

/** Primary color (oklch) per theme for swatch and label in theme dropdown. */
export const themePrimaryColors: Record<ThemeId, string> = {
  "elegant-luxury": "oklch(0.4650 0.1470 24.9381)",
  "sunset-horizon": "oklch(0.55 0.18 45)",
  "ocean-breeze": "oklch(0.5 0.15 230)",
  candyland: "oklch(0.6 0.2 350)",
};

export function isValidTheme(value: string): value is ThemeId {
  return themeIds.includes(value as ThemeId);
}
