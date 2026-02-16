import { NextResponse } from "next/server";
import { getIcalUrlForConfig } from "@/lib/channels";
import { AIRBNB_ICAL_FALLBACK } from "@/lib/constants";

/**
 * API route to fetch and parse iCal feed (default 3/2 config).
 * Returns unavailable dates for the booking calendar.
 * Uses channel config when available, fallback to constant.
 */
interface UnavailableDatesResponse {
  unavailable: string[];
  unavailableRanges: { from: string; to: string }[];
  lastSync: string;
}

function parseICalendar(icalText: string): UnavailableDatesResponse {
  const unavailableRanges: { from: string; to: string }[] = [];
  const lines = icalText.split("\n");
  let dtstart: string | null = null;
  let dtend: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("DTSTART;VALUE=DATE:")) {
      dtstart = trimmed.substring("DTSTART;VALUE=DATE:".length);
    } else if (trimmed.startsWith("DTEND;VALUE=DATE:")) {
      dtend = trimmed.substring("DTEND;VALUE=DATE:".length);
    } else if (trimmed === "END:VEVENT") {
      if (dtstart && dtend) {
        const fromFormatted = `${dtstart.slice(0, 4)}-${dtstart.slice(4, 6)}-${dtstart.slice(6, 8)}`;
        const endDate = new Date(
          parseInt(dtend.slice(0, 4), 10),
          parseInt(dtend.slice(4, 6), 10) - 1,
          parseInt(dtend.slice(6, 8), 10)
        );
        endDate.setDate(endDate.getDate() - 1);
        const toFormatted = endDate.toISOString().split("T")[0];
        unavailableRanges.push({ from: fromFormatted, to: toFormatted });
      }
      dtstart = null;
      dtend = null;
    }
  }

  return {
    unavailable: [],
    unavailableRanges,
    lastSync: new Date().toISOString(),
  };
}

export async function GET() {
  try {
    const icalUrl =
      (await getIcalUrlForConfig("3/2")) ?? AIRBNB_ICAL_FALLBACK;

    const response = await fetch(icalUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch iCal: ${response.status}`);
    }

    const icalText = await response.text();
    const parsedData = parseICalendar(icalText);
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Error syncing calendar:", error);
    return NextResponse.json(
      { error: "Failed to sync calendar" },
      { status: 500 }
    );
  }
}
