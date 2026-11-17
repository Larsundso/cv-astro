<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { asset } from '$app/paths';
	import { projects } from '#lib/content.js';
	import { motionAllowed } from '#lib/lowend.js';
	import stats from '#lib/stats.json';
	import { openStream, type Roster, type Still } from './source.js';
	import { nameOf } from './lanes.js';
	import type { Scene, Seen } from './scene.js';
	import { PIN, place } from './view.js';

	let { data }: { data: Still } = $props();
	const g = projects.globe;
	let live = $state(false);
	let paused = $state(false);
	let liveRate = $state<number | null>(null);
	// real events are arriving: every streak drawn now is one of them
	let streaming = $state(false);
	// the event the ring took last, in Discord's own name; every event gets its turn
	let last = $state('');
	// The second view: the globe opens into one dot for each server.
	const c = g.census;
	const STATS = 'https://api.ayakobot.com/v1/bot/stats';
	let census = $state(false);
	let roster = $state.raw<Roster | null>(null);
	// Ayako's own count as the build read it. In the census it is read again every minute, and members
	// joining or leaving a server move it in between.
	let count = $state({ servers: stats.servers, members: stats.members, live: false });
	// once the servers' real sizes are published, the roster counts the whole fleet
	const shown = $derived(
		roster?.source === 'members' && roster.bandMembers
			? { servers: roster.total, members: roster.bandMembers.reduce((a, b) => a + b, 0), fleet: true }
			: { servers: count.servers, members: count.members, fleet: false }
	);
	// The sizes in figures, once the roster carries the real ones: for every step its servers, their
	// members, the members' share of the whole and the average server.
	const sizes = $derived.by(() => {
		const r = roster;
		if (r?.source !== 'members' || !r.bands || !r.bandMembers) return null;
		const all = r.bandMembers.reduce((a, b) => a + b, 0) || 1;
		return r.bands.map((servers, i) => {
			const members = r.bandMembers![i];
			return { i, servers, members, share: members / all, average: servers ? Math.round(members / servers) : 0 };
		});
	});
	// the table and the sentence above it take the steps that have servers
	const rows = $derived(sizes?.filter((s) => s.servers) ?? []);
	// A step in words, from its own lowest member count and the one above it. A step without servers
	// has joined the next smaller one (the API keeps no size to a handful of servers), so a step
	// reaches up to the nearest one above it that has any.
	const mins = $derived(roster?.mins ?? [5000, 500, 50, 0]);
	const sizeName = (i: number, unit = '') => {
		const b = roster?.bands;
		let above = i - 1;
		while (b && above >= 0 && !b[above]) above--;
		if (above < 0) return `${fmt(mins[i])}${unit} ${c.size.more}`;
		return mins[i] ? `${fmt(mins[i])} ${c.size.to} ${fmt(mins[above] - 1)}${unit}` : `${c.size.fewer} ${fmt(mins[above])}${unit}`;
	};
	// events from servers of each size since the page opened. A dot's number says its size: the roster
	// numbers the dots largest first.
	let heard = $state<number[]>(new Array(12).fill(0));
	const heardAll = $derived(heard.reduce((a, b) => a + b, 0));
	const bandOf = (dot: number) => {
		const b = roster?.bands;
		if (!b || dot < 0) return -1;
		let i = 0;
		for (; i < b.length - 1 && dot >= b[i]; i++) dot -= b[i];
		return dot < b[i] ? i : -1;
	};
	function show(on: boolean) {
		census = on;
		tip = null;
		scene?.view(on);
	}
	// Pointing at a dot of the census says what is known about its server. The scene finds the dot.
	let tip = $state.raw<Seen | null>(null);
	let pointer = { x: 0, y: 0 };
	const regions = new Intl.DisplayNames(['en'], { type: 'region' });
	function point(e: PointerEvent) {
		pointer = { x: e.clientX, y: e.clientY };
		tip = scene?.inspect(pointer.x, pointer.y) ?? null;
	}
	// a finger lifting leaves the note up until the next tap; a mouse leaving takes it down
	function unpoint(e: PointerEvent) {
		if (e.pointerType !== 'touch') tip = scene?.inspect(-1e6, -1e6) ?? null;
	}
	// the note counts on while it is up
	$effect(() => {
		if (!tip) return;
		const id = setInterval(() => (tip = scene?.inspect(pointer.x, pointer.y) ?? null), 500);
		return () => clearInterval(id);
	});
	$effect(() => {
		if (!census || !live || paused) return;
		const whole = (n: unknown): n is number => Number.isSafeInteger(n) && (n as number) > 0;
		const read = () =>
			fetch(STATS)
				.then((r) => (r.ok ? r.json() : null))
				.then((j) => {
					if (whole(j?.guildCount) && whole(j?.userCount)) count = { servers: j.guildCount, members: j.userCount, live: true };
				})
				.catch(() => {}); // the build's reading stays
		read();
		const id = setInterval(read, 60_000);
		return () => clearInterval(id);
	});
	// Helsinki's place on the stage: the poster's until the scene reports its own
	let pin = $state(place(PIN[0], PIN[1]));
	let scene: Scene | undefined;
	let close: (() => void) | undefined;
	const listen = () =>
		(close = openStream({
			events: (ev) => {
				streaming = true;
				scene?.feed(ev);
				for (const [type, , , dot] of ev) {
					if (type === 'GUILD_MEMBER_ADD') count.members++;
					else if (type === 'GUILD_MEMBER_REMOVE') count.members--;
					const band = bandOf(dot);
					if (band >= 0) heard[band]++;
				}
				// a batch lands every 250 ms; its events take turns across that gap, so the label runs at the stream's pace
				ev.forEach(([type], i) => setTimeout(() => (last = nameOf(type)), (i * 250) / ev.length));
			},
			rate: (r) => (liveRate = r),
			roster: (r) => {
				roster = r;
				scene?.roster(r);
			},
			lost: () => {
				streaming = false;
				scene?.fallback();
			}
		}));
	const hangUp = () => {
		close?.();
		close = undefined;
		streaming = false;
	};

	// The scene loads when the stage comes near the viewport and motion is allowed; the poster stays
	// otherwise. Once the globe is on screen the event stream opens and feeds it; until then, and
	// whenever the stream fails, the snapshot draws the streaks and the caption prints its figure.
	const stage: Attachment<HTMLCanvasElement> = (canvas) => {
		if (!motionAllowed()) return;
		let gone = false;
		const end = () => {
			gone = true;
			near.disconnect();
			seen.disconnect();
			hangUp();
			scene?.stop();
			scene = undefined;
			live = false;
			liveRate = null;
			pin = place(PIN[0], PIN[1]);
		};
		const seen = new IntersectionObserver(([e]) => {
			if (!e.isIntersecting || close || paused) return;
			seen.disconnect();
			listen();
		});
		const near = new IntersectionObserver(
			([e]) => {
				if (!e.isIntersecting) return;
				near.disconnect();
				import('./scene.js')
					.then(({ start }) =>
						start(canvas, { land: asset('globe/land.json'), borders: asset('globe/borders.json'), prior: asset('globe/prior.json') }, g.seas, g.fields, stats.servers, {
							ready: () => (live = true),
							slow: end,
							pin: (x, y, front) => (pin = { x, y, front })
						})
					)
					.then((s) => {
						if (gone) return s.stop();
						scene = s;
						// scripts/still.mjs takes the poster from here
						// scripts/live-check.mjs reads how many streaks were real
						Object.assign(canvas, { shot: s.shot, counts: s.counts });
						seen.observe(canvas);
					})
					.catch((err) => console.warn('globe stays a still:', err));
			},
			{ rootMargin: '600px 0px' }
		);
		near.observe(canvas);
		return end;
	};

	// Pause stops every movement and lets go of the stream; Play takes both up again.
	function toggle() {
		paused = !paused;
		scene?.pause(paused);
		if (paused) hangUp();
		else listen();
	}

	const fmt = (n: number) => new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(n);
	// a share as a percentage; one decimal below 10%, so the small sizes are not all "0%"
	const pct = (x: number) => new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: x < 0.0995 && x > 0 ? 1 : 0 }).format(x);
</script>

<figure>
	<div class={['stage', { live, census }]}>
		<div class="face" role="img" aria-label={g.label}>
			<img src={asset('globe/still.webp')} alt="" width="1200" height="1200" decoding="async" fetchpriority="high" />
			<canvas {@attach stage} aria-hidden="true" onpointermove={point} onpointerdown={point} onpointerleave={unpoint}></canvas>
			<span class={['pin', { away: !pin.front }]} aria-hidden="true" style:left="{pin.x * 100}%" style:top="{pin.y * 100}%">{g.pin}</span>
			{#if tip}
				{@const under = tip.y - tip.r < 0.3}
				<div class={['tip', { under }]} aria-hidden="true" style:--x="{tip.x * 100}%" style:top="{(tip.y + (under ? tip.r : -tip.r)) * 100}%">
					<span><strong>{sizeName(tip.band, ` ${c.size.unit}`)}</strong>{#if !shown.fleet}&nbsp;<em>{c.tip.simulated}</em>{/if}</span>
					{#if sizes}
						<span>{c.tip.among.lead} {fmt(sizes[tip.band].servers)} {c.tip.among.servers} {fmt(sizes[tip.band].average)} {c.tip.among.average}</span>
					{/if}
					<span>{tip.known ? c.tip.place : c.tip.likely} {tip.country ? (regions.of(tip.country) ?? tip.country) : ''}</span>
					<span>
						{#if tip.events && tip.lastType}
							{fmt(tip.events)}
							{tip.events === 1 ? c.tip.event : c.tip.events}
							{c.tip.last} <em>{nameOf(tip.lastType)}</em>, {Math.round(tip.lastAgo)}{c.tip.ago}
						{:else}
							{c.tip.none}
						{/if}
					</span>
				</div>
			{/if}
		</div>
		<!-- the switch between the two views sits right under the scene it changes -->
		{#if live}
			<p class="modes" role="group" aria-label={g.viewsLabel}>
				<button type="button" class="hold" aria-pressed={!census} onclick={() => show(false)}>{g.modes.globe}</button>
				<button type="button" class="hold" aria-pressed={census} onclick={() => show(true)}>{g.modes.census}</button>
			</p>
			{#if census}<p class="point">{c.point}</p>{/if}
		{/if}
	</div>
	<figcaption>
		<p class="rate">
			{#if liveRate !== null}
				<span class="on">{g.live}</span>
				<strong>{fmt(liveRate)}</strong>
				{g.unit}, {g.liveSpan}.
			{:else if !data.placeholder && data.rate !== null}
				<strong>{fmt(data.rate)}</strong>
				{g.unit}, {g.measured}
				<em>{data.day}</em>.
			{:else}
				<strong class="blank">{g.placeholderN}</strong>
				{g.unit}, {g.measured}
				<span class="blank">{g.placeholderDate}</span>
				<em>({g.placeholderAside})</em>.
			{/if}
		</p>
		{#if census}
			<p class="count">
				<strong>{fmt(shown.servers)}</strong>
				{c.servers}
				<strong>{fmt(shown.members)}</strong>
				{c.members}
				{shown.fleet ? c.fleet : c.own},
				<em>{shown.fleet || count.live ? c.live : `${c.read} ${stats.readOn}`}</em>.
			</p>
			{#if rows.length}
				{@const top = rows[0]}
				<p class="holds">
					{c.hold.lead}
					<strong>{fmt(top.servers)}</strong>
					{c.hold.servers}
					<strong>{pct(top.share)}</strong>
					{c.hold.of}{#if heardAll >= 20}{' '}{c.hold.sent} <strong>{pct(heard[top.i] / heardAll)}</strong> {c.hold.events}{:else}.{/if}
				</p>
			{/if}
			<p>{c.each}{#if !sizes}{' '}{c.simulated}{/if}</p>
			{#if rows.length}
				<table class="sizes" aria-label={c.table.label}>
					<thead>
						<tr>
							<th scope="col">{c.table.size}</th>
							<th scope="col">{c.table.servers}</th>
							<th scope="col">{c.table.members}</th>
							<th scope="col">{c.table.events}</th>
						</tr>
					</thead>
					<tbody>
						{#each rows as s (s.i)}
							<tr>
								<th scope="row"><span class="dot" aria-hidden="true"><span style:--d="{0.8 * 0.28 ** (s.i / Math.max(1, mins.length - 1))}rem"></span></span>{sizeName(s.i)}</th>
								<td>{fmt(s.servers)}</td>
								<td>{fmt(s.members)} <span class="share">{pct(s.share)}</span></td>
								<td>{pct(heardAll ? heard[s.i] / heardAll : 0)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
			<p>{c.fleetLead} {c.satellites.join(', ')}.</p>
		{:else}
			<p>
				{streaming ? g.eachLive : g.eachStill}
				{g.estimate}
				{#if live}{g.night}{/if}
				{#if streaming}{g.ring}{/if}
				<a href="#method">{g.methodLink}</a>
			</p>
		{/if}
		<!-- the census's caption is longer, and the ring names the kinds already: the key steps aside there -->
		{#if !census}
			<ul class="key" role="list">
				{#each g.key as k (k.ink)}<li><span class={['ink', k.ink]} aria-hidden="true"></span>{k.text}</li>{/each}
				{#if streaming && last}<li class="last" aria-hidden="true">{g.ringLast} <em>{last}</em></li>{/if}
			</ul>
		{/if}
		{#if live}
			<p class="hands">
				<button type="button" class="hold" aria-pressed={paused} onclick={toggle}>{paused ? g.play : g.pause}</button>
				{#if !census}
					<span class="turn">
						{g.turn}
						{#each g.views as v (v.lon)}<button type="button" onclick={() => scene?.turn(v.lon)}>{v.label}</button>{/each}
						{g.drag}
					</span>
				{/if}
			</p>
		{/if}
	</figcaption>
</figure>

<style>
	figure {
		margin: 0;
		display: contents;
	}

	.stage {
		grid-area: globe;
		position: relative;
		/* never wider than its own column plus the bleed past the page edge, so the ring stays clear of the text */
		width: min(106%, var(--stage));
		justify-self: end;
		margin-right: -6%;
		margin-block: -4% 0;
	}
	.face {
		position: relative;
		aspect-ratio: 1;
	}

	/* the ball's shadow on the paper, thrown to the lower right */
	.face::before {
		content: '';
		position: absolute;
		inset: 14% 8% 8% 16%;
		border-radius: 50%;
		background: radial-gradient(closest-side, oklch(0.3 0.06 266 / 0.3) 78%, transparent);
		translate: 2.2% 3.4%;
	}

	img,
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	canvas {
		touch-action: pan-y;
		cursor: grab;
	}
	canvas:active {
		cursor: grabbing;
	}
	/* the live globe fades in over the poster; the poster goes once it is covered, since its streaks
	   past the limb would show through the canvas */
	canvas {
		opacity: 0;
		transition: opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.live canvas {
		opacity: 1;
	}
	.live img {
		visibility: hidden;
		transition: visibility 0s 1.4s;
	}

	/* a place name the way an atlas sets it: small capitals on a slip, tied to its point */
	.pin {
		position: absolute;
		translate: 1.1rem calc(-100% - 0.9rem);
		padding: 0.18rem 0.5rem 0.14rem;
		background: var(--paper);
		border: 1.5px solid var(--ink);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		line-height: 1.2;
		white-space: nowrap;
		pointer-events: none;
	}
	.pin::before {
		content: '';
		position: absolute;
		left: -1.1rem;
		top: 100%;
		width: 1.42rem;
		border-top: 1.5px solid var(--ink);
		transform-origin: 0 0;
		rotate: -39deg;
		translate: 0 0.9rem;
	}
	.pin.away {
		visibility: hidden;
	}

	figcaption {
		grid-area: caption;
		align-self: start;
		max-width: 29rem;
		font-size: 0.9375rem;
		line-height: 1.45;
		color: var(--ink-soft);
	}
	figcaption p {
		margin: 0;
	}
	figcaption p + p {
		margin-top: 0.45rem;
	}

	.rate {
		font-size: 1.125rem;
		line-height: 1.35;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.count {
		font-size: 1rem;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.count strong,
	.holds strong {
		font-weight: 800;
	}
	.holds {
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	/* the four sizes in figures: a small table under the sentence it proves */
	.sizes {
		width: 100%;
		margin-top: 0.6rem;
		border-collapse: collapse;
		font-size: 0.8125rem;
		line-height: 1.3;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}
	.sizes th,
	.sizes td {
		padding: 0.1rem 0;
		border-top: 1px solid var(--rule);
		font-weight: 500;
		text-align: right;
		white-space: nowrap;
	}
	.sizes th:first-child {
		text-align: left;
	}
	.sizes thead th {
		border-top: 0;
		font-family: var(--serif);
		font-style: italic;
		font-weight: 400;
		color: var(--ink-soft);
	}
	.sizes .share {
		display: inline-block;
		min-width: 3.1em;
		color: var(--ink-soft);
	}
	.sizes .dot {
		display: inline-grid;
		place-items: center;
		width: 0.8rem;
		height: 0.8rem;
		margin-right: 0.5em;
		vertical-align: -0.1em;
	}
	.sizes .dot span {
		width: var(--d);
		height: var(--d);
		border-radius: 50%;
		background: #1d3187;
	}
	.sizes + p {
		margin-top: 0.6rem;
	}
	.count em {
		font-family: var(--serif);
	}
	.rate strong {
		font-weight: 800;
	}
	.rate em {
		font-family: var(--serif);
		font-style: italic;
	}

	/* the one live marker: Ayako's orange, with the word beside it */
	.on {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		margin-right: 0.35em;
		padding: 0.05em 0.5em 0.02em 0.4em;
		background: var(--ink);
		color: var(--paper);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		vertical-align: 0.15em;
	}
	.on::before {
		content: '';
		width: 0.55em;
		height: 0.55em;
		border-radius: 50%;
		background: var(--orange);
	}

	.blank {
		border-bottom: 2px dashed currentColor;
	}

	a {
		white-space: nowrap;
	}
	/* the key to the streaks' three inks */
	.key {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 1.1rem;
		margin-top: 0.6rem;
	}
	.key li {
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
	}
	.ink {
		width: 1.5em;
		height: 0.28em;
		border-radius: 1em;
	}
	.last em {
		margin-left: 0.3em;
		font-family: var(--serif);
	}
	.message {
		background: #ff7310;
	}
	.interaction {
		background: #ff3380;
	}
	.other {
		background: #f53d29;
	}

	/* the globe's controls: plain words that happen to be buttons */
	figcaption .hands {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem 1rem;
		margin-top: 0.85rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--rule);
		font-size: 0.875rem;
	}
	.turn {
		font-family: var(--serif);
		font-style: italic;
	}
	button {
		padding: 0;
		border: 0;
		background: none;
		color: var(--ink);
		font: 600 1em var(--sans);
		cursor: pointer;
		text-decoration: underline;
		text-decoration-color: var(--orange);
		text-decoration-thickness: 0.14em;
		text-underline-offset: 0.2em;
	}
	.turn button {
		margin-inline: 0.2em 0.35em;
	}
	button:hover {
		text-decoration-color: currentColor;
	}
	.hold {
		min-width: 3.4em;
		padding: 0.12em 0.6em 0.08em;
		border: 1.5px solid var(--ink);
		text-align: center;
		text-decoration: none;
	}
	/* the note a census dot gives when pointed at: a slip like Helsinki's, set above the dot */
	.tip {
		position: absolute;
		left: clamp(8.5rem, var(--x), 100% - 8.5rem - 6%);
		z-index: 3;
		display: grid;
		gap: 0.15rem;
		width: max-content;
		max-width: 17rem;
		padding: 0.5rem 0.7rem 0.45rem;
		background: var(--paper);
		border: 1.5px solid var(--ink);
		font-size: 0.8125rem;
		line-height: 1.35;
		translate: -50% calc(-100% - 0.9rem);
		pointer-events: none;
	}
	.tip.under {
		translate: -50% 0.9rem;
	}
	.tip strong {
		font-weight: 700;
	}
	.tip em {
		font-family: var(--serif);
	}
	.census canvas {
		cursor: default;
	}
	.point {
		margin: 0.45rem 0 0;
		text-align: center;
		font-family: var(--serif);
		font-style: italic;
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	/* under the scene, in the gap the ring leaves at the stage's foot */
	.modes {
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: center;
		margin: -1.5% 0 0;
		font-size: 0.9375rem;
	}
	.modes .hold {
		min-width: 6.5em;
		padding: 0.34em 1.1em 0.28em;
		background: var(--paper);
	}
	.modes .hold + .hold {
		margin-left: -1.5px;
	}
	/* the ball's shadow goes when the globe opens into the flat census */
	/* it returns only once the globe is back at its size (the way back takes 3.4 s) */
	.face::before {
		transition: opacity 0.9s 1.6s;
	}
	.census .face::before {
		opacity: 0;
		transition: opacity 0.5s;
	}
	.hold:hover,
	.hold[aria-pressed='true'] {
		background: var(--ink);
		color: var(--paper);
	}

	/* the page's one entrance: the globe settles onto the paper */
	@media (prefers-reduced-motion: no-preference) {
		.stage {
			animation: settle 1.1s cubic-bezier(0.16, 1, 0.3, 1) both;
		}
		@keyframes settle {
			from {
				opacity: 0;
				scale: 0.93;
			}
		}
	}

	@media print {
		.stage {
			width: 9cm;
			margin: 0;
			justify-self: start;
		}
		canvas,
		.hands,
		.modes,
		.face::before {
			display: none;
		}
		.live img {
			visibility: visible;
		}
	}
</style>
