"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GALLERY_IMAGE_PATHS, getGalleryImageAlt } from "@/lib/gallery-images";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Rows3, LayoutList } from "lucide-react";

type ViewMode = "grid" | "masonry" | "list";

interface GalleryPageClientProps {
  locale: string;
}

/**
 * Gallery / Photos page with grid, masonry, and list view modes.
 */
export function GalleryPageClient({ locale }: GalleryPageClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <section className="space-y-6" aria-labelledby="gallery-page-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 id="gallery-page-heading" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Gallery
          </h1>
          <p className="mt-1 text-muted-foreground">
            Property photos from your stay
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border bg-muted/30 p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            aria-pressed={viewMode === "grid"}
            aria-label="Grid view"
            className="h-9 w-9 p-0"
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={viewMode === "masonry" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("masonry")}
            aria-pressed={viewMode === "masonry"}
            aria-label="Masonry view"
            className="h-9 w-9 p-0"
          >
            <Rows3 className="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            aria-pressed={viewMode === "list"}
            aria-label="List view"
            className="h-9 w-9 p-0"
          >
            <LayoutList className="size-4" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4" role="list">
          {GALLERY_IMAGE_PATHS.map((src, index) => (
            <li key={src} className="overflow-hidden rounded-lg border bg-muted shadow-sm">
              <Link
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square overflow-hidden focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={src}
                  alt={getGalleryImageAlt(index)}
                  width={400}
                  height={400}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {viewMode === "masonry" && (
        <ul
          className="columns-2 gap-3 space-y-3 sm:columns-3 md:columns-4"
          role="list"
          style={{ columnFill: "balance" }}
        >
          {GALLERY_IMAGE_PATHS.map((src, index) => (
            <li key={src} className="break-inside-avoid">
              <Link
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border bg-muted shadow-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={src}
                  alt={getGalleryImageAlt(index)}
                  width={400}
                  height={300}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="w-full object-cover transition-transform duration-200 hover:scale-[1.02]"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {viewMode === "list" && (
        <ul className="space-y-4" role="list">
          {GALLERY_IMAGE_PATHS.map((src, index) => (
            <li
              key={src}
              className="flex flex-col gap-4 overflow-hidden rounded-lg border bg-card sm:flex-row"
            >
              <Link
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block h-48 w-full shrink-0 overflow-hidden sm:h-36 sm:w-48 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={src}
                  alt={getGalleryImageAlt(index)}
                  fill
                  sizes="(max-width: 640px) 100vw, 192px"
                  className="object-cover transition-transform duration-200 hover:scale-105"
                />
              </Link>
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
        <Link href={`/${locale}`} className="underline-offset-4 hover:underline">
          ← Back to home
        </Link>
      </p>
    </section>
  );
}
