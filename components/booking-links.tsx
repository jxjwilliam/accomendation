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
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90 focus-visible:outline focus-visible:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring motion-reduce:duration-0 motion-reduce:hover:scale-100 motion-reduce:focus-visible:scale-100"
        >
          {ch.label}
        </a>
      ))}
    </div>
  );
}
