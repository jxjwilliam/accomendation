import { getFooterContent } from "@/lib/content";
import { getBaseUrl } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";
import type { UiStrings } from "@/lib/types";
import { FooterClient } from "@/components/footer-client";

interface FooterProps {
  locale: Locale;
  uiStrings: UiStrings;
}

/**
 * Site footer with business name, address, links, modal links (Policies), and QR code.
 */
export async function Footer({ locale, uiStrings }: FooterProps) {
  const [content, siteUrl] = await Promise.all([
    getFooterContent(locale),
    Promise.resolve(getBaseUrl()),
  ]);
  return <FooterClient content={content} siteUrl={siteUrl} uiStrings={uiStrings} />;
}
