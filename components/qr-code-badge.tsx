"use client";

import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface QrCodeBadgeProps {
  /** URL to encode (required). */
  value: string;
  /** Size in pixels. Default 140 for reliable phone scanning. */
  size?: number;
  /** Accessibility title for screen readers. */
  title?: string;
  className?: string;
}

/**
 * QR code badge linking to a URL (e.g. site homepage).
 * Uses qrcode.react for SVG output. Size and margin tuned for phone scanning.
 */
export function QrCodeBadge({
  value,
  size = 140,
  title = "Scan to visit site",
  className,
}: QrCodeBadgeProps) {
  const url = value?.startsWith("http") ? value : `https://${value}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex shrink-0 overflow-hidden rounded-lg border border-border bg-white shadow-sm", className)}
      style={{ width: size, height: size }}
      aria-label={title}
    >
      <QRCodeSVG
        value={url}
        size={size}
        level="L"
        marginSize={4}
        fgColor="#000000"
        bgColor="#ffffff"
        title={title}
        className="block"
      />
    </a>
  );
}
