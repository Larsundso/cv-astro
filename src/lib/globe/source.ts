// The globe's one data seam (owner rulings of 2026-10-28, FACTS 5 "Gateway globe").
// Live: server-sent events from {GLOBE_API}/gateway/events?v=2, each data line a JSON array of
// [eventType, lat, lon, dot]. The API exposes only the event type, an approximate location and the
// server's dot number for the census (a pseudonym: shuffled inside its size band, re-shuffled daily,
// never a Discord ID; owner, 2026-10-29). A "roster" event says how many dots there are and how many
// fall into each size band. This module enforces those shapes: anything else is dropped before it is
// drawn or counted.
// Fallback: the build-time snapshot in static/globe-snapshot.json (scripts/stats.mjs writes it).

export const GLOBE_API: string = __GLOBE_API__;

export type Point = [lat: number, lon: number, share: number];
export type Snapshot = {
	placeholder?: boolean;
	measured: string | null; // ISO time of the measurement
	windowSeconds: number;
	ratePerSecond: number | null;
	points: Point[]; // 2 degree bins with their share of the events
	connected: boolean;
};
export type GlobeEvent = [type: string, lat: number, lon: number, dot: number]; // dot is -1 for a server without one
// The census's roster: counts only, null while the real sizes are not published. The sizes come in as many steps as the API gives (eight; its older four bands otherwise): `mins` is
// each step's lowest member count, largest first, and `bands` and `bandMembers` count its servers and members.
export type Roster = { source: 'members' | 'provisional'; total: number; mins: number[]; bands: number[] | null; bandMembers: number[] | null };
const FOUR = [5000, 500, 50, 0];
// what the caption needs from the snapshot; the points stay out of the page's HTML and first script
export type Still = { placeholder: boolean; rate: number | null; day: string | null };

export const still = (s: Snapshot): Still => ({
	placeholder: !!s.placeholder || s.ratePerSecond === null || s.measured === null,
	rate: s.ratePerSecond,
	day: s.measured && new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date(s.measured))
});

// a gateway event name such as MESSAGE_CREATE: capitals and underscores only, so no ID or locale fits
const TYPE = /^[A-Z][A-Z_]{1,62}$/;
const MAX_BATCH = 1000;
export const MAX_DOTS = 20000; // more servers than this are not drawn; Ayako has about 8,500

export function valid(e: unknown): e is GlobeEvent {
	return (
		Array.isArray(e) &&
		e.length === 4 &&
		typeof e[0] === 'string' &&
		TYPE.test(e[0]) &&
		typeof e[1] === 'number' &&
		typeof e[2] === 'number' &&
		Math.abs(e[1]) <= 90 &&
		Math.abs(e[2]) <= 180 &&
		Number.isInteger(e[3]) &&
		e[3] >= -1 &&
		e[3] < MAX_DOTS
	);
}

const counts = (a: unknown, length?: number): a is number[] =>
	Array.isArray(a) && a.length >= 2 && a.length <= 12 && (length === undefined || a.length === length) && a.every((n) => Number.isInteger(n) && n >= 0);
export function parseRoster(data: unknown): Roster | null {
	if (typeof data !== 'string') return null;
	let r: Record<string, unknown>;
	try {
		r = JSON.parse(data);
	} catch {
		return null;
	}
	if (!r || typeof r !== 'object' || !Number.isInteger(r.total) || (r.total as number) < 1) return null;
	const total = Math.min(r.total as number, MAX_DOTS);
	if (r.source !== 'members') return { source: 'provisional', total, mins: FOUR, bands: null, bandMembers: null };
	// the finer steps when all three lists agree, else the four bands
	if (counts(r.steps) && counts(r.stepMembers, r.steps.length) && counts(r.stepMin, r.steps.length))
		return { source: 'members', total, mins: r.stepMin, bands: r.steps, bandMembers: r.stepMembers };
	if (counts(r.bands, 4) && counts(r.bandMembers, 4)) return { source: 'members', total, mins: FOUR, bands: r.bands, bandMembers: r.bandMembers };
	return { source: 'provisional', total, mins: FOUR, bands: null, bandMembers: null };
}

export function parse(data: unknown): GlobeEvent[] {
	if (typeof data !== 'string') return [];
	let batch: unknown;
	try {
		batch = JSON.parse(data);
	} catch {
		return [];
	}
	return Array.isArray(batch) ? batch.slice(0, MAX_BATCH).filter(valid) : [];
}

const WINDOW = 10; // seconds the live rate is counted over

// Opens the stream and keeps it while the tab is visible; scrolling away only stops the drawing.
// rate() gets the events per second over the last 10 seconds once that much stream exists with
// events in it, and null whenever the caption should show the snapshot instead.
// lost() runs once, when the stream has failed for this visit (the relay is unreachable, refuses this
// origin or has too many streams from this visitor); closing for a hidden tab or a pause is not a loss.
export function openStream(on: {
	events: (e: GlobeEvent[]) => void;
	rate: (r: number | null) => void;
	roster?: (r: Roster) => void;
	lost?: () => void;
}) {
	const bins = new Array<number>(WINDOW).fill(0);
	let slot = 0;
	let seconds = 0;
	let es: EventSource | null = null;
	let failed = false;

	const close = () => {
		es?.close();
		es = null;
		bins.fill(0);
		seconds = 0;
		on.rate(null);
	};
	const open = () => {
		if (es || failed) return;
		es = new EventSource(`${GLOBE_API}/gateway/events?v=2`);
		es.addEventListener('roster', (m) => {
			const r = parseRoster((m as MessageEvent).data);
			if (r) on.roster?.(r);
		});
		es.onmessage = (m) => {
			const ev = parse(m.data);
			bins[slot] += ev.length;
			if (ev.length) on.events(ev);
		};
		// ponytail: one failure ends the stream for this visit, so an unreachable API costs one request; add a backoff retry if drops prove common
		es.onerror = () => {
			failed = true;
			close();
			on.lost?.();
		};
	};

	const tick = setInterval(() => {
		if (!es) return;
		seconds++;
		const sum = bins.reduce((a, b) => a + b, 0);
		on.rate(seconds >= WINDOW && sum > 0 ? sum / WINDOW : null);
		slot = (slot + 1) % WINDOW;
		bins[slot] = 0;
	}, 1000);

	// a hidden tab holds no connection and reopens when it is seen again
	const vis = () => (document.hidden ? close() : open());
	document.addEventListener('visibilitychange', vis);
	open();

	return () => {
		clearInterval(tick);
		document.removeEventListener('visibilitychange', vis);
		close();
	};
}
