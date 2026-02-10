/**
 * Content types for the family hotel site (data-model.md, content-schema.json).
 */

export interface Location {
  city: string;
  region: string;
  country: string;
  addressLine?: string;
}

export interface Policies {
  checkInOut?: string;
  cancellation?: string;
  externalUrl?: string;
}

export interface Property {
  name: string;
  location: Location;
  typeOfAccommodation: string;
  /** Optional hero tagline; when set, used as hero subtitle instead of typeOfAccommodation. */
  heroSubtitle?: string;
  description: string;
  amenities: string[];
  photos: string[];
  policies?: Policies;
  /** Optional: bullet points for "Why choose us" on home. */
  whyChooseUs?: string[];
  /** Optional: property details (e.g. bedrooms, bathrooms) for home. */
  propertyDetails?: Record<string, string> | string[];
  /** Optional: house rules summary for home (legacy string or list). */
  houseRules?: string | string[];
  /** Optional: structured house rules (title + description) for home. */
  houseRulesItems?: { title: string; description: string }[];
  /** Optional: property detail room cards (title + image number) for Property Details section. Localized per locale. */
  propertyDetailRooms?: { title: string; imageNum: number }[];
}

export type BookingChannelType = "airbnb" | "booking.com" | "vrbo" | "contact";

export interface BookingChannel {
  type: BookingChannelType;
  label: string;
  url: string;
  openInNewTab?: boolean;
}

export interface PropertyContent {
  property: Property;
}

export interface BookingChannelsContent {
  channels: BookingChannel[];
}

/** Footer link for site footer (label localized, href path or URL). */
export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

/** Footer link that opens a modal (e.g. Policies, FAQ). */
export interface FooterModalLink {
  label: string;
  modalId: "policies" | "faq";
}

/** Footer content: business name, address, links, and optional modal links. */
export interface FooterContent {
  businessName: string;
  addressLine: string;
  links: FooterLink[];
  /** Links that open in-page modals instead of navigating. */
  modalLinks?: FooterModalLink[];
  policiesContent?: { checkInOut?: string; cancellation?: string; externalUrl?: string };
  faqContent?: { title: string; items: { q: string; a: string }[] };
}

/** UI copy per locale (nav, gallery, hero labels). */
export interface UiStrings {
  /** Localized brand name for logo and hero (e.g. "Manna Family Hotel", "吗哪家庭旅馆"). */
  brandName: string;
  /** Section heading for Property Details. */
  propertyDetailsTitle: string;
  nav: { home: string; property: string; contact: string };
  gallery: {
    title: string;
    subtitle: string;
    viewAllPhotos: string;
    backToHome: string;
    viewGrid: string;
    viewMasonry: string;
    viewList: string;
  };
  hero: { ctaLabel: string };
}
