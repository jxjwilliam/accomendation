# Implementation Plan: Add SEO for Vancouver Surrey Family Hotel

**Branch**: `003-add-seo` | **Date**: 2025-02-07 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/003-add-seo/spec.md` plus context: improve SEO, 围绕温哥华素里家庭旅馆、住宿、舒适、功能齐全 (Vancouver Surrey family hotel, accommodation, comfort, fully equipped).

## Summary

Add full SEO support so search engines can discover and index the site, shared links show correct previews, and local/business search understands the property. Use Next.js 15 Metadata API (title, description, Open Graph, Twitter), `app/sitemap.ts`, `app/robots.ts`, and schema.org LodgingBusiness JSON-LD. Centralize defaults in config/content; keep metadata and structured data server-rendered and locale-aware (next-intl). No new storage or admin; config/file-driven updates via deployment.

## Technical Context

**Language/Version**: TypeScript 5.x (latest stable)  
**Primary Dependencies**: Next.js 15 (App Router), React 19, next-intl  
**Storage**: N/A (SEO config and defaults in code or file-based content)  
**Testing**: Manual validation (view-source, Rich Results Test, OG debugger); optional script or Playwright to assert meta tags and sitemap  
**Target Platform**: Web (same as existing app); crawler-friendly HTML  
**Project Type**: Web (single Next.js app; extends existing 001/002 app)  
**Performance Goals**: No impact on LCP; metadata and JSON-LD in initial response  
**Constraints**: Title ≤ ~60 chars, description ≤ ~160 chars; absolute URLs for OG image and sitemap; FR-007 (server-rendered metadata)  
**Scale/Scope**: All public pages (home, property, policies) × 4 locales; one sitemap; one LodgingBusiness JSON-LD (per locale or default)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Project constitution is template-only. Applied checks:

- **Spec alignment**: Delivers indexability (metadata, sitemap, robots), share previews (Open Graph), and local/business understanding (LodgingBusiness JSON-LD); wording consistent with Surrey, Vancouver BC, family hotel, comfort, fully equipped.
- **Simplicity**: SEO is additive (metadata, static sitemap/robots, one JSON-LD config); no new backend or admin.

*No violations. Proceed.*

## Project Structure

### Documentation (this feature)

```text
specs/003-add-seo/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (SEO config schema, JSON-LD shape)
└── tasks.md             # From /speckit.tasks
```

### Source Code (repository root; extends existing app)

```text
app/
├── [locale]/
│   ├── layout.tsx       # Extend generateMetadata: defaults, alternates, canonical
│   ├── page.tsx         # Optional per-page metadata override (home)
│   ├── property/
│   │   └── page.tsx     # Optional per-page metadata (property)
│   ├── policies/
│   │   └── page.tsx     # Optional per-page metadata (policies)
│   └── ...
├── sitemap.ts           # NEW: default export → MetadataRoute.Sitemap (all locales × routes)
├── robots.ts            # NEW: default export → MetadataRoute.Robots (allow /, sitemap URL)
├── layout.tsx          # Keep/update root metadata defaults
└── globals.css

components/
├── json-ld-lodging.tsx  # NEW: server component that injects LodgingBusiness script (or inline in layout)
└── ...

lib/
├── i18n.ts              # Existing (locales)
├── seo.ts               # NEW: site base URL, default title/description, OG image; per-page overrides
└── ...

content/
├── site.json            # Optional: site name, default description, address for JSON-LD (or in lib/seo.ts)
└── ...
```

**Structure Decision**: Single Next.js app. SEO adds `app/sitemap.ts`, `app/robots.ts`, shared `lib/seo.ts` (and optional `content/site.json`), and a JSON-LD component or inline script. Metadata is extended in existing `app/layout.tsx` and `app/[locale]/layout.tsx` (and per-page where needed). No new routes beyond existing [locale] pages.

## Complexity Tracking

*None.*
