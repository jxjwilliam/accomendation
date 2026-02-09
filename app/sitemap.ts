import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";
import { locales } from "@/lib/i18n";

const ROUTES = ["", "gallery"];

/**
 * Generates sitemap.xml with all indexable pages (locales × routes).
 * @see specs/003-add-seo FR-003
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of ROUTES) {
      const path = route ? `/${locale}/${route}` : `/${locale}`;
      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
