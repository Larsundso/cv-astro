/**
 * All-time (career window) coding statistics.
 *
 * Tries the live WakaTime API when WAKA_KEY is set; falls back to the
 * checked-in snapshot (src/data/snapshot.ts) without throwing. The build
 * succeeds with no env. Check `source` and always render `asOf`.
 */
import { telemetry } from "~/data/snapshot";
import {
	formatH,
	formatHM,
	isoDay,
	toSlice,
	wakaFetch,
	type StatSlice,
	type TelemetrySource,
	type WakaShare
} from "~/data/telemetry";

export type { StatSlice, TelemetrySource };

export interface AllTimeStats {
	source: TelemetrySource;
	/** Date the figures were measured (live pull date or snapshot date). */
	asOf: string;
	range: { start: string; end: string };
	/** Includes the "Other" bucket — the designated headline figure. */
	total: { seconds: number; text: string };
	dailyAverage: { seconds: number; text: string };
	days: { active: number; elapsed: number; ratePercent: number };
	bestDay: { date: string; seconds: number; text: string };
	languages: StatSlice[];
	projects: StatSlice[];
	editors: StatSlice[];
	operatingSystems: StatSlice[];
	categories: StatSlice[];
}

/** Trimmed WakaTime `stats/all_time` response. */
interface WakaAllTime {
	data: {
		start: string;
		end: string;
		total_seconds_including_other_language: number;
		daily_average_including_other_language: number;
		days_minus_holidays: number;
		days_including_holidays: number;
		best_day: { date: string; total_seconds: number; text: string };
		languages: WakaShare[];
		projects: WakaShare[];
		editors: WakaShare[];
		operating_systems: WakaShare[];
		categories: WakaShare[];
	};
}

const fromLive = (live: WakaAllTime): AllTimeStats => {
	const d = live.data;
	const active = d.days_minus_holidays;
	const elapsed = d.days_including_holidays;
	return {
		source: "live",
		asOf: isoDay(d.end, telemetry.asOf),
		range: {
			start: isoDay(d.start, telemetry.trackingStart),
			end: isoDay(d.end, telemetry.asOf)
		},
		total: {
			seconds: d.total_seconds_including_other_language,
			text: formatHM(d.total_seconds_including_other_language)
		},
		dailyAverage: {
			seconds: d.daily_average_including_other_language,
			text: formatHM(d.daily_average_including_other_language)
		},
		days: {
			active,
			elapsed,
			ratePercent: elapsed > 0 ? Math.round((active / elapsed) * 1000) / 10 : 0
		},
		bestDay: {
			date: d.best_day.date,
			seconds: d.best_day.total_seconds,
			text: formatHM(d.best_day.total_seconds)
		},
		languages: d.languages.map(toSlice),
		projects: d.projects.map(toSlice),
		editors: d.editors.map(toSlice),
		operatingSystems: d.operating_systems.map(toSlice),
		categories: d.categories.map(toSlice)
	};
};

const fromSnapshot = (): AllTimeStats => {
	const t = telemetry.lifetime;
	return {
		source: "snapshot",
		asOf: telemetry.asOf,
		range: { start: telemetry.trackingStart, end: telemetry.trackingEnd },
		total: { seconds: t.total.seconds, text: t.total.display },
		dailyAverage: { seconds: t.dailyAverage.seconds, text: t.dailyAverage.display },
		days: {
			active: t.activeDays.active,
			elapsed: t.activeDays.elapsed,
			ratePercent: t.activeDays.ratePercent
		},
		bestDay: { date: t.bestDay.date, seconds: t.bestDay.seconds, text: t.bestDay.display },
		languages: t.languages.map((l) => ({
			name: l.name,
			seconds: l.seconds,
			percent: l.percent,
			text: formatH(l.hours)
		})),
		projects: [
			{
				name: "Ayako (project family, 7 generations)",
				seconds: t.ayakoFamily.seconds,
				percent: t.ayakoFamily.percent,
				text: formatH(t.ayakoFamily.hours)
			}
		],
		editors: [
			{ name: "VS Code", seconds: null, percent: t.vsCodeEditorPercent, text: null }
		],
		operatingSystems: [
			{ name: "Linux", seconds: null, percent: t.linuxPercent, text: null },
			{ name: "WSL", seconds: null, percent: t.wslPercent, text: null }
		],
		categories: [
			{
				name: "AI Coding",
				seconds: telemetry.aiCoding.lifetime.seconds,
				percent: telemetry.aiCoding.sharePercentByWindow.lifetime,
				text: telemetry.aiCoding.lifetime.display
			}
		]
	};
};

let cached: AllTimeStats | null = null;

export default async (): Promise<AllTimeStats> => {
	if (cached) return cached;

	const live = await wakaFetch<WakaAllTime>("/users/current/stats/all_time?timeout=15");
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
