/**
 * Load optional unavailable (reserved) dates for the booking calendar.
 * Sources:
 *   1. Live data from /api/sync-calendar (channel config 3/2 iCal)
 *   2. Fallback to content/unavailable-dates.json if API fails
 */

export interface UnavailableDatesContent {
  unavailable?: string[];
  unavailableRanges?: { from: string; to: string }[];
  lastSync?: string;
}

/** Parse ISO date string to timestamp for comparison. */
function parseDate(s: string): number {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return 0;
  return d.setHours(0, 0, 0, 0);
}

async function fetchFromAPI(): Promise<UnavailableDatesContent | null> {
  try {
    const response = await fetch("/api/sync-calendar", { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function loadFromJSON(): Promise<UnavailableDatesContent | null> {
  try {
    const mod = await import("@/content/unavailable-dates.json").catch(
      () => null
    );
    return (mod?.default as UnavailableDatesContent) || null;
  } catch {
    return null;
  }
}

/**
 * Returns a Set of timestamps (start of day UTC) for dates that are reserved/unavailable.
 * Fetches from /api/sync-calendar first, fallback to static JSON.
 */
export async function getUnavailableDates(): Promise<Set<number>> {
  const out = new Set<number>();
  let data = await fetchFromAPI();
  if (!data) data = await loadFromJSON();
  if (!data) return out;

  if (Array.isArray(data.unavailable)) {
    for (const d of data.unavailable) {
      const t = parseDate(d);
      if (t) out.add(t);
    }
  }
  if (Array.isArray(data.unavailableRanges)) {
    for (const { from, to } of data.unavailableRanges) {
      const start = parseDate(from);
      const end = parseDate(to);
      if (!start || !end) continue;
      for (let t = start; t <= end; t += 86400000) out.add(t);
    }
  }
  return out;
}
