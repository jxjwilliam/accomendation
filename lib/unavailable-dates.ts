/**
 * Load optional unavailable (reserved) dates for the booking calendar.
 * Source: content/unavailable-dates.json. No-op if file does not exist.
 */

export interface UnavailableDatesContent {
  unavailable?: string[];
  unavailableRanges?: { from: string; to: string }[];
}

/** Parse ISO date string to timestamp for comparison. */
function parseDate(s: string): number {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return 0;
  return d.setHours(0, 0, 0, 0);
}

/**
 * Returns a Set of timestamps (start of day UTC) for dates that are reserved/unavailable.
 * Call from client or server; returns empty Set if no file or invalid data.
 */
export async function getUnavailableDates(): Promise<Set<number>> {
  const out = new Set<number>();
  try {
    const mod = await import("@/content/unavailable-dates.json").catch(() => null);
    const data = mod?.default as UnavailableDatesContent | undefined;
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
  } catch {
    /* no file or invalid JSON */
  }
  return out;
}
