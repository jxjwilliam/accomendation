"use client";

import { Header } from "@/components/header";
import { useScrollSpy } from "@/lib/scroll-spy-context";
import type { Locale } from "@/lib/i18n";
import type { UiStrings } from "@/lib/types";

interface LayoutClientProps {
  locale: Locale;
  uiStrings: UiStrings;
  children: React.ReactNode;
}

/**
 * Client layout wrapper: Header with scroll-spy active section and main content.
 */
export function LayoutClient({ locale, uiStrings, children }: LayoutClientProps) {
  const { activeSection } = useScrollSpy();
  return (
    <>
      <Header
        currentLocale={locale}
        brandName={uiStrings.brandName}
        navLabels={uiStrings.nav}
        activeSection={activeSection}
      />
      <main className="flex-1">{children}</main>
    </>
  );
}
