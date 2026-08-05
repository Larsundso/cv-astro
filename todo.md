# Todo

## Status: the review process was reset on 2026-08-05

Everything the panel and the faculty concluded before this date was produced by a
harness that showed judges **one 1440×900 screenshot** — a fold, not a site. A later
"full site" fix was itself truncated to 44 % of the page. Both produced plausible
numbers measured against the wrong object, so the *conclusions* were discarded and the
cycle count restarted at 1.

The *code* was not reverted, deliberately: the defects fixed along the way were
measured facts, not opinions (see the log below), and reverting verified fixes because
the judging was flawed would be self-harm.

**Harness now in force** — `scratchpad/faculty/site-shots.mjs`:

- Frames are viewport screenshots at successive scroll offsets, never `fullPage`.
  Measured cause: at scroll 0, **28 of 40 `.thread-path` elements are 0 % drawn**, so a
  full-page render erases the red thread — the entire concept of the site.
- Coverage is derived from the page height and **asserted at 100 %**; anything less is
  a hard failure that blocks the review from starting.
- Four passes, all at 100 %: English 13 073 px (15 frames), German 13 498 px (15),
  English `prefers-reduced-motion` (15, thread resolved to 1.00 for judging
  composition), phone 390×844 19 279 px (23).
- Always captured from a production build (`astro build` + `astro preview`), never the
  dev server, which has served stale CSS more than once.

## Measured defects fixed (facts, independent of who was judging)

- [x] **The wall had no light.** Cork/paper was 1.38:1 — the same value — so 94.7 % of
      the page sat in one tonal band. Shadows fell straight down while the brass
      speculars pointed upper-left. Now 1.87:1, one lamp, everything falls
      down-and-right, and `--lift` gives paper, polaroid and sticker their own
      thickness. (`--pin-shadow` was declared on `:root`, which made `--lift` inert
      wall-wide — `var()` substitutes on the element that declares the property.)
- [x] **The rules ignored their own text** — every baseline sat exactly 7 px above its
      printed rule, everywhere. Now registered to 0.29 px.
- [x] **No type scale** — 64 hand-typed sizes across 11 unrelated `clamp()` curves, six
      pairs of which swapped rank on resize. Now one fluid ladder, 0 raw sizes left.
- [x] **The thread quit at 37 %** — below y≈4 200 it was a `<span>` at `left:50%`
      touching 1 of 19 pins by coincidence. Now measured from the pins at runtime,
      25 of 25, terminating on the address.
- [x] **The signature contained none of the pride inks** — sampled: top two stroke
      colours neutral grey, 10.3 % pure red. Now 99.6 % declared ink. The Lottie also
      drew for 10 s inside `display:none`.
- [x] **The ink key arrived after the code was spent** (85.4 % of the page, after 21 of
      23 coded notes). Now declared at 10.3 % and confirmed in Practice.
- [x] **The AI card outscaled the human record**, against the site's own rule —
      897,376 px² → 221,632 px², now under the values flyer.
- [x] **The habit grid asserted a 164-day gap that does not exist** (cells fill in
      sequence, so the empty ones stacked at the end of a date-labelled grid).
- [x] **German numbers were formatted en-US** — "8,357 Servern" reads as *eight point
      three five seven* to a German eye. Fixed at the source.
- [x] **Stamps fell below AA** after the cork was darkened (3.82:1 against a 4.5
      floor) — a regression introduced by the fix above. Now ≥ 4.77:1, 0 failures
      across ~290 runs per locale.
- [x] **Horizontal throw between consecutive cards** — Projects 612 px median → 51,
      Telemetry 612 → 204, Practice 663 → 188, Contact 488 → 244. DOM order now equals
      visual order.
- [x] **Availability was never stated.** Owner-approved "Right now" card: employed at
      Raleo, not urgently looking, open to TypeScript/Node product work, remote or
      Bodensee-Ravensburg. No notice period (not supplied). No photo (declined).

## Superseded — conclusions from the fold-only harness

Kept only so the same ground is not re-trodden as if it were new. **These are
first-impression scores from a harness that saw one screen of a 13 073 px page, and
none of them may be cited as a finding about the site.**

- Rounds 1–7: single 1440×900 screenshot per candidate. Iteration 8: 44 % coverage.
- The five-round refrain those rounds produced — "four type families and four marker
  colours", "six competing hues", "a rainbow gradient with no system behind it",
  "accumulated rather than composed", "large dead tan areas" — stopped appearing after
  the light and type work, but the comparison is not valid across the harness change.
- Objections recorded then, to be re-tested honestly by the new faculty, not assumed:
  effort-versus-outcome framing of the telemetry; one employer / one product / no
  team; and the anime avatar, which is the owner's commitment and not open to removal.
- Personas for rounds 1–5 were never persisted, so per-judge continuity with those
  rounds is invalid in any case.

## Cycle 1 applied (2026-08-05) — restore points 7-10

Twelve discipline professors, each researching their field before judging, all 53 frames
at asserted 100 % coverage. Four independent measurements found one cause for "still not
incredibly happy with the look of it": **one band did all the work, so nothing had rank.**

- [x] **The board was not a material.** Grain sat at 31-248 cycles/degree against a
      contrast-sensitivity peak of 2-5 — real noise, placed where the eye cannot resolve
      it. Three layers at cork's actual frequencies: sigma 1.15 -> 6.7/255, sigma16/sigma1
      0.148 -> 0.43, chroma SD 0.2 -> 2.2.
- [x] **The wash ran against the reading order.** At 105deg, 71 % of the falloff was
      vertical, so paper-on-cork was 1.711:1 at the top and 2.328:1 at the bottom. At
      90deg the vertical swing is 0.101.
- [x] **Contrast was measured against the token, not the render.** Stamp ink was 4.771:1
      against `--cork` and 4.185:1 against the darkest painted pixel; the old audit passed
      only because all 13 bare-cork stamps sit in the top third. Now 4.736:1 on the
      darkest board, cork/paper 1.881.
- [x] **The thread was cut** at the hero->timeline junction at every width, in the
      resolved state — `calc(50% - 76px)` against a spine at `calc(50% - 152px)`. One
      `--spine-x` token; join-to-spine 0.0px at thirteen widths.
- [x] **The thread never pointed forward.** It completed when its destination pin reached
      55 % of viewport, so the bottom third of every screen had none and the tip sat
      behind a card in 10 of 11 positions. Now `entry 0% entry 85%`: the tip reaches
      >=101 % of viewport height at every sampled offset, motion on.
- [x] **The thread was weightless** — 2.5px on a 1425px plane, behind every card. Now 4px
      with a `.wall-tips` layer that lifts the last 90px onto the paper to wrap each pin.
- [x] **Three of four faces spoke at 16px.** Bands restored: nodes at 16px 115/243 -> 85,
      faces there 3 -> 2, Courier's glyph area 42.5 % -> 38.4 %. Cost +5.4 % page height.
- [x] **The wall had no dark** — the mid-dark register held 1.46 %. Five section flyers on
      dark stock (12.33:1), a dark mass every ~2,600px.
- [x] **The lamp lit the wall and skipped the paper** — every sheet a flat fill, sampled
      spread 0.00000. Now a translucent modulation plus a zero-offset contact shadow.
- [x] **Shade was warmer than the surface it darkened.** `--shade` now cool: chroma drains
      2.7x faster than lightness, no blue visible.
- [x] **The focus ring failed on cork** (1.60-2.84:1) — the one a11y failure with no
      fallback, on the conversion path. Paper halo: 5.94-6.19:1 across 33 focusables.
- [x] **The phone had no wayfinding.** All five rail ticks computed 0x0; the only
      persistent control pointed backwards. Bottom strip, proportional ticks, and a
      permanent `jobs@lars-dev.org` chip.
- [x] **A scroll dead zone** — `touch-action: none` on a 323x245 canvas at 60 % phone
      depth, captioned "drag to spin". Now `pan-y`.
- [x] **768px matched both `48rem` branches** — iPad portrait got a layout that existed at
      exactly one width.
- [x] **Identity** — schema.org published "Lars Boese" against a title of Böse, with a raw
      non-ASCII byte in the LinkedIn URL. Now one record; the drawn signature stays ASCII.
- [x] **Four German runs untagged on the English page**, including the credential a screen
      reader reads first — while the decorative German was correctly tagged.
- [x] **Schooling ate screens 2-3** (648px, three cards) — now one card, first employment
      at 17.8 % depth.
- [x] **No seniority anchor**, so screeners computed one year post-qualification from the
      apprenticeship dates. Six years eight months, printed with its span. (HR proposed
      "seven years"; that rounds up, and this wall does not.)
- [x] **A raw NUL byte in `Timeline.astro`** made `file` report it as binary and `grep -r`
      silently skip it — so any "grep returns zero in src/" finding needs Python to confirm.
- [x] **Region-level violation** — "Bodensee-Ravensburg" named a town (5 disciplines).
- [x] **German claimed uninterrupted uptime** four frames before admitting outages.
- [x] **"The 4 most-tracked languages" was false** — Vue.js is rank 6; JSON at 4.79 % had
      been removed by hand. Relabelled, and the missing 22.2 % of the record now has a row.

## Carried into cycle 2 — found, measured, not yet applied

- [ ] **Chart text collapses to 7.34px at 320** (the reflow target). Rendering the two bar
      charts as HTML instead of SSR ECharts SVG would also *remove* a dependency.
- [ ] **No `@media print` anywhere** — printing yields ~15 A4 pages of cork, and German
      hiring moves `Bewerbungsunterlagen` as files.
- [ ] **The Ayako caption sits 533px below its image on desktop**, outside the viewport, so
      Projects opens on an uncaptioned portrait. The phone build already does this right.
      Six disciplines say the mitigation is framing, never shrinking.
- [ ] **The AI adoption curve is folded shut** (6.26 -> 32.46 -> 68.56 -> 69.76 %) while a
      habit grid gets 757x665px. An argument behind a fold is forfeited; a table is not.
- [ ] **37 merged upstream PRs render nowhere** — the only evidence on the wall that is
      neither self-measured nor self-authored.
- [ ] **Telemetry bar 2 is filled with paper cream**, so a 51.55:48.45 split reads as
      100:0 pre-attentively.
- [ ] **Amber — the ink declared for "where does this claim stop?" — is used once**, while
      every real limit on the wall is set in grey.
- [ ] The ink key's placement (three disciplines, three prescriptions); the duplicate
      "Sections" landmark; `63.999rem` vs `63.9375rem` in two files; 26 elements
      overflowing at 320px under `overflow-x: clip`.

## Open — owner decisions before public deploy

- [ ] **The 35-item publication gate** — content pack §7, held at
      `~/.claude/projects/-home-main--claude-cv-astro/memory/content-pack-2026-08-03.md`
      (kept outside the repo on purpose: it contains the do-not-publish list). Kiyu
      figure basis, Raleo description level, town vs region, licence wording, VR repo
      link checks. Nothing `confirmWithUser`-tagged has shipped except the three
      explicitly approved items.
- [ ] **Reviewer's minor list:** as-of appears twice on chart cards (line + stamp);
      the "TypeScript: 3,019.9 h" annotation duplicates the bar label; "Lifetime daily
      average: 3 h 27 m" should name its basis (per active day); the name renders three
      ways (Boese / Böse / Lars B.) — confirm the platform-accuracy is intentional;
      leftism reads implicit rather than open — deliberate narrowing, owner may want
      one louder line; the contact section's dead cork and floating © stamp.
- [ ] **og:image** — `public/` has no raster social card; shares render without an
      image. Author one in the wall's grammar.
- [ ] **WakaTime profile** still private and says Berlin — flip public and fix the
      location so the site's figures become third-party verifiable.
- [ ] **Re-measure at publish time** — re-pull WakaTime (set `WAKA_KEY`), re-count
      Ayako servers and users, update `src/data/snapshot.ts` so every as-of is fresh.
- [ ] **Lockfile** — `pnpm-lock.yaml` is out of sync with `package.json` and a
      `package-lock.json` also exists. Decide the canonical one.

## Improvements

- [ ] **Bilingual EN/DE** is built; the remaining work is translated meta/OG per
      locale, `hreflang`, and a locale-aware sitemap. Proper nouns and the IHK
      credential name stay untranslated.
