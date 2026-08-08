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
import { figure, formatHCoarse, formatHMCoarse, millionsPlus, pct } from "~/data/telemetry";

/* ------------------------------------------------------------------ */
/* Figure formatting — this wall's locale, applied at the source       */
/* ------------------------------------------------------------------ */
/* Every figure here goes through a helper, and every helper binds the
 * figure to its unit with a no-break space — see telemetry.ts. The card
 * faces print at the resolution the instrument identifies (whole hours
 * above 1,000 h, floored, never rounded up); the exact figures survive on
 * the chart data tables and on the provenance card. */

/** The locale every figure on this wall is formatted for. */
const L = "en" as const;
/** A grouped figure, e.g. 8,357. */
const n = (value: number): string => figure(value, L);
/** A duration from a seconds total: "5,432 h" · "5 h 53 m". */
const hm = (seconds: number): string => formatHMCoarse(seconds, L);
/** An hours figure: "2,800 h" · "102.4 h". */
const h = (hours: number): string => formatHCoarse(hours, L);
/** A share with its unit bound to it: "90.6 %". */
const pc = (value: number): string => pct(value, L);
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
	/* THE MACHINE-READABLE IDENTITY, AND IT IS THE ONLY ONE. `main.astro`
	   used to hand-type a second Person object beside this one: it published
	   `name: "Lars Boese"` under a `<title>` of *Böse*, and a LinkedIn
	   `sameAs` carrying a raw `ö` in the path — an unencoded non-ASCII
	   character in a URL literal, next to the correctly encoded copy that was
	   already sitting here. The layout now reads this record, so the wall
	   states its owner's name once.
	   The drawn signature stays ASCII on purpose (`hero.signature`): a
	   signature legitimately may be, and the Lottie swash is measured against
	   that exact string. The legal form is carried by the identity card, the
	   title, the footer stamp and this record. */
	person: {
		name: "Lars Böse",
		givenName: "Lars",
		familyName: "Böse",
		/* both the ASCII form a recruiter may search on and the handle every
		   profile is filed under */
		alternateName: ["Lars Boese", "Larsundso"],
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
/* German runs inside English prose                                    */
/* ------------------------------------------------------------------ */
/* THE ORNAMENT WAS TAGGED AND THE CONTENT WAS NOT. On the English wall
 * `lang="de"` was already correct on "Der Rote Faden" and on "Werdegang" —
 * decoration — while four SUBSTANTIVE German runs inherited `lang="en"`,
 * the first of them being the opening line of the hero record card and
 * therefore the first thing a screen reader reads inside `main`. Read with
 * an English voice, "Fachinformatiker für Anwendungsentwicklung" is the
 * least intelligible string on the page and it is also the single most
 * important one on a German developer's English CV.
 *
 * These are the runs, listed once and matched at render time, so a copy
 * edit cannot leave a `<span>` wrapped around the wrong words: the strings
 * in the data layer stay plain text and nothing here emits markup.
 *
 * NOT LISTED, deliberately: "Bodensee-Oberschwaben" and "Ravensburg" are
 * proper nouns — a place name is not a foreign-language passage — and
 * "IHK" is an initialism a screen reader spells out identically in either
 * voice. "Werdegang", "Der Rote Faden" and the rail's own tick label carry
 * their own `lang` attributes at their render sites already.
 *
 * The German wall exports this as an empty list: `<html lang="de">` there,
 * so nothing inside it is a foreign-language passage. */
export const germanRuns: readonly string[] = [
	"Fachinformatiker für Anwendungsentwicklung",
	"User Interface für Discord Bots",
	"Sommer 2025"
];

/**
 * Proper nouns that may never be hyphenated, in either locale.
 *
 * A legal name is DATA, not prose. `hyphenate-limit-chars: 6 3 3` cannot
 * protect one — "Interactive" is eleven letters, so no length rule forbids
 * breaking it, and the German wall duly printed `Columbus In-/teractive
 * GmbH` on the card that evidences the apprenticeship. That is not an ugly
 * break; it is the wrong name for the company that trained him, on the page
 * written for the readers most likely to check it.
 *
 * Marked here rather than at the render sites because these strings are
 * interpolated from `snapshot.ts` into both locales' prose, so there is no
 * element to hang a class on. Longest-first matching is handled by the
 * scanner; order in this list does not matter.
 */
export const properNouns: readonly string[] = [
	"Columbus Interactive GmbH",
	"Raleo Digital GmbH",
	"Technisches Gymnasium Ravensburg"
];

/**
 * One run of text: whether it is German, and whether it is a proper noun
 * that must not break. The two are independent — a German-language run may
 * also be a name — so they are separate flags rather than one enum.
 */
export type LangRun = { text: string; de: boolean; proper?: boolean };

/**
 * ISO 8601 dates as this wall prints them — YYYY-MM-DD and YYYY-MM.
 *
 * DEFECT 6: an ISO date breaks at its own hyphens, so the wall printed
 * `2026-08-` / `03` and opened a line with a bare `03` — on a wall whose
 * rule is that a bare number is not a fact. The two characters that cause
 * it are U+002D, and replacing them with U+2011 is the wrong trade: the
 * date would stop pasting into anything that parses ISO 8601, on a wall
 * whose whole argument is "check it yourself". So the date stays exactly
 * the bytes it is and the fix is markup — the scanner marks it `proper`,
 * which is the same flag a legal name carries, for the same reason: it is
 * DATA, not prose, and it may not be split.
 *
 * NOT SUFFICIENT ON ITS OWN. `.proper` today sets only `hyphens: manual`
 * (src/styles/wall.css:448), and `manual` is defined as permitting a break
 * at an explicit hyphen — it suppresses AUTOMATIC hyphenation, which is
 * the defect it was written for. Until that rule also forbids breaking at
 * an explicit hyphen, this marking is inert. It cannot regress anything
 * while it waits.
 */
const ISO_DATE = /\d{4}-\d{2}(?:-\d{2})?/g;

/** Split a run at every ISO date in it, marking the dates unbreakable. */
const splitIsoDates = (text: string): LangRun[] => {
	const parts: LangRun[] = [];
	let i = 0;
	for (const match of text.matchAll(ISO_DATE)) {
		const at = match.index ?? 0;
		if (at > i) parts.push({ text: text.slice(i, at), de: false });
		parts.push({ text: match[0], de: false, proper: true });
		i = at + match[0].length;
	}
	if (i < text.length) parts.push({ text: text.slice(i), de: false });
	return parts;
};

/**
 * Split a string into alternating native / German runs, longest match first
 * at any given position. Pure, and locale-agnostic: the run list is the
 * locale's business, this is only the scanner.
 */
export const splitLangRuns = (
	text: string,
	runs: readonly string[] = germanRuns,
	names: readonly string[] = properNouns
): LangRun[] => {
	if (runs.length === 0 && names.length === 0) return splitIsoDates(text);
	/* One scan over both lists. A run carries its origin so a German-language
	   passage and an unbreakable name stay independent flags. */
	const marked = [
		...runs.map((text) => ({ text, de: true, proper: false })),
		...names.map((text) => ({ text, de: false, proper: true }))
	];
	const parts: LangRun[] = [];
	let i = 0;
	while (i < text.length) {
		let at = -1;
		let hit: (typeof marked)[number] | null = null;
		for (const candidate of marked) {
			const found = text.indexOf(candidate.text, i);
			if (found === -1) continue;
			/* Longest match wins at a tie, so "Columbus Interactive GmbH" beats
			   any shorter name that starts at the same offset. */
			if (at === -1 || found < at || (found === at && candidate.text.length > (hit?.text.length ?? 0))) {
				at = found;
				hit = candidate;
			}
		}
		if (at === -1 || !hit) {
			parts.push(...splitIsoDates(text.slice(i)));
			break;
		}
		if (at > i) parts.push(...splitIsoDates(text.slice(i, at)));
		parts.push({ text: hit.text, de: hit.de, proper: hit.proper });
		i = at + hit.text.length;
	}
	return parts.filter((part) => part.text.length > 0);
};

/* ------------------------------------------------------------------ */
/* UI chrome — nav, skip link, language switcher, a11y strings         */
/* ------------------------------------------------------------------ */
/* Shared i18n contract: wall.de.ts mirrors this export with German
 * values and its langSwitch pointing back to "/". */

export const ui = {
	nav: {
		/**
		 * The district SIGN, and it stays German.
		 *
		 * DEFECT 5: four of five nav labels predicted their destination and
		 * this one did not — a German word on a page served `lang="en"`, in
		 * front of the section a recruiter opens first. The word survives
		 * where it is a LANDMARK and where the content under it explains it:
		 * on the sign over the section (Timeline.astro, `lang="de"`).
		 * Wayfinding is a different job and now has its own string below.
		 */
		werdegang: "Werdegang",
		/**
		 * The same destination, named for a reader who is deciding whether to
		 * go there: the nav list on the title card and the rail tick in the
		 * margin. A directory entry has to be parseable BEFORE the section is
		 * read, which is exactly what the sign does not have to be.
		 *
		 * NOT YET RENDERED: WallPage.astro builds one `NAV` array for both the
		 * list and the rail and reads `ui.nav.werdegang` for it, with a
		 * hard-coded `lang: "de"` on that item. Point it here and drop the
		 * `lang` — an English word tagged German is the same fault upside
		 * down. The German wall keeps "Werdegang" in both slots; there it
		 * predicts its destination already.
		 */
		werdegangWayfinding: "Career",
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
		/** The district sign's scope line, under the Werdegang rule. The
		 *  proper noun WERDEGANG stays German on both walls — it is the one
		 *  untranslated word on the route, and a landmark because of it —
		 *  but a date range is not part of a proper noun. This used to be
		 *  hard-set in the component as "2010 – heute", with lang="de", on
		 *  the English wall. */
		headDates: "2010 – today",
		/** Education card date line while ongoing, e.g. "since 2022-09". */
		since: (start: string) => `since ${start}`,
		/**
		 * Title of the ONE schooling card.
		 *
		 * Three general-education records — a secondary school, a technical
		 * high school and a one-year vocational school — used to stand as
		 * three separate pinned cards, and they occupied the whole of
		 * desktop screen 2, the top of screen 3, and a full phone viewport,
		 * inside the two screenfuls that receive most of the reading. The
		 * chronology is not the problem and is not touched: the ALLOCATION
		 * was. One card, one pin, every institution and every date kept
		 * verbatim, and the thread still passes through a single pin.
		 */
		schooling: "Schooling",
		/**
		 * The card's sentence.
		 *
		 * NOT YET RENDERED — Timeline.astro prints `<h3>{ts.schooling}</h3>`
		 * and then the rows, so this is the one card on the wall with no
		 * sentence on it: three date·institution lines, one of them two
		 * months long, left to speak for themselves. The inference a reader
		 * draws unaided is not the flattering one, and the wall's answer to
		 * an unflattering fact everywhere else is to state it rather than to
		 * let it be guessed. It adds no fact the dates do not already carry.
		 * Render it directly under the heading.
		 */
		schoolingNote:
			"General schooling before the apprenticeship, listed in full — including the two entries that lasted a few months. The record is complete or it is not.",
		/** One schooling line: its span, then the institution. */
		schoolLine: (dates: string, institution: string) => `${dates} · ${institution}`,
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
		/* SIDEWAYS, and unconditionally. The canvas now carries
		   `touch-action: pan-y` so a vertical swipe over it scrolls the page
		   instead of being swallowed; the axis the drag still owns is the
		   horizontal one, which is also the axis the spin weights. Written
		   once rather than swapped under `(pointer: coarse)`: a caption that
		   says one thing to a mouse and another to a thumb is two strings to
		   keep true, and "sideways" is true of both. */
		vrSketchCaption: "wireframe headset, sketched in three.js — drag sideways to spin",
		/* The canvas is `role="img"`: assistive tech announces "graphic" and
		   offers no operation, so a label may not promise one. It is also no
		   longer focusable — WCAG 2.5.7 wants a single-pointer alternative to
		   a drag, and arrow keys are a keyboard alternative, not that. */
		vrSketchAria: "Wireframe sketch of a VR headset.",
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
	axisHours: "{value} h",
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
		/* The snapshot sheet charts a HAND-CURATED four, not a ranking: the
		   public all_time endpoint ranks TypeScript, JavaScript, Svelte,
		   JSON, Other, Vue.js, so "the 4 most-tracked languages" was false
		   against the very instrument this wall names. The curation —
		   application languages, data and markup formats excluded — is
		   defensible, so the label states the curation. */
		appLanguagesLifetimeIntro: (count: number, asOf: string) =>
			`Bar chart of the ${count} most-tracked application languages, data and markup formats excluded, ` +
			`with a final bar for everything else; lifetime window, as of ${asOf}`,
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
			`* Share derived from published hours over the lifetime total; the “everything else” row is that total minus the published rows. Both as of ${asOf}.`
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
		ayakoShare: (percent: number) => `${users} users, ${servers} servers — and ${pc(percent)} of the record`,
		languageTop: (name: string, time: string) => `the product runs on ${name} — ${time} of it`,
		weekTotal: (total: string, leadName: string) =>
			`${leadName} is still being built — ${total} of it this week`,
		weekDaily: (average: string, leadName: string) =>
			`the changes still land in ${leadName} — ${average} a day`,
		habitRate: (ratePercent: number, sinceYear: string) =>
			`${pc(ratePercent)} of all days since ${sinceYear} produced code`
	},
	habit: {
		line: (active: string, elapsed: string, ratePercent: string) =>
			`${active} of ${elapsed} elapsed days with tracked coding — ${ratePercent} %.`,
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
			`Currently (July 2026): ${display} tracked coding per day.`,
		/** Why the card faces print whole hours, and what the exact figure is. */
		precision: (shown: string, exact: string) =>
			`Lifetime total, exactly as pulled: ${exact}. The cards print ${shown}. WakaTime does not measure a duration, it builds one by joining heartbeats that fall inside a 15-minute keystroke timeout — so at this size the minutes digit is not something the instrument can identify, and printing it would offer a precision the method does not have. Nothing is rounded up; the data tables keep every exact figure.`,
		/** The address the card named an instrument for and never gave. */
		endpoint: (url: string) => `Check it yourself — public, no key required: ${url}`,
		/** What that endpoint settles, and the one thing it cannot. */
		checkable: (o: { reconstructed: string; shortfall: string; checkedOn: string }) =>
			`It confirms the language shares to two decimals. It cannot confirm the total: coding activity is private on that profile, so the API withholds the total and the only reconstruction left — adding up the per-language rows — comes to ${o.reconstructed}, ${o.shortfall} short, because those rows do not carry the “Other” bucket. That gap is the bucket, not a number in my favour, and it is the one figure here you cannot check today. Re-checked unauthenticated on ${o.checkedOn}.`,
		/** A dated snapshot drifts from a live pull; say so before a reader
		 *  finds the difference and reads it as staleness. */
		drift: (live: string, printed: string, checkedOn: string) =>
			`A dated snapshot drifts from a live pull, and it should: on ${checkedOn} that same endpoint reported AI Coding at ${live} where this wall prints ${printed}, measured two days earlier.`
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
			`${o.active} of ${o.elapsed} days active — ${o.ratePercent} %, ${o.start} to ${o.end}.`,
		dailyAverage: (average: string) => `Lifetime daily average: ${average}.`,
		sourceLine: (sourceNote: string, mode: string) => `Source: ${sourceNote} — ${mode}.`,
		modeLive: "pulled at build",
		modeSnapshot: "checked-in snapshot"
	}
} as const;

/* ------------------------------------------------------------------ */
/* Hero cluster                                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* The seniority anchor — arithmetic, not adjective                    */
/* ------------------------------------------------------------------ */
/* THE WALL LET THE WEAKEST INFERENCE ARRIVE FIRST. The hero record card
 * stated role, employer, region and languages and NO duration and NO
 * level, so the first level statement a screener met was the Columbus
 * letterhead — "Apprentice application developer · 2022-09 – 2025", at
 * 17.8 % of the page — and from it they computed one year past
 * qualification. The 2019 → 2026 operating record was already on the wall,
 * measured and dated, but filed as a PROJECT rather than as EXPERIENCE.
 *
 * SEVEN YEARS WOULD BE WRONG. December 2019 to the snapshot's own
 * 2026-08-03 is six years and eight months, and this wall does not round a
 * figure to a friendlier one — that is the whole reason its other numbers
 * are believed. So the months are COMPUTED from two literals, the
 * production start and the snapshot date, and the span is printed beside
 * the duration so a reader can check the arithmetic without leaving the
 * card. It cannot drift when the snapshot moves and it cannot drift when
 * the page is rebuilt on some later afternoon, because neither literal is
 * a clock reading.
 *
 * It claims no title and no arrangement: a start month, a count of months,
 * a qualification year and a training length, every one of them already
 * published elsewhere on this wall. */
const PRODUCTION_START = { display: "12/2019", year: 2019, month: 12 } as const;

const productionMonths = (() => {
	const [year, month] = SNAPSHOT_AS_OF.split("-").map(Number) as [number, number];
	return (year - PRODUCTION_START.year) * 12 + (month - PRODUCTION_START.month);
})();

/** e.g. "6 years 8 months" — the wall's own figure shape, as in "5,432 h 47 m". */
const productionSpan = `${Math.floor(productionMonths / 12)} years ${productionMonths % 12} months`;

/** The year of the IHK qualification, from the exam cycle the wall states. */
const qualifiedYear = ihk.apprenticeship.examCycle.replace(/\D+/g, "");

export const hero = {
	/** Rendered by the Lottie animation; keep as accessible fallback text. */
	/* Curly apostrophe: the English page carried six straight marks beside
	   six curly double quotes, while the German page had zero straight marks
	   — inconsistency, not ignorance, and this one is the second word a
	   reader sees. */
	greeting: "Hi, I’m Lars",
	greetingSubline: "since December 2019",
	/** Lottie asset for the handwritten greeting. */
	lottieAsset: "src/assets/Hi.json",
	name: "Lars Böse",
	signature: "Lars Boese",
	handle: "Larsundso",
	/**
	 * Typed intro card.
	 *
	 * `intro[2]` is the seniority anchor and it sits directly under the
	 * sentence it quantifies, so "in production" has its referent one rule
	 * above it. The credential and the employer keep the card's first rule
	 * and its bold; the name above them is the LEGAL form (the drawn
	 * signature stays ASCII on purpose — see `person` in `meta`).
	 *
	 * THE INDICES ARE LOAD-BEARING AND READ POSITIONALLY. Hero.astro renders
	 * [1] as the claim, splits [2] into the bold level statement and its
	 * qualifier, and sets [0] as the record line — it does not map the array.
	 * Reordering it promotes copy into the bold band that was never ranked
	 * for it, so append; never insert.
	 *
	 * [3] and [4] are DEFECTS 3 and 2, and they belong to the first viewport:
	 *
	 * [3] — no technology was named above the fold at all. The first
	 * "TypeScript" on the page sat at 18.8 % depth on phone, 17.8 % on
	 * desktop, so a screener who reads one screen learned the credential, the
	 * product and the region and never the stack. The figure is the wall's
	 * own published language share, not a new claim, and it is interpolated
	 * like every other figure here. The subject is TypeScript ALONE: 55.59 %
	 * is a WakaTime LANGUAGE share and Node is a runtime that appears nowhere
	 * in that census, so "TypeScript and Node — 55.59 %" would hang a
	 * one-language measurement on a two-part subject.
	 *
	 * [4] — the most decision-relevant sentence on the site appeared once, at
	 * 95.4 % depth on phone and 95.0 % on desktop. It is duplicated here word
	 * for word from `contact.rightNow.lines[0]`, minus its invitation, which
	 * belongs to the card that carries the address. The RIGHT NOW card is
	 * unchanged. "Not urgently looking." is deliberately NOT carried up: that
	 * is an open owner decision and the first viewport may not pre-empt it.
	 *
	 * NOT YET RENDERED: Hero.astro stops at [2]. Both lines belong on the
	 * identity card after `location`, evidence first, ask last.
	 */
	intro: [
		/* THE ENGLISH WALL LED WITH AN UNTRANSLATED GERMAN CREDENTIAL AND
		   NEVER GLOSSED IT. The only gloss anywhere sat ~3,600 px down and
		   glossed the TRACK, not the credential — so the first line of the
		   record card, and the most important string on a German developer's
		   English CV, was also the least intelligible one on the page.
		   The gloss is inline and em-dashed, inside intro[0] rather than in a
		   fourth paragraph: this line carries the card's only weight contrast,
		   and a new body paragraph would dilute the run instead of qualifying
		   it. "vocational" is in it deliberately — "state-recognised
		   qualification" alone reads against a degree, and a screener who
		   discovers the difference later feels handled.
		   wall.de.ts is NOT glossed and must not be: a German reader needs
		   none, and that asymmetry is correct bilingual practice. */
		"Fachinformatiker für Anwendungsentwicklung (IHK) — the German state-recognised vocational qualification in application development — and full-stack developer at Raleo Digital GmbH, remote.",
		`I run a Discord bot with ${users} users on ${servers} servers — solo, in production since ${ayako.inProductionSince}.`,
		/* NO SENTENCE ON THIS PAGE MADE LARS THE SUBJECT OF A DURATION, and
		   that is why the apprenticeship letterhead kept winning the seniority
		   argument: it was the only line whose subject was a person with a
		   span attached. This line opened "That is …" — an anaphoric
		   reformulator, the *i.e.* construction, whose discourse function is
		   to mark what follows as a RESTATEMENT of the sentence above it. So
		   the wall's strongest experience claim was syntactically flagged
		   "nothing new here". Worse, strip the connective and the residue
		   still predicated the bot: "6 years 8 months in production" has the
		   deployment as its subject.
		   Now the subject is the person, the verb is what he did, and the
		   referent, the figures and the printed span are all unchanged, so the
		   arithmetic stays checkable on the card. Deliberately NOT widened to
		   "production systems": Kiyu is labelled unverified and active only to
		   2026-06, so the plural would outrun the evidence. */
		`I have built and operated it for ${productionSpan} — ${PRODUCTION_START.display} to ${SNAPSHOT_AS_OF}. Qualified ${qualifiedYear}, after three years of in-company training.`,
		`TypeScript, day to day — ${pc(telemetry.lifetime.languages[0].percent)} of all tracked coding time, as of ${SNAPSHOT_AS_OF}.`,
		"Open to TypeScript/Node product work — backend or full-stack."
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
			`${n(telemetry.lifetime.activeDays.active)} of ${n(telemetry.lifetime.activeDays.elapsed)} days active — ${pc(telemetry.lifetime.activeDays.ratePercent)}, ${telemetry.trackingStart} to ${telemetry.trackingEnd}.`
		],
		sourceNote: "WakaTime API",
		annotation: { text: "the 164 zero days are counted too", ink: "teal" } satisfies Annotation
	},
	/**
	 * The pinned primary action.
	 *
	 * UNRENDERED as of 2026-08-05: `grep -rn "primaryAction" src/` returns
	 * this file and wall.de.ts and no component, and it appears zero times
	 * in the served HTML of either locale. Kept, not deleted, for one
	 * reason: the first visible mailto on the page sits at 86.7 % depth,
	 * and the fix is a hero CTA that renders exactly this object. Deleting
	 * it would only mean retyping it. Wire it up in Hero.astro — the copy,
	 * the href and the note are ready and owner-approved.
	 */
	primaryAction: {
		label: "Write to jobs@lars-dev.org",
		href: "mailto:jobs@lars-dev.org",
		annotation: { text: "this address reaches me directly", ink: "blue" } satisfies Annotation
	},
	/** Thread endpoint stamps. "Werdegang" stays — it is the site's
	 *  signature word and the section explains itself. The date stamps do
	 *  not: "HEUTE" is a German word doing no work for an English reader,
	 *  and it is furniture, not an artefact. Translated on this build only;
	 *  wall.de.ts keeps HEUTE. */
	threadStart: { stamp: "12/2019", label: "December 2019 — the first pin" },
	threadEnd: { stamp: "TODAY", label: "the latest stitch" }
} as const;

/* ------------------------------------------------------------------ */
/* Timeline — the red thread, December 2019 to today                   */
/* ------------------------------------------------------------------ */
/* DEFECT 1: THE CAREER SECTION HAD NO PERSON IN IT. First-person tokens
 * per district were Hero 4, Projects 2, Telemetry 1, "How I work" 11,
 * Contact 4 — and Werdegang 0, across 292 EN / 257 DE words. The six
 * finite-verb sentences here took as their subjects *Ayako*, *It*,
 * *WakaTime*, *someone else*, *The training company* and *The rewrite*, so
 * the one district a recruiter reads first was the one district where the
 * candidate never acts. Three of them are now his: the first pin, the
 * apprenticeship and the current employer — the three that are about what
 * he did rather than about what an instrument recorded. Not one fact,
 * figure or date changed; only the subject.
 *
 * NOT rewritten, deliberately: the WakaTime line (the instrument really is
 * the actor — claiming it as an achievement would be the effort-theatre
 * reading the telemetry card was rewritten to avoid), the countersignature
 * line (its whole point is that SOMEONE ELSE signed), and the v3 line
 * (the rewrite's state is the fact, and authorship is stated on the card
 * two sections down, measured). */

export const timeline: TimelineEntry[] = [
	{
		id: "start-2019",
		dateLabel: "12/2019",
		sort: "2019-12",
		title: "The first pin",
		body: [
			"December 2019. I wrote Ayako as a single JavaScript file and have kept it in production ever since.",
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
				`(${h(telemetry.lifetime.languages[1].hours)} lifetime).`
		],
		annotation: {
			text: `TypeScript: ${pc(github.typescriptByteSharePercent.in2021)} of pushed code bytes in 2021 → ${pc(github.typescriptByteSharePercent.in2026)} in repos pushed 2026`,
			ink: "violet"
		}
	},
	{
		id: "apprenticeship-2022",
		dateLabel: "09/2022",
		sort: "2022-09",
		title: "Three years at Columbus Interactive GmbH",
		body: [
			/* "in Ravensburg" is NOT in this sentence and must not be added back:
			   `ihk.trainingCompany` already reads "Columbus Interactive GmbH,
			   Ravensburg", so the proposed wording would have printed the town
			   twice on the card that evidences the apprenticeship. */
			`${ihk.apprenticeship.start}: I joined ${ihk.trainingCompany} for three years, training as ${ihk.profession} (IHK, ${ihk.track}).`,
			`${ihk.weeklyReports} countersigned weekly training records, Nr. 0–71 — every one of them read and signed by someone else. Vocational school: ${ihk.vocationalSchool} (${ihk.vocationalSchoolEn}). Final exam cycle: ${ihk.apprenticeship.examCycle}.`
		]
	},
	{
		id: "ihk-final-project-2025",
		dateLabel: "05/2025",
		sort: "2025-05",
		title: `IHK final project: »${ihk.finalProject.title}«`,
		body: [
			`The training company assessed the work: ${ihk.finalProject.certification}, signed company confirmation dated 2025-06-01. ${h(ihk.finalProject.hours)}, ${ihk.finalProject.window.start} to ${ihk.finalProject.window.end}.`,
			`Measured under load: ${n(ihk.finalProject.loadTestServers)} real Discord servers — run against my own bot's token, not simulated.`
		],
		annotation: { text: `${h(ihk.finalProject.hours)} is the IHK’s ceiling for the project`, ink: "teal" }
	},
	{
		id: "raleo-2025",
		dateLabel: "2025",
		sort: "2025-06",
		title: "Raleo Digital GmbH",
		body: [
			"Since 2025 I have been a full-stack developer at Raleo Digital GmbH (raleo.de), an online marketplace for heating, heat pumps, and photovoltaics. Fully remote — the second company on this thread."
		]
	},
	{
		id: "current",
		/** The rendered stamp at the end of the thread — see hero.threadEnd. */
		dateLabel: "TODAY",
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
		`TypeScript: ${h(telemetry.lifetime.languages[0].hours)} — ${pc(telemetry.lifetime.languages[0].percent)} of tracked time.`,
		`${telemetry.lifetime.projectsTracked} projects · ${telemetry.lifetime.languagesTracked} languages · ${n(telemetry.lifetime.dependenciesTracked)} dependencies tracked.`,
		`${pc(telemetry.lifetime.remoteSshPercent)} of coding time on remote servers over SSH; ${pc(telemetry.lifetime.linuxInclWslPercent)} of OS time on Linux (incl. WSL).`
	]
} as const;

/**
 * NOT RENDERED — and the claim inside it was false until now.
 *
 * `is:pr author:Larsundso is:merged` returns 37, and this card was ready to
 * publish that as "merged upstream". 26 of the 37 are merges into
 * repositories the owner owns, so the number fails the first check a
 * sceptic can run — the same class of error as "the 4 most-tracked
 * languages", on a wall whose entire argument is that its figures survive
 * being checked.
 *
 * The claim is now the one that holds: 11 merged into 8 repositories he
 * does not own, verified against the GitHub search API on 2026-08-05, with
 * `search` carrying the query that reproduces it. These are also the only
 * claims on this wall that a third party attested to — every charted figure
 * is self-instrumented — which is why the card is worth wiring up rather
 * than deleting.
 */
/* ------------------------------------------------------------------ */
/* Client work — the three employed years, evidenced                   */
/* ------------------------------------------------------------------ */
/**
 * THE REDESIGN HAD DELETED THE PAID WORK'S ONLY EVIDENCE.
 *
 * Three hiring reviews in a row returned the same verdict — "a person who
 * has documented his hobby to a professional standard and his profession
 * not at all" — and the third measured why: every outbound link on this
 * wall pointed at a side project or a job-platform profile, and NONE at
 * either employer. The conclusion drawn was that the paid work could not be
 * evidenced. That was wrong. It was evidenced, on the site this one
 * replaces, and the redesign dropped it.
 *
 * Twenty-five live commercial sites, recovered from that site's own work
 * list. Its per-site `Tasks` field is reproduced here EXACTLY — a card
 * tagged Maintenance says maintained, never built. Nine of the thirteen
 * cards are maintenance only, and saying "25 sites I built" would be false.
 *
 * WHAT THIS IS FOR, in the owner's own framing: he had not written PHP,
 * Typo3 or CraftCMS before this apprenticeship and does not write them now.
 * So the record is not a PHP developer's record — it is evidence that a
 * stack he did not know was handed to him and he shipped production work in
 * it. That is the one claim a language census structurally cannot make, and
 * it is why this belongs under Columbus rather than in Projects.
 */
export const clientWork = {
	title: "What I shipped there",
	lead: "25 live sites, in a stack I had not used before. I wrote no PHP, no Typo3 and no CraftCMS before 2022-09-01, and I write none of them today.",
	/** The tags are the ones published per site — developed, or only kept running. */
	tagNote: "Split the way I logged it: what I developed, and what I only maintained.",
	groups: [
		{
			label: "Developed and maintained",
			items: [
				{
					name: "Messe Friedrichshafen — 13 trade-fair sites",
					stack: "CraftCMS · PHP · Twig · SCSS · Bootstrap",
					href: "https://messe-friedrichshafen.de/",
					also: "Aero Expo, Americana, Aqua Fisch, Fairnamic, HAM-Radio, IBO Messe, Interboot, Klassikwelt Bodensee, Motorradwelt Bodensee, Pferd Bodensee, Tuningworld Bodensee, Vertical Pro"
				},
				{
					name: "Simply-V",
					stack: "CraftCMS · TypeScript · PHP · Twig · SCSS",
					href: "https://simply-v.de/"
				},
				{
					name: "Columbus Interactive",
					stack: "PHP · SCSS · CSS3",
					href: "https://columbus-interactive.de/"
				}
			]
		},
		{
			label: "Developed",
			items: [
				{
					name: "MP Family Office",
					stack: "Bootstrap · Handlebars · TypeScript · Docker · SCSS",
					href: "https://mp-familyoffice.de/"
				}
			]
		},
		{
			label: "Maintained",
			items: [
				{ name: "Medizin Campus Bodensee", stack: "PHP · SCSS", href: "https://medizin-campus-bodensee.de/" },
				{ name: "Paravan", stack: "Typo3", href: "https://paravan.de/" },
				{ name: "Eisele", stack: "Typo3", href: "https://eisele.de/" },
				{ name: "ID-S", stack: "Handlebars · PHP · Typo3", href: "https://id-s.de/" },
				{ name: "EBZ Group", stack: "Typo3", href: "https://ebz-group.com/" },
				{ name: "Columbus AG", stack: "VueJS", href: "https://columbus.ag/" },
				{ name: "Hobart", stack: "PHP", href: "https://hobart.de/" },
				{ name: "Arnold Next-G", stack: "Handlebars", href: "https://arnoldnextg.de/" },
				{ name: "Lightweight", stack: "SCSS · CSS3", href: "https://lightweight.info/" }
			]
		}
	],
	close: "Every one of them is still live, so the work can be opened rather than taken on trust. The stack was new to me on the first day and I have not used it since — which is the part of three employed years a language census cannot show."
} as const;

export const githubStats = {
	title: "GitHub record",
	asOf: SNAPSHOT_AS_OF,
	sourceNote: "GitHub authenticated pull",
	lines: [
		`${n(github.contributions.lifetime)} contributions since ${github.accountCreated} — peak year ${github.contributions.peakYear.year}: ${n(github.contributions.peakYear.contributions)}; rolling 12 months: ${n(github.contributions.rolling12Months)}.`,
		`${github.pullRequestsAuthored} pull requests authored, lifetime.`,
		`${github.mergedUpstream.count} of them merged into ${github.mergedUpstream.repositories.length} repositories I do not own: ${github.mergedUpstream.repositories.map((r) => r.repo).join(", ")}. Checked ${github.mergedUpstream.checkedOn}.`
	],
	/** The query that returns the eleven — run it rather than trust it. */
	search: {
		label: "the search that returns them",
		href: github.mergedUpstream.searchUrl
	} satisfies WallLink
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
			/* A CENSUS, NOT AN ESTIMATE. This line printed "221,133 lines of
			   code" — the largest figure on the wall and the softest, because
			   a line count is a construct (what counts as a line, blank lines,
			   generated files) rather than a thing counted. The file count and
			   the package count are both censuses: they answer to a directory
			   listing. The line figure is not lost — it stays in
			   snapshot.ts — it is simply not the number this card leads on. */
			`Monorepo-wide: ${n(ayako.monorepo.files)} source files across ${ayako.workspace.packagesAndApps} packages (TypeScript, Svelte, Rust).`,
			`${ayako.workspace.dockerComposeServices} Docker Compose services · ${ayako.workspace.prismaModels} Prisma models.`,
			`${h(telemetry.lifetime.ayakoFamily.hours)} across ${ayako.generations} generations and ${ayako.discordLibraries} Discord libraries — ${pc(telemetry.lifetime.ayakoFamily.percent)} of all tracked coding time.`,
			`${pc(github.ayakoAuthorship.v2Percent)} of v2 default-branch commits self-authored (${n(github.ayakoAuthorship.v2Commits.own)} of ${n(github.ayakoAuthorship.v2Commits.total)}).`,
			`v3: ${ayako.v3.commits} commits, ${pc(100)} self-authored · ${ayako.v3.featurePlugins} feature plugins · ${ayako.v3.testFiles} colocated test files.`
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
		/**
		 * DEFECT 4: THE LARGEST SENTENCE ON THE WALL WAS A REFUSAL.
		 *
		 * At 38px display type the poster read "A feature that I cannot
		 * provide for free will not be implemented." Read in isolation — which
		 * is how display type IS read — a hiring manager gets *I decline work
		 * I am not paid for*, and the sentence that disambiguates it sat
		 * beside it at 15px. The two have swapped jobs. The poster now states
		 * the promise's CONSEQUENCE, which is the part a stranger can use, and
		 * the verbatim promise survives at full weight one size down, where a
		 * quotation reads as a quotation. Nothing is softened and nothing is
		 * dropped: the same words are on the same wall.
		 *
		 * BLOCKED ON Projects.astro:193. It renders this field as
		 * `<blockquote lang="en"><p>“{promise}”</p></blockquote>` — the
		 * component supplies the quotation marks and the language tag. This
		 * string is no longer a quotation, so the marks have to go with it;
		 * on the German wall the hard-coded `lang="en"` now sits on German
		 * copy, which is the mirror of the defect being fixed here.
		 */
		promise: "Ayako has been free since 2019, and it stays free.",
		/* The note carries what the poster no longer says, which is the note
		   law on this wall: the promise in the words it was made in. */
		promiseNote: `Made publicly, and quoted verbatim: “${ayako.freeForeverPromise}”`,
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
			`${h(ihk.finalProject.hours)}, ${ihk.finalProject.window.start} to ${ihk.finalProject.window.end} — ${ihk.finalProject.certification}.`,
			`Load-tested against ${n(ihk.finalProject.loadTestServers)} real Discord servers, on my own bot's live token (project documentation, 2025-06).`,
			`${ihk.finalProject.performance.initialLoad} · ${ihk.finalProject.performance.serverSwitch} · ${ihk.finalProject.performance.cacheHitRate} · ${ihk.finalProject.performance.fps} (project documentation, 2025-06).`,
			`${ihk.finalProject.code.typescript.files} TypeScript files (${n(ihk.finalProject.code.typescript.linesOfCode)} LOC) + ${ihk.finalProject.code.svelte.files} Svelte files (${n(ihk.finalProject.code.svelte.linesOfCode)} LOC).`,
			`${h(ihk.finalProject.trackedHours)} tracked on the repo.`
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
			"Runs on hybrid sharding with a custom V8 memory monitor: 30-second heap sampling with a garbage-collection trigger at 85 %."
		],
		facts: [
			"Self-described “10,000+ servers” — repo metadata, unverified.",
			`332 files · ${n(17_250)} LOC · 128 commits, 100 % self-authored.`,
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
		facts: [`${n(4_059)} LOC across 15 files.`],
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
		facts: [`${n(4_481)} LOC across 55 files · 7-module xUnit suite.`],
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
		facts: [`${n(2_436)} LOC across 36 files · vitest suite with undici MockAgent.`],
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
		facts: [`${n(32_427)} LOC across 121 files · 15 backend service modules · 19 test files.`],
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
		facts: [`${n(3_264)} LOC of strict TypeScript across 75 files.`],
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
		text: `vr-diag — three PowerShell forensic scripts (${n(1_202)} LOC): VR crash forensics across event logs, WHEA, and minidumps; a VR lag monitor; a bugcheck analyzer. 48 captured run datasets.`
	},
	{
		text: "Restart-VR.bat — idempotent Windows batch orchestrator that boots a VR streaming stack via tasklist, CIM, and UDP-port probes."
	},
	{
		text: "Car electronics — camera install and a 12 V LiFePO₄ second-battery build in a Smart 450; ESP8266 + MQTT height map."
	}
];

/* ------------------------------------------------------------------ */
/* AI practice — subordinate placement by owner decision               */
/* ------------------------------------------------------------------ */

export const aiPractice = {
	/** Owner: "not what I want to be hired for exclusively." */
	placement: "subordinate",
	title: "How I work with agents",
	/* The old opener — "Agents do a lot of my typing." — sat ~30 px above
	   "Agents never commit, stage, or push", so the first sentence of the
	   section handed the 2026 screening objection over and only then
	   disarmed it. Two corrections in one line: the division of labour is
	   stated in a single breath with control in the end-focus position, and
	   the noun is fixed. Agents do not type; they draft. The sentence does
	   not quote the Governance card below it — a lead-in that repeats the
	   card it introduces is the same restatement fault the wall bans in its
	   margin notes. */
	/* "…and the rules they run under" left `they` to bind to the nearest
	   plural, which was "the numbers". The agents run under the rules; the
	   numbers do not. */
	intro: "Agents draft; I decide, review, and commit. Here are the numbers, and the rules the agents run under.",
	entries: [
		{
			id: "volume",
			title: "Volume",
			lines: [
				`${n(ai.transcripts.count)} Claude Code transcripts (${ai.transcripts.sizeMb} MB, ${n(ai.transcripts.events)} logged events) across ${ai.transcripts.days} days, ${ai.transcripts.window.start} to ${ai.transcripts.window.end} — ${n(ai.sessionsPerDay)} top-level sessions per day.`,
				`Session indexes evidence use since at least ${ai.transcripts.evidencedSince}.`
			]
		},
		{
			id: "orchestration",
			title: "Orchestration",
			lines: [
				`${pc(ai.subagentShare.percent)} of transcripts (${n(ai.subagentShare.count)} of ${n(ai.subagentShare.of)}) are subagent and workflow runs nested under parent sessions.`,
				`Sampled prompt-to-response ratio: ${ai.promptRatio} — long autonomous runs, steered now and then.`,
				"Multiple concurrent sessions run on one checkout under written conventions: atomic claim locks for shared logs, commit-by-pathspec against index races, mtime-based attribution checks before reverts."
			]
		},
		{
			id: "adoption",
			/* NOT A CURVE, and the old title said "curve" over four windows
			   joined with arrows — which invites a reader to see four
			   successive periods rising. They are not successive: they
			   overlap, and one of them contains the others. Same class of
			   error as "71.5 % of the top 4". The arrows are gone, each
			   window is labelled with what it spans, and the relation between
			   them is stated rather than drawn. */
			title: "Measured AI adoption",
			lines: [
				"“AI Coding” is a WakaTime category of tracked time: how much of the measured coding time ran in AI-assisted sessions — not how much of the codebase an AI wrote.",
				`Lifetime (${telemetry.trackingStart} to ${telemetry.trackingEnd}): ${pc(telemetry.aiCoding.sharePercentByWindow.lifetime)}. The 12 months to ${SNAPSHOT_AS_OF}: ${pc(telemetry.aiCoding.sharePercentByWindow.last12Months)}. July 2026, the calendar month: ${pc(telemetry.aiCoding.sharePercentByWindow.july2026)}. The 7 days to ${SNAPSHOT_AS_OF}: ${pc(telemetry.aiCoding.sharePercentByWindow.last7Days)}.`,
				"Four windows, not four periods — they overlap. The lifetime window contains all of them, and both July 2026 and the last seven days sit inside the last 12 months. Read them as four zoom levels on one record, not as a curve.",
				`${pc(telemetry.aiCoding.last12MonthsShareOfLifetimePercent)} of all AI-Coding time ever tracked falls in the last 12 months. ${hm(telemetry.aiCoding.lifetime.seconds)} lifetime.`,
				`Claude Code: ${pc(telemetry.windowJuly2026.claudeCodeEditorPercent)} of July-2026 editor time.`,
				`Markdown rose from ${pc(telemetry.lifetime.markdownPercent)} of lifetime language time to ${pc(telemetry.windowJuly2026.markdownPercent)} in July 2026 — the signature of spec-driven, agentic work.`
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
	title: "a note’s ink names its claim",
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
	 *  the wall that states it. No notice period: none was supplied, and
	 *  none may be inferred.
	 *
	 *  ORDER IS LOAD-BEARING, AND THE LAST FIX MOVED THE BRAKE TO A LOUDER
	 *  SLOT. The card used to OPEN on "Not urgently looking" — right
	 *  diagnosis, wrong remedy: initial position is theme, terminal position
	 *  is END-FOCUS, the most emphatic slot in a block. The qualifier was
	 *  moved from the weaker emphatic position to the stronger one, and it
	 *  displaced the highest-converting sentence on the page out of the last
	 *  word. The genuinely weak slot is medial, and that is where it now
	 *  sits: offer → qualifier → terms → promise. Nothing was deleted; the
	 *  qualifier is still on the card, still unhedged, and the candour is
	 *  still the reason the rest is believed.
	 *
	 *  The promise also gets its agent back. "Every mail to this address is
	 *  answered" was agentless passive inside a card that is otherwise
	 *  first-person and imperative — the one promise on the wall whose
	 *  promiser was grammatically absent.
	 *
	 *  Location is stated at REGION level only, matching hero.location and
	 *  the footer. "Bodensee-Ravensburg" named a town and put a third
	 *  region name on a page that publishes one. */
	rightNow: {
		title: "Right now",
		lines: [
			"Open to TypeScript/Node product work — backend or full-stack. Tell me about it.",
			"Full-stack developer at Raleo Digital GmbH since 2025. Not urgently looking.",
			"Remote, or on site in the Bodensee-Oberschwaben region.",
			"I answer every mail to this address."
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
	/* GERMAN INSTITUTIONS KEEP THEIR GERMAN NAMES, GLOSSED. Three of these
	   were filed under machine-translated names — "Electronics School
	   Tettnang", "Ravensburg Technical High School", "1-Year Vocational
	   School for Electrical Engineering" — and nothing is registered,
	   accredited or findable under any of them. A translated institution
	   name is not a translation, it is a different institution. The name is
	   the record; the gloss is the courtesy, and it goes in the slot that
	   renders beside it. */
	{
		id: "est",
		institution: "Elektronikschule Tettnang",
		detail: "The apprenticeship’s vocational school (Berufsschule).",
		start: "2022-09",
		end: "2025-07",
		logo: "/EST.webp"
	},
	{
		id: "bfe",
		institution: "Einjährige Berufsfachschule für Elektrotechnik",
		detail: "One-year full-time vocational school, electrical engineering.",
		start: "2019-08",
		end: "2020-02",
		logo: "/GSR.webp"
	},
	{
		id: "tg",
		institution: "Technisches Gymnasium Ravensburg",
		detail: "Technical upper-secondary school.",
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
