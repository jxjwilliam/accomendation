# Contracts: 003-add-seo

- **seo-config-schema.json**: Structure for site-wide and per-page SEO configuration (used by `lib/seo.ts` or `content/site.json`). Enforces title/description length limits and required business fields for JSON-LD.
- **json-ld-lodging-schema.json**: Shape of the LodgingBusiness JSON-LD emitted in the page. Use for validation and documentation; actual output must conform to schema.org LodgingBusiness.

No REST or GraphQL API contracts; SEO is implemented via Next.js metadata, sitemap/robots routes, and inline JSON-LD.
