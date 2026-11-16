// The live globe: a printed atlas globe (cobalt sea with engraved waterlines, cream land with country
// borders) painted once onto a canvas texture, and over it every gateway event as a streak that flies
// in an arc from its estimated place to Helsinki. A streak leaves a thin trace that drains after it
// and a dot at its origin that lingers, so busy places fill in. Loaded lazily; the poster
// (static/globe/still.webp, a frame of this scene) stands in until then.
// Every streak is a real event from the stream (Ayako's Redis pub/sub, through the relay). Only once the
// stream has failed does the snapshot's measured rate and spread draw streaks instead (fallback()).
// f24 adds the servers: one dot for each, at its estimated place on the globe, lighting up when its
// event leaves. A second view, the census, lays the same dots out by size; the turn between the two is
// flown, out of the countries and back into them (TURNING below).
// f23 adds the ring: a band round the globe with one named field for each kind of event, in which every
// real event leaves a tick as its streak lands.
// f22 adds the real night (the sun's place right now), a shadow under every streak, the oceans' names
// in the atlas italic, a flick that keeps turning, set views and a pause.
import * as THREE from 'three';
import snapshot from '../../../static/globe-snapshot.json';
import { MAX_DOTS, type GlobeEvent, type Roster, type Snapshot } from './source.js';

import { inkOf as kindOf, laneOf, LANES } from './lanes.js';
import { PIN, VIEW, subsolar } from './view.js';
const SWAY = 34; // degrees the view drifts east and west of the centre
const SWAY_PERIOD = 90; // seconds per drift cycle
const CAP = 640; // streaks held at once
const HOLD = 5; // seconds a streak's trace takes to drain behind it
const MAX_RATE = CAP / 8; // streaks begun per second at most (the longest lives 7.5 s); events beyond it are counted, not drawn
const DOTS = 1024; // origin dots held at once
const DOT_LIFE = 32; // seconds an origin dot lingers
const NOMINAL = 6; // streaks per second while the snapshot is a placeholder
const SLOW_MS = 55; // median frame time above which the device gets the poster instead
const RAD = Math.PI / 180;
// the ring round the globe, in globe radii: a field for each kind of event inside, its name outside
const RING_IN = 1.1;
const FIELD_OUT = 1.205;
const RING_OUT = 1.29;
const RING_TILT = 22; // degrees its far side dips away
const MARK_LIFE = 10; // seconds a mark stays in its field
const RING_CAP = 2048; // marks held at once
const SECTOR = (Math.PI * 2) / LANES.length;
// the census, the scene's second view: one dot for each server, laid out as a disc inside the ring
const CENSUS_R = 1.045; // the disc's radius, in globe radii
const DOT_MOST = 4; // a dot's radius in the largest size step and in the smallest, before the disc is fitted
const DOT_LEAST = 0.6;
// While the servers' real sizes are not published, the bands are filled in the shares of f03's
// simulation (71, 986, 3,195 and 4,278 of 8,530 servers), and the page says the sizes are simulated.
const SIMULATED = [71 / 8530, 986 / 8530, 3195 / 8530, 4278 / 8530];
const OPEN = 2.6; // seconds the servers take to leave the globe and lay themselves out
const CLOSE = 3.4; // seconds they take to make room, swirl round the returning globe and land
const f = (n: number) => n.toFixed(5);
const snap = snapshot as Snapshot;

// the print's inks
const SEA = '#1d3187';
const SEA_LINE = [112, 138, 226]; // waterlines and graticule, mixed into the sea
const LAND = '#f3ead8';
const LAND_SHORE = '#e3d6ba';
const BORDER = '#cdbd97';


// three's sphere frame (matches SphereGeometry's UVs): longitude 0 on +x, 90 E on -z
const vec = (lat: number, lon: number) => {
	const p = lat * RAD;
	const l = lon * RAD;
	return new THREE.Vector3(Math.cos(p) * Math.cos(l), Math.sin(p), -Math.cos(p) * Math.sin(l));
};

const sunAt = () => vec(...subsolar(new Date()));

type Lines = number[][]; // flat lon,lat lists

// follow a line across the antimeridian instead of jumping back over the whole map
function unwrap(r: number[], close: boolean) {
	const pts: [number, number][] = [];
	for (let i = 0; i < r.length; i += 2) {
		let lon = r[i];
		if (pts.length) while (lon - pts[pts.length - 1][0] > 180) lon -= 360;
		if (pts.length) while (lon - pts[pts.length - 1][0] < -180) lon += 360;
		pts.push([lon, r[i + 1]]);
	}
	// a ring round a pole (Antarctica) is closed down to that pole
	if (close && Math.abs(pts[pts.length - 1][0] - pts[0][0]) > 359) {
		const pole = pts[0][1] < 0 ? -90 : 90;
		pts.push([pts[pts.length - 1][0], pole], [pts[0][0], pole]);
	}
	return pts;
}

// The whole surface as one equirectangular painting. Strokes are drawn in latitude bands, each with
// the pen widened east to west by 1 / cos(latitude), so a waterline keeps its distance from the coast
// on the sphere wherever it is.
export type Sea = { name: string; lat: number; lon: number };
function paint(land: Lines, borders: Lines, seas: Sea[], W: number) {
	const H = W / 2;
	const c = document.createElement('canvas');
	c.width = W;
	c.height = H;
	const g = c.getContext('2d')!;
	const u = W / 4096; // every measure below is in texels of the 4096 painting
	const X = (lon: number) => ((lon + 180) / 360) * W;
	const Y = (lat: number) => ((90 - lat) / 180) * H;
	const rings = land.map((r) => unwrap(r, true));
	const path = (lines: [number, number][][], squeeze: number, close: boolean) => {
		const p = new Path2D();
		for (const pts of lines)
			for (const shift of [-360, 0, 360]) {
				pts.forEach(([lon, lat], i) => (i ? p.lineTo(X(lon + shift) / squeeze, Y(lat)) : p.moveTo(X(lon + shift) / squeeze, Y(lat))));
				if (close) p.closePath();
			}
		return p;
	};

	g.fillStyle = SEA;
	g.fillRect(0, 0, W, H);

	// graticule every 15 degrees
	g.strokeStyle = `rgba(${SEA_LINE}, 0.2)`;
	g.lineWidth = 1.5 * u;
	g.beginPath();
	for (let lon = -180; lon < 180; lon += 15) g.rect(X(lon), Y(82), 0, Y(-82) - Y(82));
	for (let lat = -75; lat <= 75; lat += 15) g.rect(0, Y(lat), W, 0);
	g.stroke();

	// waterlines: five lines parallel to every coast, each fainter than the one before
	const N = 5;
	const gap = 5.5 * u;
	const pen = 1.7 * u;
	const BANDS = 18;
	g.lineJoin = 'round';
	for (let b = 0; b < BANDS; b++) {
		const top = (b * H) / BANDS;
		const mid = 90 - ((b + 0.5) * 180) / BANDS;
		const squeeze = Math.min(1 / Math.cos(mid * RAD), 4);
		g.save();
		g.beginPath();
		g.rect(0, top, W, H / BANDS + 0.5);
		g.clip();
		g.scale(squeeze, 1);
		const p = path(rings, squeeze, true);
		for (let k = N; k >= 1; k--) {
			// the sea first, so each line is drawn on clean water and never stacks on the wider one
			g.lineWidth = 2 * k * gap + pen;
			g.strokeStyle = SEA;
			g.stroke(p);
			g.strokeStyle = `rgba(${SEA_LINE}, ${0.16 + 0.5 * (1 - (k - 1) / (N - 1)) ** 1.5})`;
			g.stroke(p);
			g.lineWidth = 2 * k * gap - pen;
			g.strokeStyle = SEA;
			g.stroke(p);
		}
		g.restore();
	}

	// the oceans' names, set the way an atlas sets water: italic, widely spaced, along the parallel
	g.fillStyle = `rgba(${SEA_LINE}, 0.62)`;
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.font = `italic 400 ${44 * u}px "Libre Caslon Text", Georgia, serif`;
	if ('letterSpacing' in g) g.letterSpacing = `${15 * u}px`;
	for (const sea of seas) {
		g.save();
		g.translate(X(sea.lon), Y(sea.lat));
		g.scale(1 / Math.cos(sea.lat * RAD), 1);
		g.fillText(sea.name, 0, 0);
		g.restore();
	}

	// land, a darker shore tint inside every coast, then the borders
	const shape = path(rings, 1, true);
	g.fillStyle = LAND;
	g.fill(shape, 'evenodd');
	g.save();
	g.clip(shape, 'evenodd');
	g.strokeStyle = LAND_SHORE;
	g.globalAlpha = 0.55;
	g.lineWidth = 16 * u;
	g.stroke(shape);
	g.globalAlpha = 1;
	g.lineWidth = 5 * u;
	g.stroke(shape);
	g.strokeStyle = BORDER;
	g.lineWidth = 1.6 * u;
	g.stroke(
		path(
			borders.map((l) => unwrap(l, false)),
			1,
			false
		)
	);
	g.restore();

	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.NoColorSpace; // the shaders work in the print's own sRGB values
	t.anisotropy = 8;
	return t;
}

// The ring's face as one picture: the band, its hairlines, the lines between the fields, and each
// field's name set along the curve, upright on the upper half and turned on the lower so it reads.
function paintRing(names: string[], radiusPx: number) {
	const S = 2048;
	const c = document.createElement('canvas');
	c.width = c.height = S;
	const g = c.getContext('2d')!;
	const h = S / 2;
	const k = h / RING_OUT; // texels per globe radius
	const px = k / Math.max(radiusPx, 80); // texels per CSS pixel on screen
	const INK = '26, 31, 71';
	g.fillStyle = 'rgba(231, 223, 204, 0.62)';
	g.beginPath();
	g.arc(h, h, RING_OUT * k, 0, Math.PI * 2);
	g.arc(h, h, RING_IN * k, 0, Math.PI * 2, true);
	g.fill();
	g.strokeStyle = `rgba(${INK}, 0.5)`;
	g.lineWidth = px;
	for (const r of [RING_IN * k + px / 2, FIELD_OUT * k, RING_OUT * k - px / 2]) {
		g.beginPath();
		g.arc(h, h, r, 0, Math.PI * 2);
		g.stroke();
	}
	g.beginPath();
	names.forEach((_, i) => {
		const a = (i - 0.5) * SECTOR;
		g.moveTo(h + RING_IN * k * Math.sin(a), h - RING_IN * k * Math.cos(a));
		g.lineTo(h + RING_OUT * k * Math.sin(a), h - RING_OUT * k * Math.cos(a));
	});
	g.stroke();

	// names about 10 CSS pixels high wherever the ring is drawn, never taller than their strip allows
	const size = Math.min(10.5 * px, (RING_OUT - FIELD_OUT) * k * 0.6);
	const mid = ((FIELD_OUT + RING_OUT) / 2) * k;
	g.font = `700 ${size}px "Bricolage Grotesque", "Segoe UI", sans-serif`;
	g.fillStyle = `rgba(${INK}, 0.92)`;
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	names.forEach((name, i) => {
		const centre = i * SECTOR;
		const turned = Math.cos(centre) < -0.01; // on the lower half the name is set the other way up
		const chars = [...name.toUpperCase()];
		const widths = chars.map((ch) => (g.measureText(ch).width + size * 0.16) / mid);
		const dir = turned ? -1 : 1;
		let a = centre - (dir * widths.reduce((x, y) => x + y, 0)) / 2;
		chars.forEach((ch, j) => {
			a += (dir * widths[j]) / 2;
			g.save();
			g.translate(h + mid * Math.sin(a), h - mid * Math.cos(a));
			g.rotate(a + (turned ? Math.PI : 0));
			g.fillText(ch, 0, 0);
			g.restore();
			a += (dir * widths[j]) / 2;
		});
	});
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.NoColorSpace;
	t.anisotropy = 4;
	return t;
}

const GLSL_COLOURS = `
	vec3 ink(float kind) {
		return kind > 1.5 ? vec3(1.0, 0.2, 0.5) : kind > 0.5 ? vec3(1.0, 0.45, 0.06) : vec3(0.96, 0.24, 0.16);
	}`;

// what the page may say about the dot pointed at: its place on the stage (0 to 1), its size band, the
// country of its estimated place, and what it has done since the scene started
export type Seen = { x: number; y: number; r: number; band: number; country: string; known: boolean; events: number; lastType: string | null; lastAgo: number };
export type Scene = {
	stop: () => void;
	feed: (e: GlobeEvent[]) => void;
	shot: (quality?: number) => string;
	fallback: () => void; // the stream failed: let the snapshot draw from now on
	counts: () => { fed: number; simulated: number; ringed: number; lit: number; dots: number }; // streaks from real events and from the snapshot, marks set on the ring
	turn: (lon: number) => void; // bring a meridian to the front
	pause: (on: boolean) => void;
	view: (census: boolean) => void; // open the globe into the census, or close it again
	inspect: (clientX: number, clientY: number) => Seen | null; // the census dot under a pointer, which it also marks
	roster: (r: Pick<Roster, 'total' | 'bands'>) => void; // lay the census out anew
};
type Hooks = {
	ready: () => void;
	slow: () => void; // the device cannot hold the frame rate: go back to the poster
	pin: (x: number, y: number, visible: boolean) => void; // Helsinki's place on the stage, 0 to 1
};

export async function start(
	canvas: HTMLCanvasElement,
	urls: { land: string; borders: string; prior: string },
	seas: Sea[],
	names: string[], // the ring's fields, in the order of LANES
	firstTotal: number, // servers to lay the census out for until the stream sends its roster
	on: Hooks
): Promise<Scene> {
	const [land, borders, prior] = (await Promise.all([urls.land, urls.borders, urls.prior].map((u) => fetch(u).then((r) => r.json())))) as [Lines, Lines, [number, number, number, string][]];
	// where a server stands before its own place is known: the placement model's cells, heaviest first, as [lat, lon, weight, country]
	const priorSum: number[] = [];
	prior.reduce((sum, cell, i) => (priorSum[i] = sum + cell[2]), 0);
	const anywhere = () => {
		const x = Math.random() * priorSum[priorSum.length - 1];
		let lo = 0;
		let hi = priorSum.length - 1;
		while (lo < hi) {
			const mid = (lo + hi) >> 1;
			if (priorSum[mid] <= x) lo = mid + 1;
			else hi = mid;
		}
		return prior[lo];
	};
	// the names need the page's italic; without it they are set in the fallback serif
	await Promise.all(['italic 40px "Libre Caslon Text"', '700 20px "Bricolage Grotesque"'].map((font) => document.fonts.load(font))).catch(() => {});
	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
	renderer.setClearColor(0x000000, 0);
	renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // pass the print's sRGB values through untouched
	const scene = new THREE.Scene();
	const k = 1 / (2 * VIEW.radius);
	const camera = new THREE.OrthographicCamera(-k, k, k, -k, 0.1, 20);
	camera.position.z = 6;
	const globe = new THREE.Group();
	scene.add(globe);

	const big = canvas.clientWidth * (devicePixelRatio || 1) > 700 && renderer.capabilities.maxTextureSize >= 4096;
	const sphere = new THREE.Mesh(
		new THREE.SphereGeometry(1, 128, 80),
		new THREE.ShaderMaterial({
			uniforms: { map: { value: paint(land, borders, seas, big ? 4096 : 2048) }, uSun: { value: sunAt() }, uNight: { value: 1 } },
			vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vO;
				void main(){ vUv = uv; vO = position; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
			// a matte printed ball: a little form from the upper left, the limb darker, no gloss. Where the
			// real sun is below the horizon the print goes to dusk: cooler land on a deeper sea.
			fragmentShader: `uniform sampler2D map; uniform vec3 uSun; uniform float uNight; varying vec2 vUv; varying vec3 vN; varying vec3 vO;
				void main(){ vec3 n = normalize(vN); vec3 c = texture2D(map, vUv).rgb;
				float form = smoothstep(-0.7, 0.9, dot(n, normalize(vec3(-0.55, 0.6, 0.58))));
				float limb = pow(1.0 - max(n.z, 0.0), 3.0);
				c *= mix(0.8, 1.04, form) * (1.0 - 0.28 * limb);
				float night = uNight * (1.0 - smoothstep(-0.22, 0.14, dot(normalize(vO), uSun)));
				vec3 dusk = mix(c * vec3(0.72, 0.74, 0.86), vec3(0.09, 0.12, 0.3), 0.14);
				gl_FragColor = vec4(mix(c, dusk, night), 1.0); }`
		})
	);
	globe.add(sphere);

	// ---- streaks: one instanced ribbon, drawn in the vertex shader along each arc
	const pin = vec(PIN[0], PIN[1]);
	const SEG = 40;
	const strip = new THREE.InstancedBufferGeometry();
	const aT = new Float32Array((SEG + 1) * 2);
	const aSide = new Float32Array((SEG + 1) * 2);
	const index: number[] = [];
	for (let i = 0; i <= SEG; i++) {
		aT[i * 2] = aT[i * 2 + 1] = i / SEG;
		aSide[i * 2] = -1;
		aSide[i * 2 + 1] = 1;
		if (i < SEG) index.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
	}
	strip.setIndex(index);
	strip.setAttribute('position', new THREE.BufferAttribute(new Float32Array((SEG + 1) * 6), 3));
	strip.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
	strip.setAttribute('aSide', new THREE.BufferAttribute(aSide, 1));
	const from = new THREE.InstancedBufferAttribute(new Float32Array(CAP * 3), 3).setUsage(THREE.DynamicDrawUsage);
	const born = new THREE.InstancedBufferAttribute(new Float32Array(CAP).fill(-1e6), 1).setUsage(THREE.DynamicDrawUsage);
	const kind = new THREE.InstancedBufferAttribute(new Float32Array(CAP), 1).setUsage(THREE.DynamicDrawUsage);
	strip.setAttribute('iFrom', from);
	strip.setAttribute('iBorn', born);
	strip.setAttribute('iKind', kind);
	strip.instanceCount = CAP;
	const uniforms = { uTime: { value: 0 }, uPin: { value: pin }, uRes: { value: new THREE.Vector2(1, 1) }, uPx: { value: 1 } };
	// drawn twice: once lifted as the streak, once flat on the ball as its shadow, which is what reads as height
	const ribbon = (shadow: number) =>
		new THREE.ShaderMaterial({
			uniforms: { ...uniforms, uShadow: { value: shadow } },
			transparent: true,
			depthWrite: false,
			side: THREE.DoubleSide,
			vertexShader: `attribute float aT; attribute float aSide; attribute vec3 iFrom; attribute float iBorn; attribute float iKind;
				uniform float uTime; uniform vec3 uPin; uniform vec2 uRes; uniform float uPx; uniform float uShadow;
				varying float vT; varying float vSide; varying float vAge; varying float vFly; varying float vKind;
				vec3 arc(float t, float om, float so, float lift){
					vec3 p = so < 0.001 ? mix(iFrom, uPin, t) : (sin((1.0 - t) * om) * iFrom + sin(t * om) * uPin) / so;
					return normalize(p) * (1.004 - 0.002 * uShadow + lift * sin(3.14159265 * clamp(t, 0.0, 1.0)));
				}
				void main(){
					float om = acos(clamp(dot(iFrom, uPin), -1.0, 1.0)); float so = sin(om);
					float lift = min(0.24, 0.015 + 0.12 * om) * (1.0 - uShadow);
					vFly = 0.8 + 0.55 * om; // a longer way takes longer
					vAge = uTime - iBorn; vT = aT; vSide = aSide; vKind = iKind;
					mat4 m = projectionMatrix * modelViewMatrix;
					vec4 c = m * vec4(arc(aT, om, so, lift), 1.0);
					vec4 a = m * vec4(arc(aT - 0.01, om, so, lift), 1.0);
					vec4 b = m * vec4(arc(aT + 0.01, om, so, lift), 1.0);
					vec2 d = normalize((b.xy / b.w - a.xy / a.w) * uRes + vec2(1e-5));
					float back = vAge / vFly - aT; // how far behind the head this point is
					float comet = clamp(1.0 - back / 0.4, 0.0, 1.0) * step(0.0, back);
					float w = uPx * (1.0 + 2.6 * comet * comet) * (1.0 + 0.7 * uShadow);
					c.xy += vec2(-d.y, d.x) * aSide * w * 2.0 / uRes * c.w;
					gl_Position = c;
				}`,
			fragmentShader: `uniform float uShadow; varying float vT; varying float vSide; varying float vAge; varying float vFly; varying float vKind;
				${GLSL_COLOURS}
				void main(){
					float back = vAge / vFly - vT;
					if (vAge < 0.0 || back < 0.0) discard;
					float comet = clamp(1.0 - back / 0.4, 0.0, 1.0);
					float trace = 0.55 * (1.0 - smoothstep(0.0, ${HOLD.toFixed(1)}, back * vFly));
					float a = max(comet * comet, trace) * (1.0 - smoothstep(0.5, 1.0, abs(vSide)));
					if (a < 0.004) discard;
					// only the flying head throws a shadow; the traces' shadows would pile up into a smear
					if (uShadow > 0.5) { gl_FragColor = vec4(0.04, 0.06, 0.2, comet * comet * 0.34 * (1.0 - smoothstep(0.3, 1.0, abs(vSide)))); return; }
					gl_FragColor = vec4(mix(ink(vKind), vec3(1.0, 0.88, 0.36), pow(comet, 3.0)), a);
				}`
		});
	const streaks = new THREE.Mesh(strip, ribbon(0));
	const shadows = new THREE.Mesh(strip, ribbon(1));
	shadows.frustumCulled = false;
	shadows.renderOrder = 0.5;
	globe.add(shadows);
	streaks.frustumCulled = false;
	streaks.renderOrder = 2;
	globe.add(streaks);

	// ---- origin dots and the Helsinki beacon: instanced discs lying on the surface
	const quad = new THREE.InstancedBufferGeometry();
	quad.setIndex([0, 1, 2, 2, 1, 3]);
	quad.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]), 3));
	const dPos = new THREE.InstancedBufferAttribute(new Float32Array(DOTS * 3), 3).setUsage(THREE.DynamicDrawUsage);
	const dBorn = new THREE.InstancedBufferAttribute(new Float32Array(DOTS).fill(-1e6), 1).setUsage(THREE.DynamicDrawUsage);
	const dKind = new THREE.InstancedBufferAttribute(new Float32Array(DOTS), 1).setUsage(THREE.DynamicDrawUsage);
	quad.setAttribute('iPos', dPos);
	quad.setAttribute('iBorn', dBorn);
	quad.setAttribute('iKind', dKind);
	quad.instanceCount = DOTS;
	const dots = new THREE.Mesh(
		quad,
		new THREE.ShaderMaterial({
			uniforms: { uTime: uniforms.uTime },
			transparent: true,
			depthWrite: false,
			side: THREE.DoubleSide,
			vertexShader: `attribute vec3 iPos; attribute float iBorn; attribute float iKind; uniform float uTime;
				varying vec2 vP; varying float vAge; varying float vKind;
				void main(){ vP = position.xy; vAge = uTime - iBorn; vKind = iKind;
					vec3 e = normalize(cross(vec3(0.0, 1.0, 0.0), iPos)); vec3 nn = cross(iPos, e);
					float size = iKind > 8.5 ? 0.085 : 0.03;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(iPos * 1.003 + (e * position.x + nn * position.y) * size, 1.0); }`,
			fragmentShader: `varying vec2 vP; varying float vAge; varying float vKind;
				${GLSL_COLOURS}
				void main(){ float r = length(vP);
					if (vKind > 8.5) { // Helsinki: a cream pin with an ink rim, and two rings that keep arriving
						float core = 1.0 - smoothstep(0.17, 0.2, r);
						float rim = (1.0 - smoothstep(0.24, 0.27, r)) * (1.0 - core);
						float rings = 0.0;
						for (int i = 0; i < 2; i++) { float ph = fract(vAge * 0.5 + float(i) * 0.5); float rr = mix(0.95, 0.3, ph);
							rings = max(rings, (1.0 - smoothstep(0.0, 0.05, abs(r - rr))) * sin(3.14159265 * ph)); }
						vec3 c = mix(vec3(1.0, 0.45, 0.1), vec3(0.07, 0.1, 0.27), rim); c = mix(c, vec3(1.0, 0.97, 0.9), core);
						gl_FragColor = vec4(c, max(max(core, rim), rings * 0.9)); return; }
					if (vAge < 0.0 || vAge > ${DOT_LIFE.toFixed(1)}) discard;
					float fade = 1.0 - smoothstep(${(DOT_LIFE * 0.4).toFixed(1)}, ${DOT_LIFE.toFixed(1)}, vAge);
					float dot = (1.0 - smoothstep(0.22, 0.3, r)) * 0.85 * fade;
					float ph = clamp(vAge / 0.9, 0.0, 1.0); // the ring an event throws as it leaves
					float ring = (1.0 - smoothstep(0.0, 0.09, abs(r - mix(0.25, 0.92, ph)))) * (1.0 - ph) * step(vAge, 0.9);
					float a = max(dot, ring);
					if (a < 0.004) discard;
					gl_FragColor = vec4(ink(vKind) * vec3(0.94, 0.86, 0.86), a); }`
		})
	);
	dots.frustumCulled = false;
	dots.renderOrder = 1;
	globe.add(dots);
	// slot 0 is the beacon and is never reused
	dPos.set(pin.toArray(), 0);
	dKind.array[0] = 9;
	dBorn.array[0] = 0;

	// ---- the ring: a band round the globe, like a desk globe's horizon ring, divided into one named
	// field for each kind of event. As a real event's streak lands in Helsinki, a tick is set in the
	// field of its kind and fades over ten seconds, so a busy kind shows as a full field and a rare one
	// as a single tick. Streaks drawn from the snapshot leave no mark here.
	const ring = new THREE.Group();
	ring.rotation.x = -RING_TILT * RAD; // the far side dips away, so it reads as a ring and not a frame
	scene.add(ring);
	const band = new THREE.Mesh(
		new THREE.RingGeometry(RING_IN, RING_OUT, 200, 1),
		new THREE.MeshBasicMaterial({ map: paintRing(names, canvas.clientWidth * VIEW.radius), transparent: true, depthWrite: false, side: THREE.DoubleSide })
	);
	band.renderOrder = 3;
	ring.add(band);

	// per mark: the second it is set, its angle (clockwise from the top), its place across the field (0 to 1) and its ink
	const rq = new THREE.InstancedBufferGeometry();
	rq.setIndex([0, 1, 2, 2, 1, 3]);
	rq.setAttribute('position', quad.getAttribute('position'));
	const rMark = new THREE.InstancedBufferAttribute(new Float32Array(RING_CAP * 4), 4).setUsage(THREE.DynamicDrawUsage);
	for (let i = 0; i < RING_CAP; i++) rMark.array[i * 4] = -1e6;
	rq.setAttribute('iMark', rMark);
	rq.instanceCount = RING_CAP;
	const unit = { value: 0.003 }; // globe radii per CSS pixel
	const marks = new THREE.Mesh(
		rq,
		new THREE.ShaderMaterial({
			uniforms: { uTime: uniforms.uTime, uUnit: unit },
			transparent: true,
			depthWrite: false,
			side: THREE.DoubleSide,
			vertexShader: `attribute vec4 iMark; uniform float uTime; uniform float uUnit;
				varying vec2 vP; varying float vInk; varying float vA;
				void main(){
					float age = uTime - iMark.x;
					float len = ${f((FIELD_OUT - RING_IN) * 0.2)};
					float r = mix(${f(RING_IN)} + len * 1.6, ${f(FIELD_OUT)} - len * 1.6, iMark.z);
					vec2 rad = vec2(sin(iMark.y), cos(iMark.y)); vec2 tang = vec2(cos(iMark.y), -sin(iMark.y));
					float grow = 1.0 - pow(1.0 - clamp(age / 0.45, 0.0, 1.0), 3.0); // a tick opens as it is set
					vec2 ext = vec2(max(0.0034, 0.85 * uUnit), len * mix(0.2, 1.0, grow));
					vP = position.xy; vInk = iMark.w;
					vA = step(0.0, age) * (1.0 - smoothstep(${f(MARK_LIFE * 0.55)}, ${f(MARK_LIFE)}, age));
					vec2 p = rad * (r + position.y * ext.y) + tang * position.x * ext.x;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.002, 1.0);
				}`,
			fragmentShader: `varying vec2 vP; varying float vInk; varying float vA;
				${GLSL_COLOURS}
				void main(){
					float a = (1.0 - smoothstep(0.45, 1.0, abs(vP.x))) * (1.0 - smoothstep(0.75, 1.0, abs(vP.y))) * vA * 0.92;
					if (a < 0.004) discard;
					gl_FragColor = vec4(ink(vInk), a);
				}`
		})
	);
	marks.frustumCulled = false;
	marks.renderOrder = 4;
	ring.add(marks);
	let rslot = 0;
	let ringed = 0;
	const ringMark = (lane: number, k: number, at: number) => {
		// anywhere in the field of its kind, clear of the dividing lines
		const angle = (lane - 0.5 + 0.06 + Math.random() * 0.88) * SECTOR;
		rMark.array.set([at, angle, Math.random(), k], rslot * 4);
		touch([rMark], rslot);
		rslot = (rslot + 1) % RING_CAP;
		ringed++;
	};

	// ---- the servers: one dot for each, with two places. On the globe a dot sits at its server's
	// estimated place; in the census it sits in a sunflower disc in the ring's plane, the largest in the
	// middle (dot i at the golden angle times i, as far out as the dots before it need). The turn
	// between the two is flown in the vertex shader from four numbers the frame loop sets (TURNING below).
	const cq = new THREE.InstancedBufferGeometry();
	cq.setIndex([0, 1, 2, 2, 1, 3]);
	cq.setAttribute('position', quad.getAttribute('position'));
	const cHome = new THREE.InstancedBufferAttribute(new Float32Array(MAX_DOTS * 3), 3).setUsage(THREE.DynamicDrawUsage); // unit vector on the globe
	const cDot = new THREE.InstancedBufferAttribute(new Float32Array(MAX_DOTS * 3), 3); // x, y in the disc, radius
	const cLit = new THREE.InstancedBufferAttribute(new Float32Array(MAX_DOTS * 2), 2).setUsage(THREE.DynamicDrawUsage); // second it lit up, ink
	const cSeed = new THREE.InstancedBufferAttribute(new Float32Array(MAX_DOTS), 1); // 0 to 1, its own place in every staggered move
	cq.setAttribute('iHome', cHome);
	cq.setAttribute('iDot', cDot);
	cq.setAttribute('iLit', cLit);
	cq.setAttribute('iSeed', cSeed);
	cq.instanceCount = 0;
	const fly = {
		uLift: { value: 0 }, // 0 on the globe's surface, 1 lifted off it into a shell
		uSwirl: { value: 0 }, // radians the lifted dots have turned about the globe's axis
		uFlat: { value: 0 }, // 0 round the globe, 1 laid out as the census
		uInner: { value: 0 }, // 1: the middle of the disc moves first (leaving), 0: the middle arrives first
		uShell: { value: 0.16 }, // how far off the surface the lifted dots hover, in globe radii
		uHover: { value: -1 }, // the dot pointed at
		uGlobe: { value: new THREE.Matrix3() }, // the globe's turn, without its size
		uRing: { value: new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationX(-RING_TILT * RAD)) }
	};
	const servers = new THREE.Mesh(
		cq,
		new THREE.ShaderMaterial({
			uniforms: { uTime: uniforms.uTime, uUnit: unit, ...fly },
			transparent: true,
			depthWrite: false, // depth is still tested: the globe hides the dots behind it
			vertexShader: `attribute vec3 iHome; attribute vec3 iDot; attribute vec2 iLit; attribute float iSeed;
				uniform float uTime; uniform float uUnit; uniform float uLift; uniform float uSwirl; uniform float uFlat; uniform float uInner; uniform float uShell; uniform float uHover;
				uniform mat3 uGlobe; uniform mat3 uRing;
				varying vec2 vP; varying float vLit; varying float vInk; varying float vFlat; varying float vHover; varying float vPx;
				float ease(float x){ return x * x * (3.0 - 2.0 * x); }
				void main(){
					// off the surface in a wave that crosses the globe from left to right, each dot a little on its own
					float when = mix((uGlobe * iHome).x * 0.5 + 0.5, iSeed, 0.3);
					float lift = ease(clamp(uLift * 1.6 - when * 0.6, 0.0, 1.0));
					float c = cos(uSwirl); float s = sin(uSwirl);
					vec3 home = vec3(c * iHome.x + s * iHome.z, iHome.y, c * iHome.z - s * iHome.x); // round the polar axis
					vec3 onGlobe = uGlobe * (home * (1.006 + uShell * lift));
					// into the disc along a spiral, staggered from the middle out (or the other way when leaving)
					float far = length(iDot.xy) / ${f(CENSUS_R)};
					float e = ease(clamp((uFlat - 0.5 * mix(far, 1.0 - far, uInner)) / 0.5, 0.0, 1.0));
					float turn = (1.0 - e) * 1.0; float tc = cos(turn); float ts = sin(turn);
					vec3 onDisc = uRing * vec3(mat2(tc, -ts, ts, tc) * iDot.xy, 0.0);
					vec3 p = mix(onGlobe, onDisc, e);
					p.z += sin(3.14159265 * e) * 0.3; // the flight arcs toward the viewer, over the ring rather than through it
					float age = uTime - iLit.x;
					vLit = age >= 0.0 && age < 1.2 ? 1.0 - age / 1.2 : 0.0;
					vInk = iLit.y; vP = position.xy; vFlat = e;
					// smaller on the map, a swell as it lifts off or lands, a swell when its event arrives
					// (the swell at an event is capped, so a large dot does not cover its neighbours)
					float r = iDot.z * mix(0.5, 1.0, e);
					r += min(r * 0.8, 9.0 * uUnit) * vLit * vLit + r * 0.9 * sin(3.14159265 * lift) * (1.0 - e);
					r = max(r, 0.85 * uUnit);
					// the dot pointed at grows, and is never smaller than 5 CSS pixels across its radius
					vHover = float(gl_InstanceID) == uHover ? 1.0 : 0.0;
					r = mix(r, max(min(r * 1.35, r + 4.0 * uUnit), 5.0 * uUnit), vHover);
					vPx = r / uUnit; // its radius in CSS pixels
					gl_Position = projectionMatrix * modelViewMatrix * vec4(p + vec3(position.xy * r, 0.0), 1.0);
				}`,
			fragmentShader: `varying vec2 vP; varying float vLit; varying float vInk; varying float vFlat; varying float vHover; varying float vPx;
				${GLSL_COLOURS}
				void main(){
					// a soft edge about a pixel and a half wide whatever the dot's size, so the large ones stay crisp
					float a = 1.0 - smoothstep(1.0 - clamp(1.5 / vPx, 0.03, 0.22), 1.0, length(vP));
					if (a < 0.004) discard;
					// ink on the map's cream land, the sea's cobalt once laid out on the paper
					vec3 own = mix(vec3(0.1, 0.12, 0.28), vec3(0.114, 0.192, 0.529), vFlat);
					own = mix(own, vec3(1.0, 0.45, 0.06), vHover * (1.0 - smoothstep(0.5, 0.62, length(vP)))); // an orange heart, its own colour as the rim
					gl_FragColor = vec4(mix(own, ink(vInk), min(1.0, vLit * 1.6)), a * mix(0.88, 1.0, vFlat));
				}`
		})
	);
	servers.frustumCulled = false;
	// on the globe the dots lie under the streaks (2); in flight and in the census they pass over the ring (3, 4)
	const ON_GLOBE = 1.5;
	const IN_FLIGHT = 4.5;
	servers.renderOrder = ON_GLOBE;
	scene.add(servers);
	let dotsShown = 0;
	let homed = 0; // dots that have a place on the globe
	// a dot's own small shift, the same every time, so servers in one grid cell do not sit on one point
	const shift = (dot: number, salt: number) => (((Math.sin(dot * 12.9898 + salt * 78.233) * 43758.5453) % 1) + 1) % 1 - 0.5;
	const setHome = (dot: number, lat: number, lon: number) => {
		cHome.array.set(vec(lat + shift(dot, 1) * 1.5, lon + (shift(dot, 2) * 1.5) / Math.max(0.3, Math.cos(lat * RAD))).toArray(), dot * 3);
		touch([cHome], dot);
	};
	// what is known about each dot's server, for whoever points at it: never a name or an ID
	const about = {
		band: new Uint8Array(MAX_DOTS), // its size band, 0 the largest
		lat: new Float32Array(MAX_DOTS), // its estimated place
		lon: new Float32Array(MAX_DOTS),
		events: new Uint32Array(MAX_DOTS), // events seen from it since the scene started
		lastAt: new Float64Array(MAX_DOTS), // performance.now() of the last one
		lastType: [] as string[]
	};
	const roster = (r: Pick<Roster, 'total' | 'bands'>) => {
		const total = Math.min(r.total, MAX_DOTS);
		// how many dots each size takes: the real counts in as many steps as the roster has, or the simulated shares
		const bands = r.bands ?? SIMULATED.map((share) => Math.round(share * total));
		// a dot's radius by its step, largest first, in even ratios from DOT_MOST down to DOT_LEAST
		const sizeOf = (band: number) => DOT_MOST * (DOT_LEAST / DOT_MOST) ** (band / Math.max(1, bands.length - 1));
		const radius = new Float32Array(total);
		let band = 0;
		let left = bands[0];
		for (let i = 0; i < total; i++) {
			while (left <= 0 && band < bands.length - 1) left = bands[++band];
			left--;
			radius[i] = sizeOf(band);
			about.band[i] = band;
		}
		// a sunflower: every dot at the radius where the area laid so far ends, so dots of any size pack evenly
		let area = 0;
		for (let i = 0; i < total; i++) {
			const d = Math.sqrt((area + (radius[i] * radius[i]) / 2) / 0.56); // 0.56: the share of the disc the dots cover
			area += radius[i] * radius[i];
			cDot.array.set([d * Math.cos(i * 2.399963), d * Math.sin(i * 2.399963), radius[i]], i * 3);
		}
		// fit the whole disc inside the ring
		const fit = CENSUS_R / (Math.hypot(cDot.array[(total - 1) * 3], cDot.array[(total - 1) * 3 + 1]) + radius[total - 1] || 1);
		for (let i = 0; i < total * 3; i++) cDot.array[i] *= fit;
		// A server's place is known from its first event on. Until then its dot stands where the
		// placement model puts a server that has chosen no language, spread a little round the cell.
		for (; homed < total; homed++) {
			const [lat, lon] = anywhere();
			about.lat[homed] = lat;
			about.lon[homed] = lon;
			cHome.array.set(vec(lat + (Math.random() - 0.5) * 1.5, lon + ((Math.random() - 0.5) * 1.5) / Math.max(0.3, Math.cos(lat * RAD))).toArray(), homed * 3);
			cSeed.array[homed] = Math.random();
			cLit.array[homed * 2] = -1e6;
		}
		cDot.needsUpdate = cHome.needsUpdate = cSeed.needsUpdate = cLit.needsUpdate = true;
		cq.instanceCount = dotsShown = total;
	};
	roster({ total: firstTotal, bands: null });
	let lit = 0;
	const known = new Uint8Array(MAX_DOTS); // dots whose server has told its place
	const light = (dot: number, k: number, at: number, lat: number, lon: number, type: string) => {
		if (dot < 0 || dot >= dotsShown) return; // a server that joined after today's roster has no dot yet
		if (!known[dot]) {
			known[dot] = 1;
			about.lat[dot] = lat;
			about.lon[dot] = lon;
			setHome(dot, lat, lon);
		}
		about.events[dot]++;
		about.lastAt[dot] = performance.now();
		about.lastType[dot] = type;
		cLit.array.set([at, k], dot * 2);
		touch([cLit], dot);
		lit++;
	};

	let slot = 0;
	let dslot = 1;
	const touch = (attrs: THREE.InstancedBufferAttribute[], i: number) =>
		attrs.forEach((a) => {
			a.addUpdateRange(i * a.itemSize, a.itemSize);
			a.needsUpdate = true;
		});
	// begins a streak and returns the second it lands in Helsinki (the shader's own flight time)
	function streak(lat: number, lon: number, at: number, k = 0, dot = -1) {
		// a server's streak leaves from its own dot; an event without one gets a place near its grid cell and a passing mark
		const own = dot >= 0 && dot < dotsShown;
		const a = own ? new THREE.Vector3().fromArray(cHome.array, dot * 3) : vec(lat + (Math.random() - 0.5) * 1.4, lon + (Math.random() - 0.5) * 1.8);
		from.set(a.toArray(), slot * 3);
		born.array[slot] = at;
		kind.array[slot] = k;
		touch([from, born, kind], slot);
		slot = (slot + 1) % CAP;
		if (!own) {
			dPos.set(a.toArray(), dslot * 3);
			dBorn.array[dslot] = at;
			dKind.array[dslot] = k;
			touch([dPos, dBorn, dKind], dslot);
			dslot = dslot + 1 < DOTS ? dslot + 1 : 1;
		}
		return at + 0.8 + 0.55 * a.angleTo(pin);
	}

	// without the stream: the snapshot's measured rate (a nominal one while it is a placeholder), shared by its points
	const points = snap.points;
	const total = points.reduce((a, p) => a + p[2], 0);
	const rate = Math.min(MAX_RATE, snap.placeholder || !snap.ratePerSecond ? NOMINAL : snap.ratePerSecond);
	const pick = () => {
		let x = Math.random() * total;
		for (const p of points) if ((x -= p[2]) <= 0) return p;
		return points[0];
	};
	const kinds = () => (Math.random() < 0.45 ? 1 : Math.random() < 0.15 ? 2 : 0);
	// The globe opens empty and fills with real events as they arrive. Only when the stream has failed
	// does the snapshot draw, and if no real event was ever drawn it opens on a full globe, as the poster shows it.
	let fed = 0;
	let simulated = 0;
	let simulating = false;
	const fallback = () => {
		if (simulating) return;
		simulating = true;
		if (fed) return;
		for (let i = 0; i < rate * DOT_LIFE && i < DOTS - 1; i++) {
			const [lat, lon] = pick();
			streak(lat, lon, t - Math.random() * DOT_LIFE, kinds());
			simulated++;
		}
	};

	const resize = () => {
		renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
		renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
		renderer.getDrawingBufferSize(uniforms.uRes.value);
		uniforms.uPx.value = Math.max(1, uniforms.uRes.value.x / 1000);
		unit.value = 1 / (canvas.clientWidth * VIEW.radius);
	};
	resize();
	const ro = new ResizeObserver(resize);
	ro.observe(canvas);

	// ---- the view: a slow drift east and west, the visitor's own hand, and set views from the page
	let yaw = 0; // degrees the visitor has turned the globe
	let pitch = 0;
	let spin = 0; // degrees per second the globe keeps from a flick
	let target: number | null = null; // the yaw a set view is easing to
	let held: { x: number; y: number; yaw: number; pitch: number; at: number } | null = null;
	let idle = 0; // seconds since the visitor let go
	let phase = 0;
	let paused = false;
	let wantCensus = false; // the view asked for: the census, or the globe
	let atCensus = false; // the view the scene rests in
	let flight: { to: boolean; p: number } | null = null; // a turn between the views under way, and how far it is
	const seg = (p: number, from: number, to: number) => Math.min(1, Math.max(0, (p - from) / (to - from)));
	const ease = (x: number) => x * x * (3 - 2 * x);
	const settle = (census: boolean) => {
		atCensus = census;
		fly.uLift.value = fly.uFlat.value = +census;
		fly.uSwirl.value = fly.uInner.value = 0;
		globe.scale.setScalar(census ? 1e-4 : 1);
		globe.visible = !census;
		servers.renderOrder = census ? IN_FLIGHT : ON_GLOBE;
	};
	const down = (e: PointerEvent) => {
		if (wantCensus || flight) return; // the census does not turn, and a turn is not interrupted
		held = { x: e.clientX, y: e.clientY, yaw, pitch, at: performance.now() };
		spin = 0;
		target = null;
		canvas.setPointerCapture(e.pointerId);
	};
	const move = (e: PointerEvent) => {
		if (!held) return;
		const perPx = 1 / (canvas.clientWidth * VIEW.radius * RAD);
		const next = held.yaw - (e.clientX - held.x) * perPx;
		const now = performance.now();
		// the hand's speed, smoothed, becomes the flick
		if (now > held.at) spin = 0.6 * spin + (0.4 * (next - yaw) * 1000) / (now - held.at);
		held.at = now;
		yaw = next;
		pitch = Math.max(-35, Math.min(40, held.pitch + (e.clientY - held.y) * perPx));
		if (paused) draw();
	};
	const up = () => {
		// a hand that rested before letting go leaves the globe where it is
		if (held && performance.now() - held.at > 120) spin = 0;
		spin = Math.max(-220, Math.min(220, spin));
		held = null;
		idle = 0;
	};
	canvas.addEventListener('pointerdown', down);
	canvas.addEventListener('pointermove', move);
	canvas.addEventListener('pointerup', up);
	canvas.addEventListener('pointercancel', up);

	const seen = new THREE.Vector3();
	const spun = new THREE.Matrix4();
	let pinKey = '';
	const pose = () => {
		globe.rotation.set((VIEW.lat + pitch) * RAD, (-90 - (VIEW.lon + yaw + SWAY * Math.sin(phase))) * RAD, 0);
		globe.updateMatrixWorld();
		seen.copy(pin).applyMatrix4(globe.matrixWorld);
		const x = 0.5 + seen.x * VIEW.radius;
		const y = 0.5 - seen.y * VIEW.radius;
		const front = seen.z > 0.12 && !flight && !atCensus; // the label goes with the globe
		fly.uGlobe.value.setFromMatrix4(spun.makeRotationFromEuler(globe.rotation));
		const key = `${x.toFixed(4)} ${y.toFixed(4)} ${front}`;
		if (key !== pinKey) on.pin(x, y, front);
		pinKey = key;
	};

	const draw = () => {
		pose();
		renderer.render(scene, camera);
	};
	let then = performance.now();
	let t = 0;
	let sunRead = 0;
	let due = 0;
	let budget = MAX_RATE; // streaks that may still begin this second
	const probe: number[] = [];
	const frame = () => {
		const now = performance.now();
		const raw = now - then;
		const dt = Math.min(0.1, raw / 1000);
		then = now;
		t += dt;
		if (probe.length < 90 && t > 0.5) {
			probe.push(raw);
			if (probe.length === 90 && probe.toSorted((a, b) => a - b)[45] > SLOW_MS) return on.slow();
		}
		budget = Math.min(MAX_RATE, budget + dt * MAX_RATE);
		if (simulating) {
			due += dt * rate;
			while (due >= 1) {
				due -= 1;
				const [lat, lon] = pick();
				streak(lat, lon, t, kinds());
				simulated++;
			}
		}
		if (!held) {
			idle += dt;
			phase += (dt * Math.PI * 2) / SWAY_PERIOD;
			if (target !== null) {
				yaw += (target - yaw) * (1 - Math.exp(-dt * 4));
				pitch *= Math.exp(-dt * 4);
				idle = 0;
				if (Math.abs(target - yaw) < 0.2) target = null;
			} else if (Math.abs(spin) > 1) {
				yaw += spin * dt;
				spin *= Math.exp(-dt * 2.6);
				idle = 0;
			} else if (idle > 8) {
				// a turned globe waits eight seconds, then eases back to its drift the short way round
				yaw = ((((yaw + 180) % 360) + 360) % 360) - 180;
				yaw *= Math.exp(-dt * 0.7);
				pitch *= Math.exp(-dt * 0.7);
			}
		}
		// the sun moves a quarter of a degree a minute
		if (t - sunRead > 60) {
			sunRead = t;
			sphere.material.uniforms.uSun.value = sunAt();
		}
		// TURNING. Out: the servers lift off their countries, each at its own moment, and drift round the
		// axis while the globe closes under them; then they fly into the census, the middle first.
		// Back: the middle of the census leaves first and makes room, the servers gather as a shell that
		// swirls round the returning globe, the swirl unwinds, and each one lands in its country.
		if (!flight && wantCensus !== atCensus) {
			flight = { to: wantCensus, p: 0 };
			servers.renderOrder = IN_FLIGHT;
		}
		if (flight) {
			const p = (flight.p = Math.min(1, flight.p + dt / (flight.to ? OPEN : CLOSE)));
			let size: number;
			if (flight.to) {
				fly.uInner.value = 0;
				fly.uShell.value = 0.16;
				fly.uLift.value = seg(p, 0, 0.34);
				fly.uSwirl.value = 1.2 * ease(seg(p, 0.1, 0.7));
				fly.uFlat.value = seg(p, 0.42, 1);
				size = 1 - ease(seg(p, 0.2, 0.52));
			} else {
				fly.uInner.value = 1;
				fly.uShell.value = 0.085; // inside the ring, clear of its names
				fly.uFlat.value = 1 - seg(p, 0, 0.4);
				fly.uLift.value = 1 - seg(p, 0.66, 1);
				fly.uSwirl.value = 3.6 * (1 - ease(seg(p, 0.25, 0.9)));
				size = ease(seg(p, 0.24, 0.56));
			}
			globe.scale.setScalar(Math.max(1e-4, size));
			globe.visible = size > 0.001;
			if (p === 1) {
				settle(flight.to);
				flight = null;
			}
		}
		uniforms.uTime.value = t;
		draw();
	};
	frame();
	on.ready();

	// the loop runs only on screen and only while the visitor has not paused it
	let running = false;
	const loop = () => {
		then = performance.now();
		renderer.setAnimationLoop(running && !paused ? frame : null);
	};
	const io = new IntersectionObserver(([e]) => {
		running = e.isIntersecting;
		loop();
	});
	io.observe(canvas);

	// live events: a batch arrives every 250 ms, so its streaks begin spread over the next 250 ms
	const feed = (events: GlobeEvent[]) => {
		if (!running || paused) return;
		// the stream is back (Play after a loss opens it afresh): real events alone draw again
		simulating = false;
		events.forEach(([type, lat, lon, dot], i) => {
			const at = t + (i / events.length) * 0.25;
			const k = kindOf(type);
			// in the census there is no globe to fly over: the server's dot lights up and the ring is marked at once
			light(dot, k, at, lat, lon, type);
			if (wantCensus || flight) {
				fed++;
				return ringMark(laneOf(type), k, at);
			}
			// every event marks the ring: as its streak lands, or at once if the streak budget is spent
			if (budget < 1) return ringMark(laneOf(type), k, at);
			budget--;
			fed++;
			ringMark(laneOf(type), k, streak(lat, lon, at, k, dot));
		});
	};

	const stop = () => {
		io.disconnect();
		ro.disconnect();
		canvas.removeEventListener('pointerdown', down);
		canvas.removeEventListener('pointermove', move);
		canvas.removeEventListener('pointerup', up);
		canvas.removeEventListener('pointercancel', up);
		renderer.setAnimationLoop(null);
		sphere.material.uniforms.map.value.dispose();
		band.material.map?.dispose();
		for (const m of [sphere, streaks, shadows, dots, band, marks, servers]) { // servers shares the quad's corners
			m.geometry.dispose();
			m.material.dispose();
		}
		renderer.dispose();
	};
	// one frame of the still's own view as a picture: scripts/still.mjs makes the poster from it
	// the poster is taken in full daylight: a picture cannot keep up with the night
	const shot = (quality = 0.82) => {
		yaw = pitch = phase = spin = 0;
		target = null;
		sphere.material.uniforms.uNight.value = 0;
		draw();
		const url = canvas.toDataURL('image/webp', quality);
		sphere.material.uniforms.uNight.value = 1;
		return url;
	};
	// a set view: the short way round to the meridian asked for, allowing for where the drift stands
	const turn = (lon: number) => {
		const want = lon - VIEW.lon - SWAY * Math.sin(phase);
		target = yaw + ((((want - yaw + 180) % 360) + 360) % 360) - 180;
		spin = 0;
		if (paused) {
			yaw = target;
			pitch = 0;
			target = null;
			draw();
		}
	};
	const view = (on: boolean) => {
		wantCensus = on;
		held = null;
		// a paused scene has no frames to turn in: it changes at once
		if (!paused) return;
		flight = null;
		settle(on);
		draw();
	};
	const cosTilt = Math.cos(RING_TILT * RAD);
	const inspect = (clientX: number, clientY: number): Seen | null => {
		// marks the dot pointed at (-1 for none) and hands back nothing, so "no dot" is one line below
		const mark = (dot: number) => {
			if (fly.uHover.value !== dot) {
				fly.uHover.value = dot;
				if (paused) draw();
			}
			return null;
		};
		if (!atCensus || flight) return mark(-1);
		const at = cDot.array;
		// the pointer in the disc's own plane, which lies tilted in the ring
		const box = canvas.getBoundingClientRect();
		const x = ((clientX - box.left) / box.width - 0.5) / VIEW.radius;
		const y = (0.5 - (clientY - box.top) / box.height) / VIEW.radius / cosTilt;
		let dot = -1;
		let least = Infinity;
		// ponytail: a plain scan of every dot per pointer move, about 8,500 distances; a grid if it ever shows in a profile
		for (let i = 0; i < dotsShown; i++) {
			const d = (at[i * 3] - x) ** 2 + (at[i * 3 + 1] - y) ** 2;
			if (d < least) [least, dot] = [d, i];
		}
		if (dot < 0 || Math.sqrt(least) > Math.max(at[dot * 3 + 2], 5 * unit.value)) return mark(-1);
		mark(dot);
		// the country of the model's cell nearest to the server's estimated place
		let country = '';
		let near = Infinity;
		for (const [lat, lon, , cc] of prior) {
			const d = (lat - about.lat[dot]) ** 2 + ((lon - about.lon[dot]) * Math.cos(lat * RAD)) ** 2;
			if (d < near) [near, country] = [d, cc];
		}
		return {
			x: 0.5 + at[dot * 3] * VIEW.radius,
			y: 0.5 - at[dot * 3 + 1] * cosTilt * VIEW.radius,
			r: at[dot * 3 + 2] * cosTilt * VIEW.radius, // its half height on the stage, so the note can stand clear of it
			band: about.band[dot],
			country,
			known: !!known[dot],
			events: about.events[dot],
			lastType: about.lastType[dot] ?? null,
			lastAgo: (performance.now() - about.lastAt[dot]) / 1000
		};
	};
	const pause = (on: boolean) => {
		paused = on;
		loop();
	};
	return { stop, feed, shot, turn, pause, fallback, view,
		roster,
		inspect,
		counts: () => ({ fed, simulated, ringed, lit, dots: dotsShown })
	};
}
