import type { BookingChannel } from "@/lib/types";

interface BookingLinksProps {
  channels: BookingChannel[];
}

/**
 * Renders OTA and contact links from booking channels content (FR-003).
 */
export function BookingLinks({ channels }: BookingLinksProps) {
  return (
    <div className="flex flex-wrap gap-2" role="navigation" aria-label="Booking and contact options">
      {channels.map((ch) => (
        <a
          key={`${ch.type}-${ch.url}`}
          href={ch.url}
          target={ch.openInNewTab !== false ? "_blank" : undefined}
          rel={ch.openInNewTab !== false ? "noopener noreferrer" : undefined}
          className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
        >
          {ch.label}
        </a>
      ))}
    </div>
  );
}
