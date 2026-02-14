"use client";

import * as React from "react";

interface ScrollSpyContextValue {
  activeSection: string | null;
  setActiveSection: (id: string | null) => void;
}

const ScrollSpyContext = React.createContext<ScrollSpyContextValue | null>(null);

export function ScrollSpyProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const value = React.useMemo(
    () => ({ activeSection, setActiveSection }),
    [activeSection]
  );
  return (
    <ScrollSpyContext.Provider value={value}>
      {children}
    </ScrollSpyContext.Provider>
  );
}

export function useScrollSpy(): ScrollSpyContextValue {
  const ctx = React.useContext(ScrollSpyContext);
  if (!ctx) return { activeSection: null, setActiveSection: () => {} };
  return ctx;
}

/** Section ids to observe for scroll-spy (in scroll order). */
export const SCROLL_SPY_SECTION_IDS = ["home", "property-details", "book-your-stay", "get-in-touch"] as const;
