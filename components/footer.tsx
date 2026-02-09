import { getFooterContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { FooterClient } from "@/components/footer-client";

interface FooterProps {
  locale: Locale;
}

/**
 * Site footer with business name, address, links, and modal links (Policies, FAQ).
 */
export async function Footer({ locale }: FooterProps) {
  const content = await getFooterContent(locale);
  return <FooterClient content={content} />;
}
