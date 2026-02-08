"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { GALLERY_IMAGE_PATHS, getGalleryImageAlt } from "@/lib/gallery-images";

/**
 * Horizontal marquee of gallery images. Respects prefers-reduced-motion.
 */
export function ImageMarquee() {
  const reducedMotion = useReducedMotion();
  const duplicated = [...GALLERY_IMAGE_PATHS, ...GALLERY_IMAGE_PATHS];
  return (
    <div className="w-full overflow-hidden py-4" aria-label="Property photos">
      <div
        className={`flex gap-4 ${reducedMotion ? "" : "w-max animate-marquee"}`}
      >
        {duplicated.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-32 w-48 shrink-0 overflow-hidden rounded-lg bg-muted"
          >
            <Image
              src={src}
              alt={getGalleryImageAlt(i % GALLERY_IMAGE_PATHS.length)}
              fill
              sizes="192px"
              className="object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
