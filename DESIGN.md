# DESIGN.md — Sooncar.kz

## Aesthetic direction
Refined minimalism / zero-friction. Restraint is the point, not decoration.
NOT bold, NOT maximalist, NOT editorial-magazine, NOT playful/toy-like.
Product: taxi app marketing site + app-download showcase. Trust and speed
read as competence, not as visual noise.

## UX principles (non-negotiable)
- Jakob's Law: follow established patterns for taxi/ride-hailing UX. Do not
  invent novel interaction patterns where a familiar one exists.
- Fitts's Law: primary actions large, close, and within easy reach. No small
  tap targets for critical actions (booking, download).
- Thumb-zone: on mobile, primary CTAs sit in the bottom third of the viewport.
  Nothing critical in the top corners on mobile breakpoints.
- Minimum touch target: 44x44px (iOS HIG) / 48x48dp (Material) — use the
  larger, 48px, as the floor.

## Typography
- Never: Roboto, Open Sans, Lato, Arial, system-ui defaults.
- Display: Montserrat.
- Body: Inter.
- Weight extremes for hierarchy: e.g. 300 vs 800, not 400 vs 600.
- Size jumps of 3x+ between hero and body, not 1.5x.

## Color & theme
- Neutral-dominant palette + one sharp accent. No evenly-distributed palette.
- Design tokens (CSS custom properties):
  - `--color-accent: #A821B6` — sharp accent, used sparingly (primary CTAs,
    active/focus states, key highlights). Not a gradient, not a hero fill.
  - `--color-bg: #FFFFFF` — primary background.
  - `--color-bg-subtle: #F7F9FB` — secondary/section background.
  - `--color-bg-muted: #EEF2F6` — tertiary background, card fills, dividers.
  - `--color-text-primary: #27374D` — headings, body copy. Meets AA at all
    sizes on all background tokens above.
  - `--color-text-secondary: #6284B2` — large text / UI labels only
    (≥18px, or ≥14px bold). Contrast on white ≈ 3.85:1 — passes AA large-text
    (3:1), fails AA normal-text (4.5:1).
  - `--color-text-secondary-small: #55739C` — secondary color for small/body
    text where AA normal-text applies. Contrast ≈ 4.86:1 on white, ≈ 4.61:1 on
    `--color-bg-subtle` — passes AA normal-text (4.5:1) on every background
    token it's actually used against (the original #5978A3 only passed on
    pure white; it dropped to 4.29:1 on --color-bg-subtle, where it's used
    in `.cta-card__text` and the footer — caught in Task 9 QA).
- CSS custom properties (design tokens) for all colors — no hardcoded hex in
  components.
- Forbidden: purple/indigo gradient heroes, generic SaaS blue-on-white.
- Contrast: WCAG AA minimum on all text.

## Motion
- Motion budget: 2 moments maximum — page load (staggered reveal) and primary
  CTA interaction. Everything else stays static.
- CSS-only animations preferred. No motion that delays access to primary CTA.

## Layout
- Mobile-first. Design and build the mobile layout before desktop.
- No dead decorative sections that add scroll without adding information or
  a decision point.

## Constraints
- Framework: Static HTML/CSS/JS (no build framework, no runtime dependencies).
- Performance: no animation or asset that blocks first paint of the primary CTA.
- Accessibility: keyboard navigable, semantic HTML, alt text on all imagery.

## Explicit rejection
This project intentionally does NOT use the frontend-design plugin's default
"bold aesthetic" bias (brutalist / maximalist / retro-futuristic / editorial).
Interpret "distinctive" as "precise and uncluttered," not "loud."

## Exemption: product screenshots
Photographic/product screenshots (app UI captures used as marketing assets)
are exempt from the Color & theme forbidden-palette rule above. They read
as bounded content — a photograph of the product — not as site chrome.
Keep them inside constrained containers (phone mockup frame, card, bounded
image block). The site's own chrome (background, buttons, nav, headings)
still follows the minimalist palette rules; screenshots carry their own
color energy without dictating the site's palette.
