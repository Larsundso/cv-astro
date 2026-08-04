<!--
	VrHeadsetSketch — the one three.js touch of the whole site, quarantined.
	three loads only on intersection (client:visible), DPR capped at 2. The SSR
	poster sketch stands in until the first frame and stays if WebGL is missing.
	prefers-reduced-motion: no idle spin — a still frame; drag/arrows re-render.
-->
<script lang="ts">
	import { onMount } from "svelte";

	/** Localized canvas label; the English default stands alone. */
	let { ariaLabel = "Wireframe sketch of a VR headset. Drag it, or press the arrow keys, to spin it." }: {
		ariaLabel?: string;
	} = $props();

	let host: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let ready = $state(false);

	onMount(() => {
		let cleanup = () => {};
		(async () => {
			const T = await import("three");
			const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
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
				const tick = () => { rig.rotation.y += 0.0035; draw(); };
				const size = () => {
					const w = host.clientWidth || 1, h = host.clientHeight || 1;
					renderer.setSize(w, h, false);
					camera.aspect = w / h;
					camera.updateProjectionMatrix();
					draw();
				};
				let px = 0, py = 0, down = false;
				canvas.addEventListener("pointerdown", (e) => { down = true; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId); });
				canvas.addEventListener("pointermove", (e) => { if (!down) return; spin((e.clientX - px) * 0.008, (e.clientY - py) * 0.005); px = e.clientX; py = e.clientY; });
				for (const end of ["pointerup", "pointercancel"] as const) canvas.addEventListener(end, () => (down = false));
				const keys: Record<string, [number, number]> = { ArrowLeft: [-0.15, 0], ArrowRight: [0.15, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] };
				canvas.addEventListener("keydown", (e) => { if (!keys[e.key]) return; e.preventDefault(); spin(...keys[e.key]); });
				/* idle only while on screen, never under reduced motion */
				const io = new IntersectionObserver(([e]) => renderer.setAnimationLoop(e.isIntersecting && !still ? tick : null));
				io.observe(canvas);
				const ro = new ResizeObserver(size);
				ro.observe(host);
				size();
				ready = true;
				cleanup = () => { io.disconnect(); ro.disconnect(); renderer.setAnimationLoop(null); renderer.dispose(); };
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
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<canvas bind:this={canvas} class:ready tabindex="0" role="img" aria-label={ariaLabel}></canvas>
</div>

<style>
	.scene { position: relative; width: 100%; height: 100%; overflow: hidden; }
	.poster, canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
	canvas { opacity: 0; touch-action: none; cursor: grab; }
	canvas.ready { opacity: 1; }
	canvas:active { cursor: grabbing; }
	@media (prefers-reduced-motion: no-preference) {
		canvas { transition: opacity 200ms ease-out; }
	}
</style>
