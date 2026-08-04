/**
 * Taut-thread geometry. A pinned thread under tension runs DEAD STRAIGHT
 * between pins and changes direction only where it wraps a pin head —
 * so every thread path on the wall is a polyline whose interior vertices
 * (the pins) get a small quadratic wrap of roughly the pin's radius.
 * Straight segments also survive non-uniform viewBox stretching
 * (preserveAspectRatio="none") exactly, which Béziers do not.
 *
 * Two consumers:
 * — `tautPath` builds one path string (the hero's fixed run).
 * — `tautLegs` splits the same polyline into ONE PATH PER LEG so each
 *   leg can be its own 1:1 SVG with its own scroll range. The legs
 *   concatenate back into exactly the polyline `tautPath` would emit:
 *   a leg carries its destination pin's wrap, so the seam between two
 *   legs sits on the straight run between pins, never on a corner.
 */

export type Pt = readonly [number, number];

/** Default wrap radius: half the 14px brass pin head. */
export const PIN_R = 7;

const seg = (a: Pt, b: Pt) => {
	const dx = b[0] - a[0];
	const dy = b[1] - a[1];
	const len = Math.hypot(dx, dy) || 1;
	return { ux: dx / len, uy: dy / len, len };
};

const fmt = (n: number) => (Math.round(n * 100) / 100).toString();

/**
 * Wrap tangent points for every interior vertex: the thread leaves the
 * straight run at `a`, curves through the pin, and rejoins at `b`.
 */
const wraps = (pts: readonly Pt[], r: number) => {
	const out: { a: Pt; b: Pt }[] = [];
	for (let i = 1; i < pts.length - 1; i++) {
		const v = pts[i]!;
		const inn = seg(pts[i - 1]!, v);
		const out2 = seg(v, pts[i + 1]!);
		const rr = Math.min(r, inn.len / 2, out2.len / 2);
		out[i] = {
			a: [v[0] - inn.ux * rr, v[1] - inn.uy * rr],
			b: [v[0] + out2.ux * rr, v[1] + out2.uy * rr]
		};
	}
	return out;
};

/**
 * Rounded polyline: `M P0 … L … Q Vi … L … Pn`. Each interior vertex is
 * approached straight, wrapped with a quadratic of radius `r` (clamped to
 * half the shorter adjacent segment), and left straight.
 */
export const tautPath = (pts: readonly Pt[], r: number = PIN_R): string => {
	if (pts.length < 2) throw new Error("tautPath needs at least two points");
	const w = wraps(pts, r);

	let d = `M ${fmt(pts[0]![0])} ${fmt(pts[0]![1])}`;
	for (let i = 1; i < pts.length - 1; i++) {
		const v = pts[i]!;
		const { a, b } = w[i]!;
		d += ` L ${fmt(a[0])} ${fmt(a[1])} Q ${fmt(v[0])} ${fmt(v[1])} ${fmt(b[0])} ${fmt(b[1])}`;
	}
	const last = pts[pts.length - 1]!;
	d += ` L ${fmt(last[0])} ${fmt(last[1])}`;
	return d;
};

export interface Leg {
	/** path data, in the SAME coordinate space as the points given */
	d: string;
	/** tight bounding box of the leg, same space (control points included) */
	x: number;
	y: number;
	w: number;
	h: number;
}

/**
 * Split the taut polyline into one path per leg. Leg k runs from just
 * past pin k's wrap to just past pin k+1's wrap, so every leg ENDS on
 * its destination pin — which is what lets each leg be timed to lay
 * itself down as its destination card reaches reading height.
 */
export const tautLegs = (pts: readonly Pt[], r: number = PIN_R): Leg[] => {
	if (pts.length < 2) throw new Error("tautLegs needs at least two points");
	const n = pts.length;
	const w = wraps(pts, r);
	const legs: Leg[] = [];

	for (let k = 0; k < n - 1; k++) {
		const start: Pt = k === 0 ? pts[0]! : w[k]!.b;
		const v = pts[k + 1]!;
		const hull: Pt[] = [start];
		let d = `M ${fmt(start[0])} ${fmt(start[1])}`;

		if (k + 1 === n - 1) {
			d += ` L ${fmt(v[0])} ${fmt(v[1])}`;
			hull.push(v);
		} else {
			const { a, b } = w[k + 1]!;
			d += ` L ${fmt(a[0])} ${fmt(a[1])} Q ${fmt(v[0])} ${fmt(v[1])} ${fmt(b[0])} ${fmt(b[1])}`;
			hull.push(a, v, b);
		}

		const xs = hull.map((p) => p[0]);
		const ys = hull.map((p) => p[1]);
		const x = Math.min(...xs);
		const y = Math.min(...ys);
		legs.push({ d, x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y });
	}
	return legs;
};

export interface KnotPlacement {
	/** where the knot's entry point must sit, same space as the inputs */
	entry: Pt;
	/** rotation about the entry point, in degrees (0 = entry runs down) */
	angle: number;
}

/**
 * Place the loose end so that it hangs along the thread. The knot is
 * authored entry-at-top running straight down; `tail` is the knot-local
 * vector from that entry to the cut node. We need the cut node to land
 * on `pin` AND the entry tangent to continue the run arriving from
 * `from` — one fixed point, found in a handful of iterations.
 */
export const solveKnot = (
	from: Pt,
	pin: Pt,
	tail: Pt,
	maxTiltDeg = 45
): KnotPlacement => {
	const lim = (maxTiltDeg * Math.PI) / 180;
	let angle = 0;
	let entry: Pt = [pin[0] - tail[0], pin[1] - tail[1]];

	for (let i = 0; i < 6; i++) {
		const dx = entry[0] - from[0];
		const dy = entry[1] - from[1];
		/* R(θ)·(0,1) = (−sinθ, cosθ) in screen space (y down) */
		angle = Math.max(-lim, Math.min(lim, Math.atan2(-dx, dy || 1)));
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		entry = [pin[0] - (tail[0] * c - tail[1] * s), pin[1] - (tail[0] * s + tail[1] * c)];
	}

	return { entry, angle: (angle * 180) / Math.PI };
};
