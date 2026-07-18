# Sooncar.kz — Landing Page Design Spec

Date: 2026-07-18
Status: approved (pending final user sign-off on this document)
Related: `DESIGN.md` (aesthetic/UX rulebook — this spec applies it to a concrete page)

## Purpose

One-page marketing/download landing for Sooncar, a taxi/ride-hailing app
serving Astana, Kazakhstan. Two audiences — passengers and driver-partners —
are equally primary; neither is secondary. Goal: get each audience to the
correct store download with minimum friction, while surfacing the product's
key differentiators (fair pricing, driver commission, trust/rating, intercity
rides, local-language support).

## Scope

Single static HTML page (`index.html`) with supporting CSS/JS. No backend,
no build framework, no CMS. Content copy (headlines, body text) is written
during implementation, following the structure and tone fixed here — exact
wording is out of scope for this spec.

## Audience & language

- Passengers and driver-partners: equal priority throughout (header, hero,
  final CTA all give both audiences equal visual weight).
- Site language: Russian only. No language switcher, no bilingual UI.
- Exception: section 7 references Kazakh-language support as a *product
  fact*, stated in Russian copy. The supporting screenshot
  (`05-kazakh-local.png`) contains genuine Kazakh text (a map) and is used
  unmodified/untranslated as evidence of the claim — it is not site UI.

## Download / CTA model

- Single app, both roles. Role (passenger vs. driver) is selected inside the
  app after install — there is no separate driver app, listing, or signup
  form.
- Every CTA (hero, final CTA) therefore points to the same two store links,
  just framed with role-specific headline copy:
  - Google Play: `https://play.google.com/store/apps/details?id=kz.internet_taxi_khromtau`
  - App Store: `https://apps.apple.com/ru/app/sooncar-%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7-%D1%82%D0%B0%D0%BA%D1%81%D0%B8-%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD/id1479959863`
- Both store buttons are shown side by side in every CTA card (no OS
  auto-detection, no intermediate modal) — the user picks explicitly.

## File structure

```
sooncar.kz/
├── index.html
├── DESIGN.md
├── assets/
│   ├── logo.svg
│   └── screenshots/
│       ├── 01-fair-price.png
│       ├── 02-driver-commission.png
│       ├── 03-quality-rating.png
│       ├── 04-intercity.png
│       └── 05-kazakh-local.png
├── css/
│   ├── tokens.css       — colors, fonts, spacing as CSS custom properties
│   ├── base.css         — reset, base typography, global styles
│   ├── layout.css       — section grids, zig-zag pattern, split-hero
│   ├── components.css   — buttons, phone-mockup container, nav, cards
│   └── motion.css       — the two allowed animation moments
└── js/
    └── main.js          — staggered reveal on load only; no other JS
```

Plain `<link>`-tag CSS split (no bundler), consistent with the
"static HTML/CSS/JS, no build framework" constraint in `DESIGN.md`.
All colors/fonts come from tokens in `tokens.css` — no hardcoded hex or
font-family elsewhere.

## Design tokens (source of truth: `DESIGN.md` → Color & theme, Typography)

- `--color-accent: #A821B6` — sparing use: primary CTA buttons, active/focus
  states, key highlights. Never a gradient or full-section fill.
- `--color-bg: #FFFFFF`, `--color-bg-subtle: #F7F9FB`,
  `--color-bg-muted: #EEF2F6` — background scale, used to separate sections
  without introducing new hues.
- `--color-text-primary: #27374D` — headings and body copy, all sizes.
- `--color-text-secondary: #6284B2` — large text / UI labels only
  (≥18px, or ≥14px bold). Contrast on white ≈ 3.85:1 (AA large-text only).
- `--color-text-secondary-small: #5978A3` — secondary color for small/body
  text. Contrast on white ≈ 4.52:1 (AA normal-text).
- Typography: Display = Montserrat, Body = Inter (confirmed choice — see
  `DESIGN.md` → Typography for weight/size rules).

## Page structure (9 sections)

**1. Header**
Logo (`assets/logo.svg`) left. Right: two static text labels, "Пассажирам"
/ "Водителям" — a visual signal that the site serves both audiences, **not**
functional links (no scroll, no navigation). Rendered as non-interactive
text, not `<a>` tags, to avoid implying clickability that doesn't exist.

**2. Hero (split)**
Shared headline above the split. Below it, two equal-weight CTA cards,
side-by-side on desktop (≥768px), stacked on mobile:
- "Скачать как пассажир" — App Store + Google Play buttons
- "Стать водителем-партнёром" — same App Store + Google Play buttons
Cards are identical in size/visual weight — neither audience dominates.

**3–7. Feature sections (zig-zag pattern)**
Each: heading + short body copy + one screenshot inside a `.phone-mockup`
container (CSS-drawn phone frame — border-radius + padding, no 3D asset).
Alternates text/image sides on desktop (≥768px); always stacks
image-then-text on mobile, same order for all five (no mirroring below the
breakpoint).

| # | Section | Screenshot | Desktop layout |
|---|---------|-----------|-----------------|
| 3 | Справедливая цена (passenger) | `01-fair-price.png` | text left / image right |
| 4 | Выгодно водителям (комиссия) | `02-driver-commission.png` | image left / text right |
| 5 | Качество и доверие (рейтинги, live-tracking) | `03-quality-rating.png` | text left / image right |
| 6 | Межгород | `04-intercity.png` | image left / text right |
| 7 | Отечественный продукт (казахский язык) | `05-kazakh-local.png` | text left / image right |

Screenshots are real product images — exempt from the site's forbidden-color
palette rule per `DESIGN.md` → Exemption: product screenshots — but must stay
inside the bounded phone-mockup container, never used as section backgrounds.

**8. Final CTA (split)**
Mirrors section 2 exactly: same two CTA cards, same layout rules, repeated
at the bottom of the page as a pre-exit reinforcement.

**9. Footer**
- ТОО «Metanoia»
- ул. Туркистан 8/2, Астана 020000, Казахстан
- +7 747 942 37 23
- support@metanoia.kz
- metanoia.kz
- Copyright line
No social icons (none provided), no additional decorative content.

## Responsive behavior

- Mobile-first build order: mobile layout first, then `min-width` media
  queries extend it.
- Breakpoint for zig-zag/split → two-column: ~768px. Below it, everything
  stacks vertically.
- Minimum touch target: 48×48px on every interactive element (buttons).
- Thumb-zone / Fitts's Law: CTA buttons full-width or large on mobile, never
  cornered or undersized.

## Motion (budget: 2 moments, per `DESIGN.md`)

1. Page load: staggered reveal of header → hero headline → hero cards
   (CSS `animation` + `animation-delay`).
2. Primary CTA interaction: hover/active state on download buttons (subtle
   scale/shadow lift on the accent-colored buttons).
No scroll-triggered reveals on sections 3–7 — kept static to stay inside the
budget and avoid decorative motion.

## Accessibility

- Semantic HTML: `<header>`, `<main>`, `<section aria-label="...">` per
  section, `<footer>`. Audience labels in the header are plain text, not a
  `<nav>` (they carry no navigation function).
- `alt` text on all 5 screenshots, describing the depicted content (they are
  evidentiary, not decorative).
- Contrast: token pairs above are pre-checked; any additional text/background
  combination introduced during implementation must be verified against WCAG
  AA before shipping.
- Keyboard: all store buttons focusable with a visible accent-colored focus
  style.

## Testing / QA plan (no test framework — manual)

- Cross-browser check (Chrome, Safari, Firefox) at mobile and desktop
  breakpoints via DevTools.
- Lighthouse pass: performance (screenshot PNGs need compression and/or
  `loading="lazy"` below the fold), accessibility, best practices.
- Manual contrast check (DevTools/WebAIM) on all final text/background pairs
  actually used in the built page.
- Verify no animation blocks or delays access to a primary CTA.

## Explicitly out of scope

- Exact copywriting for headlines/body text (written during implementation).
- Social media links in the footer (none supplied).
- Any backend, form handling, or analytics integration.
- A separate driver-facing app, listing, or signup flow (confirmed: same app
  for both roles).
