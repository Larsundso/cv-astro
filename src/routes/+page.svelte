<script lang="ts">
	import { asset } from '$app/paths';
	import { contact, credentials, email, first, footer, hours, jsonLd, meta, nav, projects, work, type Fact } from '#lib/content.js';
	import Greeting from '#lib/Greeting.svelte';
	import Globe from '#lib/globe/Globe.svelte';
	import Relief from '#lib/relief/Relief.svelte';

	let { data } = $props();
	const a = projects.ayako;
	const g = projects.globe;

	// JSON-LD is built from content.ts at build time; "<" is escaped so no string can close the tag
	const host = (href: string) => new URL(href).hostname;

	const ld = `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\u003c')}</` + `script>`;
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.description} />
	<meta property="og:type" content="profile" />
	<meta property="og:site_name" content="lars-dev.org" />
	<meta name="author" content="Lars Böse" />
	<!-- trusted build-time JSON from content.ts -->
	{@html ld}
</svelte:head>

<!-- one fact: its words, then the day it was read or an aside, set in the atlas italic -->
{#snippet said(f: Fact)}
	<span lang={f.de ? 'de' : undefined}>
		{#if f.href}<a href={f.href}>{f.text}</a>{:else}{f.text}{/if}
	</span>
	{#if f.date || f.aside}<span class="when">{f.date ?? f.aside}</span>{/if}
{/snippet}

{#snippet out()}
	<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 8 8 2M3.2 2H8v4.8" /></svg>
{/snippet}

{#snippet linkrow(links: { label: string; href: string }[])}
	<ul class="flex flex-wrap gap-x-7 gap-y-2 mt-6 font-600" role="list">
		{#each links as l (l.href)}<li><a href={l.href}>{l.label}</a></li>{/each}
	</ul>
{/snippet}

<a class="skip" href="#main">{footer.skip}</a>
<div class="flag" aria-hidden="true"></div>

<header class="masthead wrap">
	<nav aria-label={footer.nav}>
		<ul class="flex flex-wrap gap-x-6 gap-y-1" role="list">
			{#each nav as n (n.id)}<li><a href="#{n.id}">{n.label}</a></li>{/each}
		</ul>
	</nav>
	<a class="pride" href={meta.prideOff} aria-label={first.prideAria}>
		<span class="knob" aria-hidden="true"></span>
		{first.pride}
	</a>
</header>

<main id="main">
	<section class="hero wrap" aria-labelledby="name">
		<div class="intro">
			<Greeting />
			<h1 id="name">{first.name}</h1>
			<dl class="facts">
				{#each first.facts as f (f.text)}
					<div class={{ mail: !!f.href }}>
						<dt>{f.label}</dt>
						<dd>{@render said(f)}</dd>
					</div>
				{/each}
			</dl>
		</div>
		<Globe data={data.globe} />
	</section>

	<section id="ayako" class="band sea" aria-labelledby="ayako-h">
		<div class="wrap split">
			<div class="side">
				<h2 id="ayako-h">{a.title}</h2>
				<figure class="avatar">
					<img src={asset('ayako.webp')} alt="" width="640" height="640" loading="lazy" decoding="async" />
					<figcaption>{a.avatarCaption}</figcaption>
				</figure>
			</div>
			<div class="body">
				<p class="lead">{@render said(a.head)}</p>
				<p class="reach">{@render said(a.facts[0])}</p>
				<ul class="lines" role="list">
					{#each a.facts.slice(1) as f (f.text)}<li>{@render said(f)}</li>{/each}
				</ul>
				{@render linkrow(a.links)}
				<div class="method" id="method">
					<h3>{g.methodTitle}</h3>
					<p>{g.method}</p>
					<details>
						<summary>{g.creditSummary}</summary>
						<p>{g.credit}</p>
					</details>
				</div>
			</div>
		</div>
	</section>

	<section id="work" class="wrap split" aria-labelledby="work-h">
		<h2 id="work-h">{work.title}</h2>
		<div class="body">
			{#each work.jobs as job (job.head.text)}
				<article class="entry">
					<p class="when">{job.head.date}</p>
					<div>
						<h3>{job.head.text}</h3>
						{#each job.facts as f (f.text)}<p>{@render said(f)}</p>{/each}
					</div>
					{#if job.sites}
						<!-- the gazetteer: an atlas index in which every place is a site that can be opened -->
						<div class="gaz">
							{#each job.sites.groups as grp (grp.label)}
								<h4>{grp.label}</h4>
								<ul class={{ big: grp.big }} role="list">
									{#each grp.rows as r (r.href)}
										<li>
											<a class="site" href={r.href} target="_blank" rel="noopener">
												<span class="name">{r.name}</span>
												<span class="stack">{r.stack}</span>
												<span class="dots" aria-hidden="true"></span>
												<span class="host">{host(r.href)}{@render out()}</span>
											</a>
											{#if r.also}
												<div class="also">
													<p>{r.also.lead}</p>
													<ul role="list">
														{#each r.also.rows as f (f.href)}
															<li><a href={f.href} target="_blank" rel="noopener">{f.label}</a></li>
														{/each}
													</ul>
												</div>
											{/if}
										</li>
									{/each}
								</ul>
							{/each}
						</div>
					{/if}
				</article>
			{/each}
			<details class="fold">
				<summary>{work.before.summary}</summary>
				<ol role="list">
					{#each work.before.rows as r (r.when)}
						<li class="entry"><span class="when">{r.when}</span><span>{r.text}</span></li>
					{/each}
				</ol>
			</details>
		</div>
	</section>

	<section id="projects" class="band shade" aria-labelledby="projects-h">
		<div class="wrap split">
			<h2 id="projects-h">{projects.title}</h2>
			<div class="body">
				{#each projects.more as m (m.head.text)}
					<article class="entry">
						<p class="when">{m.head.date}</p>
						<div>
							<h3>{m.head.text}</h3>
							{#each m.facts as f (f.text)}<p>{@render said(f)}</p>{/each}
							{@render linkrow(m.links)}
						</div>
					</article>
				{/each}
				<details class="fold">
					<summary>{projects.shelf.summary}</summary>
					<ul role="list">
						{#each projects.shelf.items as it (it.name)}
							<li class="entry">
								<span class="when">{it.when}</span>
								<div>
									<h3>
										{#if it.href}<a href={it.href}>{it.name}</a>{:else}{it.name}{/if}
										{#if it.ai}<span class="stamp">{projects.shelf.ai}</span>{/if}
									</h3>
									<p>{it.text}</p>
								</div>
							</li>
						{/each}
					</ul>
					<div class="ai">
						{#each projects.shelf.aiText as p (p)}<p>{p}</p>{/each}
					</div>
				</details>
			</div>
		</div>
	</section>

	<section id="hours" class="band sea" aria-labelledby="hours-h">
		<div class="wrap split plate">
			<h2 id="hours-h">{hours.title}</h2>
			<Relief />
		</div>
	</section>

	<section id="credentials" class="wrap split" aria-labelledby="credentials-h">
		<h2 id="credentials-h">{credentials.title}</h2>
		<div class="body">
			<ul class="lines" role="list">
				{#each credentials.facts as f, i (f.text)}<li class={{ first: i === 0 }}>{@render said(f)}</li>{/each}
			</ul>
			{@render linkrow([credentials.ihk])}
		</div>
	</section>

	<section id="contact" class="band sun" aria-labelledby="contact-h">
		<img class="peek" src={asset('ayako-peek.webp')} alt={contact.peekAlt} width="128" height="126" loading="lazy" decoding="async" />
		<div class="wrap split">
			<h2 id="contact-h">{contact.title}</h2>
			<div class="body">
				<ul class="values" role="list">
					{#each contact.values as v (v.text)}<li>{v.text}</li>{/each}
				</ul>
				<div class="notes">
					<p>{@render said(contact.roles)}</p>
					<p>{contact.interests}</p>
					<p>{contact.availability}</p>
				</div>
				<p class="closing">{contact.closing} <a href="mailto:{email}">{email}</a>.</p>
				{@render linkrow(contact.links)}
			</div>
		</div>
		<footer class="wrap"><p>{footer.colophon}</p></footer>
	</section>
</main>

<style>
	/* the six stripes, as the page's top edge */
	.flag {
		height: 6px;
		background: linear-gradient(90deg, #e40303 0 16.66%, #ff8c00 0 33.33%, #ffed00 0 50%, #008026 0 66.66%, #24408e 0 83.33%, #732982 0);
	}

	.masthead {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem 2rem;
		padding-block: 1.1rem;
		font-weight: 600;
		position: relative;
		z-index: 2;
	}
	.masthead a {
		text-decoration-color: transparent;
	}
	.masthead a:hover {
		text-decoration-color: var(--orange);
	}

	/* the pride switch: on, and switching it off leaves the site */
	.pride {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
	}
	.knob {
		position: relative;
		width: 2.5rem;
		height: 1.35rem;
		border-radius: 1rem;
		border: 1.5px solid var(--ink);
		background: linear-gradient(180deg, #e40303 0 16.66%, #ff8c00 0 33.33%, #ffed00 0 50%, #008026 0 66.66%, #24408e 0 83.33%, #732982 0);
	}
	.knob::after {
		content: '';
		position: absolute;
		top: 1px;
		right: 1px;
		bottom: 1px;
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--paper);
		border: 1.5px solid var(--ink);
		transition: translate 0.2s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.pride:hover .knob::after {
		translate: -0.25rem 0;
	}

	/* the globe's stage runs past the page edge; main cuts it there */
	main {
		overflow-x: clip;
	}

	/* ---- first screen: the facts on the left, the globe filling the right and running off the page */
	.hero {
		--stage: min(100svh - 2.5rem, 56rem);
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
		grid-template-areas: 'intro globe' 'caption globe';
		/* the caption follows the facts directly; whatever height the globe adds stays below it */
		grid-template-rows: auto 1fr;
		column-gap: 2rem;
		row-gap: 1.75rem;
		align-items: start;
		padding-bottom: clamp(1.5rem, 4vw, 3rem);
	}
	.intro {
		grid-area: intro;
		padding-top: clamp(0.5rem, 3.5vh, 2.75rem);
		position: relative;
		z-index: 1;
	}
	.intro :global(.greeting) {
		width: min(100%, 21rem);
	}
	h1 {
		margin-top: 0.9rem;
		font-size: clamp(3.4rem, 1.6rem + 6.4vw, 7rem);
		font-weight: 800;
		letter-spacing: -0.05em;
		line-height: 0.86;
	}
	.facts {
		margin-top: clamp(1.25rem, 3.4vh, 2.25rem);
		border-bottom: 1px solid var(--rule);
	}
	.facts > div {
		display: grid;
		grid-template-columns: 5.4rem minmax(0, 1fr);
		column-gap: 0.75rem;
		align-items: baseline;
		padding-block: 0.62rem;
		border-top: 1px solid var(--rule);
	}
	.facts dt {
		font-family: var(--serif);
		font-style: italic;
		font-size: 0.94em;
		color: var(--ink-soft);
	}
	.facts dd {
		font-weight: 500;
		line-height: 1.35;
		text-wrap: pretty;
	}
	.facts .when {
		margin-left: 0.3em;
		color: var(--ink-soft);
		font-weight: 400;
	}
	.facts .mail dd {
		font-size: var(--step-1);
		font-weight: 700;
		letter-spacing: -0.01em;
	}
	.facts .mail .when {
		font-size: 0.72em;
		letter-spacing: 0;
	}

	@media (max-width: 56rem) {
		.hero {
			--stage: min(100vw, 40rem);
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas: 'intro' 'globe' 'caption';
			row-gap: 0.5rem;
		}
		.hero :global(.stage) {
			width: var(--stage);
			justify-self: center;
			/* the view switch closes the stage now, so it keeps a little air above the caption */
			margin: calc(var(--stage) * -0.03) calc((100% - var(--stage)) / 2) 0.6rem;
		}
		.facts > div {
			grid-template-columns: 4.6rem minmax(0, 1fr);
			padding-block: 0.5rem;
		}
	}
	@media (max-width: 30rem) {
		.masthead {
			padding-block: 0.8rem 0.4rem;
			font-size: 0.875rem;
		}
		.masthead ul {
			column-gap: 0.85rem;
		}
	}

	/* ---- sections: the heading stands in the margin, the matter runs beside it */
	.split {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
		column-gap: 2rem;
		row-gap: 1.75rem;
		align-items: start;
		padding-block: clamp(3.5rem, 8vw, 7.5rem);
	}
	h2 {
		font-size: var(--step-3);
		font-weight: 800;
		letter-spacing: -0.045em;
		line-height: 0.92;
	}
	.split > h2,
	.side {
		position: sticky;
		top: 1.5rem;
	}
	h3 {
		font-size: var(--step-1);
		font-weight: 700;
		letter-spacing: -0.015em;
		line-height: 1.22;
		text-wrap: balance;
	}
	.body p {
		max-width: 62ch;
		text-wrap: pretty;
	}
	@media (max-width: 56rem) {
		.split {
			grid-template-columns: minmax(0, 1fr);
		}
		.split > h2,
		.side {
			position: static;
		}
	}

	/* the chart lies under its heading across both columns, so the heading stays where it is set */
	.plate > h2 {
		position: static;
	}

	.shade {
		background: var(--paper-2);
	}

	/* a dated entry: the date in the margin, as an atlas index sets its grid reference */
	.entry {
		display: grid;
		grid-template-columns: 9.5rem minmax(0, 1fr);
		column-gap: 1.25rem;
		row-gap: 0.2rem;
		padding-block: 1.35rem;
		border-top: 1px solid var(--rule);
	}
	.entry > .when {
		padding-top: 0.2em;
		color: var(--ink-soft);
		white-space: normal;
	}
	.entry h3 + p {
		margin-top: 0.5rem;
	}
	.entry p + p {
		margin-top: 0.6rem;
	}
	.entry p .when {
		color: var(--ink-soft);
	}
	@media (max-width: 40rem) {
		.entry {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	/* ---- the gazetteer: name, leader, domain, as an atlas indexes its places. It lies under the date too. */
	.gaz {
		container-type: inline-size;
		grid-column: 1 / -1;
		margin-top: 1.1rem;
		border-top: 3px double var(--rule);
	}
	.gaz h4 {
		margin: 1.1rem 0 0.25rem;
		font-family: var(--serif);
		font-style: italic;
		font-size: 0.94em;
		font-weight: 400;
		color: var(--ink-soft);
	}
	.site {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: 0.6rem;
		padding-block: 0.38rem;
		text-decoration: none;
	}
	.site .name {
		font-weight: 700;
		text-decoration: underline;
		text-decoration-color: var(--link);
		text-decoration-thickness: 0.14em;
		text-underline-offset: 0.2em;
		transition: text-decoration-color 0.15s;
	}
	.site .stack {
		font-size: 0.8em;
		color: var(--ink-soft);
	}
	.site .dots {
		flex: 1 1 1.5rem;
		min-width: 1.5rem;
		border-bottom: 2px dotted var(--rule);
		transition: border-color 0.15s;
	}
	.site .host {
		margin-left: auto;
		font-family: var(--serif);
		font-style: italic;
		font-size: 0.94em;
		color: var(--ink-soft);
		white-space: nowrap;
	}
	.site svg {
		/* the reset sets every svg as a block, which would drop the arrow under its domain */
		display: inline-block;
		width: 0.62em;
		height: 0.62em;
		margin-left: 0.55em;
		fill: none;
		stroke: var(--orange);
		stroke-width: 1.6;
		transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.site:hover .name {
		text-decoration-color: currentColor;
	}
	.site:hover .dots {
		border-color: var(--orange);
	}
	.site:hover svg {
		transform: translate(0.14em, -0.14em);
	}
	/* the developed sites are set large, each with its stack on a line of its own */
	.big .site {
		padding-block: 0.55rem 0.5rem;
	}
	.big .name {
		font-size: var(--step-1);
		letter-spacing: -0.015em;
		line-height: 1.22;
	}
	.big .stack {
		order: 1;
		flex-basis: 100%;
	}
	.also {
		margin: 0 0 0.7rem 1.25rem;
		padding-left: 1.1rem;
		border-left: 1px solid var(--rule);
		font-size: 0.94em;
	}
	.also p {
		font-family: var(--serif);
		font-style: italic;
		color: var(--ink-soft);
	}
	/* a finger needs 24 px of height on every name */
	.also a {
		display: inline-block;
		padding-block: 0.2rem;
	}
	.also ul {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0 1.5rem;
		margin-top: 0.2rem;
	}
	@container (min-width: 34rem) {
		.also ul {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.fold {
		border-block: 1px solid var(--rule);
	}
	.fold summary,
	.method summary {
		cursor: pointer;
		font-weight: 600;
	}
	.fold summary {
		padding-block: 1.1rem;
	}
	.fold summary::marker,
	.method summary::marker {
		color: var(--orange);
	}
	.fold .entry {
		padding-block: 0.95rem;
	}
	.fold h3 {
		font-size: var(--step-0);
	}
	.stamp {
		margin-left: 0.5rem;
		padding: 0.1em 0.45em 0.05em;
		border: 1.5px solid currentColor;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		vertical-align: 0.15em;
		white-space: nowrap;
	}
	.ai {
		display: grid;
		gap: 0.6rem;
		padding-block: 1.1rem 1.4rem;
		border-top: 1px solid var(--rule);
	}

	.lines li {
		padding-block: 0.95rem;
		border-top: 1px solid var(--rule);
		max-width: 46rem;
		text-wrap: pretty;
	}
	.lines li:last-child {
		border-bottom: 1px solid var(--rule);
	}
	.lines .when {
		margin-left: 0.3em;
		opacity: 0.8;
	}
	.lines .first {
		font-size: var(--step-1);
		font-weight: 700;
		letter-spacing: -0.015em;
		line-height: 1.25;
	}

	/* ---- Ayako: the globe's own sea, with the paper as its ink */
	.sea {
		--ink: var(--cream);
		--ink-soft: oklch(0.86 0.04 268);
		--rule: oklch(0.94 0.03 88 / 0.24);
		--focus: var(--cream);
		background: var(--sea-deep);
		color: var(--cream);
	}
	.avatar {
		margin-top: 1.75rem;
		max-width: 13rem;
	}
	.avatar img {
		display: block;
		width: 100%;
		height: auto;
	}
	.avatar figcaption {
		margin-top: 0.6rem;
		font-family: var(--serif);
		font-style: italic;
		font-size: var(--step--1);
		color: var(--ink-soft);
	}
	.lead {
		font-size: var(--step-1);
		font-weight: 600;
		line-height: 1.3;
	}
	.lead .when {
		margin-left: 0.3em;
		font-weight: 400;
		color: var(--ink-soft);
	}
	.reach {
		margin-block: 1.1rem 1.9rem;
		font-size: clamp(1.9rem, 1.1rem + 3.3vw, 3.7rem);
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
		text-wrap: balance;
	}
	.body .reach {
		max-width: none;
	}
	.reach .when {
		display: block;
		margin-top: 0.7rem;
		font-size: var(--step-0);
		letter-spacing: 0;
		line-height: 1.4;
		color: var(--orange);
	}
	.method {
		margin-top: 2.75rem;
		padding-top: 1.4rem;
		border-top: 1px solid var(--rule);
		display: grid;
		gap: 0.6rem;
		scroll-margin-top: 1.5rem;
	}
	.method h3 {
		font-size: var(--step-0);
	}
	.method p,
	.method summary {
		font-size: var(--step--1);
		color: var(--ink-soft);
	}
	.method details p {
		margin-top: 0.5rem;
	}

	/* ---- Contact: Ayako's orange, and Ayako herself looking over its edge */
	.sun {
		position: relative;
		--rule: oklch(0.24 0.06 268 / 0.32);
		--link: var(--ink);
		background: var(--orange);
	}
	.peek {
		position: absolute;
		right: max(var(--gutter), 11%);
		top: 0;
		z-index: -1;
		width: 6.5rem;
		height: auto;
		/* the sticker's bottom 6 of 126 px are its drawn ledge: that much hides behind the band, so her hands rest on its edge */
		translate: 0 -95%;
	}
	.sun .split {
		padding-bottom: clamp(2.5rem, 5vw, 4rem);
	}
	.values li {
		padding-block: 0.8rem;
		border-top: 1.5px solid var(--ink);
		font-size: var(--step-2);
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.12;
		text-wrap: balance;
	}
	.notes {
		display: grid;
		gap: 0.75rem;
		margin-top: 2rem;
		padding-top: 1.4rem;
		border-top: 1.5px solid var(--ink);
	}
	.closing {
		margin-top: 2.5rem;
		font-size: var(--step-2);
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.15;
	}
	.closing a {
		white-space: nowrap;
	}
	.sun :global(a:hover) {
		text-decoration-color: var(--paper);
	}
	footer {
		padding-block: 1.25rem 1.75rem;
		border-top: 1.5px solid var(--ink);
		font-size: var(--step--1);
	}
	footer p {
		max-width: 62ch;
	}

	/* the first screen arrives in one movement: the name, the facts, then the globe's caption */
	@media (prefers-reduced-motion: no-preference) {
		.intro > :global(*),
		.hero :global(figcaption) {
			animation: rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
		}
		.intro h1 {
			animation-delay: 0.07s;
		}
		.intro .facts {
			animation-delay: 0.14s;
		}
		.hero :global(figcaption) {
			animation-delay: 0.26s;
		}
		@keyframes rise {
			from {
				opacity: 0;
				translate: 0 0.9rem;
			}
		}
	}

	/* on paper: one column, no colour fields, nothing that only works on a screen */
	@media print {
		.flag,
		.masthead,
		.peek {
			display: none;
		}
		.hero {
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas: 'intro' 'globe' 'caption';
		}
		.split {
			grid-template-columns: minmax(0, 1fr);
			padding-block: 1.1rem;
		}
		.split > h2,
		.side {
			position: static;
		}
		.sea,
		.sun,
		.shade {
			--ink: #000;
			--ink-soft: #333;
			--rule: #999;
			background: none;
			color: #000;
		}
		.entry,
		.lines li,
		.values li {
			break-inside: avoid;
		}
		.avatar {
			max-width: 4cm;
		}
	}
</style>
