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
  description: string;
  amenities: string[];
  photos: string[];
  policies?: Policies;
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

/** Footer content: business name, address, and links. */
export interface FooterContent {
  businessName: string;
  addressLine: string;
  links: FooterLink[];
}
