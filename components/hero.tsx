"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIRBNB_BOOKING_URL } from "@/lib/contact";

export interface HeroProps {
  /** Main headline (e.g. property name). */
  title: string;
  /** Subtitle or tagline (e.g. type of accommodation). */
  subtitle: string;
  /** Image URLs for the carousel (e.g. from public/images). */
  images: string[];
  /** CTA label (e.g. "Book Now"). */
  ctaLabel: string;
  /** Optional locale for CTA link. */
  locale?: string;
}

/**
 * Full-viewport hero with image carousel and overlay text.
 * Respects prefers-reduced-motion (no auto-advance or minimal motion).
 */
export function Hero({ title, subtitle, images, ctaLabel, locale = "en" }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const reduceMotion = useReducedMotion();

  const slides = images.length > 0 ? images : ["/images/image_001.jpg"];
  const slideDuration = 5000;

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, slideDuration);
    return () => clearInterval(timer);
  }, [reduceMotion, slides.length]);

  const goTo = (index: number) => setCurrentSlide(index);
  const next = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      id="home"
      className="relative h-screen min-h-[600px] w-full overflow-hidden"
      aria-label="Hero"
    >
      <div className="relative h-full w-full">
        {slides.map((src, index) => (
          <motion.div
            key={src}
            initial={false}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
            }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              fetchPriority={index === 0 ? "high" : undefined}
            />
            <div className="absolute inset-0 bg-black/40" aria-hidden />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: reduceMotion ? 0 : 0.6 }}
          className="max-w-4xl px-4 text-center text-white"
        >
          <h1 className="text-5xl font-bold leading-tight drop-shadow-md md:text-7xl mb-4">
            {title}
          </h1>
          <p className="mb-8 text-xl text-white/90 md:text-2xl">
            {subtitle}
          </p>
          <Button
            asChild
            size="lg"
            className="min-h-14 rounded-md bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <a href={AIRBNB_BOOKING_URL} target="_blank" rel="noopener noreferrer">
              {ctaLabel}
            </a>
          </Button>
        </motion.div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 z-10 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 z-10 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div
            className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2"
            role="tablist"
            aria-label="Slide indicators"
          >
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === currentSlide}
                aria-label={`Slide ${index + 1}`}
                onClick={() => goTo(index)}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full transition-all"
              >
                <span
                  className={`block rounded-full transition-all ${
                    index === currentSlide ? "h-2 w-8 bg-white" : "h-2 w-2 bg-white/50"
                  }`}
                  aria-hidden
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
