/**
 * Last-7-days coding summaries (WakaTime summaries, range last_7_days).
 *
 * Tries the live API when WAKA_KEY is set; falls back to the checked-in
 * snapshot without throwing. The snapshot records only one publishable
 * last-7-days figure (AI-Coding share, 69.76 %, as of 2026-08-03) — when
 * `source` is "snapshot", `days` is empty and totals are null; render the
 * dated July-2026 window from src/data/snapshot.ts for "currently" copy.
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

export interface DaySummary {
	/** YYYY-MM-DD. */
	date: string;
	total: { seconds: number; text: string };
	languages: StatSlice[];
	projects: StatSlice[];
}

export interface WeekStats {
	source: TelemetrySource;
	/** Date the figures were measured (live pull date or snapshot date). */
	asOf: string;
	/** Null when the snapshot cannot state a verified window. */
	range: { start: string; end: string } | null;
	cumulative: { seconds: number; text: string } | null;
	dailyAverage: { seconds: number; text: string } | null;
	days: DaySummary[];
	/** Aggregated across the window (live) or the snapshot's recorded slices. */
	categories: StatSlice[];
}

/** Trimmed WakaTime `summaries?range=last_7_days` response. */
interface WakaSummaries {
	data: Array<{
		grand_total: { total_seconds: number; text: string };
		range: { date: string };
		languages?: WakaShare[];
		projects?: WakaShare[];
		categories?: WakaShare[];
	}>;
	start: string;
	end: string;
	cumulative_total: { seconds: number; text: string };
	daily_average: { seconds: number; text: string };
}

const fromLive = (live: WakaSummaries): WeekStats => {
	const totalSeconds = live.cumulative_total.seconds;

	// Aggregate categories across the window's days.
	const byCategory = new Map<string, number>();
	for (const day of live.data) {
		for (const c of day.categories ?? []) {
			byCategory.set(c.name, (byCategory.get(c.name) ?? 0) + c.total_seconds);
		}
	}
	const categories: StatSlice[] = [...byCategory.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([name, seconds]) => ({
			name,
			seconds,
			percent: totalSeconds > 0 ? Math.round((seconds / totalSeconds) * 10_000) / 100 : null,
			text: formatHM(seconds)
		}));

	return {
		source: "live",
		asOf: isoDay(live.end, telemetry.asOf),
		range: { start: isoDay(live.start, ""), end: isoDay(live.end, telemetry.asOf) },
		cumulative: { seconds: totalSeconds, text: formatHM(totalSeconds) },
		dailyAverage: {
			seconds: live.daily_average.seconds,
			text: formatHM(live.daily_average.seconds)
		},
		days: live.data.map((day) => ({
			date: day.range.date,
			total: {
				seconds: day.grand_total.total_seconds,
				text: formatHM(day.grand_total.total_seconds)
			},
			languages: (day.languages ?? []).map(toSlice),
			projects: (day.projects ?? []).map(toSlice)
		})),
		categories
	};
};

const fromSnapshot = (): WeekStats => ({
	source: "snapshot",
	asOf: telemetry.asOf,
	range: null,
	cumulative: null,
	dailyAverage: null,
	days: [],
	categories: [
		{
			name: "AI Coding",
			seconds: null,
			percent: telemetry.windowLast7Days.aiCodingSharePercent,
			text: null
		}
	]
});

let cached: WeekStats | null = null;

export default async (): Promise<WeekStats> => {
	if (cached) return cached;

	const live = await wakaFetch<WakaSummaries>("/users/current/summaries?range=last_7_days");
	if (live?.data && live.cumulative_total) {
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
