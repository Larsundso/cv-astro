/**
 * Taut-thread geometry. A pinned thread under tension runs DEAD STRAIGHT
 * between pins and changes direction only where it wraps a pin head —
 * so every thread path on the wall is a polyline whose interior vertices
 * (the pins) get a small quadratic wrap of roughly the pin's radius.
 * Straight segments also survive non-uniform viewBox stretching
 * (preserveAspectRatio="none") exactly, which Béziers do not.
 */

export type Pt = readonly [number, number];

/** Default wrap radius: half the 14px brass pin head. */
const PIN_R = 7;

/**
 * Rounded polyline: `M P0 … L … Q Vi … L … Pn`. Each interior vertex is
 * approached straight, wrapped with a quadratic of radius `r` (clamped to
 * half the shorter adjacent segment), and left straight.
 */
export const tautPath = (pts: readonly Pt[], r: number = PIN_R): string => {
	if (pts.length < 2) throw new Error("tautPath needs at least two points");
	const seg = (a: Pt, b: Pt) => {
		const dx = b[0] - a[0];
		const dy = b[1] - a[1];
		const len = Math.hypot(dx, dy) || 1;
		return { ux: dx / len, uy: dy / len, len };
	};
	const fmt = (n: number) => (Math.round(n * 100) / 100).toString();

	let d = `M ${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
	for (let i = 1; i < pts.length - 1; i++) {
		const v = pts[i];
		const inn = seg(pts[i - 1], v);
		const out = seg(v, pts[i + 1]);
		const rr = Math.min(r, inn.len / 2, out.len / 2);
		const a: Pt = [v[0] - inn.ux * rr, v[1] - inn.uy * rr];
		const b: Pt = [v[0] + out.ux * rr, v[1] + out.uy * rr];
		d += ` L ${fmt(a[0])} ${fmt(a[1])} Q ${fmt(v[0])} ${fmt(v[1])} ${fmt(b[0])} ${fmt(b[1])}`;
	}
	const last = pts[pts.length - 1];
	d += ` L ${fmt(last[0])} ${fmt(last[1])}`;
	return d;
};
