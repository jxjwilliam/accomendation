# Quickstart: 002-ui-new-features

**Branch**: `002-ui-new-features`  
**Prerequisites**: Plan and research completed; data-model and contracts in place.

## What this feature adds

- **Footer**: Site footer on all main pages (business name, address, links).
- **Gallery**: Use all images in `public/images/` via marquee, carousel, and/or scroll-trigger section.
- **Booking Calendar Card**: Glassmorphism card with shadcn Calendar + date-range; “Reserved” tooltip on unavailable dates; Framer Motion entrance; CAD; mobile-optimized.
- **Animations**: Framer Motion (entrance, micro-interactions), GSAP (optional scroll-trigger for gallery).
- **UI consistency**: Align with UI/UX Pro Max (`.agent/ui-ux-pro-max/SKILL.md`) and existing design tokens.

## Implementation order (suggested)

1. **Dependencies**: Add `framer-motion` (or `motion`), `gsap`. Add shadcn Calendar (and Tooltip if missing). Optional: copy any Aceternity-style block if used.
2. **Footer**: Create `components/footer.tsx`; feed from property content or `content/footer.*.json`; add to locale layout or each main page.
3. **Gallery**: Create `components/gallery/` (marquee, carousel, optional scroll-trigger); wire to list of all `public/images`; add section to home and/or property page.
4. **Booking Calendar Card**: Create `components/booking-calendar-card.tsx` with glassmorphism, shadcn Calendar (date-range), Reserved tooltip, Framer Motion entrance (y 20px, 0.4s); optional `content/unavailable-dates.json` and `lib/unavailable-dates.ts`.
5. **Integrate**: Add footer to `app/[locale]/layout.tsx` or each page; add gallery and booking card to home (and gallery to property as needed); ensure `prefers-reduced-motion` and a11y.
6. **Polish**: Typography/spacing consistency; CAD in any price copy; mobile check.

## Key files (after implementation)

| Item | Path |
|------|------|
| Plan | `specs/002-ui-new-features/plan.md` |
| Research | `specs/002-ui-new-features/research.md` |
| Data model | `specs/002-ui-new-features/data-model.md` |
| Unavailable dates schema | `specs/002-ui-new-features/contracts/unavailable-dates-schema.json` |
| Footer | `components/footer.tsx` |
| Booking Calendar Card | `components/booking-calendar-card.tsx` |
| Gallery | `components/gallery/*` |
| Unavailable dates (optional) | `content/unavailable-dates.json`, `lib/unavailable-dates.ts` |

## Running the app

Same as existing project:

```bash
npm run dev
```

Open home, property, and policies; confirm footer, gallery, and booking calendar card where added. Test at 375px and 768px; test with “Reduce motion” enabled.

## Tasks

Generate concrete tasks with:

```bash
# From repo root; ensure branch 002-ui-new-features
.specify/scripts/bash/update-agent-context.sh cursor-agent   # if not yet run
# Then run /speckit.tasks to produce specs/002-ui-new-features/tasks.md
```

Implement tasks in order; mark complete in `tasks.md` as you go.
