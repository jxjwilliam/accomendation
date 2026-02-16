import { NextResponse } from "next/server";
import { configParamToKey, getIcalUrlForConfig } from "@/lib/channels";

/**
 * GET /api/ical/[config]
 * Proxies iCal feed for the given room config (e.g. 3-2, 2-1, 1-1).
 * Returns RFC 5545 iCalendar format for subscription in Google/Apple/Outlook.
 * @see specs/007-add-ical/contracts/api-ical-feed.md
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ config: string }> }
) {
  const { config } = await params;
  const configKey = configParamToKey(config);

  const icalUrl = await getIcalUrlForConfig(configKey);
  if (!icalUrl) {
    return NextResponse.json({ error: "Config not found" }, { status: 404 });
  }

  try {
    const response = await fetch(icalUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Upstream iCal fetch failed: ${response.status}`);
    }

    const icalText = await response.text();

    return new NextResponse(icalText, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Error fetching iCal feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar" },
      { status: 500 }
    );
  }
}
