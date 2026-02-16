/**
 * Channel configuration loader and OTA URL builders.
 * Reads content/channels/*.json and exposes booking options with iCal URLs.
 * @see specs/007-add-ical/data-model.md
 */

import type { UiStrings } from "@/lib/types";

/** Airbnb config: single option or array for configs with multiple listings (e.g. 1/1). */
interface AirbnbOption {
  ical: string;
  room: string;
  label?: string;
}

type AirbnbConfig = Record<string, AirbnbOption | AirbnbOption[]>;

/** VRBO config: bedrooms count -> option. */
interface VrboOption {
  ical: string;
  propertyId: string;
}

type VrboConfig = Record<string, VrboOption>;

/** Booking option for UI: config key, label, OTA links, optional iCal subscribe URL. */
export interface BookingOption {
  configKey: string;
  label: string;
  links: { ota: "airbnb" | "vrbo"; url: string; label: string }[];
  icalUrl?: string;
}

const AIRBNB_BASE = "https://www.airbnb.ca/rooms";
const VRBO_BASE = "https://www.vrbo.com/en-ca/cottage-rental";

/** Build Airbnb room booking URL. */
export function buildAirbnbUrl(roomId: string): string {
  return `${AIRBNB_BASE}/${roomId}`;
}

/** Build VRBO property booking URL. */
export function buildVrboUrl(propertyId: string): string {
  return `${VRBO_BASE}/p${propertyId}?dateless=true`;
}

/** Map Airbnb config key (3/2, 2/1, 1/1) to VRBO bedrooms key (3, 2, 1). */
const AIRBNB_TO_VRBO: Record<string, string> = {
  "3/2": "3",
  "2/1": "2",
  "1/1": "1",
};

/** Load Airbnb channel config from JSON. */
async function loadAirbnbConfig(): Promise<AirbnbConfig | null> {
  try {
    const mod = await import("@/content/channels/airbnb.json");
    return mod.default as AirbnbConfig;
  } catch {
    return null;
  }
}

/** Load VRBO channel config from JSON. */
async function loadVrboConfig(): Promise<VrboConfig | null> {
  try {
    const mod = await import("@/content/channels/vrbo.json");
    return mod.default as VrboConfig;
  } catch {
    return null;
  }
}

/** Get raw Airbnb config by OTA name. */
export async function getChannelConfig(
  ota: "airbnb" | "vrbo"
): Promise<AirbnbConfig | VrboConfig | null> {
  if (ota === "airbnb") return loadAirbnbConfig();
  if (ota === "vrbo") return loadVrboConfig();
  return null;
}

/** Normalize URL param (e.g. "3-2") to Airbnb config key ("3/2"). */
export function configParamToKey(param: string): string {
  return param.replace(/-/g, "/");
}

/** Get iCal URL for a config from Airbnb. Returns null if config not found. */
export async function getIcalUrlForConfig(configKey: string): Promise<string | null> {
  const airbnb = await loadAirbnbConfig();
  if (!airbnb) return null;

  const entry = airbnb[configKey];
  if (!entry) return null;

  const first = Array.isArray(entry) ? entry[0] : entry;
  return first?.ical ?? null;
}

/**
 * Build booking options for Book Your Stay section.
 * Aggregates Airbnb and VRBO configs; uses uiStrings.hero.roomConfigs for labels.
 */
export async function getBookingOptions(
  uiStrings: UiStrings
): Promise<BookingOption[]> {
  const airbnb = await loadAirbnbConfig();
  const vrbo = await loadVrboConfig();

  const roomConfigs = uiStrings.hero.roomConfigs ?? [
    "3BR / 2BA",
    "2BR / 1BA",
    "1BR / 1BA",
  ];

  const roomConfigsFull = uiStrings.hero.roomConfigsFull ?? [
    "3 Bedrooms / 2 Bathrooms",
    "2 Bedrooms / 1 Bathroom",
    "1 Bedroom / 1 Bathroom",
  ];

  const configOrder: { key: string; labelIndex: number }[] = [
    { key: "3/2", labelIndex: 0 },
    { key: "2/1", labelIndex: 1 },
    { key: "1/1", labelIndex: 2 },
  ];

  const options: BookingOption[] = [];

  for (const { key, labelIndex } of configOrder) {
    const labelFull = roomConfigsFull[labelIndex] ?? roomConfigs[labelIndex] ?? key;
    const airbnbEntry = airbnb?.[key];
    const vrboKey = AIRBNB_TO_VRBO[key];
    const vrboEntry = vrboKey ? vrbo?.[vrboKey] : null;

    const airbnbItems = airbnbEntry
      ? (Array.isArray(airbnbEntry) ? airbnbEntry : [airbnbEntry])
      : [];

    if (airbnbItems.length === 0 && !vrboEntry) continue;

    const links: BookingOption["links"] = [];

    for (const item of airbnbItems) {
      if (item.room) {
        links.push({
          ota: "airbnb",
          url: buildAirbnbUrl(item.room),
          label: "Airbnb",
        });
      }
    }

    if (vrboEntry?.propertyId) {
      links.push({
        ota: "vrbo",
        url: buildVrboUrl(vrboEntry.propertyId),
        label: "VRBO",
      });
    }

    const firstIcal = airbnbItems[0]?.ical;

    if (airbnbItems.length === 1) {
      options.push({
        configKey: key,
        label: labelFull,
        links,
        icalUrl: firstIcal ?? undefined,
      });
    } else if (airbnbItems.length > 1) {
      for (let i = 0; i < airbnbItems.length; i++) {
        const item = airbnbItems[i];
        const subLabel =
          key === "1/1" &&
          item.label === "With in-suite bathroom" &&
          uiStrings.hero.roomConfig1InSuite
            ? uiStrings.hero.roomConfig1InSuite
            : item.label
              ? `${labelFull} – ${item.label}`
              : labelFull;
        options.push({
          configKey: key,
          label: subLabel,
          links: item.room
            ? [
                {
                  ota: "airbnb" as const,
                  url: buildAirbnbUrl(item.room),
                  label: "Airbnb",
                },
                ...(vrboEntry
                  ? [
                      {
                        ota: "vrbo" as const,
                        url: buildVrboUrl(vrboEntry.propertyId),
                        label: "VRBO",
                      },
                    ]
                  : []),
              ]
            : [],
          icalUrl: item.ical,
        });
      }
    } else if (vrboEntry) {
      options.push({
        configKey: key,
        label: labelFull,
        links,
        icalUrl: vrboEntry.ical,
      });
    }
  }

  return options;
}
