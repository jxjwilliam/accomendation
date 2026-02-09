/**
 * Load file-based property and booking channels content by locale.
 * Content lives in content/property.[locale].json and content/booking-channels.[locale].json.
 * Uses static imports so Next.js can bundle and tree-shake per locale.
 */

import type { Locale } from "@/lib/i18n";
import type { BookingChannelsContent, PropertyContent, FooterContent, FooterLink, UiStrings } from "@/lib/types";

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

const uiStringsByLocale: Record<Locale, () => Promise<{ default: UiStrings }>> = {
  en: () => import("@/content/ui.en.json").then((m) => m as { default: UiStrings }),
  fr: () => import("@/content/ui.fr.json").then((m) => m as { default: UiStrings }),
  "zh-Hans": () => import("@/content/ui.zh-Hans.json").then((m) => m as { default: UiStrings }),
  "zh-Hant": () => import("@/content/ui.zh-Hant.json").then((m) => m as { default: UiStrings }),
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

/**
 * Get UI strings for the given locale. Falls back to English if locale or keys are missing.
 */
export async function getUiStrings(locale: Locale): Promise<UiStrings> {
  const loader = uiStringsByLocale[locale] ?? uiStringsByLocale.en;
  try {
    const mod = await loader();
    if (mod?.default) return mod.default;
  } catch {
    // fallback to en
  }
  const mod = await uiStringsByLocale.en();
  return mod.default;
}

const footerLinkLabels: Record<Locale, { property: string; gallery: string; policies: string; faq: string; book: string }> = {
  en: { property: "Property", gallery: "Gallery", policies: "Policies", faq: "FAQ", book: "Book" },
  fr: { property: "Propriété", gallery: "Galerie", policies: "Politiques", faq: "FAQ", book: "Réserver" },
  "zh-Hans": { property: "房源", gallery: "相册", policies: "政策", faq: "常见问题", book: "预订" },
  "zh-Hant": { property: "房源", gallery: "相簿", policies: "政策", faq: "常見問題", book: "預訂" },
};

const faqByLocale: Record<Locale, { title: string; items: { q: string; a: string }[] }> = {
  en: {
    title: "Frequently asked questions",
    items: [
      { q: "What are check-in and check-out times?", a: "Check-in after 3 PM, check-out by 11 AM." },
      { q: "Is cancellation free?", a: "Free cancellation up to 24 hours before check-in." },
      { q: "Is there parking?", a: "Yes, free parking is available." },
    ],
  },
  fr: {
    title: "Questions fréquentes",
    items: [
      { q: "Heures d'arrivée et de départ?", a: "Arrivée après 15 h, départ avant 11 h." },
      { q: "Annulation gratuite?", a: "Annulation gratuite jusqu'à 24 h avant l'arrivée." },
      { q: "Y a-t-il un stationnement?", a: "Oui, stationnement gratuit disponible." },
    ],
  },
  "zh-Hans": {
    title: "常见问题",
    items: [
      { q: "入住和退房时间？", a: "下午3点后入住，上午11点前退房。" },
      { q: "可以免费取消吗？", a: "入住前24小时可免费取消。" },
      { q: "有停车位吗？", a: "有，提供免费停车。" },
    ],
  },
  "zh-Hant": {
    title: "常見問題",
    items: [
      { q: "入住和退房時間？", a: "下午3點後入住，上午11點前退房。" },
      { q: "可以免費取消嗎？", a: "入住前24小時可免費取消。" },
      { q: "有停車位嗎？", a: "有，提供免費停車。" },
    ],
  },
};

/**
 * Get footer content derived from property (name, address), links, and modal content.
 * Policies and FAQ open in modals; Book links to #contact.
 */
export async function getFooterContent(locale: Locale): Promise<FooterContent> {
  const property = await getProperty(locale);
  const labels = footerLinkLabels[locale] ?? footerLinkLabels.en;
  const addressLine =
    property.location.addressLine ??
    `${property.location.city}, ${property.location.region}, ${property.location.country}`;
  const links: FooterLink[] = [
    { label: labels.property, href: `/${locale}#property-details` },
    { label: labels.gallery, href: `/${locale}/gallery` },
    { label: labels.book, href: `/${locale}#contact` },
  ];
  const modalLinks: FooterContent["modalLinks"] = [
    { label: labels.policies, modalId: "policies" },
    { label: labels.faq, modalId: "faq" },
  ];
  return {
    businessName: property.name,
    addressLine,
    links,
    modalLinks,
    policiesContent: property.policies,
    faqContent: faqByLocale[locale] ?? faqByLocale.en,
  };
}
