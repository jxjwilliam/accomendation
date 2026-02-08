"use client";

import { motion, useReducedMotion } from "motion/react";
import { ImageMarquee } from "./image-marquee";
import { ImageCarousel } from "./image-carousel";

/**
 * Gallery section: marquee + carousel. Uses all images from lib/gallery-images.
 * Optional scroll-trigger: fade-in when in view (respects reduced-motion).
 */
export function Gallery() {
  const reducedMotion = useReducedMotion();
  return (
    <motion.section
      className="space-y-10"
      aria-labelledby="gallery-heading"
      initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35 }}
    >
      <h2 id="gallery-heading" className="text-lg font-semibold leading-tight">
        Gallery
      </h2>
      <ImageMarquee />
      <ImageCarousel />
    </motion.section>
  );
}

export { ImageMarquee } from "./image-marquee";
export { ImageCarousel } from "./image-carousel";
