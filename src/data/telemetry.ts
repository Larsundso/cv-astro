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

/** A grouped figure: 8,357 · 3,019.9 (en) → 8.357 · 3.019,9 (de). */
export const figure = (value: number, locale: FigureLocale = "en"): string =>
	value.toLocaleString(INTL[locale], { maximumFractionDigits: 6 });

/** "5,432 h 47 m" / "5.432 h 47 m" from a seconds total. Voice law: `h` and `m`. */
export const formatHM = (totalSeconds: number, locale: FigureLocale = "en"): string => {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	return `${figure(hours, locale)} h ${minutes} m`;
};

/** "3,019.9 h" / "3.019,9 h" from an hours figure. */
export const formatH = (hours: number, locale: FigureLocale = "en"): string =>
	`${hours.toLocaleString(INTL[locale], { maximumFractionDigits: 1 })} h`;

/** Abbreviated millions in the locale's own word: "2.4M+" → "2,4 Mio.+". */
export const millionsPlus = (value: number, locale: FigureLocale = "en"): string => {
	const millions = (value / 1_000_000).toLocaleString(INTL[locale], {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	});
	return locale === "de" ? `${millions} Mio.+` : `${millions}M+`;
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
