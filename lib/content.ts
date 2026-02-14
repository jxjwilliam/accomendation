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

/** Deep merge: fill missing keys in target from source (one level for nested objects). */
function mergeUiStrings(target: Partial<UiStrings>, source: UiStrings): UiStrings {
  const merged = { ...source };
  for (const key of Object.keys(source) as (keyof UiStrings)[]) {
    const t = target[key as keyof UiStrings];
    const s = source[key as keyof UiStrings];
    if (t != null && typeof t === "object" && !Array.isArray(t) && s != null && typeof s === "object") {
      (merged as Record<string, unknown>)[key] = { ...s, ...t };
    } else if (t != null) {
      (merged as Record<string, unknown>)[key] = t;
    }
  }
  return merged;
}

/**
 * Get UI strings for the given locale. Falls back to English for missing keys (Option B).
 */
export async function getUiStrings(locale: Locale): Promise<UiStrings> {
  const enMod = await uiStringsByLocale.en();
  const en = enMod.default;
  const loader = uiStringsByLocale[locale] ?? uiStringsByLocale.en;
  try {
    const mod = await loader();
    if (mod?.default) return mergeUiStrings(mod.default, en);
  } catch {
    // fallback to en
  }
  return en;
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
      { q: "What are check-in and check-out times?", a: "Check-in after 4 PM, check-out by 10 AM." },
      { q: "Is cancellation free?", a: "Free cancellation up to 24 hours before check-in." },
      { q: "Is there parking?", a: "Yes, free parking is available." },
      { q: "Is WiFi available?", a: "Yes, high-speed WiFi is available throughout the property." },
      { q: "Are pets allowed?", a: "Please contact us for our pet policy. Some restrictions may apply." },
      { q: "Is smoking allowed?", a: "This is a non-smoking property. Smoking is not permitted indoors." },
    ],
  },
  fr: {
    title: "Questions fréquentes",
    items: [
      { q: "Heures d'arrivée et de départ?", a: "Arrivée après 15 h, départ avant 11 h." },
      { q: "Annulation gratuite?", a: "Annulation gratuite jusqu'à 24 h avant l'arrivée." },
      { q: "Y a-t-il un stationnement?", a: "Oui, stationnement gratuit disponible." },
      { q: "Le WiFi est-il disponible?", a: "Oui, WiFi haut débit disponible dans toute la propriété." },
      { q: "Les animaux sont-ils acceptés?", a: "Veuillez nous contacter pour notre politique concernant les animaux." },
      { q: "Le tabac est-il autorisé?", a: "Propriété non-fumeurs. Fumer n'est pas permis à l'intérieur." },
    ],
  },
  "zh-Hans": {
    title: "常见问题",
    items: [
      { q: "入住和退房时间？", a: "下午4点后入住，上午10点前退房。" },
      { q: "可以免费取消吗？", a: "入住前24小时可免费取消。" },
      { q: "有停车位吗？", a: "有，提供免费停车。" },
      { q: "有WiFi吗？", a: "有，全屋提供高速WiFi。" },
      { q: "可以带宠物吗？", a: "请与我们联系了解宠物政策。" },
      { q: "可以吸烟吗？", a: "本房源为无烟房，室内禁止吸烟。" },
    ],
  },
  "zh-Hant": {
    title: "常見問題",
    items: [
      { q: "入住和退房時間？", a: "下午4點後入住，上午10點前退房。" },
      { q: "可以免費取消嗎？", a: "入住前24小時可免費取消。" },
      { q: "有停車位嗎？", a: "有，提供免費停車。" },
      { q: "有WiFi嗎？", a: "有，全屋提供高速WiFi。" },
      { q: "可以帶寵物嗎？", a: "請與我們聯繫了解寵物政策。" },
      { q: "可以吸煙嗎？", a: "本房源為無煙房，室內禁止吸煙。" },
    ],
  },
};

/**
 * Get FAQ content for the given locale (used by House Rules section).
 */
export function getFaqContent(locale: Locale): { title: string; items: { q: string; a: string }[] } {
  return faqByLocale[locale] ?? faqByLocale.en;
}

/**
 * Get footer content derived from property (name, address), links, and modal content.
 * Policies open in modal; FAQ merged into House Rules section; Book links to Airbnb.
 */
export async function getFooterContent(locale: Locale): Promise<FooterContent> {
  const property = await getProperty(locale);
  const labels = footerLinkLabels[locale] ?? footerLinkLabels.en;
  const addressLine =
    property.location.addressLine ??
    `${property.location.city}, ${property.location.region}, ${property.location.country}`;
  const links: FooterLink[] = [];
  const faq = faqByLocale[locale] ?? faqByLocale.en;
  const modalLinks: FooterContent["modalLinks"] =
    faq.items?.length && property.policies
      ? [] // Policies redundant with FAQ (check-in/cancellation covered in Q&A)
      : property.policies
        ? [{ label: labels.policies, modalId: "policies" }]
        : [];
  return {
    businessName: property.name,
    addressLine,
    links,
    modalLinks,
    policiesContent: property.policies,
    faqContent: faqByLocale[locale] ?? faqByLocale.en,
  };
}
