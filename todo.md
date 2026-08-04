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

## Open — owner decisions before public deploy

- [ ] **The 35-item publication gate** — content pack §7, preserved at `~/.claude/projects/-home-main--claude-cv-astro/memory/content-pack-2026-08-03.md` (kept outside the repo on purpose: it contains the do-not-publish list). Kiyu figure basis, Raleo description level, town vs region, license wording, VR repo link checks, etc. Nothing confirmWithUser-tagged shipped in v1 except the three explicitly approved items.
- [ ] **Reviewer's minor list:** as-of appears twice on chart cards (line + stamp); "TypeScript: 3,019.9 h" annotation duplicates the bar label; "Lifetime daily average: 3 h 27 m" should name its basis (per active day); name renders three ways (Boese / Böse / Lars B.) — confirm platform-accuracy is intentional; leftism reads implicit rather than open — deliberate narrowing, owner may want one louder line; contact section's dead cork / floating © stamp.
- [ ] **og:image** — `public/` has no raster social card; shares render without an image. Author one in the wall's grammar.
- [ ] **WakaTime profile** still private and says Berlin — flip public + fix location so the site's figures become third-party verifiable (content-pack items 3/35).
- [ ] **Re-measure at publish time** — re-pull WakaTime (set `WAKA_KEY`), re-count Ayako servers/users, update `src/data/snapshot.ts` so every as-of is launch-fresh.
- [ ] **Commit strategy** — the whole redesign sits uncommitted in the working tree (67 changed/new paths); pnpm-lock.yaml is out of sync with package.json (npm added `three`, `@types/three`, `@unocss/astro`; a local package-lock.json exists). Decide the canonical lockfile before committing.

## Improvements

- [ ] **Bilingual EN/DE.** Add an i18n layer with an EN/DE switcher. Wall copy now lives centrally in `src/data/wall.ts`, which makes extraction far cheaper than before. Needs: locale routing or client switch, translated meta/OG per locale, `hreflang`, locale-aware sitemap. Proper nouns and the IHK credential name stay untranslated. Confirmed direction — not yet scheduled.
