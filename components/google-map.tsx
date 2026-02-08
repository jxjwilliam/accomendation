/**
 * Google Map embed using app-root .env NEXT_PUBLIC_GOOGLE_API_KEY.
 * Renders a place map for the given address (e.g. Surrey, Vancouver BC, Canada).
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
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${q}`;

  return (
    <div className={className}>
      <iframe
        title={title}
        src={src}
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-lg"
      />
    </div>
  );
}
