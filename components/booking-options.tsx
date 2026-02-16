"use client";

import { siAirbnb } from "simple-icons";
import type { BookingOption } from "@/lib/channels";
import type { UiStrings } from "@/lib/types";

/** Airbnb Bélo icon as inline SVG ( inherits text color via currentColor ). */
function AirbnbIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d={siAirbnb.path} />
    </svg>
  );
}

interface BookingOptionsProps {
  options: BookingOption[];
  uiStrings: UiStrings;
}

/**
 * Renders booking option cards (3/2, 2/1, 1/1) with Airbnb links only.
 * Used in Book Your Stay section.
 */
export function BookingOptions({ options, uiStrings }: BookingOptionsProps) {
  if (options.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((opt) => {
        const airbnbLinks = opt.links.filter((l) => l.ota === "airbnb");
        if (airbnbLinks.length === 0) return null;

        return (
          <div
            key={`${opt.configKey}-${opt.label}`}
            className="rounded-xl border border-border bg-muted/30 p-4 shadow-sm"
          >
            <h3 className="mb-2 text-base font-semibold text-foreground">
              {opt.label}
            </h3>
            <div className="flex flex-wrap justify-end gap-2">
              {airbnbLinks.map((link) => (
                <a
                  key={`${link.ota}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] min-w-[120px] items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg hover:bg-primary/95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:duration-0"
                  aria-label={`${link.label} - ${opt.label}`}
                >
                  {link.ota === "airbnb" ? (
                    <>
                      <AirbnbIcon className="size-5 shrink-0" />
                      {link.label}
                    </>
                  ) : (
                    link.label
                  )}
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
