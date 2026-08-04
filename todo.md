# Todo

## Resolved by the Rote-Faden rebuild (2026-08-04)

- [x] House rules ≠ product promises — free-forever lives only on Ayako's flyer; house rules carry values only (verdict-pass verified).
- [x] Custom ink icons replace tabler — hand-inked local set in `src/icons/`; tabler include dropped from `astro.config.mjs`.
- [x] `/Raleo.webp` 404 — timeline uses `public/raleo-initials.svg`.
- [x] `favicon.ico`/`favicon.png` dead links — layout references only the existing `favicon.svg`.
- [x] Dead data-layer code — `getRepos.ts` and `getStatusBar.ts` deleted; WakaTime scripts fall back to the checked-in snapshot instead of throwing.
- [x] Starter `README.md` — replaced with the real project README.
- [x] `site: "https://astro.build"` placeholder — now `https://lars-dev.org`; canonical/OG/sitemap correct in the built output.
- [x] Disclosure IDs breaking past 26 entries — the checkbox-modal component no longer exists.
- [x] Stale figures (5,045 h; ~2,500 h Ayako; "1,800+ files / 99,000+ lines") — replaced by 2026-08-03 measured values with as-of dates; derived percents recomputed against the wall's own total.

## Resolved by the faculty cycle (2026-08-04, restore point 5)

Eleven discipline professors researched their fields, then judged the wall; the
convergence was measured, not voted. Everything below was verified before and
after, not asserted.

- [x] **The wall had no light.** cork/paper was 1.38:1 — the same value — so 94.7 %
      of the page sat in one tonal band and bare cork could never read as
      deliberate space. Shadows fell straight down while the brass speculars
      pointed upper-left. Now 1.87:1, one lamp, everything falls down-and-right,
      and `--lift` gives paper/polaroid/sticker their own thickness.
- [x] **The rules ignored their own text** — every baseline sat exactly 7px above
      its printed rule, everywhere. Now registered to 0.29px.
- [x] **No type scale** — 64 hand-typed sizes across 11 unrelated `clamp()` curves,
      six pairs of which swapped rank on resize. One fluid ladder; 0 raw sizes left.
- [x] **The thread quit at 37 %** — from y≈4,200 to the knot it was a `<span>` at
      `left:50%` touching 1 of 19 pins by coincidence. Now measured from the pins
      at runtime, 25 of 25, terminating on the address.
- [x] **The signature contained none of the pride inks** — sampled: top two stroke
      colours neutral grey, 10.3 % pure red, 33 % matching a declared ink. Now
      99.6 % / 0.1 %. The Lottie also drew for 10s inside `display:none`.
- [x] **The ink key arrived after the code was spent** (85.4 % of the page, after 21
      of 23 coded notes). Now declared at 10.3 % and confirmed in Practice.
- [x] **The AI card outscaled the human record**, against the site's own rule —
      897,376px² → 221,632px², now under the values flyer.
- [x] **The habit grid asserted a 164-day gap that does not exist** (cells fill in
      sequence, so the empty ones stacked at the end of a date-labelled grid).
- [x] **German numbers were formatted en-US** — "8,357 Servern" reads as
      *eight point three five seven* to a German eye. Fixed at the source.
- [x] **Availability** — the site never said what he wants. Owner-approved
      "Right now" card: employed at Raleo, not urgently looking, open to
      TypeScript/Node product work, remote or Bodensee-Ravensburg. No notice
      period (not supplied). No photo (declined).

## Open — owner decisions before public deploy

- [ ] **The 35-item publication gate** — content pack §7, preserved at `~/.claude/projects/-home-main--claude-cv-astro/memory/content-pack-2026-08-03.md` (kept outside the repo on purpose: it contains the do-not-publish list). Kiyu figure basis, Raleo description level, town vs region, license wording, VR repo link checks, etc. Nothing confirmWithUser-tagged shipped in v1 except the three explicitly approved items.
- [ ] **Reviewer's minor list:** as-of appears twice on chart cards (line + stamp); "TypeScript: 3,019.9 h" annotation duplicates the bar label; "Lifetime daily average: 3 h 27 m" should name its basis (per active day); name renders three ways (Boese / Böse / Lars B.) — confirm platform-accuracy is intentional; leftism reads implicit rather than open — deliberate narrowing, owner may want one louder line; contact section's dead cork / floating © stamp.
- [ ] **og:image** — `public/` has no raster social card; shares render without an image. Author one in the wall's grammar.
- [ ] **WakaTime profile** still private and says Berlin — flip public + fix location so the site's figures become third-party verifiable (content-pack items 3/35).
- [ ] **Re-measure at publish time** — re-pull WakaTime (set `WAKA_KEY`), re-count Ayako servers/users, update `src/data/snapshot.ts` so every as-of is launch-fresh.
- [ ] **Commit strategy** — the whole redesign sits uncommitted in the working tree (67 changed/new paths); pnpm-lock.yaml is out of sync with package.json (npm added `three`, `@types/three`, `@unocss/astro`; a local package-lock.json exists). Decide the canonical lockfile before committing.

## What the blind panel says now (iteration 6, 6/10, mean rank 2.0 of 11)

The five-round refrain — "four type families and four marker colours", "six
competing hues", "a rainbow gradient with no system behind it", "accumulated
rather than composed", "large dead tan areas", "threads that connect cards
without establishing a reading order" — **did not appear once**. One judge:
"the pinboard is genuinely designed rather than assembled: one type system,
one accent, a reading order that holds."

Three new objections replaced them. Two are addressable, one is the owner's:

- [ ] **"Effort, not outcome."** Three judges, independently, attacked the
      telemetry — the site's proudest asset. *"tracked hours measures effort,
      not outcome"*; *"can read as self-surveillance and effort theatre"*;
      *"flirts with proving diligence to people who were going to ask about
      impact."* The fix is framing, not deletion: lead with what the work
      achieved (8,357 servers in production since 2019, **7 generations across
      3 Discord libraries** survived, 7,000-server load test, <200 ms server
      switch, >95 % cache hit, 5/5 rating, the free promise held six years) and
      let the hours corroborate underneath.
- [ ] **"One employer, one product, no team."** Four judges. The refuting
      evidence is already on the wall but framed as *education* rather than
      *work*: three years employed at Columbus Interactive GmbH, **72
      countersigned weekly reports** (i.e. three years of someone else reviewing
      the work weekly), a company-certified final project, and Raleo since 2025.
- [ ] **The anime avatar.** Four of the six judges who PICKED the site named it
      as the thing that nearly cost the invitation — "a coin flip in front of a
      panel", "a hobbyist's bedroom wall". Owner commitment; not up for
      negotiation by me. Recorded here because it is the single most-cited risk
      and the owner should decide with the evidence in front of him.

**Methodology note:** the judge personas for iterations 1–5 were never
persisted, so per-judge continuity with those rounds is invalid — only the
aggregate is comparable. The ten personas are now stored at
`bench/personas.json` in the session scratchpad, and rounds are rebuilt from a
seed, so iteration 7 onward is reproducible.

## Improvements

- [ ] **Bilingual EN/DE.** Add an i18n layer with an EN/DE switcher. Wall copy now lives centrally in `src/data/wall.ts`, which makes extraction far cheaper than before. Needs: locale routing or client switch, translated meta/OG per locale, `hreflang`, locale-aware sitemap. Proper nouns and the IHK credential name stay untranslated. Confirmed direction — not yet scheduled.
