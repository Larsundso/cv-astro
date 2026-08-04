# lars-dev.org

Source of [lars-dev.org](https://lars-dev.org) — the portfolio and CV of Lars Böse (Larsundso).

The site is designed as **Der Rote Faden**: a pinboard wall of typed index cards, polaroids, and handwritten annotations on cork, stitched chronologically by one crimson thread from December 2019 to the latest commit. Every figure on the wall carries its unit and an as-of date.

## Stack

- [Astro 5](https://astro.build) — static output, all sections prerendered
- Svelte 5 — a single `client:visible` island (the VR wireframe sketch, three.js quarantined in its own lazy chunk)
- UnoCSS — utilities bound to the CSS custom properties in `src/styles/wall.css`
- Deployed on Cloudflare

## Data

Headline telemetry is fetched from the WakaTime API at build time when `WAKA_KEY` is set (see `.env.example`). Without it, the build renders the checked-in snapshot in `src/data/snapshot.ts`, dated 2026-08-03 and labeled as such on the page. Site copy lives in `src/data/wall.ts`; a re-pull updates every figure through one file.

## Commands

```sh
pnpm install
pnpm dev      # dev server
pnpm build    # static build to dist/
pnpm preview  # serve the build locally
```

## Contact

jobs@lars-dev.org
