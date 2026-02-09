"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GALLERY_IMAGE_PATHS, getGalleryImageAlt } from "@/lib/gallery-images";
import { Button } from "@/components/ui/button";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import { LayoutGrid, Rows3, LayoutList } from "lucide-react";

type ViewMode = "grid" | "masonry" | "list";

interface GalleryStrings {
  title: string;
  subtitle: string;
  viewAllPhotos: string;
  backToHome: string;
  viewGrid: string;
  viewMasonry: string;
  viewList: string;
}

interface GalleryPageClientProps {
  locale: string;
  galleryStrings: GalleryStrings;
}

/**
 * Gallery / Photos page with grid, masonry, and list view modes.
 */
export function GalleryPageClient({ locale, galleryStrings }: GalleryPageClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="space-y-6" aria-labelledby="gallery-page-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 id="gallery-page-heading" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            {galleryStrings.title}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {galleryStrings.subtitle}
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border bg-muted/30 p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            aria-pressed={viewMode === "grid"}
            aria-label={galleryStrings.viewGrid}
            className="h-11 min-h-[44px] w-11 min-w-[44px] p-0"
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={viewMode === "masonry" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("masonry")}
            aria-pressed={viewMode === "masonry"}
            aria-label={galleryStrings.viewMasonry}
            className="h-11 min-h-[44px] w-11 min-w-[44px] p-0"
          >
            <Rows3 className="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            aria-pressed={viewMode === "list"}
            aria-label={galleryStrings.viewList}
            className="h-11 min-h-[44px] w-11 min-w-[44px] p-0"
          >
            <LayoutList className="size-4" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4" role="list">
          {GALLERY_IMAGE_PATHS.map((src, index) => (
            <li key={src} className="overflow-hidden rounded-xl border border-border bg-card shadow-md transition-shadow hover:shadow-lg">
              <button
                type="button"
                onClick={() => openLightbox(index)}
                className="block w-full aspect-square overflow-hidden focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring text-left"
              >
                <Image
                  src={src}
                  alt={getGalleryImageAlt(index)}
                  width={400}
                  height={400}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
      <GalleryLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        images={GALLERY_IMAGE_PATHS}
        initialIndex={lightboxIndex}
      />

      {viewMode === "masonry" && (
        <ul
          className="columns-2 gap-3 space-y-3 sm:columns-3 md:columns-4"
          role="list"
          style={{ columnFill: "balance" }}
        >
          {GALLERY_IMAGE_PATHS.map((src, index) => (
            <li key={src} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => openLightbox(index)}
                className="block w-full overflow-hidden rounded-xl border border-border bg-card shadow-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring transition-shadow hover:shadow-lg text-left"
              >
                <Image
                  src={src}
                  alt={getGalleryImageAlt(index)}
                  width={400}
                  height={300}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="w-full object-cover transition-transform duration-200 hover:scale-[1.02]"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {viewMode === "list" && (
        <ul className="space-y-4" role="list">
          {GALLERY_IMAGE_PATHS.map((src, index) => (
            <li
              key={src}
              className="flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card shadow-md sm:flex-row transition-shadow hover:shadow-lg"
            >
              <button
                type="button"
                onClick={() => openLightbox(index)}
                className="relative block h-48 w-full shrink-0 overflow-hidden sm:h-36 sm:w-48 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring text-left"
              >
                <Image
                  src={src}
                  alt={getGalleryImageAlt(index)}
                  fill
                  sizes="(max-width: 640px) 100vw, 192px"
                  className="object-cover transition-transform duration-200 hover:scale-105"
                />
              </button>
              <div className="flex flex-1 flex-col justify-center px-4 py-3 sm:py-4">
                <span className="font-medium text-foreground">
                  {getGalleryImageAlt(index)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Photo {index + 1} of {GALLERY_IMAGE_PATHS.length}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-center text-sm text-muted-foreground">
        <Link href={`/${locale}`} className="underline-offset-4 hover:underline min-h-[44px] inline-flex items-center justify-center">
          {galleryStrings.backToHome}
        </Link>
      </p>
    </section>
  );
}
