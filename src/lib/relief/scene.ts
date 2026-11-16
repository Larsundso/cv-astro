// The relief: the hours WakaTime has tracked, as an archipelago on the atlas's chart. Every language
// (or project) is an island whose summit stands as high as its hours, with a thin contour every 250
// hours and a heavy one every 1,000, so the heights can be counted as on a topographic map. The sea is
// the page's own band; waterlines and a faint grid are all that is drawn on it.
// The islands of a view are laid out once (the largest at the back, so nothing hides behind it) and
// baked into a height field; the vertex shader lifts one plane by it and the fragment shader prints
// the tints and lines. Switching views mixes two fields, so islands sink and others rise.
// Loaded lazily (Relief.svelte). Under reduced motion it stands still and draws only on a change.
import * as THREE from 'three';

export type Isle = { name: string; hours: number };
type Placed = Isle & { x: number; z: number; r: number; ph: number[] };

const PW = 4.8; // the chart in world units: width (x) and depth (z, towards the viewer)
const PD = 3;
const TW = 1152; // the height field, 240 texels to a unit
const TH = 720;
const RISE = 1.05; // world height of the highest summit of all views
const R_MOST = 0.92; // an island's radius grows with the root of its hours, between these two
const R_LEAST = 0.05;
// a coast is its circle with three waves on it, so no island is round
const WAVES = [2, 3, 5];
const WOBBLE = [0.1, 0.07, 0.04];
const BULGE = 1.21; // the widest a coast gets, in radii
const GAP = 0.07; // clear water between two coasts
const REACH = 0.2; // how far the waterlines run from a coast
export const STEP = 250; // hours to a thin contour
export const HEAVY = 1000; // hours to a heavy one
const ELEVATION = 33; // degrees the eye stands above the chart
const SWAY = 8; // degrees the view drifts to either side
const SWAY_PERIOD = 80; // seconds per drift cycle
const TURN = 1.5; // seconds a change of view takes
const RAD = Math.PI / 180;

// the same three phases for the same name on every visit
function phases(name: string) {
	let h = 2166136261;
	for (const c of name) h = Math.imul(h ^ c.codePointAt(0)!, 16777619);
	return [0, 9, 18].map((shift) => (((h >>> shift) & 511) / 511) * Math.PI * 2);
}
const coast = (p: Placed, a: number) =>
	p.r * (1 + WOBBLE[0] * Math.sin(WAVES[0] * a + p.ph[0]) + WOBBLE[1] * Math.sin(WAVES[1] * a + p.ph[1]) + WOBBLE[2] * Math.sin(WAVES[2] * a + p.ph[2]));

// Largest first, each island takes the free place nearest to where its size belongs: the big ones at
// the back, the small ones in front, the largest of all to the left. If the chart is too small for
// them, every radius shrinks a little and the layout starts again.
export function lay(isles: Isle[], most: number): Placed[] {
	for (let scale = 1; ; scale *= 0.93) {
		const out: Placed[] = [];
		const fits = isles.every((isle, n) => {
			const r = Math.max(R_LEAST, R_MOST * scale * Math.sqrt(isle.hours / most));
			const R = r * BULGE;
			const wantX = n ? 0.3 : -0.95;
			const wantZ = 0.85 - 1.5 * (r / R_MOST);
			let best: [number, number] | null = null;
			let cost = Infinity;
			for (let z = -PD / 2 + REACH + R; z <= PD / 2 - REACH - R; z += 0.04)
				for (let x = -PW / 2 + REACH + R; x <= PW / 2 - REACH - R; x += 0.04) {
					const c = ((x - wantX) / 2) ** 2 + (z - wantZ) ** 2;
					if (c < cost && out.every((p) => Math.hypot(p.x - x, p.z - z) >= p.r * BULGE + R + GAP)) {
						best = [x, z];
						cost = c;
					}
				}
			if (best) out.push({ ...isle, x: best[0], z: best[1], r, ph: phases(isle.name) });
			return !!best;
		});
		// ponytail: below a fifth of the size the islands that found no place are left off; the table still lists them
		if (!fits && scale > 0.2) continue;
		// the group stands in the middle of the chart
		const box = out.reduce((b, p) => [Math.min(b[0], p.x - p.r), Math.max(b[1], p.x + p.r), Math.min(b[2], p.z - p.r), Math.max(b[3], p.z + p.r)], [9, -9, 9, -9]);
		return out.map((p) => ({ ...p, x: p.x - (box[0] + box[1]) / 2, z: p.z - (box[2] + box[3]) / 2 }));
	}
}

// the surface at a place, in world height, and the island it belongs to (-1 for the sea)
function surface(isles: Placed[], most: number, x: number, z: number): [number, number] {
	let y = 0;
	let at = -1;
	for (let i = 0; i < isles.length; i++) {
		const p = isles[i];
		const dist = Math.hypot(x - p.x, z - p.z);
		if (dist > p.r * BULGE) continue;
		const t = dist / coast(p, Math.atan2(z - p.z, x - p.x));
		if (t < 1 && (p.hours / most) * (1 - t * t) * RISE >= y) {
			y = (p.hours / most) * (1 - t * t) * RISE;
			at = i;
		}
	}
	return [y, at];
}

// A view as a texture: red is the height as a share of the highest summit (below zero in the sea),
// green the distance to the nearest coast in world units. Half floats, which WebGL2 filters by itself.
function bake(isles: Placed[], most: number) {
	const floor = -STEP / most;
	const h = new Float32Array(TW * TH).fill(floor);
	const d = new Float32Array(TW * TH).fill(REACH);
	for (const p of isles) {
		const R = p.r * BULGE + REACH;
		const i0 = Math.max(0, Math.floor(((p.x - R) / PW + 0.5) * TW));
		const i1 = Math.min(TW - 1, Math.ceil(((p.x + R) / PW + 0.5) * TW));
		const j0 = Math.max(0, Math.floor((0.5 - (p.z + R) / PD) * TH));
		const j1 = Math.min(TH - 1, Math.ceil((0.5 - (p.z - R) / PD) * TH));
		for (let j = j0; j <= j1; j++) {
			const z = PD / 2 - ((j + 0.5) / TH) * PD - p.z;
			for (let i = i0; i <= i1; i++) {
				const x = ((i + 0.5) / TW) * PW - PW / 2 - p.x;
				const dist = Math.hypot(x, z);
				const edge = coast(p, Math.atan2(z, x));
				const t = dist / edge;
				const k = j * TW + i;
				h[k] = Math.max(h[k], (p.hours / most) * (1 - t * t));
				d[k] = Math.min(d[k], dist - edge);
			}
		}
	}
	const px = new Uint16Array(TW * TH * 2);
	for (let k = 0; k < h.length; k++) {
		px[2 * k] = THREE.DataUtils.toHalfFloat(h[k]);
		px[2 * k + 1] = THREE.DataUtils.toHalfFloat(d[k]);
	}
	const tex = new THREE.DataTexture(px, TW, TH, THREE.RGFormat, THREE.HalfFloatType);
	tex.minFilter = tex.magFilter = THREE.LinearFilter;
	tex.needsUpdate = true;
	return tex;
}

const defines = { PW: PW.toFixed(2), PD: PD.toFixed(2), TW: TW.toFixed(1), TH: TH.toFixed(1), RISE: RISE.toFixed(3), STEP: STEP.toFixed(1), HEAVY: HEAVY.toFixed(1) };

const vertexShader = /* glsl */ `
uniform sampler2D tA;
uniform sampler2D tB;
uniform float uMix;
varying vec2 vUv;
varying vec2 vXZ;
void main() {
	vUv = uv;
	vXZ = position.xz;
	float h = max(mix(texture2D(tA, uv).r, texture2D(tB, uv).r, uMix), 0.0);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, h * RISE, position.z, 1.0);
}`;

// The print's inks, written as they are shown (no colour conversion follows): the globe's cream land
// warming to Ayako's orange with height, the page's blue-black for every line, a pale blue for water.
const fragmentShader = /* glsl */ `
uniform sampler2D tA;
uniform sampler2D tB;
uniform float uMix;
uniform float uMost;
varying vec2 vUv;
varying vec2 vXZ;
const vec3 LOW = vec3(0.953, 0.918, 0.847);
const vec3 MID = vec3(0.93, 0.83, 0.64);
const vec3 HIGH = vec3(0.98, 0.536, 0.155);
const vec3 INK = vec3(0.075, 0.114, 0.233);
const vec3 WATER = vec3(0.44, 0.54, 0.89);
const vec3 LIGHT = vec3(-0.549, 0.619, -0.561); // from the upper left, as a printed relief is lit

vec2 field(vec2 uv) {
	return mix(texture2D(tA, uv).rg, texture2D(tB, uv).rg, uMix);
}
float ground(vec2 uv) {
	return max(field(uv).r, 0.0);
}
// a line wherever v passes a whole number, between a and b pixels wide
float line(float v, float a, float b) {
	float w = fwidth(v);
	return 1.0 - smoothstep(w * a, w * b, abs(fract(v + 0.5) - 0.5));
}

void main() {
	vec2 f = field(vUv);
	float hours = f.r * uMost;
	float px = max(fwidth(hours), 1e-5);
	float land = clamp(hours / px + 0.5, 0.0, 1.0);

	float t = clamp(hours / 3000.0, 0.0, 1.0);
	vec3 col = mix(mix(LOW, MID, smoothstep(0.0, 0.3, t)), HIGH, smoothstep(0.3, 1.0, t));
	vec2 e = vec2(1.5 / TW, 1.5 / TH);
	float sx = ground(vUv + vec2(e.x, 0.0)) - ground(vUv - vec2(e.x, 0.0));
	float sz = ground(vUv + vec2(0.0, e.y)) - ground(vUv - vec2(0.0, e.y));
	vec3 n = normalize(vec3(-sx * RISE / (2.0 * e.x * PW), 1.0, sz * RISE / (2.0 * e.y * PD)));
	float lit = dot(n, LIGHT) - LIGHT.y;
	col = mix(col, INK, clamp(-lit * 0.5, 0.0, 0.38));
	col += max(lit, 0.0) * 0.1;

	// the contours thin out where they would run into one another
	float thin = line(hours / STEP, 0.5, 1.5) * (1.0 - smoothstep(0.28, 0.55, fwidth(hours / STEP)));
	float heavy = line(hours / HEAVY, 1.1, 2.3);
	col = mix(col, INK, max(thin * 0.5, heavy * 0.85));

	// the sea: waterlines that fade with their distance from a coast, a paler shelf, and a faint grid
	float q = f.g / 0.034;
	float water = line(q, 0.6, 1.6) * step(0.5, q) * (1.0 - smoothstep(0.5, 5.6, q));
	vec2 g = vXZ / 0.4;
	vec2 gw = fwidth(g);
	vec2 gl = 1.0 - smoothstep(gw * 0.5, gw * 1.5, abs(fract(g + 0.5) - 0.5));
	float edge = 1.0 - smoothstep(0.55, 1.0, length(vXZ / vec2(PW * 0.5, PD * 0.5)));
	float sea = max(water * 0.5, max(gl.x, gl.y) * 0.13 * edge) + 0.11 * (1.0 - smoothstep(0.0, 4.5, q));

	vec4 c = mix(vec4(WATER, sea), vec4(col, 1.0), land);
	float shore = (1.0 - smoothstep(0.9, 2.2, abs(hours) / px)) * 0.9;
	gl_FragColor = vec4(mix(c.rgb, INK, shore), max(c.a, shore));
}`;

export type Relief = {
	view: (i: number) => void; // which of the views to show; a change is flown, or immediate when still
	inspect: (clientX: number, clientY: number) => number; // the island under a point of the screen, -1 for none
	stop: () => void;
};
type On = {
	ready: () => void; // the first frame is drawn
	marks: (xy: Float32Array) => void; // every summit of the shown view in CSS pixels of the canvas, after each frame
	turned: (i: number) => void; // a change of view has ended
};

export function start(canvas: HTMLCanvasElement, views: Isle[][], still: boolean, on: On): Relief {
	const most = Math.max(1, ...views.flat().map((v) => v.hours));
	const laid = views.map((v) => lay(v, most));
	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
	renderer.setClearColor(0x000000, 0);
	const fields = laid.map((l) => bake(l, most));
	const uniforms = { tA: { value: fields[0] }, tB: { value: fields[0] }, uMix: { value: 0 }, uMost: { value: most } };
	const chart = new THREE.Mesh(
		new THREE.PlaneGeometry(PW, PD, 384, 240).rotateX(-Math.PI / 2),
		new THREE.ShaderMaterial({ uniforms, defines, vertexShader, fragmentShader, transparent: true })
	);
	chart.frustumCulled = false; // the shader lifts it out of its own bounds
	const scene = new THREE.Scene().add(chart);
	const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 40);
	const target = new THREE.Vector3(0, 0.1, 0.12);
	const xy = new Float32Array(Math.max(...laid.map((l) => l.length)) * 2);
	const v = new THREE.Vector3();
	let dist = 8;
	let base = 0; // the visitor's own turn, in radians
	let shown = 0;
	let wanted = 0;
	let turning = false;
	let turnStart = 0;
	let visible = false;
	let drawn = false;
	let raf = 0;

	const frame = (ms: number) => {
		raf = 0;
		const now = ms / 1000;
		if (turning) {
			const k = Math.min(1, Math.max(0, (now - turnStart) / TURN));
			uniforms.uMix.value = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
			if (k === 1) land();
		}
		const a = base + (still ? 0 : SWAY * RAD * Math.sin((now * Math.PI * 2) / SWAY_PERIOD));
		const el = ELEVATION * RAD;
		camera.position.set(target.x + dist * Math.sin(a) * Math.cos(el), target.y + dist * Math.sin(el), target.z + dist * Math.cos(a) * Math.cos(el));
		camera.lookAt(target);
		renderer.render(scene, camera);
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		laid[shown].forEach((p, i) => {
			v.set(p.x, (p.hours / most) * RISE, p.z).project(camera);
			xy[2 * i] = (v.x * 0.5 + 0.5) * w;
			xy[2 * i + 1] = (0.5 - v.y * 0.5) * h;
		});
		on.marks(xy);
		if (!drawn) on.ready();
		drawn = true;
		if (visible && !document.hidden && (!still || turning)) raf = requestAnimationFrame(frame);
	};
	const wake = () => {
		if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
	};

	// a change of view: the shown field gives way to the next; a click during it is taken up when it ends
	const land = () => {
		turning = false;
		uniforms.tA.value = fields[shown];
		uniforms.uMix.value = 0;
		on.turned(shown);
		if (wanted !== shown) go(wanted);
	};
	const go = (i: number) => {
		uniforms.tB.value = fields[i];
		shown = i;
		if (still) land();
		else {
			turning = true;
			turnStart = performance.now() / 1000;
		}
		wake();
	};

	const fit = () => {
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		if (!w || !h) return;
		renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		// far enough for the chart's width, and on a tall stage for its depth with the summits
		const half = Math.tan((camera.fov * RAD) / 2);
		dist = Math.max((PW * 0.5) / (half * camera.aspect), (PD * 0.5 * Math.sin(ELEVATION * RAD) + RISE * 0.55) / half);
		camera.updateProjectionMatrix();
		wake();
	};
	const sized = new ResizeObserver(fit);
	sized.observe(canvas);
	// a busy main thread delivers several entries at once; only the last says where the chart is now
	const seen = new IntersectionObserver((entries) => {
		visible = entries[entries.length - 1].isIntersecting;
		wake();
	});
	seen.observe(canvas);
	document.addEventListener('visibilitychange', wake);

	// a hand on the chart turns it, a third of a turn to either side at most
	let held = false;
	let heldX = 0;
	const down = (e: PointerEvent) => {
		held = true;
		heldX = e.clientX;
		canvas.setPointerCapture(e.pointerId);
	};
	const move = (e: PointerEvent) => {
		if (!held) return;
		base = Math.min(1, Math.max(-1, base - ((e.clientX - heldX) / canvas.clientWidth) * 1.6));
		heldX = e.clientX;
		wake();
	};
	const up = () => (held = false);
	canvas.addEventListener('pointerdown', down);
	canvas.addEventListener('pointermove', move);
	canvas.addEventListener('pointerup', up);
	canvas.addEventListener('pointercancel', up);

	return {
		view(i) {
			wanted = i;
			if (!turning && i !== shown) go(i);
		},
		// the sight line is walked down from the height of the highest summit to the sea
		inspect(clientX, clientY) {
			if (turning) return -1;
			const box = canvas.getBoundingClientRect();
			const from = camera.position;
			const dir = v.set(((clientX - box.left) / box.width) * 2 - 1, 1 - ((clientY - box.top) / box.height) * 2, 0.5).unproject(camera).sub(from).normalize();
			if (dir.y >= 0) return -1;
			const t0 = Math.max(0, (RISE - from.y) / dir.y);
			const t1 = -from.y / dir.y;
			for (let s = 0; s <= 120; s++) {
				const t = t0 + ((t1 - t0) * s) / 120;
				const [y, at] = surface(laid[shown], most, from.x + dir.x * t, from.z + dir.z * t);
				if (at >= 0 && from.y + dir.y * t <= y) return at;
			}
			// a small island is a small target: a near miss in the water counts
			const x = from.x + dir.x * t1;
			const z = from.z + dir.z * t1;
			return laid[shown].findIndex((p) => Math.hypot(x - p.x, z - p.z) < p.r * BULGE + 0.04 && p.r < 0.12);
		},
		stop() {
			cancelAnimationFrame(raf);
			sized.disconnect();
			seen.disconnect();
			document.removeEventListener('visibilitychange', wake);
			canvas.removeEventListener('pointerdown', down);
			canvas.removeEventListener('pointermove', move);
			canvas.removeEventListener('pointerup', up);
			canvas.removeEventListener('pointercancel', up);
			fields.forEach((f) => f.dispose());
			chart.geometry.dispose();
			chart.material.dispose();
			renderer.dispose();
		}
	};
}
