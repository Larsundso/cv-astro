/**
 * getCharts — SSR ECharts SVG print-outs for the telemetry wall section.
 *
 * Complete rewrite for "Der Rote Faden": the charts are clean print-outs
 * pinned to cork, not dashboard widgets.
 *
 * - Paper ground: transparent chart background — the PinCard supplies the
 *   stock; axes and grid lines are recessive ink mixes.
 * - The six pride inks are a DETERMINISTIC series palette (no Math.random):
 *   entities register an ink on first sight and keep it across every chart
 *   of a build. The adjacency order is CVD-checked — worst adjacent pair
 *   ΔE 11.2 (OKLab ×100) across protan/deutan/tritan simulations,
 *   brute-forced over all 720 orders of the fixed token set.
 * - Atkinson Hyperlegible labels (the print material), values in ink —
 *   never in the series color.
 * - Responsive: width/height stripped from the SVG root, viewBox retained;
 *   the consumer sizes it with CSS. The SVG is presentational
 *   (aria-hidden) — the consumer labels the frame and renders the
 *   accompanying data table.
 * - Snapshot-safe: with no WAKA_KEY every figure comes from the checked-in,
 *   dated snapshot; the seven-day charts are omitted, never fabricated.
 * - Voice law: every chart's `unit` line carries the unit, the window, and
 *   the as-of date.
 */
import * as echarts from "echarts";
import { getWall, type Locale, type WallModule } from "~/data/i18n";
import { telemetry } from "~/data/snapshot";
import {
	figure,
	formatH,
	formatHCoarse,
	formatHM,
	formatHMCoarse,
	pct,
	type StatSlice,
	type TelemetrySource
} from "~/data/telemetry";
import type { PrideInk } from "~/data/wall";
import getInsights from "./getInsights";
import getSummaries, { type DaySummary } from "./getSummaries";
import getTotalTime from "./getTotalTime";

/** Locale-resolved display strings (wall.ts / wall.de.ts, same shape). */
type ChartStrings = WallModule["chartStrings"];

/* ------------------------------------------------------------------ */
/* Wall tokens as sRGB hex                                             */
/* ------------------------------------------------------------------ */
/* The SSR renderer emits concrete paint values, so the OKLCH tokens in
 * src/styles/wall.css are resolved to hex here (cork resolves to #e1d2bb,
 * cross-checked against the foundation reference). Mixes are computed in
 * OKLab, matching color-mix(in oklab, …). */

const INK = "#27201a"; // --ink
const INK_SOFT = "#49413b"; // --ink-soft
const PAPER = "#f9f7f1"; // --paper
const GRID_LINE = "#d8d5cf"; // ink 14 % over paper
const AXIS_LINE = "#99948e"; // ink 42 % over paper — chrome only, never a mark
/**
 * THE REMAINDER IS A QUANTITY, SO IT IS DRAWN IN INK.
 *
 * The "everything else" bar used to be `--paper-aged` with a 1 px hairline,
 * "so a paper-on-paper bar still has an edge". Two things were wrong with
 * that, and only one of them was a contrast bug.
 *
 * Measured against the card stock including its wash: the fill came out at
 * 1.117:1, APCA Lc 0.0 — below the threshold at which two areas can be told
 * apart at all — and the safety hairline at 1.281:1. The hex had also
 * drifted: it was pinned to `oklch(94% 0.02 85)` and that token became
 * `oklch(90% 0.026 84)` a cycle ago. Syncing the hex is NOT the fix; it
 * moves 1.117 to 1.259 and changes nothing a reader can perceive.
 *
 * The encoding was the worse half. That bar carries 2,632 h — 48.45 % of
 * the record, and on the languages sheet the single quantity equal to all
 * three coloured bars put together — while a 51.55 : 48.45 split read
 * pre-attentively as a shutout. And 400 px below it the habit field teaches
 * the reader, explicitly, that pale-and-hollow means NONE. The wall's own
 * mark for absence was being used for its largest unnamed quantity.
 *
 * So the remainder is `--ink` at 50 % over `--paper`: a grey INK printed on
 * the sheet, 3.12:1, past the 3:1 floor for a graphical object. Everything
 * else here is ink on a stock, and a stock cannot be printed onto a stock.
 * The hairline goes with it — a real mark does not need a safety edge.
 * Grey stays 2.0–2.5× less salient than every pride ink, so the remainder
 * remains subordinate while ceasing to be invisible; and because it is
 * lighter than all six inks it also separates from them by lightness alone,
 * in greyscale, on e-ink and under every CVD simulation.
 *
 * The same grey raises the habit field's hollow cell, which was outlined in
 * AXIS_LINE at 2.808:1 — likewise under the floor. Sharing one ink is
 * deliberate: hollow keeps meaning absence, solid means not-itemised, and
 * the two stop borrowing each other's clothes.
 */
const INK_MUTED = "#908c86"; // --ink at 50 % over --paper — 3.12:1
/* Defensive fallback only: every charted name gets a pride ink. */
const NEUTRAL = "#aba6a0"; // ink 34 % over paper

const INK_HEX: Record<PrideInk, string> = {
	magenta: "#9a0064", // --ink-magenta
	blue: "#184da3", // --ink-blue
	amber: "#845000", // --ink-amber
	teal: "#006166", // --ink-teal
	violet: "#5e2b9a", // --ink-violet
	green: "#03642b" // --ink-green
};

/** Fixed assignment order — CVD-safe adjacency (see module doc). */
const SERIES_ORDER: readonly PrideInk[] = ["magenta", "blue", "amber", "teal", "violet", "green"];

/**
 * THE WALL'S LARGEST MASS MAY NOT ALSO BE ITS MOST SATURATED ONE.
 *
 * Two disciplines arrived at the habit field from opposite directions and
 * met on its paint.
 *
 * Measured as chroma, over the habit card's frame: pixels at CIE C* >= 25
 * were 16.84 % of the viewport and 99.4 % of those were THIS green, while
 * `--thread` — the wall's declared single structural accent, the thing the
 * site is named after — was 0.065 % of the same frame. A ratio of 258:1.
 * The filled block is ~377,400px² of stippled mid-dark, 6.8x the area of
 * the largest district sign. wall.css:39-40 states that `--thread` is the
 * only structural accent; measured, it was the third-strongest.
 *
 * Measured as mark-area: this field is 64.7 % of ALL data-graphic area on
 * the site, and it encodes two numbers, both restated as a sentence 20px
 * beneath it. What those two numbers attest is PRESENCE, not competence —
 * the exact objection levelled at the GitHub contribution graph, and the
 * weakest claim the wall makes. The wall was drawing hardest the one thing
 * only it can attest.
 *
 * So the fill keeps `--ink-green`'s lightness and hue and gives up two
 * thirds of its chroma: `oklch(44% 0.045 150)` against the token's
 * `oklch(44% 0.12 150)`. Computed on the resolved hex, not assumed —
 * OKLCH 44 % is not CIE L* 44, so both were converted:
 *   CIE C* 46.31 -> 16.95 — under the 25 that census counted, so the field
 *     drops out of that measurement altogether rather than merely scoring
 *     lower in it;
 *   CIE L* 36.57 -> 35.72 — still the same dark mass, which is the half of
 *     the graphic that was never the problem;
 *   7.069:1 against `--paper` (the file's own convention: reproducing
 *     INK_MUTED by this method returns its declared 3.121:1 exactly), far
 *     past the 3:1 floor for a graphical object. Unlike the hairline
 *     failures recorded above (14.989 -> 1.281, 3.12 -> 1.623) this figure
 *     cannot collapse between declaration and render: those were sub-pixel
 *     STROKES, and a pattern-filled rect has fully inked interior pixels at
 *     any cell size the field can reach.
 * Against INK_MUTED, which outlines the hollow cell, it separates by 22.7
 * points of L* — solid-and-dark still cannot be mistaken for hollow-and-
 * grey, so "hollow means absence, solid means not-itemised" survives intact.
 *
 * This is a SEPARATE constant, deliberately, not an edit to INK_HEX.green:
 * that hex is SERIES_ORDER[5] and a series ink, and its value is
 * load-bearing for the brute-forced CVD adjacency claimed in the module doc.
 * The green ANNOTATION ink on this same card is likewise untouched — green
 * still names the claim ("the run"); the field simply stops being a flag
 * flown in it and becomes a value.
 *
 * The second half of the finding — the block's rendered HEIGHT, 538px, 60 %
 * of a 900px viewport — is not fixable here. That height is `width: 100%`
 * in the consumer's stylesheet applied to this viewBox, and the only lever
 * in this file is HABIT_COLS. Widening it is the wrong trade: at 390 the
 * field renders at 0.4827x, so past ~54 columns the 3-unit gap falls below
 * 0.95px while the hollow cell's stroke is a non-scaling 1.25px, and the
 * empty days merge into a grey mesh — which destroys the exact distinction
 * the two-block split exists to make, to fix a defect measured at 1440. A
 * max-width on the field, applied identically to BOTH blocks so their cell
 * sizes cannot diverge, belongs in the stylesheet.
 */
const HABIT_FILL = "#415a45"; // oklch(44% 0.045 150)

/* ------------------------------------------------------------------ */
/* The annotation ink rule                                             */
/* ------------------------------------------------------------------ */
/* On the wall an ink names a KIND OF CLAIM (magenta = mine alone,
 * violet = the method, teal = the provenance, green = the run,
 * amber = the limit, blue = the way in). Inside a chart an ink names a
 * SERIES. Both were being written in the same medium — a Shantell Sans
 * margin note — so the languages note came out magenta purely because
 * TypeScript is SERIES_ORDER[0], and under the wall's only stated code
 * magenta means "mine alone".
 *
 * So: series inks stay on the MARKS (they are legended by the chart's own
 * direct labels and by its data table); every margin NOTE is set from its
 * claim, exactly like every other note on the wall. */
const CLAIM_INK = {
	/** Ranked own projects, and the Ayako family split: sole ownership. */
	projects: "magenta",
	/* MOVED TEAL → AMBER, deliberately, and stated here so it cannot be
	   read as drift. With the concentration promoted into the TITLE (see
	   FINDINGS below), the languages note no longer answers "how do you
	   know?" — it answers "where does this claim stop?", on both branches:
	   on the snapshot sheet the curation (application languages only), on a
	   live pull the top-N cut. That is the amber job as the ink key defines
	   it, and it gives amber the second genuine job the wall was short of. */
	languages: "amber",
	/** Still running, this week and since 2021. */
	run: "green"
} as const satisfies Record<string, PrideInk>;

const FONT_BODY = '"Atkinson Hyperlegible", "Segoe UI", sans-serif';
/** Ranked bars stay legible when scaled down to a phone-wide card. */
const RANKED_W = 460;

/**
 * THE ONE FILE IN src/ THAT DECLARES A RAW FONT SIZE, RECONCILED WITH THE
 * LADDER.
 *
 * ECharts takes a number, not a token, and that number is written in the
 * SVG's OWN user units — then the consumer scales the whole sheet
 * (`width: 100%` over a 460-unit viewBox). Measured on the render at 1440:
 * the ranked sheets sit in a 539.9px card, `getScreenCTM()` = 1.1738, and a
 * nominal 15 was reaching the reader at 17.61px. Fourteen labels — seven
 * rows across the two snapshot sheets, each carrying a category label and a
 * value label — in both locales.
 *
 * Neither number is on the ladder, which at 1440 resolves to
 * 10.86 / 13.97 / 16 / 20 / 24 / 30 / 38 / 48. So the chart's labels sat
 * fractionally larger than the caption directly above them (`--step-0`,
 * 16px at 1440) for no reason a reader could name, and wall.css:118-122
 * says nothing in src/ may declare a raw size.
 *
 * So the size is declared as the STEP DIVIDED BY THE SCALE IT WILL BE SEEN
 * THROUGH: 16 / 1.1738 = 13.63, which lands at 15.999px — the caption's own
 * size, to a hundredth of a pixel.
 *
 * The better version reads the step at runtime
 * (`parseFloat(getComputedStyle(host).fontSize) / ctm`) and tracks the
 * ladder at every width instead of only at 1440. It is not available here,
 * and not for want of trying: these SVGs come out of
 * `echarts.init(null, null, { ssr: true })` at build time — no host node, no
 * document, no layout to compute a CTM from — and the markup ships static
 * and aria-hidden, with no client script to correct it afterwards. The match
 * is therefore exact at 1440 and approximate below it, where the card width
 * and the clamp() shrink on different curves. That residue is inherent to a
 * viewBox-scaled label and is not repaired by choosing a different constant.
 *
 * Bar geometry is untouched by this: `grid.left` stays 138 and
 * `axisLabel.width` stays 130 — the pair that took the plot width off the
 * length of a category label and put the two snapshot sheets on one domain.
 * Smaller labels give that cap more headroom; tightening it would hand the
 * bars' length back to the words, which is the defect it was fixed for.
 */
const RANKED_CTM = 1.1738; // measured: 539.9px rendered / 460 viewBox units
const STEP_0_AT_1440 = 16; // --step-0 clamps to 1rem at 1440 (0.906rem + 0.14vw = 16.51)
const RANKED_LABEL = Math.round((STEP_0_AT_1440 / RANKED_CTM) * 100) / 100; // 13.63
/** Seven stacked days + legend need the full sheet; consumers pan on narrow screens. */
const STACKED_W = 620;

/* ------------------------------------------------------------------ */
/* Finding copy — titles that state a result, notes that add a claim   */
/* ------------------------------------------------------------------ */
/* Every chart on this wall used to be titled by its axis ("Top 4
 * languages") and annotated with a number already printed beside the
 * mark ("TypeScript: 3,019.9 h" is the y-axis label concatenated with the
 * bar's own end label). Titles now carry the finding and margin notes
 * carry what the chart cannot show.
 *
 * No figure is invented here: every value is derived at build time from
 * the same published rows the chart draws, and the derivation is stated
 * in the note itself ("of the top 4", "out of 10"). */
interface FindingCopy {
	/** Snapshot projects sheet: the Ayako family outweighs everything else. */
	ayakoTitle: string;
	ayakoNote: string;
	/** Snapshot sheet: the rows sum to the record, so the title can state the
	 *  leading language's share of everything tracked. */
	languagesTitleOfRecord: (name: string, share: string) => string;
	/** Live sheet: the rows are a top-N slice, so the title's denominator is
	 *  the sheet itself and the title must say so. */
	languagesTitleOfChart: (name: string, share: string, of: number) => string;
	/** Snapshot sheet note — the curation, which is the sheet's limit. */
	languagesNoteCuration: string;
	/** Live sheet note — the cut, which is that sheet's limit. */
	languagesNoteCut: (of: number) => string;
	/** Habit sheet. */
	habitTitle: (daysInTen: number, sinceYear: string) => string;
	habitNote: (idle: string, startYear: string, endYear: string) => string;
	habitUnit: (asOf: string) => string;
	/** In-place label on the hollow block of the habit field. */
	idleBlockLabel: (idle: string) => string;
}

const FINDINGS: Record<Locale, FindingCopy> = {
	en: {
		ayakoTitle: "One project family outweighs all the rest",
		/* The note used to read "mine end to end — and bigger than every
		   other project put together", which is the title again in other
		   words, pinned 40 px from it. Under the wall's own law
		   (wall.ts:48-49) a note must carry what the sheet cannot. The bars
		   can draw the size; nothing on the sheet can draw who built it and
		   who else touched it. That is what the note now says, and it is
		   what the two bars are actually evidence about. */
		ayakoNote: "mine end to end — no team, no handover",
		/* TITLE AND NOTE WERE THE WRONG WAY ROUND. The title read "The
		   product is written in TypeScript" — a claim about the PRODUCT —
		   directly above a unit line reading "lifetime" and a bar labelled
		   "Everything else". The rows on this sheet sum to the whole tracked
		   record; the product is precisely the object these bars cannot
		   draw, so the headline and the axis named different things two
		   lines apart. Meanwhile the note carried the correct referent.
		   So they swap: the title now carries the concentration, in the
		   record's own terms, and the note carries the curation limit that
		   until now existed only in alt text, where no sighted reader meets
		   it. The share is the API's own published figure for the leading
		   language, printed to the same two decimals as the data table two
		   lines below — not a ratio re-derived here, which would have been
		   off by hundredths and invited exactly the check it must survive. */
		languagesTitleOfRecord: (name, share) => `${name} carries ${share} of everything tracked`,
		languagesTitleOfChart: (name, share, of) =>
			`${name} carries ${share} of the ${of} languages on this sheet`,
		languagesNoteCuration: "application languages only — data and markup formats are not charted",
		languagesNoteCut: (of) => `the top ${of} only — the rest of the record is not on this sheet`,
		habitTitle: (daysInTen, sinceYear) =>
			`Coded on ${daysInTen} days out of 10 since ${sinceYear}`,
		habitNote: (idle, startYear, endYear) =>
			`the ${idle} empty days are spread across ${startYear}–${endYear} — not the last ${idle}`,
		habitUnit: (asOf) => `One cell per day · lifetime tally · as of ${asOf}`,
		idleBlockLabel: (idle) => `${idle} days without tracked coding`
	},
	de: {
		ayakoTitle: "Eine Projektfamilie wiegt schwerer als alle anderen",
		/* siehe en: die Notiz wiederholte den Titel daneben. Die Balken
		   zeigen die Größe; wer es gebaut hat, zeigt kein Balken. */
		ayakoNote: "von vorn bis hinten meins — kein Team, keine Übergabe",
		/* siehe en: Titel und Notiz waren vertauscht. Der Titel sprach über
		   das Produkt, über einer Einheitszeile „Gesamtzeitraum“ und einem
		   Balken „Alles andere“ — die Zeilen summieren sich zur gesamten
		   Aufzeichnung, und genau das Produkt können diese Balken nicht
		   zeichnen. Jetzt trägt der Titel die Konzentration und die Notiz
		   die Auswahlgrenze, die bisher nur im Alt-Text stand. */
		languagesTitleOfRecord: (name, share) =>
			`${name} trägt ${share} der gesamten Aufzeichnung`,
		languagesTitleOfChart: (name, share, of) =>
			`${name} trägt ${share} der ${of} Sprachen auf diesem Blatt`,
		languagesNoteCuration:
			"nur Anwendungssprachen — Daten- und Auszeichnungsformate sind nicht erfasst",
		languagesNoteCut: (of) =>
			`nur die Top ${of} — der Rest der Aufzeichnung steht nicht auf diesem Blatt`,
		/* Satzstellung wie im Deutschen üblich: die Zeitangabe zuerst. Die
		   alte Reihenfolge war die englische Klauselfolge, eins zu eins. */
		habitTitle: (daysInTen, sinceYear) =>
			`Seit ${sinceYear} an ${daysInTen} von 10 Tagen programmiert`,
		habitNote: (idle, startYear, endYear) =>
			`die ${idle} leeren Tage verteilen sich über ${startYear}–${endYear} — es sind nicht die letzten ${idle}`,
		habitUnit: (asOf) => `Eine Zelle pro Tag · Gesamtzählung · Stand ${asOf}`,
		idleBlockLabel: (idle) => `${idle} Tage ohne erfasste Programmierzeit`
	}
};

/* ------------------------------------------------------------------ */
/* Public shapes                                                       */
/* ------------------------------------------------------------------ */

export interface ChartAnnotation {
	/** Handwritten margin note quoting the headline figure. */
	text: string;
	ink: PrideInk;
}

export interface ChartTable {
	head: string[];
	/** First cell of each row is the row header. */
	rows: string[][];
	/** Footnote, e.g. explaining a derived figure marked with "*". */
	note?: string;
}

export interface PrintChart {
	id: "projects" | "languages" | "recent-projects" | "recent-languages";
	title: string;
	/** Unit + window + as-of line, printed under the title (voice law). */
	unit: string;
	/** Presentational inline SVG: aria-hidden, viewBox-scaled, CSS-sized. */
	svg: string;
	/** Full-sentence description for the labelled chart frame. */
	alt: string;
	table: ChartTable;
	annotation: ChartAnnotation;
}

export interface HabitField {
	title: string;
	unit: string;
	/** The filled block: days with tracked coding. */
	svg: string;
	/** The empty days, printed apart from the run they are not part of —
	 *  null when there are none. */
	idle: { svg: string; label: string } | null;
	alt: string;
	/** Printed figures line — the accessible record of the grid. */
	line: string;
	/** Honesty clause: the cells tally days, they are not a calendar. */
	smallPrint: string;
	asOf: string;
	annotation: ChartAnnotation;
}

export interface ChartsBundle {
	source: TelemetrySource;
	asOf: string;
	/** Start of the tracking span, e.g. "2021-10-29". */
	trackingStart: string;
	/** Two charts on snapshot builds, four on live builds. */
	charts: PrintChart[];
	habit: HabitField;
	/** Typed provenance-card lines; snapshot builds add the July-2026
	 *  "currently" line because the seven-day window has no snapshot. */
	provenance: string[];
}

/* ------------------------------------------------------------------ */
/* Deterministic pride-ink assignment                                  */
/* ------------------------------------------------------------------ */

type InkFor = (name: string) => string;

/** First-seen registration: a name keeps its ink for the whole build. */
const inkRegistry = (): InkFor => {
	const assigned = new Map<string, string>();
	return (name) => {
		let ink = assigned.get(name);
		if (!ink) {
			ink = INK_HEX[SERIES_ORDER[assigned.size % SERIES_ORDER.length]];
			assigned.set(name, ink);
		}
		return ink;
	};
};

/** Registry inks for one chart, de-duplicated so two entities can never
 *  share an ink on the same sheet (possible once >6 names registered). */
const chartInks = (names: string[], inkFor: InkFor): Map<string, string> => {
	const used = new Set<string>();
	const out = new Map<string, string>();
	for (const name of names) {
		let ink = inkFor(name);
		if (used.has(ink)) {
			ink = SERIES_ORDER.map((k) => INK_HEX[k]).find((hex) => !used.has(hex)) ?? ink;
		}
		used.add(ink);
		out.set(name, ink);
	}
	return out;
};

/* ------------------------------------------------------------------ */
/* Rendering plumbing                                                  */
/* ------------------------------------------------------------------ */

const renderSvg = (width: number, height: number, option: echarts.EChartsOption): string => {
	const chart = echarts.init(null, null, {
		renderer: "svg",
		ssr: true,
		width,
		height
	});
	chart.setOption({
		animation: false,
		backgroundColor: "transparent",
		textStyle: { fontFamily: FONT_BODY, color: INK },
		...option
	});
	const svg = chart.renderToSVGString();
	chart.dispose();
	// Responsive + presentational: keep the viewBox, drop the fixed size,
	// hide from assistive tech (the frame carries the label, the table the data).
	const cut = svg.indexOf(">");
	const open = svg
		.slice(0, cut)
		.replace(/\s(?:width|height)="[^"]*"/g, "")
		.replace("<svg", '<svg aria-hidden="true" focusable="false"');
	return open + svg.slice(cut);
};

const round2 = (n: number): number => Math.round(n * 100) / 100;

/* Every printed figure is formatted for the locale of the page it is
 * printed on, from the numeric source — a German reader parses the en-US
 * "3,019.9 h" as three-point-oh-one-nine. Two deliberate exceptions, both
 * required: the chart ALT TEXT and the derived-figure FOOTNOTES stay in
 * en-US, because they are the screen-reader reader's only provenance and
 * are quoted verbatim elsewhere. Hence every ranked row carries both. */
const pctIn = (p: number | null, locale: Locale): string | null =>
	p == null ? null : pct(round2(p), locale);

/* ------------------------------------------------------------------ */
/* Ranked horizontal bars (top projects / top languages)               */
/* ------------------------------------------------------------------ */

interface RankedRow {
	name: string;
	/** CARD FACE, in the page's locale: whole hours above 1,000 h, because
	 *  the minutes digit is not identified at that magnitude (see
	 *  telemetry.ts). May carry a trailing "*". */
	time: string;
	/** THE FOLD, in the page's locale: the exact figure, always. The data
	 *  table is where a reader who wants the minutes goes to find them, so
	 *  the coarser face costs no fact. May carry a trailing "*". */
	timeExact: string;
	/** The exact figure in en-US, for the alt text (which never localises). */
	timeEn: string;
	hours: number;
	/** Share display, e.g. "55.68 %"; null when not recorded. */
	share: string | null;
	/** The same share in en-US, for the alt text. */
	shareEn: string | null;
	color: string;
}

/**
 * TWO SHEETS 22px APART WERE NOT TO A COMMON SCALE, so the smaller number
 * drew the longer bar.
 *
 * Measured on the render: the projects sheet drew 2,800.7 h as 259.79px and
 * the languages sheet drew 3,019.9 h as 240.18px — same ink, same bar
 * height, same units, same window, one gutter apart, with the larger
 * quantity 8.2 % SHORTER. Cross-sheet lie factor 1.166 with the sign
 * inverted.
 *
 * Two causes, and both had to go. `xAxis` carried no `max`, so each sheet
 * auto-scaled to its own maximum; and `containLabel: true` made the plot
 * width whatever the longest category label did not eat, so the error
 * differed by LOCALE — 1.166 English, 1.115 German, because "Everything
 * else" and "Alles andere" are different lengths. The physical length of a
 * bar was being set by the length of a word.
 *
 * `left: 138` is the existing 130vb axisLabel cap plus the 8vb gap, fixed so
 * the plot no longer depends on the label. `axisMax` is opt-in: sheets that
 * are shares of ONE record pass a shared maximum; unrelated sheets keep
 * their own scale, which is correct for them.
 *
 * Rejected, after measuring it: `max = career total (5,432.78 h)`, which is
 * more elegant — every bar would read as a share of the record, matching
 * both unit lines. It takes Vue.js from 7.82px to ~4.4px at a 390 viewport,
 * which is not a bar any more.
 */
/** Shared axis domain for the two snapshot sheets; set where the projects
 *  sheet is built, consumed by both. `undefined` on the full-data path,
 *  where each sheet legitimately keeps its own scale. */
let SNAPSHOT_AXIS_MAX: number | undefined;

const rankedBarSvg = (rows: RankedRow[], axisMax?: number): string =>
	renderSvg(RANKED_W, 24 + rows.length * 48, {
		grid: { left: 138, right: 104, top: 10, bottom: 10 },
		xAxis: { type: "value", show: false, min: 0, max: axisMax },
		yAxis: {
			type: "category",
			inverse: true,
			data: rows.map((r) => r.name),
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: {
				color: INK,
				fontFamily: FONT_BODY,
				fontSize: RANKED_LABEL,
				width: 130,
				overflow: "truncate"
			}
		},
		series: [
			{
				type: "bar",
				barWidth: 18,
				data: rows.map((r) => ({
					value: round2(r.hours),
					itemStyle: { color: r.color, borderRadius: [0, 4, 4, 0] }
				})),
				label: {
					show: true,
					position: "right",
					distance: 8,
					color: INK,
					fontFamily: FONT_BODY,
					fontWeight: "bold",
					fontSize: RANKED_LABEL,
					formatter: (p: { dataIndex: number }) => rows[p.dataIndex].time
				}
			}
		]
	});

/**
 * How much of the charted total the leading bar carries.
 *
 * What the sheet cannot show is how lopsided the bars are, because judging
 * that means summing the rest of them by eye. This is a derived ratio over
 * exactly the hours printed on the sheet — nothing is invented — and the
 * note that quotes it must state THIS denominator, never a different one.
 *
 * LIVE SHEETS ONLY. On a live pull the rows are a top-N slice, there is no
 * published share of that slice, and this ratio is the only denominator the
 * sheet has — so the title names it ("of the 5 languages on this sheet").
 * The snapshot sheet does NOT use this: its rows include the remainder and
 * therefore sum to the record, so the leading language's share of the whole
 * is already published, to two decimals, in the same pull the table prints
 * from. Re-deriving it there would put 55.5 or 55.6 above a table reading
 * 55.59. Getting that pairing wrong is how "71.5 % of the top 4" came to
 * sit two lines above a table printing 55.59 %.
 */
const leadShareOfChart = (rows: RankedRow[], locale: Locale): string | null => {
	const total = rows.reduce((sum, r) => sum + r.hours, 0);
	if (rows.length < 2 || total <= 0) return null;
	return `${figure(Math.round((rows[0].hours / total) * 1000) / 10, locale)} %`;
};

/**
 * THE ALT TEXT SPEAKS THE READER'S NUMBERS NOW.
 *
 * It used to be forced to en-US in every locale, and the justification was
 * real when it was written: the alt text was "the screen-reader reader's
 * only provenance and is quoted verbatim elsewhere". That expired when the
 * `<details>` data tables shipped — opened on /de/ they already carry
 * `2.800,7 h` and `55,59 %`, correctly localised, one click away. Provenance
 * lives in the value, not in the separator.
 *
 * What the exception cost, meanwhile, was paid by the one audience that
 * cannot see the visible card. A German screen reader speaking `1,739` says
 * *eins Komma sieben drei neun*, so the wall's largest graphic was announced
 * as 1.7 cells and its biggest project as 2.8 hours — three orders of
 * magnitude out. That is exactly the defect the data layer's own rule was
 * written against ("8,357 Servern" reads as eight point three five seven);
 * the rule was written for the visible card and the exception then swallowed
 * it for everyone who cannot see one.
 */
const rankedAlt = (intro: string, rows: RankedRow[], locale: Locale = "en"): string =>
	`${intro}: ${rows
		.map((r) => {
			const time = locale === "en" ? r.timeEn : r.timeExact;
			const share = locale === "en" ? r.shareEn : r.share;
			return `${r.name} ${time}${share ? ` (${share})` : ""}`;
		})
		.join("; ")}.`;

const rankedTable = (
	kind: string,
	heads: ChartStrings["tableHeads"],
	rows: RankedRow[],
	note?: string
): ChartTable => ({
	head: [kind, heads.trackedTime, heads.share],
	/* The fold prints the EXACT figure even where the sheet's face prints
	   whole hours: the reduction is one of displayed resolution, and a
	   reader who opens the table is asking for the resolution. */
	rows: rows.map((r) => [r.name, r.timeExact, r.share ?? "—"]),
	...(note ? { note } : {})
});

/* ------------------------------------------------------------------ */
/* Stacked daily bars (last 7 days)                                    */
/* ------------------------------------------------------------------ */

interface StackResult {
	svg: string;
	names: string[];
	/** Seconds per series per day, aligned with `names`. */
	matrix: number[][];
	/** Seconds outside the top series, per day. */
	other: number[];
	/** Summed seconds of the leading series across the window. */
	leadSeconds: number;
}

const stackedDays = (
	days: DaySummary[],
	pick: (d: DaySummary) => StatSlice[],
	inkFor: InkFor,
	cs: ChartStrings,
	locale: Locale
): StackResult => {
	const totals = new Map<string, number>();
	for (const day of days) {
		for (const slice of pick(day)) {
			totals.set(slice.name, (totals.get(slice.name) ?? 0) + (slice.seconds ?? 0));
		}
	}
	const names = [...totals.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([name]) => name);
	const colors = chartInks(names, inkFor);

	const matrix = names.map((name) =>
		days.map((day) => pick(day).find((s) => s.name === name)?.seconds ?? 0)
	);
	const other = days.map((day, i) => {
		const covered = matrix.reduce((sum, row) => sum + row[i], 0);
		return Math.max(0, day.total.seconds - covered);
	});
	const hasOther = other.some((s) => s >= 60);

	/* Every segment carries the same 1 px paper border — the remainder no
	   longer needs a hairline of its own, because it is no longer paper. */
	const barSeries = (name: string, color: string, seconds: number[]) => ({
		name,
		type: "bar" as const,
		stack: "day",
		barWidth: 26,
		// 1px paper border on every segment = a 2px paper gap between fills
		itemStyle: { color, borderColor: PAPER, borderWidth: 1 },
		data: seconds.map((s) => round2(s / 3600))
	});

	/* The 12s below are NOT reconciled with the ladder the way the ranked
	   sheets' labels are, and deliberately so. That reconciliation needs the
	   scale the sheet is seen through, and these sheets have none to measure:
	   they exist only on a live pull, and their card is a pan region
	   (`overflow-x: auto`, `min-width: 34rem`), so the scale is whatever the
	   pan leaves rather than a card width. Guessing a divisor would put a
	   number on the ladder in this comment and off it on the screen. These
	   stay 12 until they are measured on a live build. */
	const svg = renderSvg(STACKED_W, 368, {
		/* The key sits directly above the marks it names, not parked below
		 * the axis, and it prints the whole name: 620 px across five or six
		 * entries has the room, and a legend that abbreviates the one thing
		 * it exists to identify is worse than no legend. */
		grid: { left: 8, right: 8, top: 72, bottom: 8, containLabel: true },
		legend: {
			top: 0,
			left: 0,
			icon: "rect",
			itemWidth: 10,
			itemHeight: 10,
			itemGap: 14,
			width: STACKED_W - 16,
			textStyle: { color: INK_SOFT, fontFamily: FONT_BODY, fontSize: 12 },
			// only a pathological name is ever cut; full names live in the table
			formatter: (name: string) => (name.length > 32 ? `${name.slice(0, 31)}…` : name)
		},
		xAxis: {
			type: "category",
			data: days.map((d) => d.date.slice(5)),
			axisLine: { lineStyle: { color: AXIS_LINE } },
			axisTick: { show: false },
			axisLabel: { color: INK_SOFT, fontFamily: FONT_BODY, fontSize: 12 }
		},
		yAxis: {
			type: "value",
			splitNumber: 3,
			axisLabel: {
				color: INK_SOFT,
				fontFamily: FONT_BODY,
				fontSize: 12,
				// keep the locale's own "{value} h" wording, localise the figure
				formatter: (value: number) => cs.axisHours.replace("{value}", figure(value, locale))
			},
			splitLine: { lineStyle: { color: GRID_LINE } }
		},
		series: [
			...names.map((name, i) => barSeries(name, colors.get(name) ?? NEUTRAL, matrix[i])),
			...(hasOther ? [barSeries(cs.other, INK_MUTED, other)] : [])
		]
	});

	return {
		svg,
		names,
		matrix,
		other,
		leadSeconds: names.length ? (totals.get(names[0]) ?? 0) : 0
	};
};

const stackedTable = (
	days: DaySummary[],
	stack: StackResult,
	cs: ChartStrings,
	locale: Locale
): ChartTable => ({
	head: [cs.tableHeads.day, ...stack.names, cs.other, cs.tableHeads.total],
	rows: days.map((day, i) => [
		day.date,
		...stack.matrix.map((row) => (row[i] >= 60 ? formatHM(row[i], locale) : "—")),
		stack.other[i] >= 60 ? formatHM(stack.other[i], locale) : "—",
		// the data layer's own string is en-US; this column is the page's
		formatHM(day.total.seconds, locale)
	])
});

/* ------------------------------------------------------------------ */
/* The habit field — two tallies, not one calendar                     */
/* ------------------------------------------------------------------ */
/* Rendered as pattern-filled rects (single-digit DOM nodes for 1,700+
 * cells). Only the COUNTS are published — the snapshot holds no per-day
 * dates at all — so cells run in sequence: a tally, deliberately not a
 * calendar.
 *
 * That is exactly where the old version lied. Filling 1,575 of 1,739
 * cells in sequence stacked the 164 unfilled ones as a solid block at the
 * bottom-right of a grid, and every convention says the tail of a dated
 * left-to-right grid is the recent past. The graphic therefore asserted a
 * four-month gap that does not exist, and the only correction was a line
 * of grey small print underneath it — the weaker label.
 *
 * So the empty days are now their own block, on their own fresh row,
 * behind a rule, under a label of their own. The label is HTML rather
 * than SVG text on purpose: inside the SVG it would scale with the
 * viewBox and shrink to seven pixels on a phone, which is how the sheet
 * got into this trouble in the first place. It rides the type ramp
 * instead, and it is the stronger label on the card. */

const HABIT_COLS = 47; // 1,739 elapsed days = 47 × 37, a full rectangle
const HABIT_CELL = 10;
const HABIT_GAP = 3;
const HABIT_PITCH = HABIT_CELL + HABIT_GAP;

/** One block of `count` cells, filled ("on") or hollow ("off"). */
const dayBlockSvg = (count: number, kind: "on" | "off"): string => {
	if (count <= 0) return "";
	const w = HABIT_COLS * HABIT_PITCH - HABIT_GAP;
	const h = Math.ceil(count / HABIT_COLS) * HABIT_PITCH - HABIT_GAP;

	/** Cover a sequential run of `count` cells with at most 2 rects. */
	const parts: string[] = [];
	const rect = (row: number, cols: number, rowSpan = 1) =>
		parts.push(
			`<rect x="0" y="${row * HABIT_PITCH}" width="${cols * HABIT_PITCH - HABIT_GAP}" height="${rowSpan * HABIT_PITCH - HABIT_GAP}"/>`
		);
	const full = Math.floor(count / HABIT_COLS);
	const rest = count % HABIT_COLS;
	if (full > 0) rect(0, HABIT_COLS, full);
	if (rest > 0) rect(full, rest);

	const id = `rf-day-${kind}`;
	const cell =
		kind === "on"
			? `<rect width="${HABIT_CELL}" height="${HABIT_CELL}" rx="2" fill="${HABIT_FILL}"/>`
			: /* the hollow cell is a MARK, not chrome: it was outlined in the
			     axis grey at 2.808:1, under the 3:1 floor for a graphical
			     object, on the one graphic whose whole point is that the
			     empty days are counted too */
				`<rect x="0.5" y="0.5" width="${HABIT_CELL - 1}" height="${HABIT_CELL - 1}" rx="2" fill="none" stroke="${INK_MUTED}"/>`;

	return (
		`<svg viewBox="-1 -1 ${w + 2} ${h + 2}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">` +
		`<defs><pattern id="${id}" width="${HABIT_PITCH}" height="${HABIT_PITCH}" patternUnits="userSpaceOnUse">${cell}</pattern></defs>` +
		`<g fill="url(#${id})">${parts.join("")}</g>` +
		`</svg>`
	);
};

/* ------------------------------------------------------------------ */
/* Bundle assembly                                                     */
/* ------------------------------------------------------------------ */

/** The data layer prints either "5,432 h 47 m" or "2,800.7 h"; the sniff
 *  reads which shape, and must tolerate the no-break space the helpers now
 *  bind between figure and unit. A plain `endsWith(" m")` silently stopped
 *  matching the moment that space stopped being a plain one. */
const HAS_MINUTES = /[\s\u00a0]m$/;

/** Reprint a data-layer display string from its numeric source, for the
 *  locale of the page it is printed on — never a separator swap on the
 *  string. `coarse` selects the card-face resolution (see telemetry.ts);
 *  the default is the exact figure, for tables and alt text. */
const localTime = (
	text: string | null | undefined,
	seconds: number,
	locale: Locale,
	coarse = false
): string => {
	const withMinutes = text ? HAS_MINUTES.test(text) : true;
	if (withMinutes) return coarse ? formatHMCoarse(seconds, locale) : formatHM(seconds, locale);
	return coarse ? formatHCoarse(seconds / 3600, locale) : formatH(seconds / 3600, locale);
};

const build = async (locale: Locale): Promise<ChartsBundle> => {
	const cs: ChartStrings = getWall(locale).chartStrings;
	const found = FINDINGS[locale];
	const [career, year, week] = await Promise.all([getTotalTime(), getInsights(), getSummaries()]);
	const projectInk = inkRegistry();
	const languageInk = inkRegistry();
	const charts: PrintChart[] = [];
	const lifetimeWindow = `${career.range.start} → ${career.range.end}`;

	/* -- projects ---------------------------------------------------- */
	if (career.source === "live" && career.projects.length > 1) {
		const top = career.projects.slice(0, 5);
		const colors = chartInks(
			top.map((p) => p.name),
			projectInk
		);
		const rows: RankedRow[] = top.map((p) => ({
			name: p.name,
			time: formatHMCoarse(p.seconds ?? 0, locale),
			timeExact: formatHM(p.seconds ?? 0, locale),
			timeEn: formatHM(p.seconds ?? 0),
			hours: (p.seconds ?? 0) / 3600,
			share: pctIn(p.percent, locale),
			shareEn: pctIn(p.percent, "en"),
			color: colors.get(p.name) ?? NEUTRAL
		}));
		charts.push({
			id: "projects",
			title: cs.titles.topProjects(rows.length),
			unit: cs.units.lifetimeHours(lifetimeWindow, career.asOf),
			svg: rankedBarSvg(rows),
			alt: rankedAlt(cs.alt.topProjectsIntro(rows.length, career.asOf), rows, locale),
			table: rankedTable(cs.tableHeads.project, cs.tableHeads, rows),
			annotation: {
				text: cs.annotations.projectLeads(rows[0].name, rows[0].time),
				ink: CLAIM_INK.projects
			}
		});
	} else {
		// Snapshot: only the Ayako-family figure is published per project.
		const fam = career.projects[0];
		const famSeconds = fam.seconds ?? 0;
		/* The shared domain for the two snapshot sheets. They are pinned 22px
		   apart, in the same ink, in hours of the same record, over the same
		   window — so they get one scale, and a reader glancing across the
		   gutter gets the right answer instead of the reverse one. */
		SNAPSHOT_AXIS_MAX = Math.max(
			famSeconds / 3600,
			(career.total.seconds - famSeconds) / 3600,
			telemetry.lifetime.languages[0]?.hours ?? 0
		);
		const famShare = fam.percent ?? telemetry.lifetime.ayakoFamily.percent;
		const restSeconds = Math.max(0, career.total.seconds - famSeconds);
		const rows: RankedRow[] = [
			{
				name: cs.ayakoFamilyRow,
				time: localTime(fam.text, famSeconds, locale, true),
				timeExact: localTime(fam.text, famSeconds, locale),
				timeEn: localTime(fam.text, famSeconds, "en"),
				hours: famSeconds / 3600,
				share: pct(famShare, locale),
				shareEn: pct(famShare),
				color: projectInk(cs.ayakoFamilyRow)
			},
			{
				name: cs.other,
				/* Both rows of this one column used to print in two different
				   time formats — "2,800.7 h" against "2,632 h 5 m*" — inside
				   the single sheet whose two rows exist to be compared. At the
				   card-face resolution they meet: whole hours, both. */
				time: `${formatHMCoarse(restSeconds, locale)}*`,
				timeExact: `${formatHM(restSeconds, locale)}*`,
				timeEn: `${formatHM(restSeconds)}*`,
				hours: restSeconds / 3600,
				share: `${pct(round2(100 - famShare), locale)}*`,
				shareEn: `${pct(round2(100 - famShare))}*`,
				color: INK_MUTED
			}
		];
		/* The two bars are near-equal, which badly undersells the fact: one
		 * side project is bigger than every other project put together. The
		 * title states that finding; the note adds the thing the bars cannot
		 * show, which is who built it. Guarded, so a future pull that drops
		 * the family below half falls back to the plain split. */
		const outweighs = famShare > 50;
		charts.push({
			id: "projects",
			title: outweighs ? found.ayakoTitle : cs.titles.ayakoFamily,
			unit: cs.units.lifetimeShare(lifetimeWindow, career.asOf),
			svg: rankedBarSvg(rows, SNAPSHOT_AXIS_MAX),
			alt: rankedAlt(cs.alt.ayakoFamilyIntro(career.asOf), rows, locale),
			table: rankedTable(cs.tableHeads.project, cs.tableHeads, rows, cs.notes.projectsDerived(career.asOf)),
			annotation: {
				text: outweighs ? found.ayakoNote : cs.annotations.ayakoShare(famShare),
				ink: CLAIM_INK.projects
			}
		});
	}

	/* -- languages ---------------------------------------------------- */
	if (year.source === "live" && year.languages.length > 0 && year.range) {
		const top = year.languages.slice(0, 5);
		const colors = chartInks(
			top.map((l) => l.name),
			languageInk
		);
		const rows: RankedRow[] = top.map((l) => ({
			name: l.name,
			time: formatHMCoarse(l.seconds ?? 0, locale),
			timeExact: formatHM(l.seconds ?? 0, locale),
			timeEn: formatHM(l.seconds ?? 0),
			hours: (l.seconds ?? 0) / 3600,
			share: pctIn(l.percent, locale),
			shareEn: pctIn(l.percent, "en"),
			color: colors.get(l.name) ?? NEUTRAL
		}));
		const lead = leadShareOfChart(rows, locale);
		charts.push({
			id: "languages",
			title: lead
				? found.languagesTitleOfChart(rows[0].name, lead, rows.length)
				: cs.titles.topLanguages(rows.length),
			unit: cs.units.last12MonthsHours(`${year.range.start} → ${year.range.end}`, year.asOf),
			svg: rankedBarSvg(rows),
			alt: rankedAlt(cs.alt.topLanguagesYearIntro(rows.length, year.asOf), rows, locale),
			table: rankedTable(cs.tableHeads.language, cs.tableHeads, rows),
			annotation: {
				text: found.languagesNoteCut(rows.length),
				ink: CLAIM_INK.languages
			}
		});
	} else {
		/* Snapshot: the four published lifetime language figures.
		 *
		 * These four are NOT "the four most-tracked languages" — against the
		 * public all_time endpoint the ranks are TypeScript, JavaScript,
		 * Svelte, JSON, Other, Vue.js, so Vue.js is rank 6. They are the four
		 * most-tracked APPLICATION languages, data and markup formats
		 * excluded. The curation is defensible and the label now says what
		 * the curation was; the old one asserted a ranking that fails the
		 * first check a sceptic can run.
		 *
		 * They also cover only 4,225.6 h of a 5,432 h 47 m record. The
		 * projects sheet 40 px away prints its own remainder as "Everything
		 * else 2,632 h 5 m*"; two ranked bar charts in one grid row cannot
		 * hold opposite conventions about whether a chart owes you the rest
		 * of its total. So the remainder is charted, on the same
		 * paper-aged-with-a-hairline stock, marked derived. */
		const langs = telemetry.lifetime.languages;
		const colors = chartInks(
			langs.map((l) => l.name),
			languageInk
		);
		const rows: RankedRow[] = langs.map((l) => ({
			name: l.name,
			time: formatHCoarse(l.hours, locale),
			timeExact: formatH(l.hours, locale),
			timeEn: formatH(l.hours),
			hours: l.hours,
			share: `${pct(l.percent, locale)}${l.derived ? "*" : ""}`,
			shareEn: `${pct(l.percent)}${l.derived ? "*" : ""}`,
			color: colors.get(l.name) ?? NEUTRAL
		}));
		/* Derived exactly like the projects sheet's rest bar: the published
		 * lifetime total minus the published rows, in seconds, so no
		 * rounding is done twice. Guarded — a re-pull that publishes rows
		 * summing to the total simply drops the row. */
		const chartedSeconds = langs.reduce((sum, l) => sum + l.seconds, 0);
		const restSeconds = Math.max(0, career.total.seconds - chartedSeconds);
		const restShare = round2((restSeconds / career.total.seconds) * 100);
		if (restSeconds >= 3600) {
			rows.push({
				name: cs.other,
				time: `${formatHCoarse(restSeconds / 3600, locale)}*`,
				timeExact: `${formatH(restSeconds / 3600, locale)}*`,
				timeEn: `${formatH(restSeconds / 3600)}*`,
				hours: restSeconds / 3600,
				share: `${pct(restShare, locale)}*`,
				shareEn: `${pct(restShare)}*`,
				color: INK_MUTED
			});
		}
		/* A RANKED BAR CHART ASSERTS, BY FORM ALONE, THAT VERTICAL ORDER IS
		   MAGNITUDE ORDER — and this sheet was printing a row the eye can see
		   is out of order. The remainder is pushed after the sorted language
		   rows and `rankedBarSvg` renders array order top to bottom, so
		   "Everything else" (1,207.2 h, 22.22 % of the record) was drawn in
		   FIFTH place, 1.66x the length of the JavaScript bar three rows above
		   it. The sister sheet 22px away happens to be in magnitude order, so
		   the two also disagreed about the convention by accident.
		   The grey INK_MUTED fill and the trailing `*` already do the job the
		   "Other goes last" convention exists to do — they mark the row as
		   not-itemised — so nothing is lost by putting it where its size says.
		   Sorted here rather than at the push, because `rankedAlt` and
		   `rankedTable` both iterate this same array: the mark, the alt text
		   and the data table cannot desynchronise. */
		rows.sort((a, b) => b.hours - a.hours);
		/* With the remainder charted the sheet's rows sum to the record, so
		 * the leading language's published share IS its share of everything
		 * tracked. It is taken from the pull, not re-derived from the rows:
		 * dividing here gives 55.5866 %, and printing either 55.5 or 55.6
		 * above a table that prints 55.59 invites the reader to check the
		 * headline and find it off. Title and table now print the same
		 * digits. (The old note quoted 71.5 %, a share of the top four,
		 * against a table printing 55.59 % two lines below it.) */
		const lead = pct(langs[0].percent, locale);
		charts.push({
			id: "languages",
			title: found.languagesTitleOfRecord(langs[0].name, lead),
			unit: cs.units.lifetimeHours(lifetimeWindow, career.asOf),
			svg: rankedBarSvg(rows, SNAPSHOT_AXIS_MAX),
			alt: rankedAlt(cs.alt.appLanguagesLifetimeIntro(langs.length, career.asOf), rows, locale),
			table: rankedTable(
				cs.tableHeads.language,
				cs.tableHeads,
				rows,
				cs.notes.languagesDerived(career.asOf)
			),
			annotation: {
				/* The curation limit, which until now lived only in the alt
				   text — where no sighted reader ever meets it. */
				text: found.languagesNoteCuration,
				ink: CLAIM_INK.languages
			}
		});
	}

	/* -- last 7 days (live builds only — the window has no snapshot) -- */
	if (week.source === "live" && week.days.length > 0 && week.range) {
		const windowUnit = cs.units.weekHoursPerDay(
			`${week.range.start} → ${week.range.end}`,
			week.asOf
		);
		/* Alt text stays en-US; the visible copy follows the page. */
		const cumulativeEn = week.cumulative?.text ?? formatHM(0);
		const averageEn = week.dailyAverage?.text ?? formatHM(0);
		const cumulative = localTime(week.cumulative?.text, week.cumulative?.seconds ?? 0, locale);
		const average = localTime(week.dailyAverage?.text, week.dailyAverage?.seconds ?? 0, locale);

		const byProject = stackedDays(week.days, (d) => d.projects, projectInk, cs, locale);
		charts.push({
			id: "recent-projects",
			title: cs.titles.weekByProject,
			unit: windowUnit,
			svg: byProject.svg,
			alt: cs.alt.weekByProject({
				start: week.range.start,
				end: week.range.end,
				topCount: byProject.names.length,
				weekTotal: cumulativeEn,
				dailyAverage: averageEn,
				leadName: byProject.names[0],
				leadTime: formatHM(byProject.leadSeconds)
			}),
			table: stackedTable(week.days, byProject, cs, locale),
			annotation: {
				text: cs.annotations.weekTotal(cumulative, byProject.names[0]),
				ink: CLAIM_INK.run
			}
		});

		const byLanguage = stackedDays(week.days, (d) => d.languages, languageInk, cs, locale);
		charts.push({
			id: "recent-languages",
			title: cs.titles.weekByLanguage,
			unit: windowUnit,
			svg: byLanguage.svg,
			alt: cs.alt.weekByLanguage({
				start: week.range.start,
				end: week.range.end,
				topCount: byLanguage.names.length,
				weekTotal: cumulativeEn,
				dailyAverage: averageEn,
				leadName: byLanguage.names[0],
				leadTime: formatHM(byLanguage.leadSeconds)
			}),
			table: stackedTable(week.days, byLanguage, cs, locale),
			annotation: {
				text: cs.annotations.weekDaily(average, byLanguage.names[0]),
				ink: CLAIM_INK.run
			}
		});
	}

	/* -- the habit field ---------------------------------------------- */
	const { active, elapsed, ratePercent } = career.days;
	const idleCount = Math.max(0, elapsed - Math.min(active, elapsed));
	const idleDays = figure(idleCount, locale);
	const startYear = career.range.start.slice(0, 4);
	const endYear = career.range.end.slice(0, 4);
	/* "Active days" names the axis. The finding is the rate, floored to a
	 * whole tenth so the headline can only ever understate the record. */
	const daysInTen = Math.floor(ratePercent / 10);
	const rateSlot = figure(ratePercent, locale);
	const habit: HabitField = {
		title: daysInTen >= 5 ? found.habitTitle(daysInTen, startYear) : cs.titles.activeDays,
		/* The date range is deliberately NOT printed on this card. The grid
		 * is a tally, and a window printed over a left-to-right grid is an
		 * invitation to read it as a calendar — the one reading it must not
		 * have. The window is still stated, in full, in the alt text, in the
		 * printed figure line, and on the provenance card beside it; the
		 * as-of date stays here, so no figure loses its provenance. */
		unit: found.habitUnit(career.asOf),
		svg: dayBlockSvg(Math.min(active, elapsed), "on"),
		idle: idleCount
			? { svg: dayBlockSvg(idleCount, "off"), label: found.idleBlockLabel(idleDays) }
			: null,
		/* en-US, in every locale: for a screen-reader user this sentence is
		   the only provenance the graphic has. THAT REASON HAS EXPIRED, and
		   this was the last place still acting on it — the same correction
		   was already applied to `rankedAlt`. The `<details>` data tables
		   carry every figure correctly localised one click away, so the alt
		   text is no longer anyone's only provenance; meanwhile the cost fell
		   entirely on the one audience that cannot see the visible card. A
		   German screen reader speaking `1,739` says *eins Komma sieben drei
		   neun*, so the wall's largest graphic announced itself as 1.7 cells
		   and 90.6 % as ninety point six — while the VISIBLE German text
		   beside it read `1.575 von 1.739` and `90,6 %` correctly.
		   It is also the one chart of the three with no data-table escape
		   hatch, so the broken label was the only accessible route to the
		   figure. The value is untouched; this is a format, never a
		   separator swap. */
		alt: cs.alt.habit({
			elapsed: figure(elapsed, locale),
			start: career.range.start,
			end: career.range.end,
			active: figure(active, locale),
			ratePercent,
			asOf: career.asOf
		}),
		/* Every figure in this sentence arrives pre-formatted for the page's
		   locale — a raw number would interpolate with a "." decimal mark on
		   the German wall. The value is untouched; this is a format, never a
		   separator swap. */
		line: cs.habit.line(figure(active, locale), figure(elapsed, locale), rateSlot),
		smallPrint: cs.habit.smallPrint,
		asOf: career.asOf,
		annotation: {
			/* green = the run (started, not stopped). The note no longer
			   repeats the rate printed on the line directly above it; it says
			   the one thing the graphic cannot: where the empty days are. */
			text: found.habitNote(idleDays, startYear, endYear),
			ink: CLAIM_INK.run
		}
	};

	/* -- provenance ---------------------------------------------------- */
	/* The as-of convention is stated once, at the head of the source card,
	 * so no individual figure has to repeat it — which is what lets the
	 * habit sheet drop its window without losing any provenance.
	 *
	 * THEN THE ADDRESS. This card named an instrument and gave no way to
	 * reach it, while 4,000 px away the wall promises, in the ink reserved
	 * for provenance, "I can show the source for every figure here,
	 * including the ones that do not flatter me." Provenance that names the
	 * instrument but not the address is rigour theatre.
	 *
	 * Printing the endpoint creates obligations, so the lines that follow it
	 * discharge them in order: what the coarse figures are exactly and why
	 * they are printed coarse; what the endpoint confirms; what it cannot
	 * confirm, and why an honest attempt to check the total lands 166 h low;
	 * and that a dated snapshot drifts from a live pull, so the reader who
	 * follows the link and finds a different AI-Coding share has found the
	 * expected thing rather than a stale wall. */
	const audit = telemetry.publicApi;
	const provenance = [cs.provenance.convention(career.asOf)]
		.concat(
			career.source === "live"
				? [cs.provenance.live(career.asOf)]
				: [
						cs.provenance.snapshot(career.asOf),
						cs.provenance.currentlyJuly2026(
							formatHM(telemetry.windowJuly2026.dailyAverage.seconds, locale)
						)
					]
		)
		.concat([
			cs.provenance.precision(
				formatHMCoarse(telemetry.lifetime.total.seconds, locale),
				formatHM(telemetry.lifetime.total.seconds, locale)
			),
			cs.provenance.endpoint(audit.endpoint),
			cs.provenance.checkable({
				reconstructed: formatHCoarse(Math.floor(audit.reconstructedTotalSeconds / 3600), locale),
				shortfall: formatHCoarse(Math.floor(audit.shortfallSeconds / 3600), locale),
				checkedOn: audit.checkedOn
			})
		])
		.concat(
			career.source === "live"
				? []
				: [
						cs.provenance.drift(
							pct(telemetry.aiCoding.liveCategoryPercentOn20260805, locale),
							pct(telemetry.aiCoding.sharePercentByWindow.lifetime, locale),
							audit.checkedOn
						)
					]
		);

	return {
		source: career.source,
		asOf: career.asOf,
		trackingStart: career.range.start,
		charts,
		habit,
		provenance
	};
};

const cache = new Map<Locale, Promise<ChartsBundle>>();

/** Memoized per locale: each locale's charts render once per build. */
export default (locale: Locale): Promise<ChartsBundle> => {
	let bundle = cache.get(locale);
	if (!bundle) {
		bundle = build(locale);
		cache.set(locale, bundle);
	}
	return bundle;
};
