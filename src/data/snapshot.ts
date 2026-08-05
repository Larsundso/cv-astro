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
 * WakaTime leaderboard rank.
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

	lifetime: {
		/** Designated headline figure — includes the "Other" bucket. */
		total: { seconds: 19_558_020, display: "5,432 h 47 m" } satisfies Measured,
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
		dailyAverage: { seconds: 12_420, display: "3 h 27 m" } satisfies Measured,
		activeDays: { active: 1_575, elapsed: 1_739, ratePercent: 90.6 },
		bestDay: {
			date: "2026-07-14" as IsoDate,
			seconds: 46_560,
			display: "12 h 56 m"
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
		dailyAverage: { seconds: 21_180, display: "5 h 53 m" } satisfies Measured,
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
		lifetime: { seconds: 1_224_720, display: "340 h 12 m" } satisfies Measured,
		/** 98.1 % of lifetime AI-Coding time falls within the last 12 months. */
		last12MonthsShareOfLifetimePercent: 98.1,
		/** Share of tracked time per window: the measured adoption curve. */
		sharePercentByWindow: {
			lifetime: 6.26,
			last12Months: 32.46,
			july2026: 68.56,
			last7Days: 69.76
		}
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
	/** Upstream projects with merged PRs (public record). */
	mergedUpstream: [
		"discord.js (26,773 stars)",
		"discord-api-types",
		"UnoCSS",
		"tsx",
		"discordeno (5 PRs)",
		"discord-userdoccers",
		"captcha-canvas"
	],
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
	/** License precision is binding copy law. */
	license: {
		v2: "source-available (CC BY-NC 4.0)",
		v3: "open source (AGPL-3.0)"
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
	vocationalSchool: "Electronics School Tettnang",
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
		loadTestServers: 7_000,
		performance: {
			initialLoad: "<5 s initial load at 100 servers",
			serverSwitch: "<200 ms server switch",
			cacheHitRate: ">95 % cache hit rate",
			fps: "constant 30 FPS"
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
