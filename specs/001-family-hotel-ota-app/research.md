# Research: Family Hotel OTA Web App

**Feature**: 001-family-hotel-ota-app  
**Date**: 2025-02-07

## 1. Next.js 15 + i18n (4 locales: en, fr, zh-Hans, zh-Hant)

**Decision**: Use Next.js 15 App Router with a `[locale]` dynamic segment and locale-specific content/messages. Use `next-intl` for message loading and routing, or a minimal custom solution (JSON per locale + `middleware` to set locale from URL/selector).

**Rationale**: next-intl is widely used with App Router, supports static generation, and fits four distinct locales. Alternative: next-i18next is more tied to Pages Router. Custom middleware + JSON keeps bundle small if we want minimal deps.

**Alternatives considered**: next-i18next (Pages Router bias); next.js built-in i18n (subpath routing only, no RSC message API); custom middleware + JSON (chosen if we avoid next-intl for simplicity).

---

## 2. Tailwind CSS v4 in Next.js 15

**Decision**: Use Tailwind CSS v4 with the official PostCSS or Vite-based setup recommended for Next.js 15. Follow Next.js + Tailwind v4 docs for configuration (e.g. `tailwind.config.ts` or `@tailwindcss/postcss`).

**Rationale**: User requested "latest" Tailwind; v4 is the current major version with improved performance and CSS-first config. Next.js 15 is compatible with Tailwind v4 via PostCSS.

**Alternatives considered**: Tailwind v3 (stable but not "latest"); plain CSS (rejected for velocity and consistency with shadcn).

---

## 3. shadcn/ui with App Router and i18n

**Decision**: Install shadcn/ui per official docs (Components are copied into the repo under `components/ui/`). Use Radix-based primitives for the language selector (e.g. DropdownMenu or Select). Ensure all UI strings are passed as props or from i18n messages so components work across locales.

**Rationale**: shadcn is unopinionated on i18n; components are local and editable. Language selector in header (FR-008) can be a small dropdown or link list with locale labels in each language.

**Alternatives considered**: Headless UI (user rules prefer shadcn); custom selector only (shadcn gives consistent a11y and styling).

---

## 4. Static / SSG and performance (SC-002: &lt;3s)

**Decision**: Use static generation (SSG) for all pages: `generateStaticParams` for `[locale]` and any static routes. No server-side form submission or API routes for contact; contact is link-only (mailto/external). Images via `next/image` with static sources.

**Rationale**: Fits "no backend" and "file-based content"; SSG gives predictable &lt;3s load. No dynamic server rendering required for this scope.

**Alternatives considered**: ISR (not needed for small, infrequent content updates); hybrid (rejected to keep stack simple).

---

## 5. WCAG 2.1 Level AA verification

**Decision**: Use automated checks (e.g. axe-core via `@axe-core/react` or Playwright + axe) in CI and/or E2E. Manual checks for focus order, keyboard nav, and language selector semantics. Document target as WCAG 2.1 Level AA in plan and tests.

**Rationale**: FR-006 and SC-004 require Level AA; automated tools catch many issues; manual pass needed for custom components (e.g. language switcher).

**Alternatives considered**: WCAG 2.2 (newer; AA still the stated target); Level A only (rejected per spec).

---

## 6. Content file format (owner-editable, no admin)

**Decision**: Store property and booking-channel content in JSON (or one JSON per locale) under `content/`. Schema: property name, location, description, amenities list, policy text or link, photo paths; booking channels: type (Airbnb | Booking.com | VRBO | contact), label, URL. Optionally separate files per locale (e.g. `property.en.json`) or single file with keys per locale.

**Rationale**: JSON is easy to edit in repo, validate, and type in TypeScript. Single source per locale keeps i18n clear. No CMS or database.

**Alternatives considered**: MDX for rich text (optional for policies); YAML (equivalent; JSON chosen for single parser and types).
