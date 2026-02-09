import { cn } from "@/lib/utils";

/**
 * Google Map embed using app-root .env NEXT_PUBLIC_GOOGLE_API_KEY.
 * Renders a place map for the given address (e.g. Surrey, Vancouver BC, Canada).
 * Uses zoom=11 to show a wider area; wrapper is larger for better visibility.
 */
interface GoogleMapProps {
  /** Address or place query for the map (e.g. "Surrey, Vancouver BC, Canada") */
  address: string;
  /** Optional title for the iframe (accessibility) */
  title?: string;
  /** Optional class for the wrapper */
  className?: string;
}

export function GoogleMap({ address, title = "Map", className }: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  if (!apiKey) {
    return (
      <div className={className} role="img" aria-label="Map unavailable">
        <div className="flex h-64 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
          Map unavailable (missing API key)
        </div>
      </div>
    );
  }

  const q = encodeURIComponent(address);
  const zoom = 11;
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${q}&zoom=${zoom}`;

  return (
    <div className={cn(className, "h-[420px] min-h-[320px] w-full")}>
      <iframe
        title={title}
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: 420 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-lg"
      />
    </div>
  );
}
