/**
 * Checked-in snapshot of every publishable figure on the wall.
 *
 * Single source of truth for build-time fallbacks (no WAKA_KEY) and for all
 * static copy in `src/data/wall.ts`. Every figure carries its unit and its
 * as-of date; components must render both (voice law).
 *
 * Sources:
 * - WakaTime API pull, 2026-08-03 (supersedes the 2026-07-06 snapshot).
 * - GitHub authenticated pull, 2026-08-03.
 * - Ayako ops figures, 2026-08-03 (re-pull before major re-publications).
 * - IHK paper trail: signed company confirmation dated 2025-06-01,
 *   project documentation (DBD-Doku), 72 countersigned weekly reports.
 * - Claude Code archive census, 2026-08-03.
 *
 * Figures that are BANNED site-wide and must never re-enter this file:
 * the stale pre-2026-08 lifetime-hours total; the approximate Ayako-hours
 * estimate; any editor-time percentage stated as a lifetime claim; any
 * WakaTime leaderboard rank; "37 merged upstream pull requests" (see
 * `github.mergedUpstream`); and "6.75 % AI" (see
 * `telemetry.aiCoding.sharePercentByWindow`). The last two are banned for
 * the same reason: each is a real number attached to the wrong
 * denominator, and each fails the first check a sceptic can run.
 *
 * Window discipline: "currently" copy uses the July-2026 window
 * (`windowJuly2026`), career copy uses the lifetime window — never mixed.
 */

/** ISO calendar date, YYYY-MM-DD. */
export type IsoDate = string;

/** A tracked amount of time with its exact display string. */
export interface Measured {
	seconds: number;
	/** Display string for copy, e.g. "5,432 h 47 m". */
	display: string;
}

/** A language's share of lifetime tracked time. */
export interface LanguageShare {
	name: string;
	hours: number;
	seconds: number;
	/**
	 * Share of lifetime tracked time in percent. TypeScript's value is as
	 * stated by the 2026-08-03 pull; the others are derived from published
	 * hours over the published lifetime total, rounded to 2 decimals.
	 */
	percent: number;
	derived: boolean;
}

/** The authoritative pull date for every figure in this file. */
export const SNAPSHOT_AS_OF: IsoDate = "2026-08-03";

/* ------------------------------------------------------------------ */
/* Telemetry — WakaTime API pull, 2026-08-03                           */
/* ------------------------------------------------------------------ */

export const telemetry = {
	asOf: SNAPSHOT_AS_OF,
	source: "WakaTime API pull, 2026-08-03",
	/** Continuous tracking span. */
	trackingStart: "2021-10-29" as IsoDate,
	trackingEnd: SNAPSHOT_AS_OF,

	/**
	 * WHAT A SCEPTIC CAN CHECK WITHOUT A KEY — and what he cannot.
	 *
	 * The wall promises, in the ink reserved for provenance, that it can show
	 * the source for every figure "including the ones that do not flatter me".
	 * It then named the instrument and gave no address. This is the address,
	 * plus the honest limit, because the obvious attempt to verify the
	 * headline currently produces evidence AGAINST the owner:
	 *
	 * Re-run 2026-08-05, unauthenticated: `GET /stats/all_time` → HTTP 200,
	 * but `is_coding_activity_visible: false`, so `total_seconds`,
	 * `daily_average`, `start` and `end` are absent from the payload. The
	 * per-language SHARES are published and they match this snapshot within
	 * 0.05 pp (live TypeScript 55.64 vs published 55.59; JavaScript 13.38 vs
	 * 13.39; Svelte 5.55 vs 5.56; Vue.js 3.24 vs 3.24).
	 *
	 * The only reconstruction of the TOTAL left to a reader is to add up the
	 * per-language `ai_coding_seconds + manual_coding_seconds`. That sums to
	 * 18,958,694 s — 599,326 s short of the published total, because those
	 * rows do not carry the "Other" bucket (published share 4.09 %, implying
	 * ~222 h, against 47 h of ai + manual in that row). A reader who does the
	 * arithmetic therefore lands 166 h low and concludes the headline is
	 * overstated. That is worse than unverifiable, so the provenance card
	 * states it.
	 *
	 * Making the coding-activity flag public would retire the whole block —
	 * a profile setting, not a code change, and the owner's to make.
	 */
	publicApi: {
		endpoint: "https://wakatime.com/api/v1/users/Larsundso/stats/all_time",
		checkedOn: "2026-08-05" as IsoDate,
		/** `total_seconds` is withheld while coding activity is private. */
		totalIsPublic: false,
		/** Σ per-language (ai + manual) — the only reconstruction available. */
		reconstructedTotalSeconds: 18_958_694,
		/** Published total minus that reconstruction: the "Other" bucket. */
		shortfallSeconds: 599_326
	},

	lifetime: {
		/** Designated headline figure — includes the "Other" bucket. */
		total: { seconds: 19_558_020, display: "5,432 h 47 m" } satisfies Measured,
		/**
		 * ACTIVE-DAY CONVENTION, stated once because it is not the obvious
		 * one: WakaTime's daily average divides by days WORKED, not by days
		 * elapsed. 19,558,020 s / 1,575 active days = 12,418 s ≈ 3 h 27 m;
		 * over the 1,739 elapsed days it would be 3 h 7 m. Copy that prints
		 * this as "per day" therefore adds twenty minutes silently — say
		 * "per day worked", or print the denominator.
		 *
		 * `windowJuly2026.dailyAverage` (5 h 53 m) comes from the same
		 * instrument and presumably the same rule, but that has NOT been
		 * checked against a July day count. Verify before labelling it.
		 */
		dailyAverage: { seconds: 12_420, display: "3 h 27 m" } satisfies Measured,
		activeDays: { active: 1_575, elapsed: 1_739, ratePercent: 90.6 },
		bestDay: {
			date: "2026-07-14" as IsoDate,
			seconds: 46_560,
			display: "12 h 56 m"
		},
		projectsTracked: 338,
		languagesTracked: 72,
		dependenciesTracked: 7_792,

		languages: [
			{ name: "TypeScript", hours: 3_019.9, seconds: 10_871_640, percent: 55.59, derived: false },
			{ name: "JavaScript", hours: 727.6, seconds: 2_619_360, percent: 13.39, derived: true },
			{ name: "Svelte", hours: 301.9, seconds: 1_086_840, percent: 5.56, derived: true },
			{ name: "Vue.js", hours: 176.2, seconds: 634_320, percent: 3.24, derived: true }
		] satisfies LanguageShare[],

		/* REMOVED 2026-08-05 — `tsFamily: { hours: 3_231, percent: 69.0 }`.
		 *
		 * The three numbers it touched could not all be true at once:
		 * 3,231 h is 59.47 % of the published lifetime total (19,558,020 s),
		 * not 69.0 %, and the four published language rows above already sum
		 * to 4,225.6 h = 77.78 %. No pair of the three was consistent.
		 *
		 * It was referenced nowhere outside this file, so nothing on the
		 * wall was ever wrong — but this file is the single source of truth,
		 * and a latent figure is a figure waiting to be published.
		 *
		 * Deleted rather than recomputed, deliberately: the family as
		 * documented included JSX, whose hours the pull does not publish, so
		 * any replacement total would have been asserted rather than
		 * measured. If the family figure is ever wanted, re-pull it — do not
		 * reconstruct it from the rows above.
		 */
		/** Ayako project family, 7 generations, share of all tracked time. */
		ayakoFamily: { hours: 2_800.7, seconds: 10_082_520, percent: 51.55 },

		/** Share of lifetime coding time spent on remote machines over SSH. */
		remoteSshPercent: 60.4,
		/** Linux 65.13 % + WSL 4.69 % of lifetime OS time. */
		linuxInclWslPercent: 69.8,
		linuxPercent: 65.13,
		wslPercent: 4.69,
		/** Lifetime editor mix. */
		vsCodeEditorPercent: 94.49,
		/** Markdown share of lifetime language time (vs. 34.58 % in July 2026). */
		markdownPercent: 2.29
	},

	/** "Currently" window — July 2026. Never mix with lifetime figures. */
	windowJuly2026: {
		dailyAverage: { seconds: 21_180, display: "5 h 53 m" } satisfies Measured,
		aiCodingSharePercent: 68.56,
		/** Claude Code share of editor time within July 2026 only. */
		claudeCodeEditorPercent: 81.7,
		/** Markdown share of July-2026 language time — spec-driven signature. */
		markdownPercent: 34.58
	},

	windowLast12Months: {
		aiCodingSharePercent: 32.46
	},

	windowLast7Days: {
		aiCodingSharePercent: 69.76
	},

	aiCoding: {
		lifetime: { seconds: 1_224_720, display: "340 h 12 m" } satisfies Measured,
		/** 98.1 % of lifetime AI-Coding time falls within the last 12 months. */
		last12MonthsShareOfLifetimePercent: 98.1,
		/**
		 * Share of tracked time per window.
		 *
		 * NOT A TIME SERIES, and copy that joins these four with arrows is
		 * wrong: the windows OVERLAP. `lifetime` contains all three others;
		 * `july2026` (the calendar month, 2026-07-01 to 2026-07-31) and
		 * `last7Days` (the seven days to the pull date, so 2026-07-28 to
		 * 2026-08-03) both sit inside `last12Months` but neither contains the
		 * other — they straddle the month boundary. They are four zoom levels
		 * on one record; the movement between them is real and is stated by
		 * `last12MonthsShareOfLifetimePercent`, not by reading the row as a
		 * curve.
		 *
		 * BANNED FIGURE: "6.75 % AI, lifetime". That is Σ ai ÷ Σ (ai + manual)
		 * over the public per-language rows — a denominator this site does not
		 * use and, because coding activity is private on the profile, cannot
		 * reproduce. The API publishes `categories: [{ name: "AI Coding",
		 * percent: … }]` directly, which is the same construct as the 6.26 %
		 * below. Checked unauthenticated on 2026-08-05, that live entry read
		 * 6.53 % — a two-day forward drift in the expected direction, which is
		 * why the provenance card says so rather than leaving a reader to find
		 * a mismatch and conclude the wall is stale.
		 */
		sharePercentByWindow: {
			lifetime: 6.26,
			last12Months: 32.46,
			july2026: 68.56,
			last7Days: 69.76
		},
		/** What the live public endpoint read two days after the pull, same
		 *  construct (`categories` → "AI Coding"). Published only as the
		 *  drift clause on the provenance card, with its own date. */
		liveCategoryPercentOn20260805: 6.53
	}
} as const;

/* ------------------------------------------------------------------ */
/* GitHub — authenticated pull, 2026-08-03                             */
/* ------------------------------------------------------------------ */

export const github = {
	asOf: SNAPSHOT_AS_OF,
	source: "GitHub authenticated pull, 2026-08-03",
	accountCreated: "2019-01-17" as IsoDate,
	/** Coding since December 2019 (~6.5 years as of 2026-08). */
	codingSince: "2019-12",
	contributions: {
		lifetime: 8_650,
		commits: 5_748,
		issues: 470,
		pullRequests: 46,
		peakYear: { year: 2024, contributions: 3_192 },
		rolling12Months: 1_426
	},
	/** Pull requests authored across all repositories, lifetime. */
	pullRequestsAuthored: 130,
	/**
	 * Merged pull requests into repositories the owner does NOT own.
	 *
	 * BANNED FIGURE, site-wide: "37 merged upstream pull requests." The
	 * search `is:pr author:Larsundso is:merged` does return 37 — and 26 of
	 * those 37 are merges into his own repositories (Larsundso/*,
	 * AyakoBot/*), which is not what "upstream" claims. It fails the first
	 * check a sceptic can run, and it is the same class of error as the
	 * "4 most-tracked languages" label the last cycle retired.
	 *
	 * The checkable claim is 11, across 8 repositories he does not own.
	 * Verified unauthenticated against the GitHub search API on 2026-08-05
	 * with `-user:Larsundso -org:AyakoBot` appended: total_count 11, the
	 * per-repository counts below. `searchUrl` is the same query in the web
	 * UI, so a reader re-runs the check rather than taking the number.
	 *
	 * The old list also carried a star count inside a repository name
	 * ("discord.js (26,773 stars)") and folded `discordeno/cache-proxy`
	 * into `discordeno` as "discordeno (5 PRs)" — one repository too few,
	 * and a figure that would need its own as-of date.
	 */
	mergedUpstream: {
		count: 11,
		checkedOn: "2026-08-05" as IsoDate,
		/** THE LIMIT, AS A FIGURE RATHER THAN A SENTENCE. This file bans two
		 *  numbers a few lines up for being "a real number attached to the
		 *  wrong denominator" that "fails the first check a sceptic can run" —
		 *  and an adversarial screener applied exactly that test here. The
		 *  claim reproduces (total_count 11, eight foreign repos), but the
		 *  newest of the eleven merged twenty months before the page's own
		 *  date, and the wall stated no bound. Its verdict: the only place on
		 *  the wall where the stated convention "the limit: where does this
		 *  claim stop?" was not applied, and the only place it would have
		 *  hurt. The copy now carries the bound, and it reads the date from
		 *  here rather than hand-typing it, per this file's own rule.
		 *  Re-derived from the GitHub search API 2026-08-10: merge dates run
		 *  2022-10-27 to 2024-11-25. */
		newestMergedOn: "2024-11-25" as IsoDate,
		repositories: [
			{ repo: "discordeno/discordeno", merged: 3 },
			{ repo: "discordeno/cache-proxy", merged: 2 },
			{ repo: "discordjs/discord.js", merged: 1 },
			{ repo: "discordjs/discord-api-types", merged: 1 },
			{ repo: "unocss/unocss", merged: 1 },
			{ repo: "privatenumber/tsx", merged: 1 },
			{ repo: "Shashank3736/captcha-canvas", merged: 1 },
			{ repo: "discord-userdoccers/discord-userdoccers", merged: 1 }
		],
		searchUrl:
			"https://github.com/search?q=is%3Apr+author%3ALarsundso+is%3Amerged+-user%3ALarsundso+-org%3AAyakoBot&type=pullrequests"
	},
	ayakoAuthorship: {
		/** Share of Ayako-v2 default-branch commits; remainder is dependabot. */
		v2Percent: 99.8,
		v2Commits: { own: 2_325, total: 2_330 },
		v15Percent: 98.2,
		v15Commits: { own: 1_232, total: 1_254 },
		/** Ayako v3 microservice commits, 100 % self-authored. */
		v3Commits: 730
	},
	/** TypeScript share of code bytes in repos pushed 2026 (vs 1.4 % in 2021). */
	typescriptByteSharePercent: { in2021: 1.4, in2026: 97.6 }
} as const;

/* ------------------------------------------------------------------ */
/* Ayako product — as of 2026-08-03                                    */
/* ------------------------------------------------------------------ */

export const ayako = {
	asOf: SNAPSHOT_AS_OF,
	source: "Ayako ops figures, 2026-08-03",
	servers: 8_357,
	serversDisplay: "8,357",
	/** 2.4M+ users. */
	users: 2_400_000,
	usersDisplay: "2.4M+",
	rating: { value: "5/5", platform: "top.gg" },
	topGgUrl: "https://top.gg/bot/650691698409734151",
	inProductionSince: 2019,
	/** Monorepo-wide census (TypeScript, Svelte, Rust; excl. node_modules,
	 *  generated, vendored), measured 2026-08-03. Always label "monorepo-wide". */
	monorepo: { files: 3_113, linesOfCode: 221_133, languages: ["TypeScript", "Svelte", "Rust"] },
	workspace: { packagesAndApps: 10, dockerComposeServices: 10, prismaModels: 89, prismaSchemaLines: 1_238 },
	generations: 7,
	discordLibraries: 3,
	locales: 2,
	v3: { featurePlugins: 30, testFiles: 73, commits: 730 },
	/** License precision is binding copy law — and this line was WRONG, in
	 *  the direction that flatters, on the flagship card, in both locales.
	 *
	 *  The wall printed `v3: open source (AGPL-3.0)`. Checked 2026-08-10
	 *  against the public record it invites the reader to check: every Ayako
	 *  v3 repository — Ayako, Service, Gateway, API, Database, Utility —
	 *  carries `CC BY-NC 4.0` on line 1 of its LICENSE, and GitHub classifies
	 *  all six NOASSERTION because it cannot match them to an OSI licence.
	 *  There is no AGPL grant anywhere in the org.
	 *
	 *  An adversarial screener made this its rejection condition and was
	 *  right to: "He built a site whose whole argument is 'don't take my word
	 *  for it, here is the endpoint.' So I took him up on it — and the first
	 *  legal fact I checked was wrong in his favour." A non-commercial clause
	 *  fails the Open Source Definition, so `open source` was wrong twice
	 *  over — the licence identifier AND the category.
	 *
	 *  It is the same error the previous cycle corrected on the GIFfer card,
	 *  recurring here on the larger one, which is why it is written down
	 *  rather than quietly amended: the rule is that a licence claim is a
	 *  legal fact and gets checked against the repository, never against
	 *  memory or intent.
	 *
	 *  IF THE INTENT IS AGPL FOR v3, the fix is in the repositories, not
	 *  here — change the LICENSE files and this line follows. Until they say
	 *  AGPL, this says what they say. */
	license: {
		v2: "source-available (CC BY-NC 4.0)",
		v3: "source-available (CC BY-NC 4.0)"
	},
	/** The free-forever promise, quoted verbatim. A strength, stated plainly. */
	freeForeverPromise: "A feature that I cannot provide for free will not be implemented."
} as const;

/* ------------------------------------------------------------------ */
/* IHK credential — signed documents                                   */
/* ------------------------------------------------------------------ */

export const ihk = {
	source: "Signed IHK paper trail (company confirmation 2025-06-01; project documentation; 72 weekly reports)",
	profession: "Fachinformatiker für Anwendungsentwicklung",
	professionEn: "IT specialist for application development",
	track: "application-development track, DQR level 4",
	trainingCompany: "Columbus Interactive GmbH, Ravensburg",
	/* The institution's own name. It was filed here in translation
	   ("Electronics School Tettnang") — a name nothing is registered under
	   and nothing can be looked up by. The English wall glosses it; it does
	   not rename it. */
	vocationalSchool: "Elektronikschule Tettnang",
	vocationalSchoolEn: "technical vocational school",
	apprenticeship: { start: "2022-09-01" as IsoDate, examCycle: "Sommer 2025" },
	weeklyReports: 72,
	finalProject: {
		title: "User Interface für Discord Bots",
		/** Signed company confirmation, 2025-06-01. */
		hours: 80,
		window: { start: "2025-05-18" as IsoDate, end: "2025-06-01" as IsoDate },
		/** The only permitted completion wording — no grade or completion claims. */
		certification: "company-certified as independently executed (»selbstständig ausgeführt«)",
		repoUrl: "https://github.com/Larsundso/discord-bot-dashboard",
		trackedHours: 102.4,
		/** REAL servers, not simulated. Owner-corrected 2026-08-08: the load
		 *  test ran against his own Ayako bot's token, so these are 7,000 live
		 *  Discord servers the dashboard actually addressed — not a synthetic
		 *  fixture. Every string that renders this figure must say so; the wall
		 *  spent two cycles calling a production measurement a simulation and
		 *  giving away the strongest thing about it. */
		loadTestServers: 7_000,
		performance: {
			initialLoad: "<5 s initial load at 100 servers",
			serverSwitch: "<200 ms server switch",
			cacheHitRate: ">95 % cache hit rate",
			fps: "constant 30 FPS"
		},
		code: {
			typescript: { files: 108, linesOfCode: 5_485 },
			svelte: { files: 78, linesOfCode: 5_181 }
		}
	}
} as const;

/* ------------------------------------------------------------------ */
/* AI-native practice — archive census, 2026-08-03                     */
/* ------------------------------------------------------------------ */

export const ai = {
	asOf: SNAPSHOT_AS_OF,
	source: "Claude Code archive census, 2026-08-03",
	transcripts: {
		count: 2_144,
		sizeMb: 952,
		events: 328_665,
		days: 94,
		window: { start: "2026-05-02" as IsoDate, end: "2026-08-03" as IsoDate },
		/** Session indexes evidence use since at least this date. */
		evidencedSince: "2025-12-31" as IsoDate,
		projectDirectories: 19
	},
	sessionsPerDay: 6.3,
	transcriptsPerDayInclSubagents: 22.8,
	subagentShare: { percent: 72.5, count: 1_555, of: 2_144 },
	/** Sampled human-prompt : assistant-message ratio (40-file sample). */
	promptRatio: "1 : 19.4",
	modelGenerations: 7,
	memory: { notes: 198, projectContexts: 24 },
	/**
	 * Phrasing law: NOT all self-authored — never state these counts as if
	 * they were. The verified self-authored subset includes a
	 * link-verification skill and a diagram-authoring skill.
	 */
	installed: { skills: 41, plugins: 17, communityAgentDefinitions: 363 }
} as const;

export type TelemetrySnapshot = typeof telemetry;
export type GithubSnapshot = typeof github;
export type AyakoSnapshot = typeof ayako;
export type IhkSnapshot = typeof ihk;
export type AiSnapshot = typeof ai;
