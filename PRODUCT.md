# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: employers and recruiters in the German hiring market, evaluating Lars Böse as a full-stack developer hire. They arrive from a job platform profile (XING, LinkedIn, Indeed) or from an application, and are doing a verification pass — checking whether the person behind the CV is real, current, and as capable as the profile claims. They skim first and read second, and they cross-reference what they find here against the other profiles.

No secondary audience is confirmed. Client acquisition is explicitly not the job of this site.

## Product Purpose

A personal CV and portfolio site (lars-dev.org) that establishes Lars Böse as a credible, currently-active full-stack developer worth contacting. Success is a recruiter or hiring manager reaching out through one of the contact channels — or arriving at an interview already convinced by the evidence on the page.

## Positioning

Two claims that hold together, and that a neighbouring developer portfolio cannot truthfully copy:

1. **Proof by live telemetry.** The site publishes real, continuously updating WakaTime coding hours and GitHub activity, pulled from the APIs rather than written by hand. The claim of being an active developer is verifiable on the page instead of asserted.
2. **Long-haul depth.** Ayako, carried since 2019 from a single JavaScript file into a TypeScript monolith of 1,800+ files and 99,000+ lines running Prisma, PostgreSQL, Redis and ffmpeg under real throughput. Sustained ownership of one production system, not a grid of demo projects.

Neither claim stands alone: the telemetry shows the work is current, the project shows it goes deep.

## Operating Context

- Visitors evaluate on a schedule that is not theirs — between applications, often on mobile, frequently with a competing tab open on another candidate.
- German hiring conventions apply: the IHK (Chamber of Industry and Commerce) certification is a credential that German employers recognise on sight, and XING and Indeed are live parts of the evaluation path alongside LinkedIn.
- The record on this site is checked against the same facts published on those profiles, so employment dates, employers, and education must stay consistent with them.
- Telemetry is fetched at build time; the page a visitor sees is as current as the last deploy.

## Capabilities and Constraints

- Astro 5 + Svelte 5 with UnoCSS, deployed through the Cloudflare adapter. ECharts renders the activity charts in SVG.
- Live data sources: WakaTime (`WAKA_KEY`) for coding-time totals, insights, and summaries; GitHub via Octokit (`GH_KEY`) for repository activity.
- `src/components/scripts/getRepos.ts` currently short-circuits with an early `return` — the GitHub repository fetch is effectively disabled and the site runs on the committed record instead.
- Career and project record lives in `src/assets/repos.json`; education in `src/assets/edu.json`. Organisation logos are real assets in `public/*.webp`.
- Current position: employed at Raleo Digital GmbH since July 2025. Prior: Columbus-Interactive (2022–July 2025). Freelancing runs alongside from 2022. These are employment facts, not company positioning — the site represents Lars, not Raleo.
- **Open decision — bilingual EN/DE.** Committed in direction, not yet built: there is no i18n layer and every string is hard-coded English. Tracked in `todo.md`. Until it lands, new copy must not be written in ways that make extraction expensive.

## Brand Commitments

- Name shown publicly as "Lars B." / Lars Böse; canonical site `lars-dev.org`.
- Contact channels that must stay reachable and correct: `jobs@lars-dev.org`, GitHub `Larsundso`, LinkedIn, XING, Indeed, WakaTime `@Larsundso`.
- The IHK certification links to the official IHK Schwaben page for Fachinformatiker Anwendungsentwicklung; the credential is stated in English as "Chamber of Industry and Commerce certified IT specialist for application development."
- **Full personality, on purpose (confirmed 2026-08-03).** The site presents a human, not a neutral CV: Ayako and the free-time work (VR/VRChat tooling, bots) are identity, and **queer-friendliness and leftism are defining traits** the site may express openly. An employer put off by that is a mismatch by design.
- **The Lottie greeting survives.** The handwritten animated "Hi, I'm Lars Böse" (already in pride colors) is retained in some form in every redesign.
- **Claims gate (owner-confirmed 2026-08-03):** Ayako may be stated at real scale ("2.4m users on 8.3k servers, solo, in-prod since 2019" — matches the public GitHub bio). **Kiyu may be named publicly** with its scale (10,000+ servers). The AI-native workflow story (2,144 Claude Code sessions across 44 projects, custom tooling) is publishable.
- **Sacred in redesigns:** live telemetry charts (rendering may change, centrality may not), German-market links as first-class citizens. Single-page is NOT required; multi-page is allowed.
- **Technical taste constraints:** three.js is welcome as an accent, never as the site's foundation. CSS features must compose into one coherent picture, not stack as separate effects. The craft bar: well-versed frontend developers should be impressed.
- Ayako stays free and open source — a public promise; the site must never imply otherwise.

## Evidence on Hand

Real and usable:

- WakaTime coding-time totals, yearly insights, and recent summaries, live from the API.
- GitHub account and public repository activity under `Larsundso`.
- Employment and project history with dates, tech stacks, and per-repo task breakdowns in `src/assets/repos.json`.
- Education history with dates and institution logos in `src/assets/edu.json` and `public/*.webp`.
- The IHK certification, verifiable via the linked official page.

Absent — future work must not fabricate these:

- No testimonials, references, or quotes from employers, colleagues, or clients.
- No case studies, client names, or delivery metrics beyond what `repos.json` records.
- No awards, press, certifications beyond the IHK credential, or user/download counts for any project.

## Product Principles

1. **Every number is traceable.** Figures on this page come from a live source or the committed record — never estimated, rounded up, or written for effect. The verifiability is the whole point of showing them.
2. **The claim lands before the scroll.** A recruiter decides in the first seconds whether to keep reading; the evidence that this developer is current and deep has to be legible immediately, not assembled from the whole page.
3. **Depth beats inventory.** One system carried for six years says more than a wall of samples. Give sustained work the room its story needs.
4. **German-market literate.** IHK, XING, Indeed, and eventual German-language reach are part of being qualified for this audience, not decoration on an English site.
5. **Copy is content, not chrome.** Every string must survive translation and record updates without a redesign — the record changes as the career does.
