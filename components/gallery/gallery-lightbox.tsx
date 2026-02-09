"use client";

import * as React from "react";
import { useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getGalleryImageAlt } from "@/lib/gallery-images";

export interface GalleryLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** All image paths (e.g. GALLERY_IMAGE_PATHS). */
  images: string[];
  /** Initial index when opening (0-based). */
  initialIndex: number;
}

/**
 * Full-screen lightbox dialog with loopable carousel. Use when user clicks a gallery photo.
 */
export function GalleryLightbox({
  open,
  onOpenChange,
  images,
  initialIndex,
}: GalleryLightboxProps) {
  const len = images.length;
  const [index, setIndex] = React.useState(initialIndex);

  // Sync index when dialog opens with a new initialIndex
  useEffect(() => {
    if (open) setIndex(initialIndex >= 0 && initialIndex < len ? initialIndex : 0);
  }, [open, initialIndex, len]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + len) % len);
  }, [len]);
  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % len);
  }, [len]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, goPrev, goNext, onOpenChange]);

  if (len === 0) return null;

  const src = images[index];
  const alt = getGalleryImageAlt(index);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] w-full max-h-[95vh] h-full border-0 bg-black/95 p-0 overflow-hidden focus:outline-none"
        onEscapeKeyDown={() => onOpenChange(false)}
      >
        <div className="relative flex h-[85vh] w-full items-center justify-center p-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 text-white hover:bg-white/30"
            onClick={goPrev}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <div className="relative h-full w-full flex items-center justify-center">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="95vw"
              priority
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 text-white hover:bg-white/30"
            onClick={goNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
        <div className="flex items-center justify-center gap-4 py-3 text-white/90 text-sm">
          <span aria-live="polite">
            {index + 1} / {len}
          </span>
        </div>
        <DialogTitle className="sr-only">{alt}</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
