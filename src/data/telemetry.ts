/**
 * Shared plumbing for the WakaTime data layer.
 *
 * Every fetch script (getTotalTime / getInsights / getSummaries) resolves to a
 * domain-shaped result carrying a `source` discriminator:
 *
 *   - "live"     — fetched from the WakaTime API at build time (WAKA_KEY set).
 *   - "snapshot" — derived from the checked-in, dated snapshot in
 *                  `src/data/snapshot.ts`. The build NEVER fails on a missing
 *                  key, a network error, or a non-OK response.
 *
 * Components must render the `asOf` date next to every figure (voice law:
 * every figure carries unit + as-of date) and may use `source` to label
 * snapshot figures as such.
 */

export type TelemetrySource = "live" | "snapshot";

/** One named share of tracked time (language, project, editor, OS, category). */
export interface StatSlice {
	name: string;
	/** Tracked seconds; null when the snapshot only records a percentage. */
	seconds: number | null;
	/** Share of the window's total in percent; null when not recorded. */
	percent: number | null;
	/** Display string, e.g. "3,019.9 h" — null when not printable. */
	text: string | null;
}

/* ------------------------------------------------------------------ */
/* Locale-aware figure formatting                                      */
/* ------------------------------------------------------------------ */
/**
 * Every figure on the wall is formatted for the locale of the page it is
 * printed on, at the source, never retyped. German groups with "." and
 * marks decimals with ",", so an en-US "8,357" reads to a German eye as
 * eight-point-three-five-seven — unacceptable on a wall whose whole
 * argument is that its numbers are exact.
 *
 * These helpers change grouping, the decimal mark and the abbreviation
 * word. They never change a value, and "en" reproduces every string the
 * snapshot already carries, byte for byte.
 */

/** The two locales the wall is published in. */
export type FigureLocale = "en" | "de";

const INTL: Record<FigureLocale, string> = { en: "en-US", de: "de-DE" };

/* ------------------------------------------------------------------ */
/* THE FIGURE AND ITS UNIT ARE ONE TOKEN                               */
/* ------------------------------------------------------------------ */
/* Measured on the served HTML of both locales: ZERO occurrences of
 * U+00A0, U+202F or U+2009, across ~50 `figure %` joins and every h/m
 * join — on a wall whose stated law is "every figure carries its unit".
 * It is not theoretical: one German frame broke "… 90,6" / "%.", leaving
 * the unit and the terminal full stop alone on a line.
 *
 * Bound here, at the helper, rather than at the fifty call sites: a
 * hand-typed no-break space is invisible in a diff and survives exactly
 * until the next copy edit.
 *
 * U+00A0 rather than the typographically finer U+202F (NARROW NO-BREAK
 * SPACE): U+00A0 is present in every font on the wall, U+202F is not
 * guaranteed in Courier Prime or Atkinson Hyperlegible, and a missing
 * glyph renders as a notdef box in the middle of a figure. The
 * load-bearing property is unbreakability, not width. */
const NB = "\u00a0";

/**
 * The magnitude above which the instrument stops identifying the digit.
 *
 * WakaTime does not MEASURE a duration, it CONSTRUCTS one: editor plugins
 * emit heartbeats on file change, on save, and every two minutes of
 * typing, and the server joins consecutive heartbeats that fall inside a
 * 15-minute keystroke timeout. A single boundary decision can therefore
 * move a total by up to fifteen minutes. At four figures of hours the
 * minutes digit is not merely uninformative — it is not identified by the
 * method that produced it, and printing it invites a reader to test a
 * precision the instrument cannot support.
 *
 * Below the threshold the minutes stay: on a daily figure fifteen minutes
 * is a visible fraction of the value, so the digit still carries
 * information.
 *
 * Nothing is rounded UP and no value is lost: the coarse forms floor, so
 * they can only ever understate, and the exact forms remain on the data
 * tables, in the chart alt text and on the provenance card.
 */
const COARSE_HOURS = 1_000;

/** A grouped figure: 8,357 · 3,019.9 (en) → 8.357 · 3.019,9 (de). */
export const figure = (value: number, locale: FigureLocale = "en"): string =>
	value.toLocaleString(INTL[locale], { maximumFractionDigits: 6 });

/** A share with its unit bound to it: "90.6 %" / "90,6 %". */
export const pct = (value: number, locale: FigureLocale = "en"): string =>
	`${figure(value, locale)}${NB}%`;

/** EXACT: "5,432 h 47 m" / "5.432 h 47 m" from a seconds total. Tables,
 *  alt text and provenance — never softened. Voice law: `h` and `m`. */
export const formatHM = (totalSeconds: number, locale: FigureLocale = "en"): string => {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	return `${figure(hours, locale)}${NB}h ${minutes}${NB}m`;
};

/** Card face: minutes only where the method identifies them (COARSE_HOURS). */
export const formatHMCoarse = (totalSeconds: number, locale: FigureLocale = "en"): string => {
	const hours = Math.floor(totalSeconds / 3600);
	return hours >= COARSE_HOURS ? `${figure(hours, locale)}${NB}h` : formatHM(totalSeconds, locale);
};

/** EXACT: "3,019.9 h" / "3.019,9 h" from an hours figure. */
export const formatH = (hours: number, locale: FigureLocale = "en"): string =>
	`${hours.toLocaleString(INTL[locale], { maximumFractionDigits: 1 })}${NB}h`;

/** Card face: whole hours at or above COARSE_HOURS, floored. */
export const formatHCoarse = (hours: number, locale: FigureLocale = "en"): string =>
	hours >= COARSE_HOURS
		? `${figure(Math.floor(hours), locale)}${NB}h`
		: formatH(hours, locale);

/**
 * Abbreviated millions in the locale's own word: "2.4M+" → „über 2,4 Mio.".
 *
 * German does not suffix a `+` to an abbreviation point — "2,4 Mio.+" is an
 * English form rendered with German words. The preposition carries the
 * "at least" sense that the `+` carries in English, so both walls state the
 * same floored claim in their own idiom.
 */
export const millionsPlus = (value: number, locale: FigureLocale = "en"): string => {
	const millions = (value / 1_000_000).toLocaleString(INTL[locale], {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	});
	return locale === "de" ? `über ${millions}${NB}Mio.` : `${millions}M+`;
};

/** ISO date (YYYY-MM-DD) from an API datetime string, with a fallback. */
export const isoDay = (value: string | undefined | null, fallback: string): string =>
	typeof value === "string" && value.length >= 10 ? value.slice(0, 10) : fallback;

/**
 * Fetch a WakaTime API path. Resolves to null (never throws) when:
 * - WAKA_KEY is not configured,
 * - the request fails or times out (15 s),
 * - the response is not OK or not JSON.
 */
export const wakaFetch = async <T>(path: string): Promise<T | null> => {
	const key: string | undefined = import.meta.env.WAKA_KEY;
	if (!key) return null;

	try {
		const res = await fetch(`https://wakatime.com/api/v1${path}`, {
			headers: { Authorization: `Basic ${btoa(`${key}:`)}` },
			signal: AbortSignal.timeout(15_000)
		});
		if (!res.ok) return null;
		return (await res.json()) as T;
	} catch {
		return null;
	}
};

/** Raw WakaTime share entry as the API returns it. */
export interface WakaShare {
	name: string;
	total_seconds: number;
	percent?: number;
	text?: string;
}

/** Map a raw API share entry onto the domain StatSlice. */
export const toSlice = (entry: WakaShare): StatSlice => ({
	name: entry.name,
	seconds: entry.total_seconds,
	percent: entry.percent ?? null,
	text: entry.text ?? formatHM(entry.total_seconds)
});
