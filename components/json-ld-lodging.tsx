import { getBusiness } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";

interface JsonLdLodgingProps {
  locale?: Locale;
}

/**
 * Server component that injects schema.org LodgingBusiness JSON-LD.
 * Rendered in initial HTML for crawlers (FR-006, FR-007).
 */
export function JsonLdLodging({ locale }: JsonLdLodgingProps) {
  const data = getBusiness(locale);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
