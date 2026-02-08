/**
 * Load file-based property and booking channels content by locale.
 * Content lives in content/property.[locale].json and content/booking-channels.[locale].json.
 * Uses static imports so Next.js can bundle and tree-shake per locale.
 */

import type { Locale } from "@/lib/i18n";
import type { BookingChannelsContent, PropertyContent } from "@/lib/types";

const propertyByLocale: Record<Locale, () => Promise<{ default: PropertyContent }>> = {
  en: () => import("@/content/property.en.json").then((m) => m as { default: PropertyContent }),
  fr: () => import("@/content/property.fr.json").then((m) => m as { default: PropertyContent }),
  "zh-Hans": () => import("@/content/property.zh-Hans.json").then((m) => m as { default: PropertyContent }),
  "zh-Hant": () => import("@/content/property.zh-Hant.json").then((m) => m as { default: PropertyContent }),
};

const bookingChannelsByLocale: Record<
  Locale,
  () => Promise<{ default: BookingChannelsContent }>
> = {
  en: () => import("@/content/booking-channels.en.json").then((m) => m as { default: BookingChannelsContent }),
  fr: () => import("@/content/booking-channels.fr.json").then((m) => m as { default: BookingChannelsContent }),
  "zh-Hans": () => import("@/content/booking-channels.zh-Hans.json").then((m) => m as { default: BookingChannelsContent }),
  "zh-Hant": () => import("@/content/booking-channels.zh-Hant.json").then((m) => m as { default: BookingChannelsContent }),
};

export async function getProperty(locale: Locale): Promise<PropertyContent["property"]> {
  const loader = propertyByLocale[locale];
  if (!loader) throw new Error(`Unsupported locale: ${locale}`);
  const mod = await loader();
  const data = mod.default;
  if (!data?.property) throw new Error(`Invalid property content for locale ${locale}`);
  return data.property;
}

export async function getBookingChannels(locale: Locale): Promise<BookingChannelsContent["channels"]> {
  const loader = bookingChannelsByLocale[locale];
  if (!loader) throw new Error(`Unsupported locale: ${locale}`);
  const mod = await loader();
  const data = mod.default;
  if (!data?.channels?.length) throw new Error(`Invalid or empty booking channels for locale ${locale}`);
  return data.channels;
}
