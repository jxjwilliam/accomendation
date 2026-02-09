"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ImageCarousel } from "./image-carousel";

interface GalleryStrings {
  title: string;
  viewAllPhotos: string;
}

/**
 * Gallery section on home: carousel + link to full gallery page.
 * Marquee removed; full gallery available at /[locale]/gallery.
 */
export function Gallery({ locale, galleryStrings }: { locale: string; galleryStrings: GalleryStrings }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.section
      className="space-y-6"
      aria-labelledby="gallery-heading"
      initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="gallery-heading" className="font-serif text-2xl font-semibold leading-tight sm:text-3xl">
          {galleryStrings.title}
        </h2>
        <Link
          href={`/${locale}/gallery`}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline min-h-[44px] min-w-[44px] inline-flex items-center"
        >
          {galleryStrings.viewAllPhotos}
        </Link>
      </div>
      <ImageCarousel />
    </motion.section>
  );
}

export { ImageCarousel } from "./image-carousel";
