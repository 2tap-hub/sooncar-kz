# Sooncar.kz Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Sooncar.kz static landing page (index.html + CSS, no JS runtime needed) per the approved design spec.

**Architecture:** One `index.html` loading five split CSS files (`tokens`, `base`, `layout`, `components`, `motion`) via plain `<link>` tags. No build step, no framework, no package manager. The single page-load reveal animation is done with pure CSS (`animation-delay` driven by a `data-delay` attribute) — this removes the `js/main.js` file the spec sketched, since there is no scroll-triggered behavior to justify JS (YAGNI; also matches `DESIGN.md`'s "CSS-only animations preferred").

**Tech Stack:** HTML5, CSS3 (custom properties, flexbox), Google Fonts CDN (Montserrat + Inter). No JavaScript.

## Global Constraints

- Framework: static HTML/CSS only — no build tools, no npm, no JS framework, no runtime dependencies. (spec)
- Site language: Russian only, no language switcher. (spec)
- Colors: only via CSS custom properties defined in `css/tokens.css` — never hardcode hex elsewhere. (spec, DESIGN.md)
- Accent `#A821B6` used sparingly (buttons, focus, highlights) — never a gradient or full-section fill. (DESIGN.md)
- Typography: Display = Montserrat, Body = Inter; weight extremes for hierarchy (e.g. 300 vs 800); hero-to-body size jump ≥ 3x. (DESIGN.md)
- Motion budget: exactly 2 moments — page-load staggered reveal (hero only) and primary-CTA hover/focus. Nothing else animates. (DESIGN.md)
- Touch targets: minimum 48×48px on every interactive element. (DESIGN.md)
- Mobile-first: build the unprefixed (mobile) styles first, then add `min-width: 768px` rules to expand to desktop. (spec)
- Both CTA buttons (passenger and driver) link to the same two store URLs — there is no separate driver signup:
  - Google Play: `https://play.google.com/store/apps/details?id=kz.internet_taxi_khromtau`
  - App Store: `https://apps.apple.com/ru/app/sooncar-%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7-%D1%82%D0%B0%D0%BA%D1%81%D0%B8-%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD/id1479959863`
- Header "Пассажирам" / "Водителям" are plain text labels — not links, no scroll behavior. (spec)
- Product screenshots (`assets/screenshots/*.png`) are exempt from the color-palette rule but must stay inside a bounded `.phone-mockup` container — never a section background. (DESIGN.md)
- No git repository for this project — every task ends with a manual verification checkpoint instead of a commit.
- No automated test framework — verification uses `grep` (for CSS/HTML content checks) and a manual browser pass via `python3 -m http.server` (see each task's Steps).

---

## File Map

- `css/tokens.css` — all design tokens (colors, fonts, spacing, radii, breakpoint). Created in Task 1.
- `index.html` — page shell + all 9 sections. Created in Task 2, filled in by Tasks 3–7.
- `css/base.css` — reset, base typography/type scale. Created in Task 2.
- `css/layout.css` — section-level layout (hero split, feature zig-zag, footer). Created across Tasks 3–7.
- `css/components.css` — reusable pieces (CTA card, store button, phone-mockup, audience label). Created across Tasks 3–7.
- `css/motion.css` — the two allowed animation moments. Created in Task 8.
- `assets/logo.svg`, `assets/screenshots/*.png` — already present, not modified.

---

### Task 1: Design tokens

**Files:**
- Create: `css/tokens.css`

**Interfaces:**
- Consumes: nothing (first file).
- Produces: CSS custom properties on `:root`, consumed by every later CSS file:
  `--color-accent`, `--color-bg`, `--color-bg-subtle`, `--color-bg-muted`,
  `--color-text-primary`, `--color-text-secondary`, `--color-text-secondary-small`,
  `--font-display`, `--font-body`, `--weight-light`, `--weight-bold`,
  `--space-1` … `--space-7`, `--breakpoint-desktop`, `--touch-target-min`,
  `--radius-card`, `--radius-button`.

- [ ] **Step 1: Create `css/tokens.css`**

```css
:root {
  /* Color */
  --color-accent: #A821B6;
  --color-bg: #FFFFFF;
  --color-bg-subtle: #F7F9FB;
  --color-bg-muted: #EEF2F6;
  --color-text-primary: #27374D;
  --color-text-secondary: #6284B2;       /* large text / UI labels only, AA large-text */
  --color-text-secondary-small: #5978A3; /* small/body text, AA normal-text */

  /* Typography */
  --font-display: 'Montserrat', sans-serif;
  --font-body: 'Inter', sans-serif;
  --weight-light: 300;
  --weight-bold: 800;

  /* Spacing scale (px) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 48px;
  --space-6: 64px;
  --space-7: 96px;

  /* Layout */
  --breakpoint-desktop: 768px;
  --touch-target-min: 48px;
  --radius-card: 16px;
  --radius-button: 8px;
}
```

- [ ] **Step 2: Verify the required color tokens are present**

Run: `grep -cE -- "--color-(accent|bg|bg-subtle|bg-muted|text-primary|text-secondary|text-secondary-small): #" "css/tokens.css"`
Expected: `7`

- [ ] **Step 3: Manual verification checkpoint**

Confirm `css/tokens.css` has no syntax errors by opening it in an editor and checking every declaration ends in `;` and the file has exactly one closing `}`. No browser check yet — nothing consumes this file until Task 2.

---

### Task 2: Page shell + base styles

**Files:**
- Create: `index.html`
- Create: `css/base.css`

**Interfaces:**
- Consumes: tokens from Task 1 (`--color-*`, `--font-*`).
- Produces:
  - `index.html` with HTML comment placeholders `<!-- HEADER -->`, `<!-- HERO -->`,
    `<!-- FAIR PRICE -->`, `<!-- DRIVER COMMISSION -->`, `<!-- QUALITY TRUST -->`,
    `<!-- INTERCITY -->`, `<!-- LOCAL PRODUCT -->`, `<!-- FINAL CTA -->`,
    `<!-- FOOTER -->` — each later task replaces exactly one placeholder with real markup.
  - Base type elements (`h1`, `h2`, `h3`, `p`, `a`) styled and ready to use.

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sooncar — такси в Казахстане</title>
  <meta name="description" content="Sooncar — такси для пассажиров и водителей-партнёров в Казахстане. Справедливая цена, низкая комиссия, поездки между городами.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Montserrat:wght@300;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/motion.css">
</head>
<body>
  <!-- HEADER -->
  <main>
    <!-- HERO -->
    <!-- FAIR PRICE -->
    <!-- DRIVER COMMISSION -->
    <!-- QUALITY TRUST -->
    <!-- INTERCITY -->
    <!-- LOCAL PRODUCT -->
    <!-- FINAL CTA -->
  </main>
  <!-- FOOTER -->
</body>
</html>
```

Note: `css/layout.css`, `css/components.css`, `css/motion.css` are linked here but don't exist yet — they are created empty in this task (Step 2) so the page doesn't 404, then filled in by later tasks.

- [ ] **Step 2: Create empty placeholder stylesheets**

Run:
```bash
touch "css/layout.css" "css/components.css" "css/motion.css"
```
Expected: three empty files created, no output.

- [ ] **Step 3: Create `css/base.css`**

```css
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-text-primary);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
}

h1, h2, h3 {
  font-family: var(--font-display);
  margin: 0;
  line-height: 1.15;
}

h1 {
  font-weight: var(--weight-bold);
  font-size: 52px; /* body is 16px -> 3.25x jump, meets the 3x+ rule */
}

@media (min-width: 768px) {
  h1 {
    font-size: 76px;
  }
}

h2 {
  font-weight: var(--weight-bold);
  font-size: 28px;
}

@media (min-width: 768px) {
  h2 {
    font-size: 36px;
  }
}

h3 {
  font-weight: var(--weight-bold);
  font-size: 20px;
}

p {
  margin: 0;
}
```

- [ ] **Step 4: Verify files exist and HTML references resolve**

Run:
```bash
ls "css/tokens.css" "css/base.css" "css/layout.css" "css/components.css" "css/motion.css" "index.html" "assets/logo.svg"
```
Expected: all seven paths printed, no "No such file" errors.

- [ ] **Step 5: Manual verification checkpoint**

Run: `python3 -m http.server 8000` in the project root, open `http://localhost:8000/` in a browser.
Confirm: blank page loads with no console 404s (check DevTools Network tab), background is white, no layout yet (body is empty except comments). Stop the server (Ctrl+C) when done.

---

### Task 3: Header

**Files:**
- Modify: `index.html` (replace `<!-- HEADER -->`)
- Modify: `css/components.css` (add `.audience-label`)
- Modify: `css/layout.css` (add `.site-header`)

**Interfaces:**
- Consumes: `--color-text-secondary`, `--space-*` from tokens.
- Produces: `.site-header`, `.site-header__logo`, `.audience-labels`, `.audience-label` — not reused elsewhere.

- [ ] **Step 1: Replace `<!-- HEADER -->` in `index.html`**

```html
<header class="site-header">
  <img src="assets/logo.svg" alt="Sooncar" class="site-header__logo">
  <div class="audience-labels">
    <span class="audience-label">Пассажирам</span>
    <span class="audience-label">Водителям</span>
  </div>
</header>
```

- [ ] **Step 2: Add header layout to `css/layout.css`**

```css
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3);
  max-width: 1100px;
  margin: 0 auto;
}

.site-header__logo {
  height: 32px;
  width: auto;
}
```

- [ ] **Step 3: Add audience label styling to `css/components.css`**

```css
.audience-labels {
  display: flex;
  gap: var(--space-3);
}

.audience-label {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}
```

- [ ] **Step 4: Verify markup was inserted correctly**

Run: `grep -c "audience-label\">Пассажирам" "index.html"`
Expected: `1`

- [ ] **Step 5: Manual verification checkpoint**

Run: `python3 -m http.server 8000`, open `http://localhost:8000/`.
Confirm: logo appears top-left, "Пассажирам" / "Водителям" appear top-right in muted blue-gray text, no navigation/click affordance styling (no underline, no pointer cursor needed). Resize to mobile width (~375px) — header should not wrap or overflow.

---

### Task 4: Hero split (CTA cards + store buttons)

**Files:**
- Modify: `index.html` (replace `<!-- HERO -->`)
- Modify: `css/layout.css` (add `.hero-split`, `.cta-row`)
- Modify: `css/components.css` (add `.cta-card`, `.cta-card__title`, `.cta-card__text`, `.store-buttons`, `.store-button`)

**Interfaces:**
- Consumes: `--color-accent`, `--color-bg-subtle`, `--radius-card`, `--radius-button`, `--touch-target-min`, `--breakpoint-desktop` from tokens.
- Produces: `.hero-split`, `.cta-row`, `.cta-card`, `.cta-card__title`, `.cta-card__text`,
  `.store-buttons`, `.store-button` — `.hero-split`/`.cta-row`/`.cta-card`/`.store-buttons`/`.store-button`
  are reused as-is by Task 6 (Final CTA). `.reveal` / `data-delay` attributes are added here but
  styled later in Task 8 — until then they have no visual effect (unstyled attribute selector).

- [ ] **Step 1: Replace `<!-- HERO -->` in `index.html`**

```html
<section id="hero" class="hero-split" aria-label="Скачать приложение Sooncar">
  <h1 class="reveal" data-delay="0">Такси, в котором честно и пассажирам, и водителям</h1>
  <div class="cta-row">
    <div class="cta-card reveal" data-delay="1">
      <h2 class="cta-card__title">Скачать как пассажир</h2>
      <p class="cta-card__text">Быстрая подача и цена без сюрпризов.</p>
      <div class="store-buttons">
        <a class="store-button" href="https://play.google.com/store/apps/details?id=kz.internet_taxi_khromtau">Google Play</a>
        <a class="store-button" href="https://apps.apple.com/ru/app/sooncar-%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7-%D1%82%D0%B0%D0%BA%D1%81%D0%B8-%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD/id1479959863">App Store</a>
      </div>
    </div>
    <div class="cta-card reveal" data-delay="2">
      <h2 class="cta-card__title">Стать водителем-партнёром</h2>
      <p class="cta-card__text">Низкая комиссия и стабильный доход.</p>
      <div class="store-buttons">
        <a class="store-button" href="https://play.google.com/store/apps/details?id=kz.internet_taxi_khromtau">Google Play</a>
        <a class="store-button" href="https://apps.apple.com/ru/app/sooncar-%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7-%D1%82%D0%B0%D0%BA%D1%81%D0%B8-%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD/id1479959863">App Store</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add hero layout to `css/layout.css`**

```css
.hero-split {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-3);
  max-width: 1100px;
  margin: 0 auto;
}

.cta-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

@media (min-width: 768px) {
  .cta-row {
    flex-direction: row;
  }
}
```

- [ ] **Step 3: Add CTA card and store button components to `css/components.css`**

```css
.cta-card {
  background: var(--color-bg-subtle);
  border-radius: var(--radius-card);
  padding: var(--space-4);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-start;
}

.cta-card__title {
  color: var(--color-text-primary);
}

.cta-card__text {
  color: var(--color-text-secondary-small);
  font-size: 14px;
}

.store-buttons {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.store-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--touch-target-min);
  min-width: var(--touch-target-min);
  padding: 0 var(--space-3);
  border-radius: var(--radius-button);
  background: var(--color-accent);
  color: #FFFFFF;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
}
```

- [ ] **Step 4: Verify both store links are present**

Run: `grep -c "play.google.com/store/apps/details?id=kz.internet_taxi_khromtau" "index.html"`
Expected: `2` (one per CTA card)

Run: `grep -c "apps.apple.com/ru/app/sooncar" "index.html"`
Expected: `2`

- [ ] **Step 5: Manual verification checkpoint**

Run: `python3 -m http.server 8000`, open `http://localhost:8000/`.
Confirm: hero headline renders large (Montserrat, bold); two equal-width cards below it, stacked on mobile width (~375px) and side-by-side at ≥768px; each card has two magenta (`#A821B6`) buttons at least 48px tall; clicking a store button opens the correct store URL in a new check (hover over link, confirm URL in browser status bar matches the intended store).

---

### Task 5: Feature sections 3–7 (zig-zag layout + content)

**Files:**
- Modify: `index.html` (replace `<!-- FAIR PRICE -->`, `<!-- DRIVER COMMISSION -->`, `<!-- QUALITY TRUST -->`, `<!-- INTERCITY -->`, `<!-- LOCAL PRODUCT -->`)
- Modify: `css/layout.css` (add `.feature-section`, `.feature-section--reverse`)
- Modify: `css/components.css` (add `.phone-mockup`)

**Interfaces:**
- Consumes: `--color-bg-muted`, `--space-*`, `--breakpoint-desktop` from tokens; `h2`/`p` base styles from Task 2.
- Produces: `.feature-section`, `.feature-section--reverse`, `.feature-section__content`,
  `.feature-section__media`, `.phone-mockup` — all five sections share these classes;
  no section-specific CSS is introduced (only the `--reverse` modifier alternates sides).

- [ ] **Step 1: Replace `<!-- FAIR PRICE -->` in `index.html`**

```html
<section id="fair-price" class="feature-section" aria-label="Справедливая цена">
  <div class="feature-section__content">
    <h2>Справедливая цена</h2>
    <p>Вы видите итоговую стоимость поездки заранее — без скрытых наценок и сюрпризов после поездки.</p>
  </div>
  <div class="feature-section__media">
    <div class="phone-mockup">
      <img src="assets/screenshots/01-fair-price.png" alt="Экран приложения Sooncar с расчётом стоимости поездки до заказа">
    </div>
  </div>
</section>
```

- [ ] **Step 2: Replace `<!-- DRIVER COMMISSION -->` in `index.html`**

```html
<section id="driver-commission" class="feature-section feature-section--reverse" aria-label="Выгодно водителям">
  <div class="feature-section__content">
    <h2>Выгодно водителям</h2>
    <p>Одна из самых низких комиссий на рынке — больше поездок приносят больше дохода вам, а не платформе.</p>
  </div>
  <div class="feature-section__media">
    <div class="phone-mockup">
      <img src="assets/screenshots/02-driver-commission.png" alt="Экран приложения Sooncar с размером комиссии водителя">
    </div>
  </div>
</section>
```

- [ ] **Step 3: Replace `<!-- QUALITY TRUST -->` in `index.html`**

```html
<section id="quality-trust" class="feature-section" aria-label="Качество и доверие">
  <div class="feature-section__content">
    <h2>Качество и доверие</h2>
    <p>Рейтинги водителей и пассажиров, отслеживание поездки в реальном времени — вы всегда знаете, кто за рулём и где сейчас машина.</p>
  </div>
  <div class="feature-section__media">
    <div class="phone-mockup">
      <img src="assets/screenshots/03-quality-rating.png" alt="Экран приложения Sooncar с рейтингом водителя и live-трекингом поездки">
    </div>
  </div>
</section>
```

- [ ] **Step 4: Replace `<!-- INTERCITY -->` in `index.html`**

```html
<section id="intercity" class="feature-section feature-section--reverse" aria-label="Межгород">
  <div class="feature-section__content">
    <h2>Межгород</h2>
    <p>Заказывайте поездки между городами Казахстана в том же приложении — без пересадок и поиска отдельного перевозчика.</p>
  </div>
  <div class="feature-section__media">
    <div class="phone-mockup">
      <img src="assets/screenshots/04-intercity.png" alt="Экран приложения Sooncar с заказом межгородской поездки">
    </div>
  </div>
</section>
```

- [ ] **Step 5: Replace `<!-- LOCAL PRODUCT -->` in `index.html`**

```html
<section id="local-product" class="feature-section" aria-label="Отечественный продукт">
  <div class="feature-section__content">
    <h2>Отечественный продукт</h2>
    <p>Sooncar разработан в Казахстане и поддерживает казахский язык — включая карты и адреса в приложении.</p>
  </div>
  <div class="feature-section__media">
    <div class="phone-mockup">
      <img src="assets/screenshots/05-kazakh-local.png" alt="Карта в приложении Sooncar с адресами на казахском языке">
    </div>
  </div>
</section>
```

- [ ] **Step 6: Add zig-zag layout to `css/layout.css`**

```css
.feature-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-3);
  max-width: 1100px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .feature-section {
    flex-direction: row;
    align-items: center;
    gap: var(--space-6);
  }

  .feature-section--reverse {
    flex-direction: row-reverse;
  }

  .feature-section__content,
  .feature-section__media {
    flex: 1;
  }
}
```

- [ ] **Step 7: Add phone-mockup component to `css/components.css`**

```css
.phone-mockup {
  background: var(--color-bg-muted);
  border-radius: 32px;
  padding: var(--space-2);
  box-shadow: 0 20px 40px rgba(39, 55, 77, 0.12);
  max-width: 320px;
  margin: 0 auto;
}

.phone-mockup img {
  border-radius: 20px;
}
```

- [ ] **Step 8: Verify all five screenshots are referenced**

Run: `grep -c 'src="assets/screenshots/' "index.html"`
Expected: `5`

- [ ] **Step 9: Manual verification checkpoint**

Run: `python3 -m http.server 8000`, open `http://localhost:8000/`.
Confirm at ≥768px width: sections alternate text-left/image-right (Справедливая цена, Качество и доверие, Отечественный продукт) and image-left/text-right (Выгодно водителям, Межгород). Confirm at ~375px width: all five stack image-then-text, in the same order (no mirroring). Confirm every screenshot sits inside a rounded, shadowed phone-mockup card — never full-bleed as a background.

---

### Task 6: Final CTA

**Files:**
- Modify: `index.html` (replace `<!-- FINAL CTA -->`)

**Interfaces:**
- Consumes: `.hero-split`, `.cta-row`, `.cta-card`, `.cta-card__title`, `.store-buttons`, `.store-button` from Task 4 (no new CSS).
- Produces: nothing new — this section is a content-only reuse of Task 4's components, without the `.reveal`/`data-delay` attributes (final CTA is below the fold; the page-load reveal animation only applies to the hero, per the 2-moment motion budget).

- [ ] **Step 1: Replace `<!-- FINAL CTA -->` in `index.html`**

```html
<section id="final-cta" class="hero-split" aria-label="Скачать приложение Sooncar">
  <h2>Готовы начать?</h2>
  <div class="cta-row">
    <div class="cta-card">
      <h3 class="cta-card__title">Скачать как пассажир</h3>
      <div class="store-buttons">
        <a class="store-button" href="https://play.google.com/store/apps/details?id=kz.internet_taxi_khromtau">Google Play</a>
        <a class="store-button" href="https://apps.apple.com/ru/app/sooncar-%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7-%D1%82%D0%B0%D0%BA%D1%81%D0%B8-%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD/id1479959863">App Store</a>
      </div>
    </div>
    <div class="cta-card">
      <h3 class="cta-card__title">Стать водителем-партнёром</h3>
      <div class="store-buttons">
        <a class="store-button" href="https://play.google.com/store/apps/details?id=kz.internet_taxi_khromtau">Google Play</a>
        <a class="store-button" href="https://apps.apple.com/ru/app/sooncar-%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7-%D1%82%D0%B0%D0%BA%D1%81%D0%B8-%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD/id1479959863">App Store</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify final CTA store links are present**

Run: `grep -c "play.google.com/store/apps/details?id=kz.internet_taxi_khromtau" "index.html"`
Expected: `4` (2 from hero + 2 from final CTA)

- [ ] **Step 3: Manual verification checkpoint**

Run: `python3 -m http.server 8000`, open `http://localhost:8000/`, scroll to the bottom section above the footer.
Confirm: same two-card layout as the hero, correctly labeled "Готовы начать?", both store buttons present and styled identically to the hero's.

---

### Task 7: Footer

**Files:**
- Modify: `index.html` (replace `<!-- FOOTER -->`)
- Modify: `css/layout.css` (add `.site-footer`)

**Interfaces:**
- Consumes: `--color-bg-subtle`, `--color-text-secondary-small`, `--space-*` from tokens.
- Produces: `.site-footer` — not reused elsewhere.

- [ ] **Step 1: Replace `<!-- FOOTER -->` in `index.html`**

```html
<footer class="site-footer">
  <p>ТОО «Metanoia»</p>
  <p>ул. Туркистан 8/2, Астана 020000, Казахстан</p>
  <p><a href="tel:+77479423723">+7 747 942 37 23</a></p>
  <p><a href="mailto:support@metanoia.kz">support@metanoia.kz</a></p>
  <p><a href="https://metanoia.kz">metanoia.kz</a></p>
  <p>&copy; 2026 ТОО «Metanoia». Все права защищены.</p>
</footer>
```

- [ ] **Step 2: Add footer styling to `css/layout.css`**

```css
.site-footer {
  background: var(--color-bg-subtle);
  padding: var(--space-5) var(--space-3);
  color: var(--color-text-secondary-small);
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.site-footer a {
  text-decoration: underline;
}
```

- [ ] **Step 3: Verify footer contact details are present**

Run: `grep -c "support@metanoia.kz" "index.html"`
Expected: `1`

Run: `grep -c "+7 747 942 37 23" "index.html"`
Expected: `1`

- [ ] **Step 4: Manual verification checkpoint**

Run: `python3 -m http.server 8000`, open `http://localhost:8000/`, scroll to the bottom.
Confirm: footer has a light-gray background, all five lines (company, address, phone, email, web) are present and legible, phone/email/web are clickable links.

---

### Task 8: Motion (page-load reveal + CTA hover)

**Files:**
- Modify: `css/motion.css`

**Interfaces:**
- Consumes: `.reveal` and `data-delay` attributes on hero elements (added in Task 4); `.store-button` class (added in Task 4).
- Produces: the two motion moments allowed by the budget. No new HTML or JS.

- [ ] **Step 1: Write the page-load reveal animation in `css/motion.css`**

```css
@keyframes stagger-reveal {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal {
  animation: stagger-reveal 0.5s ease-out both;
}

.reveal[data-delay="1"] {
  animation-delay: 0.1s;
}

.reveal[data-delay="2"] {
  animation-delay: 0.2s;
}
```

- [ ] **Step 2: Write the CTA hover/focus interaction in `css/motion.css`**

```css
.store-button {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.store-button:hover,
.store-button:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(168, 33, 182, 0.35);
}
```

- [ ] **Step 3: Respect reduced-motion preference**

```css
@media (prefers-reduced-motion: reduce) {
  .reveal {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .store-button {
    transition: none;
  }
}
```

- [ ] **Step 4: Verify `css/motion.css` defines exactly the two allowed moments**

Run: `grep -c "@keyframes" "css/motion.css"`
Expected: `1` (only the reveal animation — confirms no extra keyframe animations were added elsewhere)

- [ ] **Step 5: Manual verification checkpoint**

Run: `python3 -m http.server 8000`, open `http://localhost:8000/` with DevTools open.
Confirm: on load, the hero headline and two cards fade/slide in with a slight stagger (not simultaneous, not scroll-triggered — reload the page while scrolled to the bottom and confirm the hero still played its reveal off-screen, proving it's load-triggered, not scroll-triggered). Hover a store button — confirm it lifts slightly with a magenta-tinted shadow. Confirm no other element on the page animates (scroll through sections 3–7 slowly, nothing should move).

---

### Task 9: Responsive, accessibility, and manual QA pass

**Files:**
- Modify: `index.html`, `css/base.css`, `css/layout.css`, `css/components.css` (small fixes only, as issues are found — no new components)

**Interfaces:**
- Consumes: the complete page from Tasks 1–8.
- Produces: nothing new — this task is a verification and fix pass, not a build step.

- [ ] **Step 1: Verify semantic landmarks and aria-labels**

Run: `grep -c "aria-label=" "index.html"`
Expected: `7` (hero, fair-price, driver-commission, quality-trust, intercity, local-product, final-cta)

- [ ] **Step 2: Verify every screenshot has descriptive alt text**

Run: `grep -c 'alt="Экран приложения Sooncar\|alt="Карта в приложении Sooncar' "index.html"`
Expected: `5`

- [ ] **Step 3: Manual touch-target check**

Run: `python3 -m http.server 8000`, open `http://localhost:8000/` with DevTools device toolbar set to a 375px-wide mobile viewport.
Confirm: every store button and footer link has a tap area of at least 48×48px (use the DevTools element inspector's box-model panel to check the rendered height/width of `.store-button`).

- [ ] **Step 4: Manual contrast check**

Open DevTools, use the color-contrast checker on the computed styles of:
- `.cta-card__text` (`--color-text-secondary-small` on `--color-bg-subtle`)
- `.audience-label` (`--color-text-secondary` on `--color-bg`)
- `.store-button` (white text on `--color-accent`)
Confirm: all three report an AA pass at their respective font sizes (normal-text 4.5:1 for `.cta-card__text` and `.store-button`; large-text 3:1 is sufficient only if `.audience-label`'s 14px/500-weight doesn't qualify as "large text" — if DevTools flags it, bump `.audience-label` to `font-weight: 700` or switch it to `--color-text-secondary-small`).

- [ ] **Step 5: Cross-browser and breakpoint sweep**

Run: `python3 -m http.server 8000`, open `http://localhost:8000/` in Chrome, Safari, and Firefox.
Confirm in each: layout matches at 375px (mobile), 768px (breakpoint), and 1200px (desktop) — no overlapping text, no horizontal scrollbar, images load, fonts render as Montserrat/Inter (not a fallback font — check via DevTools Computed styles panel on `h1` and `body`).

- [ ] **Step 6: Lighthouse pass**

Run: in Chrome DevTools, open the Lighthouse tab, run an audit (mobile, all categories) against `http://localhost:8000/`.
Confirm: Accessibility score ≥ 95. If Performance flags large images, note the specific screenshot file(s) and add `loading="lazy"` to that `<img>` in `index.html` (all 5 feature-section screenshots are below the fold, so `loading="lazy"` is safe to add to all of them without affecting the hero/first-paint budget).

- [ ] **Step 7: Final manual verification checkpoint**

Stop the server (Ctrl+C). Re-read `DESIGN.md` and the spec's "Explicitly out of scope" section once more; confirm nothing in scope was skipped. The page is complete when Steps 1–6 all pass with no outstanding fixes.
