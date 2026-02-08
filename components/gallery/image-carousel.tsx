"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { GALLERY_IMAGE_PATHS, getGalleryImageAlt } from "@/lib/gallery-images";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Carousel of gallery images with prev/next and optional dots. Accessible and keyboard-navigable.
 */
export function ImageCarousel() {
  const [index, setIndex] = useState(0);
  const len = GALLERY_IMAGE_PATHS.length;
  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + len) % len);
  }, [len]);
  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % len);
  }, [len]);

  return (
    <section
      className="relative w-full"
      aria-label="Property photo carousel"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
      }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src={GALLERY_IMAGE_PATHS[index]}
          alt={getGalleryImageAlt(index)}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover"
          priority={index < 3}
          loading={index < 3 ? "eager" : "lazy"}
        />
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={goPrev}
          aria-label="Previous image"
          className="min-h-11 min-w-11 shrink-0 cursor-pointer"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <span className="min-h-11 flex items-center text-sm text-muted-foreground" aria-live="polite">
          {index + 1} / {len}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={goNext}
          aria-label="Next image"
          className="min-h-11 min-w-11 shrink-0 cursor-pointer"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </section>
  );
}
