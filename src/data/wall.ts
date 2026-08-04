/**
 * Der Rote Faden — the wall's content as structured data.
 *
 * Every string here is final site copy and obeys the voice law: CEFR C2
 * English, no hype adjectives, every figure with its unit, "currently"
 * copy in the July-2026 window, career copy in the lifetime window, never
 * mixed. jobs@lars-dev.org is the only email anywhere.
 *
 * As-of discipline: the wall states its measuring date ONCE
 * (`chartStrings.provenance.convention`) and then stamps only the figures
 * that carry a DIFFERENT date, plus the two headline claims. Provenance is
 * a policy here, not a tic — never remove a date that is not the snapshot's.
 *
 * Content gate: publishable facts from the content pack only, plus three
 * owner-approved items — Ayako at real scale, Kiyu named with the
 * self-described server figure labeled as such, and the AI-native workflow
 * story in subordinate placement.
 *
 * Figures are sourced from src/data/snapshot.ts so a re-pull updates the
 * wall in one place, and are formatted for this wall's locale through the
 * shared helpers in src/data/telemetry.ts — never hand-typed.
 */
import { ai, ayako, github, ihk, SNAPSHOT_AS_OF, telemetry } from "~/data/snapshot";
import { figure, formatHM, millionsPlus } from "~/data/telemetry";

/* ------------------------------------------------------------------ */
/* Figure formatting — this wall's locale, applied at the source       */
/* ------------------------------------------------------------------ */

/** The locale every figure on this wall is formatted for. */
const L = "en" as const;
/** A grouped figure, e.g. 8,357. */
const n = (value: number): string => figure(value, L);
/** A duration from a seconds total, e.g. "5,432 h 47 m". */
const hm = (seconds: number): string => formatHM(seconds, L);
/** The two headline product figures, formatted once. */
const users = millionsPlus(ayako.users, L);
const servers = n(ayako.servers);

/* ------------------------------------------------------------------ */
/* Shared shapes                                                       */
/* ------------------------------------------------------------------ */

/** The six rationed pride inks — annotation and data colors only. */
export type PrideInk = "magenta" | "violet" | "teal" | "green" | "amber" | "blue";

/** A handwritten margin note (Shantell Sans, one pride ink).
 *  Law: a note must carry a fact, a judgement or a joke that is NOT on the
 *  sheet it is pinned to. A note that restates its card is decoration. */
export interface Annotation {
	text: string;
	ink: PrideInk;
}

export interface WallLink {
	label: string;
	href: string;
}

export interface TimelineEntry {
	id: string;
	/** Stamp text on the thread, e.g. "12/2019". */
	dateLabel: string;
	/** Sort key, ISO-ish. */
	sort: string;
	/** Typed heading (Courier Prime — index-card material). */
	title: string;
	/** Typed card copy; one string per paragraph. */
	body: string[];
	annotation?: Annotation;
}

export type ProjectRole = "flagship" | "portfolio" | "vr";

export interface ProjectEntry {
	id: string;
	name: string;
	role: ProjectRole;
	oneLiner: string;
	/** Typed card copy; one string per paragraph. */
	body: string[];
	/** Measured lines — each carries its unit; dates only where they differ
	 *  from the wall-wide measuring date. */
	facts: string[];
	stack: string[];
	/** Verified links only; never guessed URLs. */
	links: WallLink[];
	license?: string;
	/** Flagship only: the free-forever promise, quoted verbatim. */
	promise?: string;
	promiseNote?: string;
	/** Path under public/, when an asset exists. */
	logo?: string;
	annotation?: Annotation;
}

export interface AiPracticeEntry {
	id: string;
	title: string;
	/** Typed card copy; one string per paragraph. */
	lines: string[];
	annotation?: Annotation;
}

/** One house rule: a display headline and the sentence that carries it. */
export interface HouseRule {
	/** Six words or fewer — set in display type. */
	headline: string;
	/** The supporting sentence — set in body type. Carries the email. */
	text: string;
	ink: PrideInk;
}

/** One row of the wall's colour key: an ink, the job it does, and the
 *  reader's question it answers. */
export interface InkKeyRow {
	ink: PrideInk;
	/** The job, two or three words — never the name of the hue. */
	job: string;
	/** The question this ink answers, in the reader's own words. */
	q: string;
}

export interface ContactEntry {
	id: string;
	label: string;
	/** Display text, e.g. the handle. */
	value: string;
	href: string;
	primary?: boolean;
}

export interface EducationEntry {
	id: string;
	institution: string;
	detail?: string;
	/** YYYY-MM, or YYYY when only the year is confirmed. */
	start: string;
	/** Null while ongoing. */
	end: string | null;
	/** Path under public/, or null when no asset exists. */
	logo: string | null;
}

export interface EmploymentEntry {
	id: string;
	company: string;
	role: string;
	start: string;
	end: string | null;
	note: string;
	logo: string;
	/** Set when the logo asset does not exist yet and must be generated. */
	logoNote?: string;
}

/* ------------------------------------------------------------------ */
/* Page metadata                                                       */
/* ------------------------------------------------------------------ */

export const meta = {
	siteName: "lars-dev.org",
	title: "Lars Böse — Fachinformatiker (IHK) · Full-stack developer",
	description:
		`Fachinformatiker für Anwendungsentwicklung (IHK). I run a Discord bot with ` +
		`${users} users on ${servers} servers — solo, in production ` +
		`since ${ayako.inProductionSince}. ${hm(telemetry.lifetime.total.seconds)} tracked coding, ` +
		`as of ${SNAPSHOT_AS_OF}.`,
	locale: "en",
	person: {
		name: "Lars Böse",
		alternateName: "Larsundso",
		jobTitle: "Full-stack developer (Fachinformatiker für Anwendungsentwicklung, IHK)",
		email: "jobs@lars-dev.org",
		addressRegion: "Bodensee-Oberschwaben region, Baden-Württemberg, Germany",
		sameAs: [
			"https://github.com/Larsundso",
			"https://wakatime.com/@Larsundso",
			"https://www.linkedin.com/in/lars-b%C3%B6se-217272351",
			"https://www.xing.com/profile/Lars_Boese",
			"https://profile.indeed.com/p/larsb-2hf1h8b"
		]
	}
} as const;

/* ------------------------------------------------------------------ */
/* UI chrome — nav, skip link, language switcher, a11y strings         */
/* ------------------------------------------------------------------ */
/* Shared i18n contract: wall.de.ts mirrors this export with German
 * values and its langSwitch pointing back to "/". */

export const ui = {
	nav: {
		werdegang: "Werdegang",
		projects: "Projects",
		telemetry: "Telemetry",
		practice: "How I work",
		contact: "Contact"
	},
	skipLink: "Skip to content",
	backToTop: "Back to top",
	navAria: "Sections",
	langSwitch: { label: "Deutsch", aria: "Diese Seite auf Deutsch", href: "/de/", hreflang: "de" },
	opensNewTab: "(opens in new tab)",
	footerLine: null as string | null
} as const;

/* ------------------------------------------------------------------ */
/* Section stragglers — copy hardcoded in section markup until i18n    */
/* ------------------------------------------------------------------ */
/* Every entry is user-visible English that lived in .astro/.svelte
 * markup. wall.de.ts mirrors this export (identical shape, translated
 * values; figures and dates verbatim). */

export const sectionStrings = {
	/** Stamp sub-line above an as-of date, e.g. "as of / 2026-08-03". */
	asOfStamp: "as of",
	timeline: {
		/** Handwritten scrap beside the Werdegang flyer. It counts the
		 *  employers, because a reader who does not count them reads this
		 *  section as one job and a school record. */
		headNote: "two employers since 2022 — career and education, stitched in order.",
		/** Education card date line while ongoing, e.g. "since 2022-09". */
		since: (start: string) => `since ${start}`,
		/** Flagship card: prefix of the stack line. */
		stackLabel: "Stack:",
		/** Flagship card: performance figures + provenance suffix. */
		perfLine: (figures: string) => `${figures} — project documentation, 2025-06.`
	},
	projects: {
		ayakoAlt: "Ayako, the Discord bot",
		v3Title: "Ayako v3 — the rewrite",
		licenseLabel: "License:",
		vrBenchTitle: "The VR bench",
		vrBenchNote: "desktop tools for the headset I wear myself",
		vrSketchCaption: "wireframe headset, sketched in three.js — drag to spin",
		vrSketchAria: "Wireframe sketch of a VR headset. Drag it, or press the arrow keys, to spin it.",
		breadthTitle: "Also pinned"
	},
	contact: {
		/** Handwritten note above the mailto pin. */
		annotation: "The only address I publish."
	}
} as const;

/* ------------------------------------------------------------------ */
/* Chart strings — every display string getCharts.ts renders           */
/* ------------------------------------------------------------------ */
/* Templates are plain functions so German can reorder freely; number
 * and date FIGURES arrive preformatted. wall.de.ts mirrors this export
 * with identical keys and signatures. */

/** The as-of suffix, dropped when the window it follows already ends on
 *  that same date — the wall states its measuring date once. */
const asOfSuffix = (window: string, asOf: string): string =>
	window.includes(asOf) ? "" : ` · as of ${asOf}`;

/* Titles state the OUTCOME the hours bought; the hours corroborate it in
 * the line underneath. A title that names its own axis ("Top 5 projects")
 * makes the sheet an argument about effort — which is the one reading this
 * wall must not invite, because the record is only interesting for what
 * came out of it: a product in production since 2019, across seven
 * generations and three Discord libraries. Every figure here is the
 * snapshot's own, never a live value quoted in advance. */

export const chartStrings = {
	titles: {
		topProjects: (count: number) =>
			`Product work since ${ayako.inProductionSince} — the top ${count} by tracked hours`,
		ayakoFamily: `One product, ${ayako.generations} generations, in production since ${ayako.inProductionSince}`,
		topLanguages: (count: number) =>
			`One language family carries the product — top ${count} by tracked hours`,
		weekByProject: "What is being built right now — by project",
		weekByLanguage: "What is being built right now — by language",
		activeDays: "Days that produced code"
	},
	/** Unit + window lines (voice law). */
	units: {
		lifetimeHours: (window: string, asOf: string) =>
			`Tracked time in hours · lifetime, ${window}${asOfSuffix(window, asOf)}`,
		lifetimeShare: (window: string, asOf: string) =>
			`Share of all tracked coding time · lifetime, ${window}${asOfSuffix(window, asOf)}`,
		last12MonthsHours: (window: string, asOf: string) =>
			`Tracked time in hours · last 12 months, ${window}${asOfSuffix(window, asOf)}`,
		weekHoursPerDay: (window: string, asOf: string) =>
			`Tracked hours per day · ${window}${asOfSuffix(window, asOf)}`,
		habitCells: (window: string, asOf: string) =>
			`One cell per elapsed day · ${window}${asOfSuffix(window, asOf)}`
	},
	tableHeads: {
		project: "Project",
		language: "Language",
		trackedTime: "Tracked time",
		share: "Share",
		day: "Day",
		total: "Total"
	},
	/** The "everything else" bucket (series name, legend, table column). */
	other: "Everything else",
	/** Row label of the snapshot projects chart. */
	ayakoFamilyRow: "Ayako family",
	/** ECharts axis-label template — keep the {value} placeholder. */
	axisHours: "{value} h",
	/** Alt-text intros/sentences; ranked intros are completed by the
	 *  data rows ("<intro>: name time (share); ….") in getCharts. A screen
	 *  reader never sees the wall's date stamps, so alt text keeps its own. */
	alt: {
		topProjectsIntro: (count: number, asOf: string) =>
			`Bar chart of the ${count} most-tracked projects, lifetime window, as of ${asOf}`,
		ayakoFamilyIntro: (asOf: string) =>
			`Bar chart of the Ayako project family against everything else, lifetime window, as of ${asOf}`,
		topLanguagesYearIntro: (count: number, asOf: string) =>
			`Bar chart of the ${count} most-tracked languages over the last 12 months, as of ${asOf}`,
		topLanguagesLifetimeIntro: (count: number, asOf: string) =>
			`Bar chart of the ${count} most-tracked languages, lifetime window, as of ${asOf}`,
		weekByProject: (o: {
			start: string;
			end: string;
			topCount: number;
			weekTotal: string;
			dailyAverage: string;
			leadName: string;
			leadTime: string;
		}) =>
			`Stacked daily bar chart of tracked hours, ${o.start} to ${o.end}, ` +
			`split by the week's top ${o.topCount} projects plus everything else. ` +
			`Week total ${o.weekTotal}; daily average ${o.dailyAverage}. ` +
			`Leading project: ${o.leadName} at ${o.leadTime}.`,
		weekByLanguage: (o: {
			start: string;
			end: string;
			topCount: number;
			weekTotal: string;
			dailyAverage: string;
			leadName: string;
			leadTime: string;
		}) =>
			`Stacked daily bar chart of tracked hours, ${o.start} to ${o.end}, ` +
			`split by the week's top ${o.topCount} languages plus everything else. ` +
			`Week total ${o.weekTotal}; daily average ${o.dailyAverage}. ` +
			`Leading language: ${o.leadName} at ${o.leadTime}.`,
		habit: (o: {
			elapsed: string;
			start: string;
			end: string;
			active: string;
			ratePercent: number;
			asOf: string;
		}) =>
			`Tally grid of ${o.elapsed} cells, one per elapsed day between ${o.start} ` +
			`and ${o.end}; ${o.active} filled cells mark days with tracked coding — ` +
			`${o.ratePercent} percent, as of ${o.asOf}.`
	},
	/** Footnotes explaining starred (derived) figures. */
	notes: {
		projectsDerived: (asOf: string) =>
			`* Derived from the published lifetime total and the Ayako-family figure, both as of ${asOf}.`,
		languagesDerived: (asOf: string) =>
			`* Share derived from published hours over the lifetime total, as of ${asOf}.`
	},
	/** Handwritten margin notes: each carries the CONSEQUENCE the sheet
	 *  cannot draw — a note that repeats the bar it hangs beside is
	 *  decoration, and the bar already prints its own end label. */
	annotations: {
		/* Deliberately ignores the leading row: on a live pull that row is
		   whichever repo took the most hours, and the fact worth adding is
		   what the hours are running as, which no bar on this sheet shows. */
		projectLeads: (_name: string, _time: string) =>
			`${servers} servers run on what these hours built`,
		ayakoShare: (percent: number) => `${users} users, ${servers} servers — and ${n(percent)} % of the record`,
		languageTop: (name: string, time: string) => `the product runs on ${name} — ${time} of it`,
		weekTotal: (total: string, leadName: string) =>
			`${leadName} is still being built — ${total} of it this week`,
		weekDaily: (average: string, leadName: string) =>
			`the changes still land in ${leadName} — ${average} a day`,
		habitRate: (ratePercent: number, sinceYear: string) =>
			`${n(ratePercent)} % of all days since ${sinceYear} produced code`
	},
	habit: {
		line: (active: string, elapsed: string, ratePercent: string) =>
			`${active} of ${elapsed} elapsed days with tracked coding — ${ratePercent} %.`,
		/* Load-bearing: the cells fill in SEQUENCE, so any wording that
		   invites a left-to-right calendar reading makes the hollow block
		   look like a four-month gap at the end. There is no such gap —
		   the empty days are spread across the whole window. This clause
		   is the one that says so, and it is deliberately kept as an
		   antithesis where the rest of the wall dropped them. */
		smallPrint: "Two tallies, not a calendar — the cells are counted, never dated."
	},
	/** Typed provenance-card lines (Telemetry "Source" card). */
	provenance: {
		/** The wall's as-of rule, stated once so no figure has to repeat it. */
		convention: (asOf: string) =>
			`Unless a figure is stamped otherwise, every number on this wall was measured on ${asOf}.`,
		live: (asOf: string) =>
			`Charts pulled from the WakaTime API at build time; window ends ${asOf}.`,
		snapshot: (asOf: string) =>
			`Checked-in figures from the ${asOf} WakaTime API pull — live builds fetch at build time and add the seven-day charts.`,
		currentlyJuly2026: (display: string) =>
			`Currently (July 2026): ${display} tracked coding per day.`
	},
	/** Telemetry section chrome around the charts (Telemetry.astro). */
	telemetrySection: {
		/* The section's own subline. It leads with the thing the hours
		   produced and puts the measuring span second, because a telemetry
		   section that opens on "tracked since …" argues about diligence
		   before it has said what the diligence is for. */
		trackedSince: (date: string) =>
			`In production since ${ayako.inProductionSince} · tracked since ${date}`,
		sourceHeading: "Source",
		dataAsTable: "Data as a table"
	},
	/** Hero telemetry print-out: live-build sentences + source line
	 *  (snapshot builds print hero.telemetryCard.lines verbatim). */
	heroTelemetry: {
		total: (total: string, asOf: string) => `${total} tracked coding, as of ${asOf}.`,
		activeDays: (o: {
			active: string;
			elapsed: string;
			ratePercent: string;
			start: string;
			end: string;
		}) =>
			`${o.active} of ${o.elapsed} days active — ${o.ratePercent} %, ${o.start} to ${o.end}.`,
		dailyAverage: (average: string) => `Lifetime daily average: ${average}.`,
		sourceLine: (sourceNote: string, mode: string) => `Source: ${sourceNote} — ${mode}.`,
		modeLive: "pulled at build",
		modeSnapshot: "checked-in snapshot"
	}
} as const;

/* ------------------------------------------------------------------ */
/* Hero cluster                                                        */
/* ------------------------------------------------------------------ */

export const hero = {
	/** Rendered by the Lottie animation; keep as accessible fallback text. */
	greeting: "Hi, I'm Lars",
	greetingSubline: "since December 2019",
	/** Lottie asset for the handwritten greeting. */
	lottieAsset: "src/assets/Hi.json",
	name: "Lars Böse",
	signature: "Lars Boese",
	handle: "Larsundso",
	/** Typed intro card. */
	intro: [
		"Fachinformatiker für Anwendungsentwicklung (IHK) and full-stack developer at Raleo Digital GmbH, remote.",
		`I run a Discord bot with ${users} users on ${servers} servers — solo, in production since ${ayako.inProductionSince}.`
	],
	location: "Bodensee-Oberschwaben region (Lake Constance), Germany — fully remote.",
	languages: "German (native) · English (working language)",
	/** Ayako polaroid pinned beside the greeting — the product, not a
	 *  portrait: the label names it, the caption measures it. */
	polaroid: {
		image: "/Ayako.webp",
		alt: "Ayako's avatar — the illustrated character used as the Discord bot's logo: orange hair, green eyes, pointed ears.",
		/** Printed as the caption's first line: what this artifact is. */
		label: "Ayako — my Discord bot",
		caption: `${users} users · ${servers} servers · ${ayako.rating.value} on ${ayako.rating.platform}`,
		annotation: { text: "one on-call rotation, and it is me", ink: "magenta" } satisfies Annotation
	},
	/** Hand-annotated telemetry print-out. */
	telemetryCard: {
		title: "Tracked, not estimated",
		/* OUTCOME FIRST, hours as corroboration.
		   Three of ten blind hiring judges attacked exactly these lines, in
		   these words: "tracked hours measures effort, not outcome", "reads as
		   self-surveillance and effort theatre rather than impact", "flirts
		   with proving diligence to people who were going to ask about
		   impact." They were right about the framing and wrong about the
		   remedy — the provenance is why the same judges believe the page at
		   all, so nothing here is dropped or un-dated. What changed is the
		   order: the card now opens on what the hours SUSTAINED (a system
		   still in production after seven rewrites and three breaking library
		   migrations) and closes on the measurement that backs it. */
		lines: [
			`In production since ${ayako.inProductionSince} — through ${ayako.generations} generations and ${ayako.discordLibraries} Discord libraries.`,
			`${hm(telemetry.lifetime.total.seconds)} tracked coding behind it, as of ${SNAPSHOT_AS_OF}.`,
			`${n(telemetry.lifetime.activeDays.active)} of ${n(telemetry.lifetime.activeDays.elapsed)} days active — ${n(telemetry.lifetime.activeDays.ratePercent)} %, ${telemetry.trackingStart} to ${telemetry.trackingEnd}.`
		],
		sourceNote: "WakaTime API",
		annotation: { text: "the 164 zero days are counted too", ink: "teal" } satisfies Annotation
	},
	/** The pinned primary action. */
	primaryAction: {
		label: "Write to jobs@lars-dev.org",
		href: "mailto:jobs@lars-dev.org",
		annotation: { text: "this address reaches me directly", ink: "blue" } satisfies Annotation
	},
	/** Thread endpoint stamps. */
	threadStart: { stamp: "12/2019", label: "December 2019 — the first pin" },
	threadEnd: { stamp: "HEUTE", label: "the latest stitch" }
} as const;

/* ------------------------------------------------------------------ */
/* Timeline — the red thread, December 2019 to today                   */
/* ------------------------------------------------------------------ */

export const timeline: TimelineEntry[] = [
	{
		id: "start-2019",
		dateLabel: "12/2019",
		sort: "2019-12",
		title: "The first pin",
		body: [
			"December 2019. Ayako begins as a single JavaScript file. It has been in production ever since.",
			`GitHub account since ${github.accountCreated}.`
		],
		annotation: { text: "one file, no plan, no users", ink: "green" }
	},
	{
		id: "angel-bots-era",
		dateLabel: "2021–2022",
		sort: "2021-10",
		title: "The bot-building years",
		body: [
			`${telemetry.trackingStart}: WakaTime telemetry starts recording and has run continuously since.`,
			"The Angel-Bots era: single-purpose Discord bots in JavaScript, one job each — the origin of most of the JavaScript in the record " +
				`(${n(telemetry.lifetime.languages[1].hours)} h lifetime).`
		],
		annotation: {
			text: `TypeScript: ${n(github.typescriptByteSharePercent.in2021)} % of pushed code bytes in 2021 → ${n(github.typescriptByteSharePercent.in2026)} % in repos pushed 2026`,
			ink: "violet"
		}
	},
	{
		id: "apprenticeship-2022",
		dateLabel: "09/2022",
		sort: "2022-09",
		title: "Three years at Columbus Interactive GmbH",
		body: [
			`${ihk.apprenticeship.start}: three years employed at ${ihk.trainingCompany}, training as ${ihk.profession} (IHK, ${ihk.track}).`,
			`${ihk.weeklyReports} countersigned weekly training records, Nr. 0–71 — every one of them read and signed by someone else. Vocational school: ${ihk.vocationalSchool}. Final exam cycle: ${ihk.apprenticeship.examCycle}.`
		]
	},
	{
		id: "ihk-final-project-2025",
		dateLabel: "05/2025",
		sort: "2025-05",
		title: `IHK final project: »${ihk.finalProject.title}«`,
		body: [
			`The training company assessed the work: ${ihk.finalProject.certification}, signed company confirmation dated 2025-06-01. ${ihk.finalProject.hours} h, ${ihk.finalProject.window.start} to ${ihk.finalProject.window.end}.`,
			`Measured under load: ${n(ihk.finalProject.loadTestServers)} simulated Discord servers.`
		],
		annotation: { text: "80 h is the IHK's ceiling for the project", ink: "teal" }
	},
	{
		id: "raleo-2025",
		dateLabel: "2025",
		sort: "2025-06",
		title: "Raleo Digital GmbH",
		body: [
			"Since 2025: full-stack developer at Raleo Digital GmbH (raleo.de), an online marketplace for heating, heat pumps, and photovoltaics. Fully remote — the second company on this thread."
		]
	},
	{
		id: "current",
		dateLabel: "HEUTE",
		sort: "2026-08",
		title: "The latest stitch",
		body: [
			`July 2026: ${hm(telemetry.windowJuly2026.dailyAverage.seconds)} tracked coding per day. Best single day: ${hm(telemetry.lifetime.bestDay.seconds)} on ${telemetry.lifetime.bestDay.date}.`,
			`The Ayako v3 rewrite is in active development: ${ayako.v3.commits} commits, ${ayako.v3.featurePlugins} feature plugins, ${ayako.v3.testFiles} colocated test files.`
		],
		annotation: { text: "the first pin and this one are the same bot", ink: "green" }
	}
];

/* ------------------------------------------------------------------ */
/* Career print-outs (lifetime window)                                 */
/* ------------------------------------------------------------------ */

export const careerStats = {
	title: "Career telemetry",
	asOf: SNAPSHOT_AS_OF,
	sourceNote: "WakaTime API pull",
	lines: [
		`${hm(telemetry.lifetime.total.seconds)} tracked coding.`,
		`TypeScript: ${n(telemetry.lifetime.languages[0].hours)} h — ${n(telemetry.lifetime.languages[0].percent)} % of tracked time.`,
		`${telemetry.lifetime.projectsTracked} projects · ${telemetry.lifetime.languagesTracked} languages · ${n(telemetry.lifetime.dependenciesTracked)} dependencies tracked.`,
		`${n(telemetry.lifetime.remoteSshPercent)} % of coding time on remote servers over SSH; ${n(telemetry.lifetime.linuxInclWslPercent)} % of OS time on Linux (incl. WSL).`
	]
} as const;

export const githubStats = {
	title: "GitHub record",
	asOf: SNAPSHOT_AS_OF,
	sourceNote: "GitHub authenticated pull",
	lines: [
		`${n(github.contributions.lifetime)} contributions since ${github.accountCreated} — peak year ${github.contributions.peakYear.year}: ${n(github.contributions.peakYear.contributions)}; rolling 12 months: ${n(github.contributions.rolling12Months)}.`,
		`${github.pullRequestsAuthored} pull requests authored, lifetime. Merged upstream in ${github.mergedUpstream.join(", ")}.`
	]
} as const;

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export const projects: ProjectEntry[] = [
	{
		id: "ayako",
		name: "Ayako",
		role: "flagship",
		oneLiner: "Multi-purpose Discord bot, built and operated solo, in production since 2019.",
		body: [
			"I design, build, deploy, and operate Ayako alone: application code, database, cache, sharding, metrics, and deployment.",
			`The v3 rewrite decomposes the monolith into Redis-bound processes while v2 keeps running: a Bun gateway ingests the Discord websocket and republishes over pub/sub to ${ayako.v3.featurePlugins} self-contained feature plugins; timers are delegated to Redis keyspace expiry.`
		],
		facts: [
			`${servers} servers · ${users} users · ${ayako.rating.value} on ${ayako.rating.platform}, as of ${SNAPSHOT_AS_OF}.`,
			`Monorepo-wide: ${n(ayako.monorepo.files)} source files, ${n(ayako.monorepo.linesOfCode)} lines of code (TypeScript, Svelte, Rust).`,
			`${ayako.workspace.packagesAndApps} packages and apps · ${ayako.workspace.dockerComposeServices} Docker Compose services · ${ayako.workspace.prismaModels} Prisma models.`,
			`${n(telemetry.lifetime.ayakoFamily.hours)} h across ${ayako.generations} generations and ${ayako.discordLibraries} Discord libraries — ${n(telemetry.lifetime.ayakoFamily.percent)} % of all tracked coding time.`,
			`${n(github.ayakoAuthorship.v2Percent)} % of v2 default-branch commits self-authored (${n(github.ayakoAuthorship.v2Commits.own)} of ${n(github.ayakoAuthorship.v2Commits.total)}).`,
			`v3: ${ayako.v3.commits} commits, 100 % self-authored · ${ayako.v3.featurePlugins} feature plugins · ${ayako.v3.testFiles} colocated test files.`
		],
		stack: [
			"TypeScript",
			"discord.js 14",
			"@discordjs/core",
			"discord-hybrid-sharding",
			"Prisma",
			"PostgreSQL 16",
			"Redis 7",
			"Rust → WASM",
			"Prometheus · Grafana",
			"Docker Compose",
			"SvelteKit",
			"Node ≥24 · Bun"
		],
		links: [
			{ label: "ayakobot.com", href: "https://ayakobot.com" },
			{ label: "GitHub: AyakoBot", href: "https://github.com/AyakoBot" },
			{ label: "top.gg listing", href: ayako.topGgUrl }
		],
		license: `v2 ${ayako.license.v2} · v3 ${ayako.license.v3}`,
		promise: ayako.freeForeverPromise,
		promiseNote: "Ayako is free. That has held since 2019 and it stays that way.",
		logo: "/Ayako.webp",
		annotation: { text: "every outage since 2019, fixed by me", ink: "magenta" }
	},
	{
		id: "discord-bot-dashboard",
		name: "discord-bot-dashboard",
		role: "portfolio",
		oneLiner: "The IHK final project as a public repo: a web dashboard plus gateway-cache microservice for Discord bots.",
		body: [
			"Support staff authenticate with a Discord application's token and inspect permission configuration, roles, and channels across all of its servers — real-time UI over Server-Sent Events, backed by a typed Redis cache layer and a sharded bot backend."
		],
		facts: [
			`${ihk.finalProject.hours} h, ${ihk.finalProject.window.start} to ${ihk.finalProject.window.end} — ${ihk.finalProject.certification}.`,
			`Load-tested to ${n(ihk.finalProject.loadTestServers)} simulated Discord servers (project documentation, 2025-06).`,
			`${ihk.finalProject.performance.initialLoad} · ${ihk.finalProject.performance.serverSwitch} · ${ihk.finalProject.performance.cacheHitRate} · ${ihk.finalProject.performance.fps} (project documentation, 2025-06).`,
			`${ihk.finalProject.code.typescript.files} TypeScript files (${n(ihk.finalProject.code.typescript.linesOfCode)} LOC) + ${ihk.finalProject.code.svelte.files} Svelte files (${n(ihk.finalProject.code.svelte.linesOfCode)} LOC).`,
			`${n(ihk.finalProject.trackedHours)} h tracked on the repo.`
		],
		stack: [
			"SvelteKit",
			"Svelte 5",
			"UnoCSS",
			"TypeScript",
			"Redis pub/sub",
			"Server-Sent Events",
			"@discordjs/core",
			"Prometheus",
			"Docker Compose"
		],
		links: [{ label: "GitHub: discord-bot-dashboard", href: ihk.finalProject.repoUrl }],
		annotation: { text: "you can clone the exam and run it", ink: "teal" }
	},
	{
		id: "kiyu",
		name: "Kiyu",
		role: "portfolio",
		oneLiner:
			"Second production Discord bot, private codebase: giveaways with message- and voice-minute entry requirements, welcome flows, logging, booster tracking, embed builder, online-peak statistics.",
		body: [
			"Runs on hybrid sharding with a custom V8 memory monitor: 30-second heap sampling with a garbage-collection trigger at 85 %."
		],
		facts: [
			"Self-described “10,000+ servers” — repo metadata, unverified.",
			`332 files · ${n(17_250)} LOC · 128 commits, 100 % self-authored.`,
			"Active through 2026-06."
		],
		stack: ["TypeScript", "discord.js 14", "Prisma", "discord-hybrid-sharding", "socket.io"],
		links: [],
		annotation: {
			text: "private code, so take the rest on trust too",
			ink: "amber"
		}
	},
	{
		id: "vr-discord-vc-overlay",
		name: "VR-Discord-VC-Overlay",
		role: "vr",
		oneLiner:
			"C#/.NET 8 SteamVR overlay rendering Discord voice state in-headset, with interactive mute and deafen.",
		body: [
			"Discord RPC implemented directly over the local IPC pipe — no bot token. Ships as a single self-contained executable with license, privacy policy, terms, and a release workflow."
		],
		facts: [`${n(4_059)} LOC across 15 files.`],
		stack: ["C#/.NET 8", "SkiaSharp", "DirectX 11 (Vortice)", "OpenVR", "Kestrel", "WebSocket"],
		links: []
	},
	{
		id: "vrc-inviter",
		name: "VRC-Inviter",
		role: "vr",
		oneLiner: "Windows tray service that auto-accepts VRChat invites by rule precedence.",
		body: [
			"Spec-first: the design document is dated 2026-04-16, before implementation. DPAPI-encrypted credentials, a loopback-only web dashboard, and SQLite persistence."
		],
		facts: [`${n(4_481)} LOC across 55 files · 7-module xUnit suite.`],
		stack: ["C#/.NET 8", "Svelte 5", "SQLite", "xUnit", "Kestrel"],
		links: []
	},
	{
		id: "vrc-status-changer",
		name: "VRC-Status-Changer",
		role: "vr",
		oneLiner:
			"Sets a VRChat profile status from live signals in priority order: Discord voice state, then world ID, then world tag.",
		body: [
			"The Discord IPC RPC client — OAuth handshake and frame protocol included — is hand-rolled rather than pulled from a library."
		],
		facts: [`${n(2_436)} LOC across 36 files · vitest suite with undici MockAgent.`],
		stack: ["TypeScript", "Node.js", "vitest"],
		links: []
	},
	{
		id: "vrchat-speech-assistant",
		name: "VRChatSpeechAssistant",
		role: "vr",
		oneLiner:
			"Three-process desktop app for real-time AI speech in VRChat: Electron/React frontend, Python FastAPI backend, SteamVR overlay.",
		body: [
			"Speech is recognized locally with Faster-Whisper and routed to the VRChat chatbox over OSC; the overlay renders dashboard, HUD, and wrist views in-headset."
		],
		facts: [`${n(32_427)} LOC across 121 files · 15 backend service modules · 19 test files.`],
		stack: ["Python", "FastAPI", "Faster-Whisper", "Electron", "React", "OpenVR", "WebSocket", "OSC"],
		links: []
	},
	{
		id: "giffer",
		name: "GIFfer",
		role: "portfolio",
		oneLiner:
			"Public user-installable Discord app that converts video and YouTube URLs to GIF or MP4, with trimming and FPS control.",
		body: [
			"Run as a real open-source project: strict TypeScript, compression with SSH/HTTP upload fallback, Docker packaging, and a SECURITY.md."
		],
		facts: [`${n(3_264)} LOC of strict TypeScript across 75 files.`],
		stack: ["TypeScript", "ffmpeg", "youtube-dl-exec", "SWC", "Docker"],
		links: [],
		license: "CC BY-NC 4.0"
	}
];

/** Breadth — single typed lines pinned low on the wall. */
export const breadth: { text: string; link?: WallLink }[] = [
	{
		text:
			"lars-dev.org — this site: Astro 5, Svelte 5, UnoCSS on Cloudflare. Headline figures are fetched from the WakaTime API at build time, with a checked-in snapshot (dated " +
			`${SNAPSHOT_AS_OF}) as fallback.`
	},
	{
		text: "waifu-pics-api — MIT-licensed npm wrapper for the waifu.pics image API. The final release deliberately fails at import after the upstream domain expired, rather than returning empty data. Deprecated 2026-05-07.",
		link: { label: "npm", href: "https://www.npmjs.com/package/waifu-pics-api" }
	},
	{
		text: `vr-diag — three PowerShell forensic scripts (${n(1_202)} LOC): VR crash forensics across event logs, WHEA, and minidumps; a VR lag monitor; a bugcheck analyzer. 48 captured run datasets.`
	},
	{
		text: "Restart-VR.bat — idempotent Windows batch orchestrator that boots a VR streaming stack via tasklist, CIM, and UDP-port probes."
	},
	{
		text: "Car electronics — camera install and a 12 V LiFePO₄ second-battery build in a Smart 450; ESP8266 + MQTT height map."
	}
];

/* ------------------------------------------------------------------ */
/* AI practice — subordinate placement by owner decision               */
/* ------------------------------------------------------------------ */

export const aiPractice = {
	/** Owner: "not what I want to be hired for exclusively." */
	placement: "subordinate",
	title: "How I work with agents",
	intro: "Agents do a lot of my typing. Here are the numbers, and the rules I run them under.",
	entries: [
		{
			id: "volume",
			title: "Volume",
			lines: [
				`${n(ai.transcripts.count)} Claude Code transcripts (${ai.transcripts.sizeMb} MB, ${n(ai.transcripts.events)} logged events) across ${ai.transcripts.days} days, ${ai.transcripts.window.start} to ${ai.transcripts.window.end} — ${n(ai.sessionsPerDay)} top-level sessions per day.`,
				`Session indexes evidence use since at least ${ai.transcripts.evidencedSince}.`
			]
		},
		{
			id: "orchestration",
			title: "Orchestration",
			lines: [
				`${n(ai.subagentShare.percent)} % of transcripts (${n(ai.subagentShare.count)} of ${n(ai.subagentShare.of)}) are subagent and workflow runs nested under parent sessions.`,
				`Sampled prompt-to-response ratio: ${ai.promptRatio} — long autonomous runs, steered now and then.`,
				"Multiple concurrent sessions run on one checkout under written conventions: atomic claim locks for shared logs, commit-by-pathspec against index races, mtime-based attribution checks before reverts."
			]
		},
		{
			id: "adoption",
			title: "Measured adoption curve",
			lines: [
				`AI-Coding share of tracked time: ${n(telemetry.aiCoding.sharePercentByWindow.lifetime)} % lifetime → ${n(telemetry.aiCoding.sharePercentByWindow.last12Months)} % last 12 months → ${n(telemetry.aiCoding.sharePercentByWindow.july2026)} % July 2026 → ${n(telemetry.aiCoding.sharePercentByWindow.last7Days)} % last 7 days. ${hm(telemetry.aiCoding.lifetime.seconds)} lifetime.`,
				`Claude Code: ${n(telemetry.windowJuly2026.claudeCodeEditorPercent)} % of July-2026 editor time.`,
				`Markdown rose from ${n(telemetry.lifetime.markdownPercent)} % of lifetime language time to ${n(telemetry.windowJuly2026.markdownPercent)} % in July 2026 — the signature of spec-driven, agentic work.`
			]
		},
		{
			id: "governance",
			title: "Governance",
			lines: [
				"Agents never commit, stage, or push. I write and review every commit myself.",
				"Read-only is enforced by taking the tools away. A prompt that asks nicely is not a control. Agent output passes an explicit tsc gate, because a pipeline can go green while tsc fails.",
				"Production changes: one reversible step at a time, rollback emitted in the same turn as any mutation, blast-radius verification after each change."
			],
			annotation: { text: "rules written after incidents, not before", ink: "violet" }
		},
		{
			id: "memory-tooling",
			title: "Memory and tooling",
			lines: [
				`Persistent cross-session memory: ${ai.memory.notes} curated notes across ${ai.memory.projectContexts} project contexts, each with typed frontmatter and a mandatory “Why”.`,
				`A written cost policy routes implementation and research to cheaper models and review to the strongest; ${ai.modelGenerations} model generations operated within three months.`,
				`${ai.installed.skills} installed skills, ${ai.installed.plugins} plugins, and a ${ai.installed.communityAgentDefinitions}-definition community agent library. I wrote the link-verification skill and the diagram-authoring skill; the rest I installed.`,
				"Library-touching code is preceded by a current-documentation fetch (Context7 MCP); repos carry architecture maps and dated spec documents written for agents and developers alike."
			]
		}
	] satisfies AiPracticeEntry[]
} as const;

/* ------------------------------------------------------------------ */
/* House rules — values card, handwritten                              */
/* ------------------------------------------------------------------ */
/* Each rule is a display headline plus one supporting sentence. The
 * politics is stated, never defended: rule one is the position, rule two
 * is what he does about it, and neither asks permission. */

export const houseRules = {
	title: "House rules",
	/** Handwritten card (Shantell Sans); one pride ink per rule. */
	rules: [
		{
			headline: "Queer, and on the left.",
			text: "The six inks on this wall are my working colors, chosen on purpose.",
			ink: "magenta"
		},
		{
			headline: "No tolerance for intolerance.",
			text: "Moderation is infrastructure, and I have built and run it since 2019.",
			ink: "violet"
		},
		{
			headline: "Plain records over polish.",
			text: "I can show the source for every figure here, including the ones that do not flatter me.",
			ink: "teal"
		},
		{
			headline: "If these rules read like home,",
			text: "write to jobs@lars-dev.org.",
			ink: "blue"
		}
	] satisfies HouseRule[]
} as const;

/* ------------------------------------------------------------------ */
/* The ink key — the wall states its own code                          */
/* ------------------------------------------------------------------ */
/* The six jobs of The Annotation Ink Rule, in the rule's own words and
 * the rule's own order. Rows name what an ink MEANS; the hue is shown,
 * never spelled. `q` states the reader's question the ink answers — a key
 * that names categories from inside the system does not teach. The heading
 * is the one hand line on the wall written in plain ink — it labels the
 * code, so it may not wear it. */

export const inkKey = {
	title: "a note's ink names its claim",
	rows: [
		{ ink: "magenta", job: "mine alone", q: "who owns this, and how big is it?" },
		{ ink: "violet", job: "the method", q: "how is the work done?" },
		{ ink: "teal", job: "the provenance", q: "how do you know?" },
		{ ink: "green", job: "the run", q: "since when, and is it still going?" },
		{ ink: "amber", job: "the limit", q: "where does this claim stop?" },
		{ ink: "blue", job: "the way in", q: "what do I do next?" }
	] satisfies InkKeyRow[]
} as const;

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
	title: "Write to me",
	email: "jobs@lars-dev.org",
	/** What he is actually after — owner-approved, and the only place on
	 *  the wall that states it. No notice period: none was supplied. */
	rightNow: {
		title: "Right now",
		lines: [
			"Full-stack developer at Raleo Digital GmbH since 2025. Not urgently looking.",
			"Open to TypeScript/Node product work — backend or full-stack. Tell me about it.",
			"Remote, or on site around Bodensee-Ravensburg.",
			"Every mail to this address is answered."
		]
	},
	entries: [
		{
			id: "email",
			label: "Email",
			value: "jobs@lars-dev.org",
			href: "mailto:jobs@lars-dev.org",
			primary: true
		},
		{ id: "github", label: "GitHub", value: "Larsundso", href: "https://github.com/Larsundso" },
		{
			id: "linkedin",
			label: "LinkedIn",
			value: "Lars Böse",
			href: "https://www.linkedin.com/in/lars-b%C3%B6se-217272351"
		},
		{
			id: "xing",
			label: "XING",
			value: "Lars Boese",
			href: "https://www.xing.com/profile/Lars_Boese"
		},
		{
			id: "indeed",
			label: "Indeed",
			value: "Lars B.",
			href: "https://profile.indeed.com/p/larsb-2hf1h8b"
		},
		{
			id: "wakatime",
			label: "WakaTime",
			value: "Larsundso",
			href: "https://wakatime.com/@Larsundso"
		}
	] satisfies ContactEntry[]
} as const;

/* ------------------------------------------------------------------ */
/* Employment & education                                              */
/* ------------------------------------------------------------------ */

export const employment: EmploymentEntry[] = [
	{
		id: "raleo",
		company: "Raleo Digital GmbH",
		role: "Full-stack developer",
		start: "2025",
		end: null,
		note: "raleo.de — online marketplace for heating, heat pumps, and photovoltaics. Fully remote.",
		logo: "/raleo-initials.svg",
		logoNote:
			"No logo asset exists in public/. Generate an initials SVG ('R', paper/ink palette) at public/raleo-initials.svg before shipping."
	},
	{
		id: "columbus",
		company: "Columbus Interactive GmbH",
		role: "Apprentice application developer",
		start: "2022-09",
		end: "2025",
		note: `Ravensburg. Three years employed in the IHK dual system; ${ihk.weeklyReports} countersigned weekly training records; final exam cycle ${ihk.apprenticeship.examCycle}.`,
		logo: "/CI.webp"
	}
];

export const education: EducationEntry[] = [
	{
		id: "apprenticeship",
		institution: "IHK apprenticeship — Fachinformatiker für Anwendungsentwicklung",
		detail: `Application-development track, DQR level 4. Training company: ${ihk.trainingCompany}. IHK final project »${ihk.finalProject.title}«, ${ihk.finalProject.certification}.`,
		start: "2022-09",
		end: "2025",
		logo: "/CI.webp"
	},
	{
		id: "est",
		institution: "Electronics School Tettnang",
		detail: "Vocational school (Berufsschule) of the apprenticeship.",
		start: "2022-09",
		end: "2025-07",
		logo: "/EST.webp"
	},
	{
		id: "bfe",
		institution: "1-Year Vocational School for Electrical Engineering",
		start: "2019-08",
		end: "2020-02",
		logo: "/GSR.webp"
	},
	{
		id: "tg",
		institution: "Ravensburg Technical High School",
		start: "2018-08",
		end: "2018-10",
		logo: "/GSR.webp"
	},
	{
		id: "konrad",
		institution: "BZ St. Konrad Ravensburg",
		start: "2010-04",
		end: "2018-07",
		logo: "/Konrad.webp"
	}
];
