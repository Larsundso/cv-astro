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
import { formatH, formatHM, type StatSlice, type TelemetrySource } from "~/data/telemetry";
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
const NEUTRAL = "#aba6a0"; // ink 34 % over paper — the "everything else" bucket

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

/** Reverse lookup so a margin note can write in its subject's series ink. */
const INK_NAME = new Map<string, PrideInk>(
	(Object.entries(INK_HEX) as [PrideInk, string][]).map(([name, hex]) => [hex, name])
);

const inkNameOf = (hex: string | undefined, fallback: PrideInk): PrideInk =>
	(hex && INK_NAME.get(hex)) || fallback;

const FONT_BODY = '"Atkinson Hyperlegible", "Segoe UI", sans-serif';
/** Ranked bars stay legible when scaled down to a phone-wide card. */
const RANKED_W = 460;
/** Seven stacked days + legend need the full sheet; consumers pan on narrow screens. */
const STACKED_W = 620;

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
	svg: string;
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

const pct = (p: number | null): string | null => (p == null ? null : `${round2(p)} %`);

/* ------------------------------------------------------------------ */
/* Ranked horizontal bars (top projects / top languages)               */
/* ------------------------------------------------------------------ */

interface RankedRow {
	name: string;
	/** Printed time, e.g. "3,019 h 54 m" — may carry a trailing "*". */
	time: string;
	hours: number;
	/** Share display, e.g. "55.68 %"; null when not recorded. */
	share: string | null;
	color: string;
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
					itemStyle: { color: r.color, borderRadius: [0, 4, 4, 0] }
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

const rankedAlt = (intro: string, rows: RankedRow[]): string =>
	`${intro}: ${rows
		.map((r) => `${r.name} ${r.time}${r.share ? ` (${r.share})` : ""}`)
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
	/** The leading series' assigned ink (hex). */
	leadColor: string;
}

const stackedDays = (
	days: DaySummary[],
	pick: (d: DaySummary) => StatSlice[],
	inkFor: InkFor,
	cs: ChartStrings
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

	const barSeries = (name: string, color: string, seconds: number[]) => ({
		name,
		type: "bar" as const,
		stack: "day",
		barWidth: 26,
		// 1px paper border on every segment = a 2px paper gap between fills
		itemStyle: { color, borderColor: PAPER, borderWidth: 1 },
		data: seconds.map((s) => round2(s / 3600))
	});

	const svg = renderSvg(STACKED_W, 344, {
		grid: { left: 8, right: 8, top: 12, bottom: 48, containLabel: true },
		legend: {
			bottom: 0,
			left: "center",
			icon: "rect",
			itemWidth: 10,
			itemHeight: 10,
			itemGap: 14,
			textStyle: { color: INK_SOFT, fontFamily: FONT_BODY, fontSize: 12 },
			// full names live in the data table
			formatter: (name: string) => (name.length > 16 ? `${name.slice(0, 15)}…` : name)
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
				formatter: cs.axisHours
			},
			splitLine: { lineStyle: { color: GRID_LINE } }
		},
		series: [
			...names.map((name, i) => barSeries(name, colors.get(name) ?? NEUTRAL, matrix[i])),
			...(hasOther ? [barSeries(cs.other, NEUTRAL, other)] : [])
		]
	});

	return {
		svg,
		names,
		matrix,
		other,
		leadSeconds: names.length ? (totals.get(names[0]) ?? 0) : 0,
		leadColor: names.length ? (colors.get(names[0]) ?? NEUTRAL) : NEUTRAL
	};
};

const stackedTable = (days: DaySummary[], stack: StackResult, cs: ChartStrings): ChartTable => ({
	head: [cs.tableHeads.day, ...stack.names, cs.other, cs.tableHeads.total],
	rows: days.map((day, i) => [
		day.date,
		...stack.matrix.map((row) => (row[i] >= 60 ? formatHM(row[i]) : "—")),
		stack.other[i] >= 60 ? formatHM(stack.other[i]) : "—",
		day.total.text
	])
});

/* ------------------------------------------------------------------ */
/* The habit field — one cell per elapsed day, tallied not dated       */
/* ------------------------------------------------------------------ */
/* Rendered as four pattern-filled rects (single-digit DOM nodes for
 * 1,700+ cells). Only the counts are published, so filled cells run in
 * sequence — a tally, deliberately not a calendar. */

const habitFieldSvg = (active: number, elapsed: number): string => {
	const COLS = 47; // 1,739 elapsed days = 47 × 37, a full rectangle
	const CELL = 10;
	const GAP = 3;
	const PITCH = CELL + GAP;
	const rows = Math.ceil(elapsed / COLS);
	const w = COLS * PITCH - GAP;
	const h = rows * PITCH - GAP;

	/** Cover the sequential cell range [from, to) with at most 3 rects. */
	const rectsFor = (from: number, to: number): string => {
		if (to <= from) return "";
		const parts: string[] = [];
		const rect = (row: number, colA: number, colB: number, rowSpan = 1) =>
			parts.push(
				`<rect x="${colA * PITCH}" y="${row * PITCH}" width="${(colB - colA) * PITCH - GAP}" height="${rowSpan * PITCH - GAP}"/>`
			);
		const r0 = Math.floor(from / COLS);
		const c0 = from % COLS;
		const r1 = Math.floor((to - 1) / COLS);
		const c1 = (to - 1) % COLS;
		if (r0 === r1) {
			rect(r0, c0, c1 + 1);
		} else {
			rect(r0, c0, COLS);
			if (r1 - r0 > 1) rect(r0 + 1, 0, COLS, r1 - r0 - 1);
			rect(r1, 0, c1 + 1);
		}
		return parts.join("");
	};

	const filled = Math.min(active, elapsed);
	return (
		`<svg viewBox="-1 -1 ${w + 2} ${h + 2}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">` +
		`<defs>` +
		`<pattern id="rf-day-on" width="${PITCH}" height="${PITCH}" patternUnits="userSpaceOnUse">` +
		`<rect width="${CELL}" height="${CELL}" rx="2" fill="${INK_HEX.green}"/>` +
		`</pattern>` +
		`<pattern id="rf-day-off" width="${PITCH}" height="${PITCH}" patternUnits="userSpaceOnUse">` +
		`<rect x="0.5" y="0.5" width="${CELL - 1}" height="${CELL - 1}" rx="2" fill="none" stroke="${AXIS_LINE}"/>` +
		`</pattern>` +
		`</defs>` +
		`<g fill="url(#rf-day-on)">${rectsFor(0, filled)}</g>` +
		`<g fill="url(#rf-day-off)">${rectsFor(filled, elapsed)}</g>` +
		`</svg>`
	);
};

/* ------------------------------------------------------------------ */
/* Bundle assembly                                                     */
/* ------------------------------------------------------------------ */

/* Figures keep en-US grouping in every locale — the wall's figure style
 * is uniform (wall.de.ts copies figure strings verbatim, same rule). */
const fmt = (n: number): string => n.toLocaleString("en-US");

const build = async (locale: Locale): Promise<ChartsBundle> => {
	const cs: ChartStrings = getWall(locale).chartStrings;
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
			time: formatHM(p.seconds ?? 0),
			hours: (p.seconds ?? 0) / 3600,
			share: pct(p.percent),
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
				ink: inkNameOf(rows[0].color, "magenta")
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
				time: fam.text ?? formatHM(famSeconds),
				hours: famSeconds / 3600,
				share: `${famShare} %`,
				color: projectInk(cs.ayakoFamilyRow)
			},
			{
				name: cs.other,
				time: `${formatHM(restSeconds)}*`,
				hours: restSeconds / 3600,
				share: `${round2(100 - famShare)} %*`,
				color: NEUTRAL
			}
		];
		charts.push({
			id: "projects",
			title: cs.titles.ayakoFamily,
			unit: cs.units.lifetimeShare(lifetimeWindow, career.asOf),
			svg: rankedBarSvg(rows),
			alt: rankedAlt(cs.alt.ayakoFamilyIntro(career.asOf), rows),
			table: rankedTable(cs.tableHeads.project, cs.tableHeads, rows, cs.notes.projectsDerived(career.asOf)),
			annotation: {
				text: cs.annotations.ayakoShare(famShare),
				ink: inkNameOf(rows[0].color, "magenta")
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
			time: formatHM(l.seconds ?? 0),
			hours: (l.seconds ?? 0) / 3600,
			share: pct(l.percent),
			color: colors.get(l.name) ?? NEUTRAL
		}));
		charts.push({
			id: "languages",
			title: cs.titles.topLanguages(rows.length),
			unit: cs.units.last12MonthsHours(`${year.range.start} → ${year.range.end}`, year.asOf),
			svg: rankedBarSvg(rows),
			alt: rankedAlt(cs.alt.topLanguagesYearIntro(rows.length, year.asOf), rows),
			table: rankedTable(cs.tableHeads.language, cs.tableHeads, rows),
			annotation: {
				text: cs.annotations.languageTop(rows[0].name, rows[0].time),
				ink: inkNameOf(rows[0].color, "blue")
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
			time: formatH(l.hours),
			hours: l.hours,
			share: `${l.percent} %${l.derived ? "*" : ""}`,
			color: colors.get(l.name) ?? NEUTRAL
		}));
		charts.push({
			id: "languages",
			title: cs.titles.topLanguages(rows.length),
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
				text: cs.annotations.languageTop(rows[0].name, rows[0].time),
				ink: inkNameOf(rows[0].color, "blue")
			}
		});
	}

	/* -- last 7 days (live builds only — the window has no snapshot) -- */
	if (week.source === "live" && week.days.length > 0 && week.range) {
		const windowUnit = cs.units.weekHoursPerDay(
			`${week.range.start} → ${week.range.end}`,
			week.asOf
		);
		const cumulative = week.cumulative?.text ?? formatHM(0);
		const average = week.dailyAverage?.text ?? formatHM(0);

		const byProject = stackedDays(week.days, (d) => d.projects, projectInk, cs);
		charts.push({
			id: "recent-projects",
			title: cs.titles.weekByProject,
			unit: windowUnit,
			svg: byProject.svg,
			alt: cs.alt.weekByProject({
				start: week.range.start,
				end: week.range.end,
				topCount: byProject.names.length,
				weekTotal: cumulative,
				dailyAverage: average,
				leadName: byProject.names[0],
				leadTime: formatHM(byProject.leadSeconds)
			}),
			table: stackedTable(week.days, byProject, cs),
			annotation: {
				text: cs.annotations.weekTotal(cumulative, byProject.names[0]),
				ink: inkNameOf(byProject.leadColor, "teal")
			}
		});

		const byLanguage = stackedDays(week.days, (d) => d.languages, languageInk, cs);
		charts.push({
			id: "recent-languages",
			title: cs.titles.weekByLanguage,
			unit: windowUnit,
			svg: byLanguage.svg,
			alt: cs.alt.weekByLanguage({
				start: week.range.start,
				end: week.range.end,
				topCount: byLanguage.names.length,
				weekTotal: cumulative,
				dailyAverage: average,
				leadName: byLanguage.names[0],
				leadTime: formatHM(byLanguage.leadSeconds)
			}),
			table: stackedTable(week.days, byLanguage, cs),
			annotation: {
				text: cs.annotations.weekDaily(average, byLanguage.names[0]),
				ink: inkNameOf(byLanguage.leadColor, "violet")
			}
		});
	}

	/* -- the habit field ---------------------------------------------- */
	const { active, elapsed, ratePercent } = career.days;
	const habit: HabitField = {
		title: cs.titles.activeDays,
		unit: cs.units.habitCells(lifetimeWindow, career.asOf),
		svg: habitFieldSvg(active, elapsed),
		alt: cs.alt.habit({
			elapsed: fmt(elapsed),
			start: career.range.start,
			end: career.range.end,
			active: fmt(active),
			ratePercent,
			asOf: career.asOf
		}),
		line: cs.habit.line(fmt(active), fmt(elapsed), ratePercent),
		smallPrint: cs.habit.smallPrint,
		asOf: career.asOf,
		annotation: {
			/* green = the run (started, not stopped) — and it is also the ink
			   of the filled cells this note quotes, so legend and code agree. */
			text: cs.annotations.habitRate(ratePercent, career.range.start.slice(0, 4)),
			ink: "green"
		}
	};

	/* -- provenance ---------------------------------------------------- */
	const provenance =
		career.source === "live"
			? [cs.provenance.live(career.asOf)]
			: [
					cs.provenance.snapshot(career.asOf),
					cs.provenance.currentlyJuly2026(telemetry.windowJuly2026.dailyAverage.display)
				];

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
