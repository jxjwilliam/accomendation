# Contracts: 005-ui-ux-improvements

**Branch**: `005-ui-ux-improvements`  
**Scope**: Frontend-only (layout, header, theme switcher, i18n UI strings, gallery cards, home sections).

## No API or backend contracts

This feature does **not** introduce:

- New REST or GraphQL endpoints
- Server-side APIs
- Database schemas or migrations
- External service contracts

All behavior is implemented in the Next.js app (layout, components, and content loading). Data continues to come from:

- `getProperty(locale)` and `getBookingChannels(locale)` (from `lib/content.ts`)
- Optional: `getUiStrings(locale)` if UI copy is centralized in `content/ui.[locale].json`
- Optional: extended `property.*.json` keys for home sections (whyChooseUs, propertyDetails, houseRules)

## Content contracts (optional)

If UI strings are centralized:

- **File**: `content/ui.[locale].json` (en, fr, zh-Hans, zh-Hant)
- **Shape**: Single object with string values; keys are semantic (e.g. `nav.property`, `gallery.title`, `hero.ctaLabel`). No formal JSON Schema required; document keys in `lib/content.ts` or `lib/types.ts` when added.

If property content is extended for home sections:

- **File**: `content/property.[locale].json`
- **New optional keys**: `whyChooseUs?: string[]`, `propertyDetails?: object | string[]`, `houseRules?: string | string[]`. See [data-model.md](../data-model.md).

No OpenAPI or separate schema files are required for this feature.
