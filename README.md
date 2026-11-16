# lars-dev.org

Source of [lars-dev.org](https://lars-dev.org), the portfolio and CV of Lars Böse (Larsundso).

One prerendered page set as a printed atlas. Two parts of it are drawn with three.js: a globe in the
hero that shows the gateway events of the Discord bot Ayako by type and approximate origin, and a
relief chart further down that shows the hours WakaTime has tracked as islands, one per language or
project.

## Stack

- [SvelteKit 3](https://svelte.dev/docs/kit) with `adapter-static`: the whole site is prerendered to `dist/`
- Svelte 5 in runes mode
- UnoCSS
- three.js, loaded lazily for the globe and the hours chart; without WebGL2 the globe falls back to a still image and the chart to its table

## Data

Every visible string lives in `src/lib/content.ts`. Two scripts run before each build and refresh the
figures. Each keeps the last good file when a read fails, so the build never depends on the network.

- `scripts/stats.mjs` reads Ayako's public statistics into `src/lib/stats.json` and the globe's
  snapshot into `static/globe-snapshot.json`.
- `scripts/waka.mjs` reads the tracked hours into `src/lib/hours.json`. It needs `WAKA_TOKEN`, a
  WakaTime OAuth access token with the scope `read_stats` (see `.env.example`). WakaTime's API keys
  no longer read anything. A language or a project is written to the file only with more than 10
  hours, and the names listed in `STRUCK` are never written.

The globe's live stream comes from `https://api.ayakobot.com/bot` and answers only to lars-dev.org,
so a local build shows the snapshot. Set the environment variable `GLOBE_API` at build time to point
the globe at another base.

## Commands

```sh
pnpm install
pnpm dev      # dev server
pnpm check    # svelte-check
pnpm build    # refresh the data, then build to dist/
pnpm preview  # serve the build locally
```

## Contact

jobs@lars-dev.org
