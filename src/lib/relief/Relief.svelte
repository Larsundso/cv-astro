<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { hours as c } from '#lib/content.js';
	import data from '#lib/hours.json';
	import { reducedMotion, sceneAllowed } from '#lib/lowend.js';
	import type { Relief } from './scene.js';

	const HOUR = 3600;
	const nf = new Intl.NumberFormat('en', { maximumFractionDigits: 1 });
	// whole hours from 100 up and tenths below, always rounded down: a figure never says more than was tracked
	const h = (s: number) => (s < 360 ? '<0.1' : nf.format(s >= 100 * HOUR ? Math.floor(s / HOUR) : Math.floor(s / 360) / 10));

	// The two views with their own readings. The file holds only what counts: a language or a project
	// with more than data.leastHours hours, and no struck name (scripts/waka.mjs). The table lists every
	// row (owner, 2026-11-16: "i want them all listed"); the chart has room for the highest 64.
	const CHARTED = 64;
	const sets = [data.languages, data.projects].map((v, i) => {
		const rows = (v.rows as [string, number][]).map(([name, seconds]) => ({ name, seconds }));
		return { ...c.views[i], readOn: v.readOn, total: v.total, rows, isles: rows.slice(0, CHARTED) };
	});

	let view = $state(0);
	const s = $derived(sets[view]);
	let live = $state(false); // the scene has drawn its first frame
	let off = $state(false); // no scene on this device: the table speaks alone
	let settled = $state(true); // false while one view gives way to the other
	let tip = $state(-1); // the island pointed at
	let room = $state(8); // how many summits are named without being asked
	const named = $derived([...Array(Math.min(room, s.isles.length)).keys(), ...(tip >= room ? [tip] : [])]);
	const label = $derived(`${s.chart} ${s.isles.slice(0, 3).map((r) => `${r.name} with ${h(r.seconds)} ${c.hoursWord}`).join(', ')}.`);

	let scene: Relief | undefined;
	let face = $state<HTMLElement>();
	const slips: (HTMLElement | null)[] = [];
	const hidden: boolean[] = [];
	let summits: Float32Array = new Float32Array(0);
	// Every slip goes to its summit. The island pointed at comes first, then the highest; a slip that
	// would cover one already set stays away, and comes back only once it has a little air.
	function put() {
		if (!face || !summits.length) return;
		const wide = face.clientWidth;
		const fits = wide < 520 ? 4 : wide < 900 ? 6 : 8;
		if (fits !== room) room = fits;
		const set: number[][] = [];
		for (const i of tip >= 0 ? [tip, ...named.filter((n) => n !== tip)] : named) {
			const el = slips[i];
			if (!el) continue;
			const x = summits[2 * i];
			const y = summits[2 * i + 1];
			el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
			const w = el.offsetWidth / 2 + (hidden[i] ? 8 : 2);
			const box = [x - w, y - el.offsetHeight - 16, x + w, y];
			hidden[i] = i !== tip && set.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1]);
			el.style.opacity = hidden[i] ? '0' : '';
			if (!hidden[i]) set.push(box);
		}
	}
	// a slip that has just come onto the page is set at once, also where no frame follows (reduced motion)
	$effect(() => {
		void [tip, room, view, live];
		put();
	});

	function show(i: number) {
		if (i === view) return;
		view = i;
		tip = -1;
		settled = false;
		hidden.length = 0;
		scene?.view(i);
	}
	const point = (e: PointerEvent) => (tip = settled ? (scene?.inspect(e.clientX, e.clientY) ?? -1) : -1);
	// a finger lifting leaves the slip up until the next tap; a mouse leaving takes it down
	const leave = (e: PointerEvent) => e.pointerType !== 'touch' && (tip = -1);

	// The scene loads when the stage comes near the viewport. Without WebGL2 or under Save-Data the
	// stage steps aside and the table opens.
	const stage: Attachment<HTMLCanvasElement> = (canvas) => {
		if (!sceneAllowed()) return void (off = true);
		let gone = false;
		const near = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				near.disconnect();
				import('./scene.js')
					.then(({ start }) => {
						if (gone) return;
						const isles = sets.map((v) => v.isles.map((r) => ({ name: r.name, hours: r.seconds / HOUR })));
						scene = start(canvas, isles, reducedMotion(), {
							ready: () => (live = true),
							marks: (xy) => {
								summits = xy;
								put();
							},
							turned: () => (settled = true)
						});
					})
					.catch((err) => {
						console.warn('the relief stays a table:', err);
						off = true;
					});
			},
			{ rootMargin: '600px 0px' }
		);
		near.observe(canvas);
		return () => {
			gone = true;
			near.disconnect();
			scene?.stop();
			scene = undefined;
			live = false;
		};
	};
</script>

<svelte:head>
	<!-- without JavaScript there is no scene: the stage steps aside for the table -->
	<noscript><style>[data-relief] { display: none; }</style></noscript>
</svelte:head>

<figure>
	<p class="lead">
		<strong>{h(s.total)}</strong>
		{c.tracked}
		{data.since}
		<span class="when">{c.read} {s.readOn}</span>
	</p>
	<div class={['stage', { live }]} hidden={off} data-relief>
		<div class="face" role="img" aria-label={label} bind:this={face}>
			<canvas {@attach stage} aria-hidden="true" onpointermove={point} onpointerdown={point} onpointerleave={leave}></canvas>
			{#if live}
				<ul class={['slips', { settled }]} role="list" aria-hidden="true">
					{#each named as i (`${view} ${i}`)}
						<li bind:this={slips[i]} class={{ tip: i === tip }}>{s.isles[i].name} <em>{h(s.isles[i].seconds)} {c.unit}</em></li>
					{/each}
				</ul>
			{/if}
		</div>
		{#if live}
			<p class="modes" role="group" aria-label={c.viewsLabel}>
				{#each sets as v, i (v.label)}
					<button type="button" aria-pressed={view === i} onclick={() => show(i)}>{v.label}</button>
				{/each}
			</p>
		{/if}
	</div>
	<figcaption>
		<div class="notes">
			{#if live}
				<p>{s.each} {c.height}</p>
				{#if s.isles.length < s.rows.length}
					<p>{c.shows.lead} {nf.format(s.isles.length)} {c.shows.of} {nf.format(s.rows.length)} {s.many}, {c.shows.all}</p>
				{/if}
				<p class="point">{c.point}</p>
			{/if}
			<p>{c.least.lead} {data.leastHours} {c.least.tail} {c.method.lead} {data.pauseMinutes} {c.method.tail}</p>
		</div>
		<details open={off}>
			<summary>{c.table.summary}</summary>
			<div class="tables">
				{#each sets as v (v.label)}
					<table>
						<caption>{v.label}, <em>{c.read} {v.readOn}</em></caption>
						<thead>
							<tr><th scope="col">{v.column}</th><th scope="col">{c.table.hours}</th></tr>
						</thead>
						<tbody>
							{#each v.rows as r (r.name)}
								<tr><th scope="row">{r.name}</th><td>{h(r.seconds)}</td></tr>
							{/each}
						</tbody>
					</table>
				{/each}
			</div>
		</details>
	</figcaption>
</figure>

<style>
	/* the figure's parts take their places in the section's own grid (+page.svelte, .split) */
	figure {
		display: contents;
	}
	.lead {
		grid-column: 2;
		align-self: end;
		max-width: 26ch;
		font-size: var(--step-2);
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.12;
		text-wrap: balance;
	}
	.lead strong {
		font-weight: 800;
		font-variant-numeric: tabular-nums;
	}
	.lead .when {
		display: block;
		margin-top: 0.6rem;
		font-size: var(--step-0);
		font-weight: 400;
		letter-spacing: 0;
		line-height: 1.4;
		color: var(--orange);
	}

	/* the chart lies across the whole page width, as a double-page plate does */
	.stage {
		grid-column: 1 / -1;
	}
	.face {
		position: relative;
		aspect-ratio: 2.1;
	}
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		touch-action: pan-y;
		cursor: grab;
		opacity: 0;
		transition: opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1);
	}
	canvas:active {
		cursor: grabbing;
	}
	.live canvas {
		opacity: 1;
	}

	/* a summit's name and height on a slip, as Helsinki has one on the globe */
	.slips {
		position: absolute;
		inset: 0;
		margin: 0;
		padding: 0;
		list-style: none;
		pointer-events: none;
		opacity: 0;
	}
	.slips.settled {
		opacity: 1;
		transition: opacity 0.5s;
	}
	li {
		--slip: oklch(0.24 0.06 268);
		position: absolute;
		left: 0;
		top: 0;
		padding: 0.18rem 0.5rem 0.14rem;
		background: var(--paper);
		border: 1.5px solid var(--slip);
		color: var(--slip);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		line-height: 1.2;
		white-space: nowrap;
		transform: translate(-50%, calc(-100% - 11px));
		transition: opacity 0.25s;
	}
	/* the slip's foot points at the summit */
	li::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 100%;
		width: 8px;
		height: 8px;
		background: var(--paper);
		border: solid var(--slip);
		border-width: 0 1.5px 1.5px 0;
		transform: translate(-50%, -4px) rotate(45deg);
	}
	li em {
		margin-left: 0.3em;
		font-family: var(--serif);
		font-size: 0.8125rem;
		font-weight: 400;
		letter-spacing: 0;
		text-transform: none;
	}
	li.tip {
		z-index: 1;
		background: var(--orange);
	}
	li.tip::after {
		background: var(--orange);
	}

	.modes {
		position: relative;
		display: flex;
		justify-content: center;
		margin: 0.25rem 0 0;
		font-size: 0.9375rem;
	}
	button {
		min-width: 6.5em;
		padding: 0.34em 1.1em 0.28em;
		border: 1.5px solid var(--ink);
		background: none;
		color: var(--ink);
		font: 600 1em var(--sans);
		text-align: center;
		cursor: pointer;
	}
	button + button {
		margin-left: -1.5px;
	}
	button:hover,
	button[aria-pressed='true'] {
		background: var(--ink);
		color: var(--sea-deep);
	}

	figcaption {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: subgrid;
		align-items: start;
		font-size: 0.9375rem;
		line-height: 1.45;
		color: var(--ink-soft);
	}
	.notes {
		display: grid;
		gap: 0.45rem;
		max-width: 29rem;
	}
	.point {
		font-family: var(--serif);
		font-style: italic;
	}
	details {
		border-block: 1px solid var(--rule);
	}
	summary {
		padding-block: 0.9rem;
		cursor: pointer;
		font-weight: 600;
		color: var(--ink);
	}
	summary::marker {
		color: var(--orange);
	}
	.tables {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
		gap: 1.25rem 2.5rem;
		align-items: start;
		padding-bottom: 1.25rem;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.8125rem;
		line-height: 1.3;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}
	caption {
		padding-bottom: 0.35rem;
		text-align: left;
		font-size: 0.9375rem;
		font-weight: 700;
	}
	caption em {
		font-family: var(--serif);
		font-weight: 400;
		color: var(--ink-soft);
	}
	th,
	td {
		padding: 0.12rem 0;
		border-top: 1px solid var(--rule);
		font-weight: 500;
		text-align: right;
		white-space: nowrap;
	}
	th:first-child {
		text-align: left;
		white-space: normal;
	}
	thead th {
		border-top: 0;
		font-family: var(--serif);
		font-style: italic;
		font-weight: 400;
		color: var(--ink-soft);
	}

	@media (max-width: 56rem) {
		.lead,
		.stage,
		figcaption {
			grid-column: 1;
		}
		figcaption {
			display: grid;
			grid-template-columns: minmax(0, 1fr);
			row-gap: 1.25rem;
		}
		.face {
			aspect-ratio: 1.55;
		}
		/* the chart runs to the screen's edges */
		.stage {
			margin-inline: calc(var(--gutter) * -1);
		}
	}

	@media print {
		.stage,
		.point {
			display: none;
		}
	}
</style>
