---
name: Der Rote Faden — lars-dev.org
description: A career pinned to a cork wall by its owner's hand, stitched chronologically by one crimson thread.
colors:
  thread: "oklch(50% 0.19 22)"
  ink-magenta: "oklch(45% 0.19 350)"
  ink-violet: "oklch(42% 0.17 300)"
  ink-teal: "oklch(44% 0.09 200)"
  ink-green: "oklch(44% 0.12 150)"
  ink-amber: "oklch(48% 0.11 70)"
  ink-blue: "oklch(44% 0.15 260)"
  brass: "oklch(70% 0.09 85)"
  cork: "oklch(87% 0.035 80)"
  cork-deep: "oklch(82% 0.045 75)"
  paper: "oklch(97.5% 0.008 90)"
  paper-aged: "oklch(94% 0.02 85)"
  ink: "oklch(25% 0.015 60)"
  ink-soft: "oklch(38% 0.015 60)"
typography:
  display:
    fontFamily: "League Gothic, Arial Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "0.01em"
  body:
    fontFamily: "Atkinson Hyperlegible, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  typed:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: "24px"
  hand:
    fontFamily: "Shantell Sans, Segoe Print, cursive"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  none: "0px"
  full: "50%"
spacing:
  baseline: "8px"
  card-pad: "24px"
  col-gap: "24px"
  row-gap: "64px"
  section-pad: "64px"
components:
  pin-card-typed:
    backgroundColor: "{colors.paper-aged}"
    textColor: "{colors.ink}"
    typography: "{typography.typed}"
    rounded: "{rounded.none}"
    padding: "48px 24px 24px"
  pin-card-flyer:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
    padding: "24px"
  pin-card-print:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "24px"
  pin-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.typed}"
    rounded: "{rounded.none}"
    padding: "16px 24px"
  hand-note:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-magenta}"
    typography: "{typography.hand}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  polaroid:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.hand}"
    rounded: "{rounded.none}"
    padding: "12px 12px 16px"
  stamp:
    textColor: "color-mix(in oklab, oklch(50% 0.19 22) 85%, oklch(25% 0.015 60))"
    typography: "{typography.typed}"
    rounded: "{rounded.full}"
    size: "104px"
---

# Design System: Der Rote Faden

## Overview

**Creative North Star: "Der Rote Faden"**

The site is a career pinned to a cork wall by its owner's hand. One crimson thread — *der rote Faden*, German for both a literal red thread and a story's through-line — enters at a stamped 12/2019 pin in the hero, stitches every artifact in chronological order down the whole page, and is cut in a loose knot on open cork just before the contact corner. Everything on screen is a physical object on that wall: typed index cards, flyer posters, clean print-outs, polaroids, handwritten margin notes, brass pins, circular rubber stamps. The world refuses the dark-neon developer-dashboard default and the neutral CV alike (the direction contract committed in `src/layouts/main.astro`).

The wall proves instead of asserting. Every figure on it carries its unit and its as-of date; standalone dates arrive as hand-pressed stamps; telemetry hangs as annotated chart print-outs with the data repeated in a folded table. The six pride inks are the owner's working colors — they write the margin notes and encode the chart series — and the house-rules flyer states in League Gothic that removing them makes the wall stop making sense. Two durable brand commitments live here: the handwritten Lottie greeting (drawn in pride inks) survives every redesign, and queer-friendliness is expressed openly as identity, not decoration.

Density is a curated collage: artifacts cluster, overlap, and tilt, but a hidden 12-column grid organizes every placement and the tilt comes in fixed ±1.2° steps. Motion is quiet and physical — the thread draws itself as the wall scrolls, pins settle in 150ms, and every animation has a designed resolved state that stands on its own wherever motion is unwelcome or unsupported.

**Key Characteristics:**
- Warm, light, paper-on-cork material world (`color-scheme: light` only; no dark theme).
- One structural accent — the crimson thread — plus six rationed pride inks doing real work (annotation + data series), never decoration.
- Four typefaces, one per physical material; faces never mix inside a single artifact.
- Hidden 12-column grid under a tilted collage; rotation in ±1.2° steps, neighbors never share a tilt.
- One shadow, one grain texture; depth is physical stacking (thread behind paper, pins above it), never glow.
- Scroll-drawn thread and 150ms settle micro-motion, each with a fully-drawn/resolved fallback state.
- Every figure set with unit + as-of date; stamps date the wall itself.

## Colors

A warm paper-and-cork neutral field where one crimson accent does the structure and six deep pride inks do the talking; all values are authored in OKLCH in `src/styles/wall.css` (the hex values in parens are sRGB approximations).

### Primary
- **Crimson Thread** (`oklch(50% 0.19 22)`, ≈ #b7162d): the one structural accent. It is the thread itself (2.5px stroke), the focus ring on every interactive element, link underlines, the hand-drawn headline rules under flyer titles, the selection tint, and — darkened one step toward ink via `color-mix` — the rubber-stamp ink. Nothing else on the wall gets to be red.

### Secondary
The six pride inks — deep, deliberately darkened so each holds ≥4.5:1 as text on paper. They are working colors with two jobs: handwritten annotations (HandNote) and deterministic chart-series encoding (an entity registers an ink on first sight in `getCharts` and keeps it across every chart; two entities never share an ink on one sheet).
- **Magenta Ink** (`oklch(45% 0.19 350)`, ≈ #9a0064): first ink in flag order; Ayako's series color.
- **Violet Ink** (`oklch(42% 0.17 300)`, ≈ #5e2b9a): annotations; series color.
- **Teal Ink** (`oklch(44% 0.09 200)`, ≈ #006166): annotations (the timeline's margin note, the VR bench note); series color.
- **Green Ink** (`oklch(44% 0.12 150)`, ≈ #03642b): annotations (the 12/2019 origin note, the free-forever note); series color.
- **Amber Ink** (`oklch(48% 0.11 70)`, ≈ #845000): annotations ("The only address I publish", the house-rules note); series color.
- **Blue Ink** (`oklch(44% 0.15 260)`, ≈ #184da3): annotations; series color; at 20% opacity it also rules the index-card lines.

### Tertiary
- **Brass** (`oklch(70% 0.09 85)`, ≈ #b89a5a): hardware only. Rendered as a lit sphere (radial gradient from a 40%-white mix through brass to a 55%-black mix) for the 14px pins, the filmstrip's end pins, and the 44px scroll-to-top pin. Never a text or surface color.

### Neutral
- **Cork** (`oklch(87% 0.035 80)`, ≈ #e1d2bb): the ground. The page background under a single feTurbulence grain; also the punched-through sprocket holes of the filmstrip.
- **Deep Cork** (`oklch(82% 0.045 75)`, ≈ #d6c1a4): the darker cork step (defined in the token set, rarely surfaced).
- **Paper** (`oklch(97.5% 0.008 90)`, ≈ #f9f7f1): the default sheet — flyers, print-outs, polaroid frames, buttons, note slips.
- **Aged Paper** (`oklch(94% 0.02 85)`, ≈ #f1eadc): older stock — typed index cards, polaroid photo wells, filmstrip frames.
- **Ink** (`oklch(25% 0.015 60)`, ≈ #27201a): all primary text; a warm near-black, never pure #000. Low-alpha mixes of it make the pin shadow, hairline borders (18%), and table rules (12–15%).
- **Soft Ink** (`oklch(38% 0.015 60)`, ≈ #49413b): secondary text — source lines, stacks, licenses, datelines, the footer.

### Named Rules
**The One Thread Rule.** `--thread` is the only structural accent. It may be thread, stamp ink, focus ring, underline, or headline rule — never a large fill, and never joined by a second red.

**The Working Ink Rule.** The six pride inks are load-bearing: they annotate the wall and encode the data series, and the house-rules flyer says so in type ("remove them and the wall stops making sense"). An ink that is neither writing a note nor naming a series has no business on the wall.

**The Paper Slip Rule.** Handwritten ink goes on paper, not raw cork. Every pride ink clears 4.5:1 on `--paper`; green, violet, and blue do not clear raw cork, so freestanding notes ride small paper slips with the pin shadow.

## Typography

**Display Font:** League Gothic (with Arial Narrow fallback)
**Body Font:** Atkinson Hyperlegible (with Segoe UI fallback)
**Typed Font:** Courier Prime (with Courier New fallback)
**Hand Font:** Shantell Sans (with Segoe Print fallback)

**Character:** Four faces, each the voice of one physical material: League Gothic is the flyer press, Courier Prime the typewriter, Atkinson Hyperlegible the clean office printer, Shantell Sans the owner's pen. The pairing reads as artifacts made by different machines and one hand — never as a website's font stack.

### Hierarchy
- **Display / flyer headlines** (400, `clamp(2.75rem, 6vw, 4.5rem)` for section headlines down to `clamp(2rem, 4vw, 2.75rem)` for the title card, line-height 0.92–0.95, uppercase): the section flyers ("Werdegang", "Projects", "Telemetry", "House Rules", "Write to me") and the wall's title card. House-rules statements set in it at `clamp(1.375rem, 1.2rem + 0.7vw, 1.625rem)` in the pride inks.
- **Card titles** (700, 1.0625–1.25rem, line-height 24px): headings on typed and print cards, set in the card's own face.
- **Body / print** (400, 0.9375rem on cards, 1rem base, line-height 1.5 = 24px): print-out copy; telemetry figures with `font-variant-numeric: tabular-nums`.
- **Typed** (400/700, 0.875–1rem, line-height exactly 24px): index-card copy sitting on the printed ruling; also buttons, channel labels, the footer, and stamp text.
- **Hand** (500, 0.875–1.125rem, line-height 1.3–1.4, rotated −2° to +1.5°): annotations and captions only — never body copy. The greeting is the one large hand setting, set as a signature: the salutation at 400 in `--ink-soft`, the name at 500 carrying all six pride inks as one continuous stroke (`background-clip: text`), under a hand-drawn swash in the same six inks.
- **Stamp text** (700 typed, 0.625–0.6875rem, letter-spacing 0.06–0.14em, uppercase): dates and marks inside stamp rings.

### Named Rules
**The One Material Rule.** Every artifact is one physical material. A flyer is League Gothic only, an index card Courier Prime only, a print-out Atkinson Hyperlegible only, an annotation Shantell Sans only. Faces never mix inside one artifact — the greeting card is all hand material, including its Lottie.

**The Ruled Card Rule.** Typed index cards print their own ruling — a red header rule at 40px and blue lines every 24px — and the typed face's 24px line-height sits the copy exactly on those lines. Break the rhythm and the card reads as a forgery.

**The Unit-and-Date Rule.** Every figure is set with its unit and its as-of date ("2.4M+ users on 8,357 servers, as of 2026-08-03"; "3,019.9 h"). Standalone dates are stamped, with "as of" as the stamp's sub-line. A bare number is not a fact on this wall.

## Layout

The wall is one continuous surface — no section background changes, ever; sections are clusters of artifacts on the same cork. Content lives in a centered 78rem shell (`.wall-max`, 24px inline padding) holding a hidden 12-column grid (`.wall-grid`: 24px column gap, 64px row gap; the column gap tightens to 16px below 48rem). The grid organizes and never shows: artifacts span ranges of it (a polaroid on columns 1–4, a spec card on 5–13), keep their natural height, and stagger across rows to collage.

Rotation is layout: pinned artifacts tilt in fixed steps of ±1.2° via `--tilt` (−1 | 0 | 1), and neighbors never share a tilt (the contact channels cycle 1, 0, −1). Stamps rotate freely (−8° to +7°, deterministic per row) because they are hand-pressed, not pinned.

Rhythm is an 8px baseline (`--baseline`); paddings, gaps, and line-heights are authored as multiples of it (cards pad 24px, sections pad-block 64px, body line-height 24px). Breakpoints sit at 48rem and 64rem: below 64rem the hero collage stacks into one curated centered column and its thread swaps to a near-vertical center stitch; below 48rem the timeline spine moves from the shell's center to 48px off the left edge and cards go full-width. The thread's cross-section handoffs are contracts — the hero exits its board at x ≈ 67% of the shell, the timeline spine picks it up at center — so the line never breaks between sections.

## Elevation & Depth

Depth is physical, not luminous. There is exactly one shadow in the world, `--pin-shadow` (`box-shadow: 0 2px 8px oklch(25% 0.015 60 / 0.15)`), a soft warm drop that means "paper hangs on cork". Interaction *reduces* it: hover presses paper toward the board (`0 1px 4px` at 0.18 + `translate: 0 1px`), active presses harder (`0 1px 2px` at 0.2, 2px down). Nothing ever lifts, glows, or blurs. The only other shadow in the build is the brass pin's own tight cast (`0 1px 3px` at 0.35) — part of the hardware — and the pins' sphere shading is a radial gradient, the one gradient family in the world.

The rest of depth is stacking order with a story: the thread runs *behind* the paper (z-index −1 inside an isolated stacking context for the long mid-page run) and surfaces only in the cork gaps between artifacts; pins and stamps sit above the paper; the flagship IHK card is pinned over the thread so the thread visibly slips beneath the certified document and re-emerges below it. Texture is a single feTurbulence fractal-noise grain (280px tile, 0.05 opacity) baked onto the cork — the one permitted texture.

### Shadow Vocabulary
- **Pin shadow** (`box-shadow: 0 2px 8px oklch(25% 0.015 60 / 0.15)`): every paper artifact at rest.
- **Pressed** (`box-shadow: 0 1px 4px oklch(25% 0.015 60 / 0.18)` + `translate: 0 1px`): hover/focus-within on interactive paper.
- **Pinned hard** (`box-shadow: 0 1px 2px oklch(25% 0.015 60 / 0.2)` + `translate: 0 2px`): active press.
- **Brass cast** (`box-shadow: 0 1px 3px oklch(25% 0.015 60 / 0.35)`): the pin hardware only.

### Named Rules
**The One Shadow Rule.** Every artifact hangs on the same pin shadow. Interaction presses paper toward the cork — shadows shrink on hover, they never grow, and nothing glows.

**The Behind-the-Paper Rule.** The thread runs behind the paper and never crosses printed text. It surfaces only where cork shows; where an artifact must sit over it (the flagship IHK card), the thread demonstratively dips beneath and re-emerges.

## Shapes

Paper is square-cut: 0 radius on every card, flyer, polaroid, button, and slip — sheets are guillotined, not die-cut. Circles belong exclusively to hardware and rubber: the 14px brass pin sphere, the 44px scroll-to-top pin, and the stamp's double ring (2px outer border + 1px inner ring inset 3px, both in stamp ink). Nothing in between — no pill buttons, no rounded chips.

The counter-form to the straight paper edge is the wavering hand line — but the thread is the exception that obeys physics instead: it is under tension, so it runs dead straight between pins and bends only in a small wrap (≈ the 7px pin radius) where it rounds a pin head; its one loose moment is the cut end's knot and tail. The hand waver belongs to everything actually drawn by hand: the headline rules under flyer titles (`M 3 6 C 40 2 70 9 146 4`), the hand-drawn arrow pointing at the mailto note, and the icon set. Icons follow one grammar (`src/icons/`): 24px viewBox, `stroke-width: 1.75`, `stroke: currentColor`, `fill: none`, round caps and joins, one or two paths per glyph with slightly-off coordinates so they read as inked by hand, not exported from a library. Machine edges for paper, hand waver for everything drawn — that tension is the form language. The filmstrip adds the one die-cut exception that proves the rule: sprocket holes punched through the paper strip as cork-colored dots.

## Components

### PinCard (the paper artifact)
The universal container: paper ground, pin shadow, 24px padding, a centered brass pin bridging the top edge (`top: -6px`), tilt step via `--tilt`. Three material variants, one face each:
- **typed** — aged-paper index card: Courier Prime on a printed ruling (red header rule at 40px, blue lines every 24px), top padding 48px to clear the header band. Used for the intro card, timeline entries, project specs, provenance, and the AI-practice record.
- **flyer** — poster stock: League Gothic, uppercase, line-height 0.92–0.95, nothing but headline material on the sheet (plus a hand-drawn thread rule). Used for section headlines, the title card/nav, the free-forever promise, and house rules.
- **print** — clean white print-out: Atkinson Hyperlegible, `tabular-nums`. Used for telemetry charts, the v3 rewrite card, GIFfer, and contact channel slips.

### Buttons (PinButton)
- **Shape:** square-cut paper note (0 radius) with a centered brass pin; tilt step like any artifact.
- **Primary:** paper background, ink text, bold typed face (700, 1rem), padding 16px 24px. The mailto (`jobs@lars-dev.org`) is the biggest pinned note in the contact corner.
- **Hover / Active:** the press-in treatment — shadow shrinks, the note translates 1px then 2px down, 150ms ease-out (motion-gated).
- **Focus:** the global ring — `outline: 2px solid var(--thread)`, offset 3px.
- There is no secondary or ghost button; secondary actions are thread-underlined links.

### HandNote (annotation)
Shantell Sans 500 in one of the six pride inks via `color: var(--ink-*)`, small rotation (−2° to +1.5°). Rides directly on a card's margin or, when freestanding on cork, on a paper slip (fit-content, pin shadow, 8–12px padding). Never body copy, never more than a sentence or two.

### Polaroid
Paper frame (12px sides, 16px chin), aged-paper photo well at `aspect-ratio: 8/9` (4/3 for the landscape VR sketch), image `object-fit: cover`, hand-face caption centered below, brass pin on top. Carries the Ayako portrait in the hero and projects, and hosts the site's one three.js touch: an ink-wireframe VR headset drawn on aged paper, drag-to-spin.

### Stamp
Circular rubber stamp for dates and marks: double ring, uppercase typed face, stamp ink = `color-mix(in oklab, var(--thread) 85%, var(--ink))` (darkened so small type holds 4.5:1 on cork). Free rotation in degrees. Grammar: `sub` above `label` — "as of / 2026-08-03", "IHK / 2025", "© 2026 / Lars Böse". Sizes 5–7.5rem via `--stamp-size`; the flagship timeline stamp is the largest.

### Thread (the signature)
*Der rote Faden* itself: SVG paths stroked 2.5px in `--thread`, round caps, `pathLength="1"`, with 3.5px dots where the path meets a pin. Decorative (`aria-hidden`), never interactive. **The Taut Thread Rule.** The thread is under tension: dead-straight runs pin to pin, and brass pins appear ONLY on cards (owner decisions, 2026-08-04). On the timeline there is no spine at all — each row emits one straight connector from its card's pin to the next card's pin (a stretched corner-to-corner SVG strip spanning the two pin x-positions, `stroke-dasharray: none` because Chromium mis-normalizes dashes on stretched viewBoxes). In the hero, `src/components/wall/taut.ts` generates the polyline with a ~7px wrap at each pin. The two section-seam junctions (join→first pin, last pin→wall-run) tuck their corners behind paper. The only slack is the cut end's knot. It layers at `z-index: -1` inside `main { isolation: isolate }`, so it runs behind every sheet and surfaces only on bare cork; a hand note sitting in its path gets a paper slip so thread never crosses ink. The sole slack is the cut end's knot. Straight segments also survive `preserveAspectRatio="none"` stretching exactly, which the old Béziers did not. **Motion:** where `@supports (animation-timeline: view())` holds and motion is welcome, the thread draws itself as the wall scrolls (dash-offset animation with `animation-range` tuned per segment so the tip hands over seamlessly between hero, joins, spine, and knot); stretched connector segments reveal by clip-wipe instead, because Chromium does not pathLength-normalize dashes under `vector-effect: non-scaling-stroke`. Everywhere else — reduced motion, older engines, no JS — the resolved state stands: fully drawn. The CSS default state *is* the drawn state; animation only rewinds it.

### Navigation (the title card)
A flyer PinCard pinned top-right (centered below 64rem): "Der Rote Faden" in the display face, a hand-drawn thread rule, then a single wrapping row of uppercase anchor links (1.375rem League Gothic) underlined in 30%-ink; hover swaps the underline to full thread color and thickens it 1.5px → 2.5px. No sticky header, no hamburger — the wall scrolls as one piece, with a brass scroll-to-top pin appearing after 480px.

### Channel cards (contact)
Small print-variant PinCards where the whole slip is one link: hand-inked icon (1.75rem, `currentColor`), bold typed label, soft-ink value, ≥44px hit target, hidden "(opens in new tab)" text. Hover/focus-within presses the slip into the cork like every interactive note. Five channels: GitHub, LinkedIn, XING, Indeed, WakaTime.

### Accent underline
The one link treatment on paper: ink-colored bold text underlined in `--thread` (1.5–2px, offset 3px); hover thickens the underline to 2.5px or tips the text into thread color. Used for repo links, in-card links, and — in a 30%-ink resting state — the nav.

### The Greeting (signature centerpiece)
The hero's handwritten greeting: motion-capable visitors watch the Lottie ink draw it (the pastel asset pressed into the paper via `filter: brightness(0.62) saturate(1.9)`); everyone else gets the designed resolved state — the same greeting hand-set as a signature, the name carrying all six pride inks in one stroke above a pride swash. **The Never-Blank Rule.** The handover is gated on the player reporting ≥92 % of its frames drawn, not on the svg merely existing: this asset draws on from nothing over ~5.7 s, so an earlier swap would serve an empty card to screenshot bots, social-card crawlers and anyone on a slow chunk. The card therefore holds the hand-set signature and settles into the drawn one — never empty, never half-written. This artifact survives every redesign.

### Telemetry print-outs
Chart sheets as print PinCards: SSR ECharts SVG on paper ground, series in the deterministic pride-ink palette, labels in the body face with values in ink (never in the series color), a soft-ink unit line under the title, a handwritten margin note quoting the headline figure in its subject's own series ink, an as-of stamp where a figure stands alone, and a `<details>` "Data as a table" fold for assistive tech. Dense seven-day sheets pan horizontally (keyboard-reachable via tabindex) instead of shrinking their type.

### Named Rules
**The Resolved State Rule.** Every animation is a progressive enhancement over a designed resolved state — the thread fully drawn, the greeting hand-set, tilts already applied. Reduced motion, missing `animation-timeline` support, or failed JS must land on a state that was designed, not degraded.

**The 150ms Settle Rule.** Micro-motion is one gesture: 150ms ease-out. Hover settles a pinned artifact's tilt toward 0.35× and presses it toward the cork. Nothing bounces, springs, or runs longer than 150ms except the scroll-driven thread.

## Do's and Don'ts

### Do:
- **Do** pin every new artifact properly: paper or aged-paper ground, the single pin shadow, a brass pin bridging the top edge, and a tilt step from {−1, 0, 1} — neighbors never share a tilt.
- **Do** set every figure with its unit and as-of date, and stamp standalone dates ("as of" sub + ISO date). A number without provenance doesn't go on the wall.
- **Do** keep handwritten pride ink on paper — put freestanding notes on paper slips; green, violet, and blue do not clear 4.5:1 on raw cork.
- **Do** design the resolved state first and gate motion behind `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`; the CSS default state is the finished one.
- **Do** draw new icons in the house grammar: 24px viewBox, stroke 1.75, `currentColor`, round caps and joins, a deliberate waver in every path.
- **Do** keep the wall's German artifacts German with `lang="de"` — "Werdegang", "2010 – heute", the HEUTE stamp — the market literacy is part of the design.

### Don't:
- **Don't** use glass, blur, glow, gradient text, or dark surfaces — the world explicitly refused the dark-neon dashboard; the only gradients alive are the brass sphere and the printed card rulings.
- **Don't** add kickers or eyebrow labels above headings. A flyer carries its headline, a hand-drawn thread rule, and at most one dateline.
- **Don't** mix faces inside one artifact — no Courier on a flyer, no League Gothic on an index card, no hand face as body copy.
- **Don't** put facts on the house-rules flyer: it carries values only; every measured claim lives on the quiet typed record card beside it.
- **Don't** move the free-forever promise off Ayako's cluster — it is Ayako's own flyer, quoted, with the license line on the v3 card, never a site-wide banner.
- **Don't** let the AI-workflow story outscale the human record: it stays a subordinate typed index card; the values flyer stays the louder artifact.
- **Don't** let the thread cross printed text or sit above paper — it runs behind and surfaces in cork gaps only.
- **Don't** introduce a second red or spend `--thread` on fills; it is thread, stamp ink, focus ring, and underline — its scarcity is the structure.
