<!--
	VrHeadsetSketch — the one three.js touch of the whole site, quarantined.
	three loads only on intersection (client:visible), DPR capped at 2. The SSR
	poster sketch stands in until the first frame and stays if WebGL is missing.

	IT DOES NOT MOVE BY ITSELF, AND THAT IS THE POINT. Until 2026-08-05 this
	canvas ran `renderer.setAnimationLoop` at 0.0035 rad/frame — ~12°/s,
	forever, whenever it was on screen — which made it the ONLY object on a
	wall of pinned paper that moved without being touched. A sketch that spins
	on its own is not a sketch pinned to cork; it is a widget embedded in one.
	It now draws ONCE, when three finishes loading and the canvas has a real
	size, and re-draws only on drag or resize. That deletes the idle loop, the
	IntersectionObserver that gated it, and the `prefers-reduced-motion`
	special case that existed solely to switch it off — a still frame is the
	default for everyone, so there is no reduced state to special-case.

	IT IS ALSO HONESTLY DECORATIVE. `role="img"` announces "graphic" and
	offers no operation, so a label promising "press the arrow keys" described
	an affordance assistive tech cannot expose; and WCAG 2.5.7 asks for a
	SINGLE-POINTER alternative to a drag, which arrow keys are not. The canvas
	is therefore no longer focusable and its label states only what it is.
	Dragging survives as pure enhancement for whoever finds it.

	`touch-action: pan-y`, not `none`: at 390 the canvas is 323 × 245 px —
	83 % of the viewport's width, at 60 % of the page's depth — and
	`touch-action: none` withdrew panning from it entirely, so a thumb that
	landed there found the page frozen. `pan-y` gives the vertical axis back
	to the scroller and keeps the horizontal one, which is the axis the spin
	actually weights (clientX 0.008 against clientY 0.005).
-->
<script lang="ts">
	import { onMount } from "svelte";

	/** Localized canvas label; the English default stands alone. */
	let { ariaLabel = "Wireframe sketch of a VR headset." }: {
		ariaLabel?: string;
	} = $props();

	let host: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let ready = $state(false);

	onMount(() => {
		let cleanup = () => {};
		(async () => {
			const T = await import("three");
			try {
				const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
				const scene = new T.Scene();
				const camera = new T.PerspectiveCamera(26, 1, 0.1, 40);
				camera.position.set(0, 0.55, 7.5);
				camera.lookAt(0, 0, 0);
				/* ink lines on the aged-paper ground of the polaroid frame */
				const ink = new T.LineBasicMaterial({ color: 0x33302a });
				const faint = new T.LineBasicMaterial({ color: 0x33302a, transparent: true, opacity: 0.35 });
				const rig = new T.Group();
				const wire = (g: InstanceType<typeof T.BufferGeometry>, m = ink) =>
					rig.add(new T.LineSegments(new T.EdgesGeometry(g), m));
				wire(new T.BoxGeometry(2.35, 1.2, 1.0)); /* housing */
				wire(new T.BoxGeometry(1.9, 0.9, 1.26), faint); /* face gasket */
				const ring = new T.EllipseCurve(0, 0, 0.34, 0.34).getPoints(48);
				for (const x of [-0.52, 0.52]) /* lenses */
					rig.add(new T.LineLoop(new T.BufferGeometry().setFromPoints(ring.map((p) => new T.Vector3(p.x + x, p.y, -0.55))), ink));
				const band = new T.EllipseCurve(0, 0, 1.3, 1.05).getPoints(72);
				for (const h of [-0.2, 0.2]) /* head strap */
					rig.add(new T.LineLoop(new T.BufferGeometry().setFromPoints(band.map((p) => new T.Vector3(p.x, h, p.y - 0.45))), faint));
				const arc = new T.EllipseCurve(0, 0, 0.95, 0.95, 0, Math.PI).getPoints(40);
				rig.add(new T.Line(new T.BufferGeometry().setFromPoints(arc.map((p) => new T.Vector3(0, p.y + 0.1, p.x - 0.45))), faint));
				rig.rotation.set(0.15, -0.6, 0);
				scene.add(rig);

				const draw = () => renderer.render(scene, camera);
				const spin = (dy: number, dx: number) => {
					rig.rotation.y += dy;
					rig.rotation.x = Math.min(0.9, Math.max(-0.9, rig.rotation.x + dx));
					draw();
				};
				/* ONE DRAW, and only at a size worth drawing at. `ready` fades
				   the canvas up over the SSR poster, so setting it after a draw
				   made at a degenerate 1×1 host would leave an EMPTY canvas at
				   full opacity with the poster already gone. It is therefore
				   gated on the draw having happened at a real size — the
				   ResizeObserver fires again the moment the host has one. */
				const size = () => {
					const w = host.clientWidth, h = host.clientHeight;
					renderer.setSize(w || 1, h || 1, false);
					camera.aspect = (w || 1) / (h || 1);
					camera.updateProjectionMatrix();
					draw();
					if (w > 1 && h > 1) ready = true;
				};
				let px = 0, py = 0, down = false;
				canvas.addEventListener("pointerdown", (e) => { down = true; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId); });
				canvas.addEventListener("pointermove", (e) => { if (!down) return; spin((e.clientX - px) * 0.008, (e.clientY - py) * 0.005); px = e.clientX; py = e.clientY; });
				for (const end of ["pointerup", "pointercancel"] as const) canvas.addEventListener(end, () => (down = false));
				const ro = new ResizeObserver(size);
				ro.observe(host);
				size();
				cleanup = () => { ro.disconnect(); renderer.dispose(); };
			} catch {
				/* no WebGL: the poster sketch stays */
			}
		})();
		return () => cleanup();
	});
</script>

<div class="scene" bind:this={host}>
	{#if !ready}
		<svg class="poster" viewBox="0 0 240 270" aria-hidden="true" fill="none" stroke="var(--ink)" stroke-width="2">
			<rect x="38" y="96" width="164" height="84" rx="26" />
			<rect x="52" y="108" width="136" height="60" rx="18" opacity="0.4" />
			<path d="M75 138a17 17 0 1 0 34 0a17 17 0 1 0-34 0M131 138a17 17 0 1 0 34 0a17 17 0 1 0-34 0" />
			<path d="M38 128C18 128 14 152 38 154M202 128C222 128 226 152 202 154M64 96C84 56 156 56 176 96" opacity="0.4" />
		</svg>
	{/if}
	<canvas bind:this={canvas} class:ready role="img" aria-label={ariaLabel}></canvas>
</div>

<style>
	.scene { position: relative; width: 100%; height: 100%; overflow: hidden; }
	.poster, canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
	canvas { opacity: 0; touch-action: pan-y; cursor: grab; }
	canvas.ready { opacity: 1; }
	canvas:active { cursor: grabbing; }
	@media (prefers-reduced-motion: no-preference) {
		canvas { transition: opacity 200ms ease-out; }
	}
</style>
