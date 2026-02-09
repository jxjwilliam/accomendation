/**
 * Central SEO config for the family hotel site (Surrey, Vancouver BC).
 * Drives metadata, Open Graph, and LodgingBusiness JSON-LD.
 * @see specs/003-add-seo/contracts/seo-config-schema.json
 */

import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

/** Max length for page titles (search snippet). */
export const TITLE_MAX = 60;
/** Max length for meta descriptions (search snippet). */
export const DESC_MAX = 160;

const DEFAULT_OG_IMAGE_PATH = "/images/image_001.jpg";

/** Default titles per locale (family hotel, Surrey, Vancouver BC). */
const DEFAULT_TITLES: Record<Locale, string> = {
  en: "Wonderful Family Stay | Surrey Vancouver BC",
  fr: "Wonderful Family Stay | Surrey Vancouver BC",
  "zh-Hans": "Wonderful Family Stay | 素里 温哥华 BC",
  "zh-Hant": "Wonderful Family Stay | 素里 溫哥華 BC",
};

/** Default meta descriptions per locale (comfort, fully equipped, accommodation). */
const DEFAULT_DESCRIPTIONS: Record<Locale, string> = {
  en: "Family hotel in Surrey, Vancouver BC, Canada. Comfortable, fully equipped accommodation. Book or contact us.",
  fr: "Hôtel familial à Surrey, Vancouver BC, Canada. Hébergement confortable et bien équipé. Réservez ou contactez-nous.",
  "zh-Hans": "加拿大 BC 省温哥华素里家庭旅馆，住宿舒适、功能齐全。预订或联系我们。",
  "zh-Hant": "加拿大 BC 省溫哥華素里家庭旅館，住宿舒適、功能齊全。預訂或聯絡我們。",
};

/** Per-page overrides: path segment -> { title?, description? } (locale-agnostic keys). */
const PAGE_OVERRIDES: Record<string, { title?: Record<Locale, string>; description?: Record<Locale, string> }> = {};

/**
 * Returns the site base URL for absolute links (sitemap, robots, OG).
 * Use NEXT_PUBLIC_SITE_URL in production; fallback for local dev.
 */
export function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url) return url.replace(/\/$/, "");
  if (typeof process.env.VERCEL_URL === "string")
    return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/**
 * Returns default page title for a locale, length-limited for search snippets.
 */
export function getDefaultTitle(locale: Locale, pathSegment?: string): string {
  const overrides = pathSegment ? PAGE_OVERRIDES[pathSegment]?.title : undefined;
  const raw = overrides?.[locale] ?? DEFAULT_TITLES[locale] ?? DEFAULT_TITLES.en;
  return raw.length > TITLE_MAX ? raw.slice(0, TITLE_MAX - 3) + "..." : raw;
}

/**
 * Returns default meta description for a locale, length-limited for search snippets.
 */
export function getDefaultDescription(locale: Locale, pathSegment?: string): string {
  const overrides = pathSegment ? PAGE_OVERRIDES[pathSegment]?.description : undefined;
  const raw = overrides?.[locale] ?? DEFAULT_DESCRIPTIONS[locale] ?? DEFAULT_DESCRIPTIONS.en;
  return raw.length > DESC_MAX ? raw.slice(0, DESC_MAX - 3) + "..." : raw;
}

/** LodgingBusiness address (Surrey, Vancouver BC, Canada). */
export interface SeoAddress {
  "@type"?: "PostalAddress";
  addressCountry: string;
  addressRegion: string;
  addressLocality: string;
  streetAddress?: string;
  postalCode?: string;
}

/** LodgingBusiness shape for JSON-LD (schema.org). */
export interface LodgingBusinessData {
  "@context": "https://schema.org";
  "@type": "LodgingBusiness";
  name: string;
  description: string;
  url: string;
  address: SeoAddress;
  image?: string;
  telephone?: string;
  priceRange?: string;
  amenityFeature?: Array<{ "@type": "LocationFeatureSpecification"; name: string; value: boolean }>;
  availableLanguage?: string[];
  checkinTime?: string;
  checkoutTime?: string;
  inLanguage?: string;
}

/**
 * Returns LodgingBusiness JSON-LD data for the family hotel (Surrey, Vancouver BC).
 * Optional locale for inLanguage and localized description.
 */
export function getBusiness(locale?: Locale): LodgingBusinessData {
  const baseUrl = getBaseUrl();
  const desc = locale ? getDefaultDescription(locale) : DEFAULT_DESCRIPTIONS.en;
  const data: LodgingBusinessData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Wonderful Family Stay Surrey",
    description: desc,
    url: baseUrl,
    address: {
      "@type": "PostalAddress",
      addressCountry: "CA",
      addressRegion: "BC",
      addressLocality: "Surrey",
      streetAddress: "16727 108 Avenue",
      postalCode: "V4N 1N5",
    },
    image: getOgImageUrl(),
    availableLanguage: [...locales],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Comfortable", value: true },
      { "@type": "LocationFeatureSpecification", name: "Fully equipped", value: true },
      { "@type": "LocationFeatureSpecification", name: "Family-friendly", value: true },
    ],
    checkinTime: "15:00",
    checkoutTime: "11:00",
  };
  if (locale) data.inLanguage = locale;
  return data;
}

/**
 * Returns absolute URL for the default OG/Twitter image.
 */
export function getOgImageUrl(): string {
  const base = getBaseUrl();
  const path = DEFAULT_OG_IMAGE_PATH.startsWith("http") ? DEFAULT_OG_IMAGE_PATH : `${base}${DEFAULT_OG_IMAGE_PATH}`;
  return path;
}
