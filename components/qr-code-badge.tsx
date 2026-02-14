"use client";

import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface QrCodeBadgeProps {
  /** URL to encode (required). */
  value: string;
  /** Size in pixels. Default 100. */
  size?: number;
  /** Accessibility title for screen readers. */
  title?: string;
  className?: string;
}

/**
 * Small QR code badge linking to a URL (e.g. site homepage).
 * Uses qrcode.react for SVG output. Suitable for header or footer.
 */
export function QrCodeBadge({
  value,
  size = 100,
  title = "Scan to visit site",
  className,
}: QrCodeBadgeProps) {
  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex rounded-lg border border-border bg-white p-2 shadow-sm", className)}
      aria-label={title}
    >
      <QRCodeSVG value={value} size={size} title={title} className="rounded" />
    </a>
  );
}
