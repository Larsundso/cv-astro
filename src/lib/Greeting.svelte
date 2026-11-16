<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import greeting from './greeting/greeting-light.svg?raw';

	// The owner's handwritten pride greeting: the shared build-time SVG (context/assets/greeting).
	// Its role="img" and aria-label name the h1. CSS inside it draws the strokes; under reduced motion,
	// or with .hi-still on <html>, the finished drawing is there at first paint.

	// Once per session: the first mount marks the session, and after its 1.2 s draw .hi-still keeps
	// later mounts still. app.html sets .hi-still before the first paint of every later page load.
	const once: Attachment<HTMLSpanElement> = () => {
		const d = document.documentElement;
		if (d.classList.contains('hi-still')) return;
		try {
			sessionStorage.setItem('greeted', '1');
		} catch {
			// storage blocked: the draw still stops repeating for the rest of this page load
		}
		setTimeout(() => d.classList.add('hi-still'), 2500);
	};
</script>

<!-- trusted build-time markup from build-greeting.mjs, never user input -->
<span class="greeting" {@attach once}>{@html greeting}</span>

<style>
	.greeting {
		display: block;
		width: min(100%, 30rem);
	}
	.greeting :global(svg) {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
