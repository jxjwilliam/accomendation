# Tasks: Add SEO for Vancouver Surrey Family Hotel

**Input**: Design documents from `specs/003-add-seo/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in spec; manual validation per quickstart.md.

**Organization**: Tasks grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `app/`, `components/`, `lib/` at repository root (Next.js 15 App Router)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment and config prerequisites for SEO (base URL, env var).

- [x] T001 Add NEXT_PUBLIC_SITE_URL to .env.example with a short comment (create .env.example if missing) at repository root; document that production must set this for sitemap/robots/OG absolute URLs

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Central SEO config used by all user stories. No user story work can begin until this phase is complete.

- [x] T002 Create lib/seo.ts with getBaseUrl() (from process.env.NEXT_PUBLIC_SITE_URL or fallback), getDefaultTitle(locale), getDefaultDescription(locale), TITLE_MAX=60, DESC_MAX=160, getBusiness() returning LodgingBusiness shape (name, description, address with Surrey/Vancouver BC/Canada, url), and getOgImageUrl() returning absolute default OG image URL; align with specs/003-add-seo/contracts/seo-config-schema.json and data-model.md

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 1 — Search engines index the site (Priority: P1) — MVP

**Goal**: Every public page has unique title and meta description; sitemap and robots.txt allow crawlers to discover and index the site (FR-001–FR-004, FR-007, FR-008).

**Independent Test**: View page source on home, property, policies (each locale): each has `<title>` and `<meta name="description">`. Fetch /sitemap.xml and /robots.txt; sitemap lists all locale × route URLs; robots allows / and references sitemap.

### Implementation for User Story 1

- [x] T003 [US1] Extend app/[locale]/layout.tsx generateMetadata to use lib/seo.ts getDefaultTitle(locale) and getDefaultDescription(locale) (length-safe); keep or move existing locale title/description strings into lib/seo.ts
- [x] T004 [US1] Add or extend generateMetadata in app/[locale]/page.tsx for home page with unique title and description from lib/seo (page-specific overrides if needed)
- [x] T005 [US1] Add or extend generateMetadata in app/[locale]/property/page.tsx for property page with unique title and description from lib/seo
- [x] T006 [US1] Add or extend generateMetadata in app/[locale]/policies/page.tsx for policies page with unique title and description from lib/seo
- [x] T007 [P] [US1] Create app/sitemap.ts with default export returning MetadataRoute.Sitemap: all indexable URLs (locales × routes '', property, policies) as absolute URLs using lib/seo getBaseUrl() and locales from lib/i18n
- [x] T008 [P] [US1] Create app/robots.ts with default export returning MetadataRoute.Robots (allow '/', sitemap: getBaseUrl() + '/sitemap.xml')
- [x] T009 [US1] Update app/layout.tsx root metadata to use defaults from lib/seo.ts or keep minimal fallback so crawlers always see a valid title/description when hitting root

**Checkpoint**: User Story 1 complete — all pages have metadata; sitemap and robots are live and testable independently

---

## Phase 4: User Story 2 — Visitors sharing links see attractive previews (Priority: P2)

**Goal**: Shared links show correct Open Graph and Twitter Card previews (title, description, image) so the site presents as a comfortable, fully equipped family hotel in Surrey, Vancouver BC (FR-005).

**Independent Test**: Share a key page URL in a platform that supports OG (e.g. Facebook Sharing Debugger or Slack); preview shows intended title, description, and image.

### Implementation for User Story 2

- [x] T010 [US2] Add metadata.openGraph (title, description, url, siteName, locale, images with absolute URL from lib/seo getOgImageUrl()) to app/[locale]/layout.tsx generateMetadata
- [x] T011 [US2] Add metadata.twitter (card: summary_large_image, title, description, image) to app/[locale]/layout.tsx generateMetadata reusing same title/description/image as Open Graph
- [x] T012 [US2] Ensure lib/seo.ts getOgImageUrl() returns absolute image URL (baseUrl + path or full URL) and is used for both openGraph.images and twitter.images in app/[locale]/layout.tsx

**Checkpoint**: User Story 2 complete — share previews work independently of US1/US3

---

## Phase 5: User Story 3 — Local and business search understand the property (Priority: P3)

**Goal**: Page exposes schema.org LodgingBusiness JSON-LD so validators and search engines understand the business (family hotel, Surrey, Vancouver BC, comfort, fully equipped) (FR-006, FR-007, FR-008).

**Independent Test**: View page source; find `<script type="application/ld+json">` with @type LodgingBusiness, name, description, address, url. Run Google Rich Results Test or schema.org Validator; no errors.

### Implementation for User Story 3

- [x] T013 [US3] Ensure lib/seo.ts getBusiness() returns full LodgingBusiness shape (name, description, address with addressCountry/addressRegion/addressLocality, url, optional telephone, image, amenityFeature) per specs/003-add-seo/contracts/json-ld-lodging-schema.json and data-model.md
- [x] T014 [P] [US3] Create components/json-ld-lodging.tsx server component that renders a single script tag type="application/ld+json" with LodgingBusiness JSON from lib/seo getBusiness() (and optional locale for inLanguage)
- [x] T015 [US3] Render JsonLdLodging component in app/[locale]/layout.tsx so JSON-LD is present in the initial HTML response (server-rendered)

**Checkpoint**: User Story 3 complete — structured data validates and is independently testable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Multi-locale SEO (alternates, canonical) and validation.

- [x] T016 [P] Add metadata.alternates.languages (map each locale to same path, e.g. en: '/en', fr: '/fr', zh-Hans: '/zh-Hans', zh-Hant: '/zh-Hant') and metadata.alternates.canonical (current page absolute URL) in app/[locale]/layout.tsx generateMetadata
- [x] T017 Run quickstart validation: view source on home, property, policies (at least one locale); confirm title, description, og:*, twitter:*, ld+json; fetch /sitemap.xml and /robots.txt and confirm URLs and rules; optionally run Google Rich Results Test and Facebook Sharing Debugger per specs/003-add-seo/quickstart.md
- [x] T018 [P] Document NEXT_PUBLIC_SITE_URL (or chosen env var) in README or specs/003-add-seo/quickstart.md if not already documented in .env.example

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 (env var documented) — blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2 — metadata, sitemap, robots
- **Phase 4 (US2)**: Depends on Phase 3 (layout generateMetadata exists) — adds OG/Twitter to same layout
- **Phase 5 (US3)**: Depends on Phase 2 (getBusiness) and Phase 3 (layout) — adds JSON-LD to layout
- **Phase 6 (Polish)**: Depends on Phases 3–5 — alternates/canonical and validation

### User Story Dependencies

- **US1 (P1)**: After Foundational — no dependency on US2/US3
- **US2 (P2)**: After US1 — extends same generateMetadata in app/[locale]/layout.tsx
- **US3 (P3)**: After US1 (layout) and Foundational (getBusiness) — injects component into same layout

### Parallel Opportunities

- **Phase 3**: T007 (app/sitemap.ts) and T008 (app/robots.ts) can be done in parallel
- **Phase 5**: T014 (components/json-ld-lodging.tsx) can be built in parallel with T013 if T013 only augments existing getBusiness()
- **Phase 6**: T016, T018 can run in parallel; T017 (validation) after implementation

---

## Parallel Example: User Story 1

```text
# After T003–T006 (metadata in layout and pages), these can run in parallel:
T007: Create app/sitemap.ts
T008: Create app/robots.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002)
3. Complete Phase 3: User Story 1 (T003–T009)
4. **STOP and VALIDATE**: View source on key pages; fetch /sitemap.xml and /robots.txt
5. Deploy or demo indexability

### Incremental Delivery

1. Setup + Foundational → lib/seo.ts and env ready
2. Add US1 → Metadata, sitemap, robots → Validate (MVP)
3. Add US2 → Open Graph, Twitter → Validate share previews
4. Add US3 → JSON-LD LodgingBusiness → Validate Rich Results
5. Polish → Alternates, canonical, quickstart validation

### Suggested Order (Single Developer)

T001 → T002 → T003 → T004 → T005 → T006 → T007, T008 (parallel) → T009 → T010 → T011 → T012 → T013 → T014 → T015 → T016, T018 (parallel) → T017.

---

## Notes

- [P] tasks use different files and have no ordering dependency with each other
- [USn] maps task to spec user story for traceability
- Each user story is independently testable per Independent Test above
- Commit after each task or logical group
- Env: set NEXT_PUBLIC_SITE_URL in production for correct absolute URLs in sitemap, robots, and OG
