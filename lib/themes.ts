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

export function isValidTheme(value: string): value is ThemeId {
  return themeIds.includes(value as ThemeId);
}
