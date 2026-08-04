/**
 * Last-12-months coding statistics (WakaTime insights, range last_year).
 *
 * Tries the live API when WAKA_KEY is set; falls back to the checked-in
 * snapshot without throwing. The snapshot records only one publishable
 * last-12-months figure (AI-Coding share, 32.46 %, as of 2026-08-03) —
 * when `source` is "snapshot", render dated lifetime figures from
 * src/data/snapshot.ts instead of pretending to a full year window.
 */
import { telemetry } from "~/data/snapshot";
import {
	formatHM,
	isoDay,
	toSlice,
	wakaFetch,
	type StatSlice,
	type TelemetrySource,
	type WakaShare
} from "~/data/telemetry";

export type { StatSlice, TelemetrySource };

export interface YearStats {
	source: TelemetrySource;
	/** Date the figures were measured (live pull date or snapshot date). */
	asOf: string;
	/** Null when the snapshot cannot state a verified window. */
	range: { start: string; end: string } | null;
	total: { seconds: number; text: string } | null;
	dailyAverage: { seconds: number; text: string } | null;
	languages: StatSlice[];
	projects: StatSlice[];
	editors: StatSlice[];
	categories: StatSlice[];
}

/** Trimmed WakaTime `insights/stats/last_year` response. */
interface WakaYear {
	data: {
		start: string;
		end: string;
		total_seconds_including_other_language?: number;
		total_seconds: number;
		daily_average_including_other_language?: number;
		daily_average: number;
		languages: WakaShare[];
		projects: WakaShare[];
		editors: WakaShare[];
		categories: WakaShare[];
	};
}

const fromLive = (live: WakaYear): YearStats => {
	const d = live.data;
	const total = d.total_seconds_including_other_language ?? d.total_seconds;
	const daily = d.daily_average_including_other_language ?? d.daily_average;
	return {
		source: "live",
		asOf: isoDay(d.end, telemetry.asOf),
		range: { start: isoDay(d.start, ""), end: isoDay(d.end, telemetry.asOf) },
		total: { seconds: total, text: formatHM(total) },
		dailyAverage: { seconds: daily, text: formatHM(daily) },
		languages: d.languages.map(toSlice),
		projects: d.projects.map(toSlice),
		editors: d.editors.map(toSlice),
		categories: d.categories.map(toSlice)
	};
};

const fromSnapshot = (): YearStats => ({
	source: "snapshot",
	asOf: telemetry.asOf,
	range: null,
	total: null,
	dailyAverage: null,
	languages: [],
	projects: [],
	editors: [],
	categories: [
		{
			name: "AI Coding",
			seconds: null,
			percent: telemetry.windowLast12Months.aiCodingSharePercent,
			text: null
		}
	]
});

let cached: YearStats | null = null;

export default async (): Promise<YearStats> => {
	if (cached) return cached;

	const live = await wakaFetch<WakaYear>("/users/current/insights/stats/last_year");
	if (live?.data) {
		try {
			cached = fromLive(live);
			return cached;
		} catch {
			// Malformed live payload — fall through to the snapshot.
		}
	}

	cached = fromSnapshot();
	return cached;
};
