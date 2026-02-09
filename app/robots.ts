import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";

/**
 * Generates robots.txt allowing crawlers and pointing to sitemap.
 * @see specs/003-add-seo FR-004
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

