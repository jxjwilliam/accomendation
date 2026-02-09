"use client";

import { useState, useEffect } from "react";

/**
 * Returns whether the user prefers reduced motion (e.g. OS/browser setting).
 * Used by animation components to skip or simplify motion for accessibility.
 * SSR-safe: defaults to false until hydration so we don't block animations on first paint.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}
