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

/** "5,432 h 47 m" from a seconds total. Voice law formatting: `h` and `m`. */
export const formatHM = (totalSeconds: number): string => {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	return `${hours.toLocaleString("en-US")} h ${minutes} m`;
};

/** "3,019.9 h" from an hours figure. */
export const formatH = (hours: number): string =>
	`${hours.toLocaleString("en-US", { maximumFractionDigits: 1 })} h`;

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
