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
import { figure, formatH, formatHM, type StatSlice, type TelemetrySource } from "~/data/telemetry";
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
const AXIS_LINE = "#99948e"; // ink 42 % over paper
/* The "everything else" bucket is the wall's own unremarkable material,
 * not an ECharts default grey: --paper-aged (oklch(94% 0.02 85)) with a
 * 1px ink hairline so a paper-on-paper bar still has an edge. */
const PAPER_AGED = "#f1eadc"; // --paper-aged
const HAIRLINE = "rgba(39, 32, 26, 0.18)"; // --ink at 18 %
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
	/** Where the measured hours actually went: how you know. */
	languages: "teal",
	/** Still running, this week and since 2021. */
	run: "green"
} as const satisfies Record<string, PrideInk>;

const FONT_BODY = '"Atkinson Hyperlegible", "Segoe UI", sans-serif';
/** Ranked bars stay legible when scaled down to a phone-wide card. */
const RANKED_W = 460;
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
	/** Languages sheet: how concentrated the charted hours are. */
	languagesTitle: (name: string) => string;
	languagesNote: (share: string, of: number) => string;
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
		ayakoNote: "mine end to end — and bigger than every other project put together",
		/* Outcome, not effort. "…is where the hours went" was the last
		   headline on the wall that measured expenditure rather than result —
		   three blind judges attacked precisely that framing. Same figure,
		   same denominator, same provenance; it now names what the language
		   BUILT rather than what it consumed. */
		languagesTitle: (name) => `The product is written in ${name}`,
		languagesNote: (share, of) => `one language, ${share} of the top ${of}`,
		habitTitle: (daysInTen, sinceYear) =>
			`Coded on ${daysInTen} days out of 10 since ${sinceYear}`,
		habitNote: (idle, startYear, endYear) =>
			`the ${idle} empty days are spread across ${startYear}–${endYear} — not the last ${idle}`,
		habitUnit: (asOf) => `One cell per day · lifetime tally · as of ${asOf}`,
		idleBlockLabel: (idle) => `${idle} days without tracked coding`
	},
	de: {
		ayakoTitle: "Eine Projektfamilie wiegt schwerer als alle anderen",
		ayakoNote: "von vorn bis hinten meins — und größer als alle anderen Projekte zusammen",
		/* siehe en: das Ergebnis benennen, nicht den Aufwand */
		languagesTitle: (name) => `Das Produkt ist in ${name} geschrieben`,
		languagesNote: (share, of) => `eine Sprache, ${share} der Top ${of}`,
		habitTitle: (daysInTen, sinceYear) =>
			`An ${daysInTen} von 10 Tagen programmiert, seit ${sinceYear}`,
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
	p == null ? null : `${figure(round2(p), locale)} %`;

/* ------------------------------------------------------------------ */
/* Ranked horizontal bars (top projects / top languages)               */
/* ------------------------------------------------------------------ */

interface RankedRow {
	name: string;
	/** Printed time in the page's locale, e.g. "3,019.9 h" / "3.019,9 h" —
	 *  may carry a trailing "*". */
	time: string;
	/** The same figure in en-US, for the alt text (which never localises). */
	timeEn: string;
	hours: number;
	/** Share display, e.g. "55.68 %"; null when not recorded. */
	share: string | null;
	/** The same share in en-US, for the alt text. */
	shareEn: string | null;
	color: string;
	/** The "everything else" bucket: paper-on-paper, so it needs an edge. */
	hairline?: boolean;
}

const rankedBarSvg = (rows: RankedRow[]): string =>
	renderSvg(RANKED_W, 24 + rows.length * 48, {
		grid: { left: 8, right: 104, top: 10, bottom: 10, containLabel: true },
		xAxis: { type: "value", show: false },
		yAxis: {
			type: "category",
			inverse: true,
			data: rows.map((r) => r.name),
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: {
				color: INK,
				fontFamily: FONT_BODY,
				fontSize: 15,
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
					itemStyle: {
						color: r.color,
						borderRadius: [0, 4, 4, 0],
						...(r.hairline ? { borderColor: HAIRLINE, borderWidth: 1 } : {})
					}
				})),
				label: {
					show: true,
					position: "right",
					distance: 8,
					color: INK,
					fontFamily: FONT_BODY,
					fontWeight: "bold",
					fontSize: 15,
					formatter: (p: { dataIndex: number }) => rows[p.dataIndex].time
				}
			}
		]
	});

/**
 * How much of the charted total the leading bar carries.
 *
 * The chart shows four bars; what it cannot show is how lopsided they
 * are, because judging that means summing three of them by eye. This is a
 * derived ratio over exactly the hours printed on the sheet — nothing is
 * invented, and the note that quotes it states its own denominator
 * ("of the top 4"), never the lifetime total.
 */
const leadShareOfChart = (rows: RankedRow[], locale: Locale): string | null => {
	const total = rows.reduce((sum, r) => sum + r.hours, 0);
	if (rows.length < 2 || total <= 0) return null;
	return `${figure(Math.round((rows[0].hours / total) * 1000) / 10, locale)} %`;
};

/** Alt text is en-US in every locale — see the note on `pctIn`. */
const rankedAlt = (intro: string, rows: RankedRow[]): string =>
	`${intro}: ${rows
		.map((r) => `${r.name} ${r.timeEn}${r.shareEn ? ` (${r.shareEn})` : ""}`)
		.join("; ")}.`;

const rankedTable = (
	kind: string,
	heads: ChartStrings["tableHeads"],
	rows: RankedRow[],
	note?: string
): ChartTable => ({
	head: [kind, heads.trackedTime, heads.share],
	rows: rows.map((r) => [r.name, r.time, r.share ?? "—"]),
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

	const barSeries = (name: string, color: string, seconds: number[], edge = PAPER) => ({
		name,
		type: "bar" as const,
		stack: "day",
		barWidth: 26,
		// 1px paper border on every segment = a 2px paper gap between fills
		itemStyle: { color, borderColor: edge, borderWidth: 1 },
		data: seconds.map((s) => round2(s / 3600))
	});

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
			...(hasOther ? [barSeries(cs.other, PAPER_AGED, other, HAIRLINE)] : [])
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
		day.total.text
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
			? `<rect width="${HABIT_CELL}" height="${HABIT_CELL}" rx="2" fill="${INK_HEX.green}"/>`
			: `<rect x="0.5" y="0.5" width="${HABIT_CELL - 1}" height="${HABIT_CELL - 1}" rx="2" fill="none" stroke="${AXIS_LINE}"/>`;

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

/** Data-layer display strings are en-US; reprint them from the numeric
 *  source when the page is not. Never a separator swap on the string. */
const localTime = (text: string | null | undefined, seconds: number, locale: Locale): string => {
	if (locale === "en") return text ?? formatHM(seconds);
	// the data layer prints either "5,432 h 47 m" or "2,800.7 h"
	return text && !text.endsWith(" m") ? formatH(seconds / 3600, locale) : formatHM(seconds, locale);
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
			time: formatHM(p.seconds ?? 0, locale),
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
			alt: rankedAlt(cs.alt.topProjectsIntro(rows.length, career.asOf), rows),
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
		const famShare = fam.percent ?? telemetry.lifetime.ayakoFamily.percent;
		const restSeconds = Math.max(0, career.total.seconds - famSeconds);
		const rows: RankedRow[] = [
			{
				name: cs.ayakoFamilyRow,
				time: localTime(fam.text, famSeconds, locale),
				timeEn: localTime(fam.text, famSeconds, "en"),
				hours: famSeconds / 3600,
				share: `${figure(famShare, locale)} %`,
				shareEn: `${figure(famShare)} %`,
				color: projectInk(cs.ayakoFamilyRow)
			},
			{
				name: cs.other,
				time: `${formatHM(restSeconds, locale)}*`,
				timeEn: `${formatHM(restSeconds)}*`,
				hours: restSeconds / 3600,
				share: `${figure(round2(100 - famShare), locale)} %*`,
				shareEn: `${figure(round2(100 - famShare))} %*`,
				color: PAPER_AGED,
				hairline: true
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
			svg: rankedBarSvg(rows),
			alt: rankedAlt(cs.alt.ayakoFamilyIntro(career.asOf), rows),
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
			time: formatHM(l.seconds ?? 0, locale),
			timeEn: formatHM(l.seconds ?? 0),
			hours: (l.seconds ?? 0) / 3600,
			share: pctIn(l.percent, locale),
			shareEn: pctIn(l.percent, "en"),
			color: colors.get(l.name) ?? NEUTRAL
		}));
		const lead = leadShareOfChart(rows, locale);
		charts.push({
			id: "languages",
			title: lead ? found.languagesTitle(rows[0].name) : cs.titles.topLanguages(rows.length),
			unit: cs.units.last12MonthsHours(`${year.range.start} → ${year.range.end}`, year.asOf),
			svg: rankedBarSvg(rows),
			alt: rankedAlt(cs.alt.topLanguagesYearIntro(rows.length, year.asOf), rows),
			table: rankedTable(cs.tableHeads.language, cs.tableHeads, rows),
			annotation: {
				text: lead
					? found.languagesNote(lead, rows.length)
					: cs.annotations.languageTop(rows[0].name, rows[0].time),
				ink: CLAIM_INK.languages
			}
		});
	} else {
		// Snapshot: the four published lifetime language figures.
		const langs = telemetry.lifetime.languages;
		const colors = chartInks(
			langs.map((l) => l.name),
			languageInk
		);
		const rows: RankedRow[] = langs.map((l) => ({
			name: l.name,
			time: formatH(l.hours, locale),
			timeEn: formatH(l.hours),
			hours: l.hours,
			share: `${figure(l.percent, locale)} %${l.derived ? "*" : ""}`,
			shareEn: `${figure(l.percent)} %${l.derived ? "*" : ""}`,
			color: colors.get(l.name) ?? NEUTRAL
		}));
		const lead = leadShareOfChart(rows, locale);
		charts.push({
			id: "languages",
			title: lead ? found.languagesTitle(rows[0].name) : cs.titles.topLanguages(rows.length),
			unit: cs.units.lifetimeHours(lifetimeWindow, career.asOf),
			svg: rankedBarSvg(rows),
			alt: rankedAlt(cs.alt.topLanguagesLifetimeIntro(rows.length, career.asOf), rows),
			table: rankedTable(
				cs.tableHeads.language,
				cs.tableHeads,
				rows,
				cs.notes.languagesDerived(career.asOf)
			),
			annotation: {
				text: lead
					? found.languagesNote(lead, rows.length)
					: cs.annotations.languageTop(rows[0].name, rows[0].time),
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
		   the only provenance the graphic has, and it is quoted verbatim
		   elsewhere. See the note on `pctIn`. */
		alt: cs.alt.habit({
			elapsed: figure(elapsed),
			start: career.range.start,
			end: career.range.end,
			active: figure(active),
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
	 * habit sheet drop its window without losing any provenance. */
	const provenance = [cs.provenance.convention(career.asOf)].concat(
		career.source === "live"
			? [cs.provenance.live(career.asOf)]
			: [
					cs.provenance.snapshot(career.asOf),
					cs.provenance.currentlyJuly2026(telemetry.windowJuly2026.dailyAverage.display)
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
