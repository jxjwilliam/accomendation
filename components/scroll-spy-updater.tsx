"use client";

import { useEffect } from "react";
import { useScrollSpy, SCROLL_SPY_SECTION_IDS } from "@/lib/scroll-spy-context";

/**
 * Observes section elements by id and updates scroll-spy context when they enter view.
 * When multiple sections intersect, the topmost one (first in document order) wins so
 * "Property" highlights while scrolling the property-details area.
 */
export function ScrollSpyUpdater() {
  const { setActiveSection } = useScrollSpy();

  useEffect(() => {
    const ids = [...SCROLL_SPY_SECTION_IDS];
    const elements: { id: string; el: HTMLElement }[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) elements.push({ id, el });
    });
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const byOrder = [...visible].sort(
          (a, b) =>
            ids.indexOf(a.target.id as (typeof ids)[number]) - ids.indexOf(b.target.id as (typeof ids)[number])
        );
        const topmost = byOrder[0];
        if (topmost?.target.id) setActiveSection(topmost.target.id);
      },
      { rootMargin: "-15% 0px -50% 0px", threshold: 0 }
    );

    elements.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, [setActiveSection]);

  return null;
}
