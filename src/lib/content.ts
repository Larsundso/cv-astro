// Every visible string lives here. Every claim traces to context/FACTS.md (section in the comment).
// A fact carries at most one reading date.
import stats from './stats.json';

export const email = 'jobs@lars-dev.org';
const gh = (p: string) => `https://github.com/${p}`;

// Ayako’s scale, re-read by every build (scripts/stats.mjs, owner 2026-10-28, FACTS 5) and printed with
// the day it was read.
const fmt = (n: number) => new Intl.NumberFormat('en').format(n);
const members = fmt(stats.members);
const servers = fmt(stats.servers);
export const statsDay = stats.readOn;

export type Fact = { label?: string; text: string; date?: string; aside?: string; href?: string; de?: boolean };
export type Link = { label: string; href: string };
export type Site = { name: string; href: string; stack: string; also?: { lead: string; rows: Link[] } };
export type Sites = { groups: { label: string; big?: boolean; rows: Site[] }[] };
type Job = { head: { text: string; date: string }; facts: Fact[]; sites?: Sites };

// FACTS 3, Columbus: the 25 sites under the labels the 2025 site published. They are employer assignments,
// so the page says what I did to each (developed, or maintained only) and nothing about the client.
// All 25 answered on the day in `sitesChecked`; check again before changing that date.
const sitesChecked = '2026-11-16';
const fairs: Link[] = [
	{ label: 'Aero Expo', href: 'https://aero-expo.de/' },
	{ label: 'Americana', href: 'https://americana.de/' },
	{ label: 'Aqua Fisch', href: 'https://aqua-fisch.de/' },
	{ label: 'Fairnamic', href: 'https://fairnamic.com/' },
	{ label: 'HAM-Radio', href: 'https://hamradio-friedrichshafen.de/' },
	{ label: 'IBO Messe', href: 'https://ibo-messe.de/' },
	{ label: 'Interboot', href: 'https://interboot.de/' },
	{ label: 'Klassikwelt Bodensee', href: 'https://klassikwelt-bodensee.de/' },
	{ label: 'Motorradwelt Bodensee', href: 'https://motorradwelt-bodensee.de/' },
	{ label: 'Pferd Bodensee', href: 'https://pferdbodensee.de/' },
	{ label: 'Tuningworld Bodensee', href: 'https://tuningworldbodensee.com/' },
	{ label: 'Vertical Pro', href: 'https://vertical-pro.de/' }
];
const developed: Site[] = [
	{
		name: 'Messe Friedrichshafen',
		href: 'https://messe-friedrichshafen.de/',
		stack: 'CraftCMS, PHP, Twig, SCSS, Bootstrap',
		also: { lead: `and ${fairs.length} of its trade fairs`, rows: fairs }
	},
	{ name: 'Simply-V', href: 'https://simply-v.de/', stack: 'CraftCMS, TypeScript, PHP, Twig, SCSS' },
	{ name: 'Columbus Interactive', href: 'https://columbus-interactive.de/', stack: 'PHP, SCSS, CSS3' },
	{ name: 'MP Family Office', href: 'https://mp-familyoffice.de/', stack: 'Bootstrap, Handlebars, TypeScript, Docker, SCSS' }
];
const maintained: Site[] = [
	{ name: 'Medizin Campus Bodensee', href: 'https://medizin-campus-bodensee.de/', stack: 'PHP, SCSS' },
	{ name: 'Paravan', href: 'https://paravan.de/', stack: 'Typo3' },
	{ name: 'Eisele', href: 'https://eisele.de/', stack: 'Typo3' },
	{ name: 'ID-S', href: 'https://id-s.de/', stack: 'Handlebars, PHP, Typo3' },
	{ name: 'EBZ Group', href: 'https://ebz-group.com/', stack: 'Typo3' },
	{ name: 'Columbus AG', href: 'https://columbus.ag/', stack: 'VueJS' },
	{ name: 'Hobart', href: 'https://hobart.de/', stack: 'PHP' },
	{ name: 'Arnold Next-G', href: 'https://arnoldnextg.de/', stack: 'Handlebars' },
	{ name: 'Lightweight', href: 'https://lightweight.info/', stack: 'SCSS, CSS3' }
];
// the counts are taken from the lists, so the names and the figures cannot disagree
const nDeveloped = developed.length + fairs.length;
const nSites = nDeveloped + maintained.length;

export const meta = {
	title: 'Lars Böse, full-stack developer',
	description:
		`Lars Böse is an IT-Specialist for Application Development at Raleo Digital GmbH and builds and runs Ayako, a free Discord bot, alone: ${members} members on ${servers} servers as of ${statsDay}.`,
	prideOff: 'https://www.google.com/search?q=misanthropic+freelance+developer'
};

// FACTS 1, 3, 4
export const jsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: 'Lars Böse',
	givenName: 'Lars',
	familyName: 'Böse',
	alternateName: 'Larsundso',
	jobTitle: 'IT-Specialist for Application Development',
	worksFor: { '@type': 'Organization', name: 'Raleo Digital GmbH' },
	email: `mailto:${email}`,
	url: 'https://lars-dev.org/',
	address: { '@type': 'PostalAddress', addressRegion: 'Baden-Württemberg', addressCountry: 'DE' },
	hasCredential: {
		'@type': 'EducationalOccupationalCredential',
		name: 'Fachinformatiker für Anwendungsentwicklung (IHK)',
		credentialCategory: 'vocational qualification',
		recognizedBy: { '@type': 'Organization', name: 'IHK Bodensee-Oberschwaben' }
	},
	knowsLanguage: ['de', 'en'],
	sameAs: [gh('Larsundso'), 'https://www.linkedin.com/in/lars-b%C3%B6se-217272351']
};

export const nav = [
	{ id: 'ayako', label: 'Ayako' },
	{ id: 'work', label: 'Work' },
	{ id: 'projects', label: 'Projects' },
	{ id: 'credentials', label: 'Credentials' },
	{ id: 'contact', label: 'Contact' }
] as const;

// First screen: FACTS 2 claims 1, 3 and 4; FACTS 1 for the address
export const first = {
	pride: 'Pride colours',
	prideAria: 'Pride colours are on. Switching them off leaves this site for a search for misanthropic freelance developers.',
	name: 'Lars Böse',
	facts: [
		{ label: 'Now', text: 'IT-Specialist for Application Development at Raleo Digital GmbH', date: 'since 2025-07' },
		{ label: 'Built', text: `Ayako, a free Discord bot I build and run alone: ${members} members on ${servers} servers`, date: statsDay },
		{
			label: 'Qualified',
			text: 'Fachinformatiker für Anwendungsentwicklung (IHK), vocational qualification, IHK Bodensee-Oberschwaben',
			date: 'summer 2025',
			de: true
		},
		{ label: 'Write to', text: email, href: `mailto:${email}` }
	] satisfies Fact[]
};

// FACTS 3, 6a-bis
export const work = {
	title: 'Work',
	jobs: [
		{
			head: { text: 'IT-Specialist for Application Development, Raleo Digital GmbH', date: '2025-07 to today' },
			facts: [
				{ text: 'An online marketplace for heating, heat pumps and photovoltaics. Fully remote, in a team of 8.' },
				{
					text: 'I own the ingestion service the marketplace runs on. On a schedule it collects availability, price, stock, images and descriptions from manufacturer sites, and it pulls shipment documents from supplier portals so a customer can be told where an order is.'
				},
				{
					text: 'A wrong stock figure costs money and a stale availability figure costs the sale, so most of the work is keeping unattended collection correct. TypeScript and Node.'
				}
			] as Fact[]
		},
		{
			head: { text: 'Freelance developer', date: '2024-03 to today' },
			facts: [
				{
					text: 'Paid Discord bots and websites for clients, alongside employment. Clients stay unnamed. Two pieces carry names: Ayako Custom-Clients, bespoke bots for specific Discord communities, and Marvel-Overlay, an AI-assisted stream overlay for Marvel Rivals.'
				}
			] as Fact[]
		},
		{
			head: { text: 'Apprentice application developer, Columbus Interactive GmbH, Ravensburg', date: '2022-09 to 2025-07' },
			facts: [
				{ text: 'A three-year IHK apprenticeship in a stack I was handed: CraftCMS, Typo3 and PHP, all new to me.' },
				{ text: `I worked on ${nSites} production websites there. Each name below opens the site, and all ${nSites} answered when checked.`, date: sitesChecked }
			] as Fact[],
			sites: {
				groups: [
					{ label: `${nDeveloped} developed`, big: true, rows: developed },
					{ label: `${maintained.length} maintained only`, rows: maintained }
				]
			}
		}
	] as Job[],
	before: {
		summary: 'Before 2022-09: school, two unfinished starts, two gaps and a till',
		rows: [
			{ when: '2010-04 to 2018-07', text: 'BZ St. Konrad Ravensburg, ending with the Mittlere Reife (intermediate school-leaving certificate).' },
			{ when: '2018-08 to 2018-10', text: 'Technisches Gymnasium Ravensburg (technical upper-secondary school). I left after three months.' },
			{ when: '2018-11 to 2019-07', text: 'Nine months with no school and no work.' },
			{
				when: '2019-08 to 2020-02',
				text: 'Einjährige Berufsfachschule für Elektrotechnik (one-year vocational school, electrical engineering). I left after seven of twelve months.'
			},
			{ when: '2019-12', text: 'I wrote Ayako. It has run ever since.' },
			{ when: 'from about 2019-12', text: 'Developer for a Discord community network that no longer exists.' },
			{ when: '2020-03 to 2021-05', text: 'No school and no work. I waited out the pandemic until vaccines were available. Ayako kept running.' },
			{
				when: '2021-06 to 2022-08',
				text: 'Cashier at a petrol station: advising customers, stocking and pricing goods, balancing the till at shift end and training new staff.'
			}
		]
	}
};

// FACTS 2, 4, 5, 6, 7, 10; owner rulings of 2026-10-28 for the globe (FACTS 5, Gateway globe)
export const projects = {
	title: 'Projects',
	ayako: {
		title: 'Ayako',
		avatarCaption: 'Ayako’s avatar. The character belongs to the bot.',
		head: { text: 'Ayako, a free multi-purpose Discord bot I build, deploy and run alone', date: 'since 2019-12-01' },
		facts: [
			{ text: `${members} members on ${servers} servers, and ${fmt(stats.userInstalls)} user installs`, date: statsDay },
			{ text: 'Four generations, v1.4, v1.5, v2 and v3, and five Discord libraries: discord.js, Eris, Discordeno, Oceanic.js, now @discordjs/core.' },
			{ text: '2,325 of 2,330 Ayako-v2 commits are mine. The other 5 are dependabot’s.', date: '2026-08-10' },
			{ text: 'Free since 2019, with no paid tier. v2 and v3 are source-available under CC BY-NC 4.0. Every outage since 2019, fixed by me.' }
		] as Fact[],
		links: [
			{ label: 'Ayako-v2 on GitHub', href: gh('AyakoBot/Ayako-v2') },
			{ label: 'Service (v3) on GitHub', href: gh('AyakoBot/Service') },
			{ label: 'ayakobot.com', href: 'https://ayakobot.com' },
			{ label: 'top.gg', href: 'https://top.gg/bot/650691698409734151' }
		] as Link[]
	},
	globe: {
		label:
			'Ayako’s gateway events on a globe: each event is drawn as a streak from its estimated place to Helsinki, where Ayako’s server stands.',
		pin: 'Helsinki',
		unit: 'gateway events per second reach Ayako',
		measured: 'measured',
		live: 'Live',
		liveSpan: 'counted over the last 10 seconds',
		placeholderN: '<N>',
		placeholderDate: '<date>',
		placeholderAside: 'placeholder until the first measurement',
		eachLive: 'Each dark dot is one of the servers Ayako runs on, at its estimated place. Each streak is one of its events on the way to Helsinki, where Ayako’s own server stands.',
		eachStill: 'Each dark dot is one of the servers Ayako runs on, at an estimated place. Each streak is drawn from an estimated place to Helsinki, where Ayako’s own server stands.',
		estimate: 'Every place on the globe is an estimate.',
		methodLink: 'How the places are estimated',
		night: 'The darker side is where it is night right now.',
		// the streaks' three inks (scene.ts): a message, an interaction, everything else
		key: [
			{ ink: 'message', text: 'a message' },
			{ ink: 'interaction', text: 'an interaction' },
			{ ink: 'other', text: 'any other event' }
		],
		// the ring round the globe (scene.ts): every event once more, as a mark on the track of its kind
		ring: 'On the ring every event leaves one more mark, in the field named for its kind, as its streak lands.',
		// the ring's nine fields, in the order of LANES (lanes.ts); "Channels" takes threads too, "Servers" roles, invites and whatever fits no other field
		fields: ['Messages', 'Members', 'Typing', 'Moderation', 'Reactions', 'Voice', 'Channels', 'Servers', 'Commands'],
		ringLast: 'Last:',
		// the scene's two views, and the census's own words (scene.ts)
		viewsLabel: 'View',
		modes: { globe: 'Globe', census: 'Servers' },
		census: {
			servers: 'servers,',
			members: 'members',
			own: 'on Ayako itself',
			fleet: 'across the fleet',
			read: 'read',
			live: 'live',
			each: 'The same dots, laid out by size with the largest in the middle. A dot lights up when its server gets an event. Which dot is which server is shuffled daily.',
			simulated: 'The four sizes are simulated until the real ones are published.',
			// printed with the roster's own figures and the page's own count: "The 54 largest servers hold 80% of all members and sent 52% of the server events since you opened this page."
			hold: { lead: 'The', servers: 'largest servers hold', of: 'of all members', sent: 'and sent', events: 'of the server events since you opened this page.' },
			// the sizes in figures, from the roster; the last column is each size's share of those same events
			table: {
				label: 'Servers and members by server size',
				size: 'Members each',
				servers: 'Servers',
				members: 'Members',
				events: 'Events'
			},
			point: 'Point at a dot to see what is known about its server.',
			// a size step in words, from the roster's own limits: "10,000 or more", "500 to 999", "Fewer than 10";
			// a dot's note adds the unit: "10,000 members or more", "500 to 999 members", "Fewer than 10 members"
			size: { more: 'or more', to: 'to', fewer: 'Fewer than', unit: 'members' },
			// what a dot says when pointed at: a size band, an estimated country and its events. Never a name.
			tip: {
				simulated: '(size simulated)',
				// with real sizes: "One of 54 servers this size, 42,181 members on average."
				among: { lead: 'One of', servers: 'servers this size,', average: 'members on average.' },
				place: 'Estimated place:',
				likely: 'Likely place:',
				event: 'event since you opened this page.',
				events: 'events since you opened this page.',
				last: 'Last:',
				ago: 's ago',
				none: 'No event since you opened this page.'
			},
			fleetLead: 'The fleet is Ayako and twelve satellite bots:',
			// the satellites' own names, from the Gateway's bot descriptions (owner, 2026-11-14: all 13, named)
			satellites: ['Ticketing', 'Economy', 'Custom Roles', 'Confessions', 'Welcome', 'Info', 'AFK', 'Reminders', 'Bump Reminders', 'Giveaways', 'Verification', 'RP']
		},
		turn: 'Turn to',
		views: [
			{ label: 'the Americas', lon: -92 },
			{ label: 'Europe and Africa', lon: 12 },
			{ label: 'Asia', lon: 96 }
		],
		drag: 'or drag it.',
		pause: 'Pause',
		play: 'Play',
		// painted onto the globe itself, in the italic an atlas keeps for water
		seas: [
			{ name: 'Atlantic Ocean', lat: 31, lon: -44 },
			{ name: 'Atlantic Ocean', lat: -24, lon: -16 },
			{ name: 'Pacific Ocean', lat: 27, lon: -152 },
			{ name: 'Pacific Ocean', lat: -26, lon: -118 },
			{ name: 'Indian Ocean', lat: -25, lon: 78 }
		],
		methodTitle: 'How the globe places an event',
		creditSummary: 'Data sources',
		method:
			'Each event is placed by its server’s language where the server has chosen one, spread over the countries that speak it by how many people there use the internet and Discord. A server still on Discord’s default language is placed by where Discord’s users are, and after a day of watching by the hours in which it goes quiet. Every place on the globe is an estimate.',
		// the short credit line of globe-api/ATTRIBUTION.md (2026-10-28), set as sentences
		credit:
			'Locations are estimated from modified GeoNames data and World Bank figures from the ITU, both licensed CC BY 4.0. Modified Unicode CLDR data under the Unicode License v3 says which countries speak which language. Discord’s share of traffic per country is a Similarweb estimate from October 2026, and Germany’s share is a figure Resourcera attributes to Similarweb.'
	},
	more: [
		{
			head: { text: 'IHK final project: a dashboard and gateway-cache service for Discord bots', date: '2025-05 to 2025-06' },
			facts: [{ text: 'Load tested against 7,000 real Discord servers through Ayako’s live token. Company-certified as independently executed.' }] as Fact[],
			links: [{ label: 'discord-bot-dashboard on GitHub', href: gh('Larsundso/discord-bot-dashboard') }] as Link[]
		},
		{
			head: { text: '11 pull requests merged into 8 repositories I do not own', date: '2022-10 to 2024-11' },
			facts: [{ text: 'Among them discord.js and discord-api-types: OAuth2 token revocation, split across both.' }] as Fact[],
			links: [
				{ label: 'discord.js #10440', href: 'https://github.com/discordjs/discord.js/pull/10440' },
				{ label: 'discord-api-types #1050', href: 'https://github.com/discordjs/discord-api-types/pull/1050' }
			] as Link[]
		}
	],
	shelf: {
		summary: 'More projects, and how I work with AI agents',
		ai: 'AI-assisted',
		items: [
			{ name: 'SteamVR-Discord-Overlay', text: 'My Discord voice channel and notifications inside SteamVR, through the local Discord client. C#/.NET 8.', when: '2026-03 to 2026-04', ai: true, href: gh('Larsundso/SteamVR-Discord-Overlay') },
			{ name: 'VRCStreamerDetector', text: 'Tails the VRChat log and flags players in your instance who are live on Twitch, YouTube, Kick or TikTok. Python, FastAPI, SvelteKit.', when: '2026-03 to 2026-05', ai: true, href: gh('Larsundso/VRCStreamerDetector') },
			{ name: 'GIFfer', text: 'A Discord app that turns YouTube, Twitter and MP4 media into GIF or MP4, with trimming and FPS control. Paused.', when: '2025-08 to 2025-09', ai: true, href: gh('Larsundso/GIFfer') },
			{ name: 'Tenor-Bot', text: 'A user-installed Discord app with a /gif picker. Node 22 with zero dependencies.', when: '2026-08', ai: true },
			{ name: 'VRC-Status-Changer', text: 'Sets my VRChat status from rules: voice channel first, then world, then world tag.', when: '2026-05', ai: true },
			{ name: 'top.gg auctions auto-bidder', text: 'A browser extension and dashboard that bids in top.gg’s weekly advertising auctions within set caps.', when: '2026-04', ai: true },
			{ name: 'PG-x-Redis', text: 'Caches PostgreSQL query results in Redis and serves SELECTs from there. MIT, archived.', when: '2022-08 to 2023-10', href: gh('Larsundso/PG-x-Redis') },
			{ name: 'waifu-pics-api and purrbot-api', text: 'Two MIT TypeScript wrappers on npm. I deprecated the first on purpose when its upstream domain expired.', when: '2023-05 to 2026-05', href: gh('Larsundso/waifu.pics') },
			{ name: 'Othello and Shifting-Game', text: 'Solo coursework at the Elektronikschule Tettnang, where optiker, Ticket-Dash and Height-Map were team coursework.', when: '2023-12 to 2024-12', href: gh('Larsundso/Othello') }
		] as { name: string; text: string; when: string; ai?: boolean; href?: string }[],
		aiText: [
			'I work with AI coding agents under rules I set: agents never commit, stage or push, and I write and review every commit myself.',
			'Agent output passes an explicit tsc gate, read-only work is enforced by removing tools, and production changes go one reversible step at a time, with the rollback written before the change.'
		]
	}
};

// FACTS 9: hours only, each with the day it was read, and no percentages. The figures are re-read by
// every build (scripts/waka.mjs) into hours.json; the relief (src/lib/relief) draws them.
export const hours = {
	title: 'Hours',
	// "5,588 hours of coding tracked by WakaTime since 2021-10-29, read 2026-11-16"
	tracked: 'hours of coding tracked by WakaTime since',
	read: 'read',
	viewsLabel: 'Show',
	// the relief's two views, in the order of hours.json: its "languages", then its "projects"
	views: [
		{
			label: 'Languages',
			column: 'Language',
			each: 'Each island is a language.',
			chart: 'A relief chart on which every island is a language, as high as the hours spent in it. The highest are',
			many: 'languages'
		},
		{
			label: 'Projects',
			column: 'Project',
			each: 'Each island is a project.',
			chart: 'A relief chart on which every island is a project, as high as the hours spent on it. The highest are',
			many: 'projects'
		}
	],
	// printed only when more rows count than the chart has room for:
	// "The chart shows the 64 highest of 80 projects, and the table below lists them all."
	shows: { lead: 'The chart shows the', of: 'highest of', all: 'and the table below lists them all.' },
	// printed with the least hours of the reading (scripts/waka.mjs, owner 2026-11-16):
	// "A language or a project counts here only with more than 10 hours."
	least: { lead: 'A language or a project counts here only with more than', tail: 'hours.' },
	// keep the two figures in step with STEP and HEAVY in relief/scene.ts
	height: 'Its summit stands as high as its hours: a thin line for every 250 hours, a heavy one for every 1,000.',
	point: 'Point at an island to read its name and hours, or drag to turn the chart.',
	// printed with the keystroke timeout of the reading: "... every pause longer than 15 minutes."
	method: { lead: 'WakaTime measures the time from activity in the editor and leaves out every pause longer than', tail: 'minutes.' },
	unit: 'h',
	hoursWord: 'hours',
	table: { summary: 'The hours as a table', hours: 'Hours' }
};

// FACTS 4
export const credentials = {
	title: 'Credentials',
	facts: [
		{ text: 'Fachinformatiker für Anwendungsentwicklung (IHK), issued by the IHK Bodensee-Oberschwaben', date: 'summer 2025', de: true },
		{ text: 'In English: Chamber of Industry and Commerce certified IT specialist for application development, a vocational qualification at DQR level 4.' },
		{ text: 'Three-year apprenticeship at Columbus Interactive GmbH, with vocational school at the Elektronikschule Tettnang.', date: '2022-09 to 2025-07' },
		{ text: 'KMK foreign-language certificate, English, Stufe III, which equals CEFR B2.', date: '2025' }
	] as Fact[],
	ihk: { label: 'IHK Bodensee-Oberschwaben', href: 'https://www.ihk.de/bodensee-oberschwaben' }
};

// FACTS 1, 3, 11
export const contact = {
	title: 'Contact',
	values: [
		{ text: 'Queer, and on the left.' },
		{ text: 'No tolerance for intolerance. Moderation is infrastructure, and I have built and run it since 2019.' },
		{ text: 'Plain records over polish. I can show the source for every figure on this page, the unflattering ones included.' }
	] as Fact[],
	roles: { text: 'Administrator rights in 17 Discord communities and moderation rights in 6 more.', date: '2026-10-24' } as Fact,
	interests:
		'Outside code: moderation, community management, gaming, VR and VRChat, Linux, electronics, renovations, fishing, electrics, soldering and cooking.',
	availability:
		'Employed at Raleo and open to TypeScript and Node product work, backend or full-stack, remote or on site in the Bodensee-Oberschwaben region around Lake Constance. My CV comes as a PDF on request.',
	closing: 'If these rules read like home, write to',
	peekAlt: 'Ayako, the bot’s character, peeking over the edge.',
	links: [
		{ label: 'GitHub', href: gh('Larsundso') },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/lars-b%C3%B6se-217272351' },
		{ label: 'XING', href: 'https://www.xing.com/profile/Lars_Boese' }
	] as Link[]
};

export const footer = {
	skip: 'Skip to the facts',
	nav: 'Sections',
	colophon: 'Set in Bricolage Grotesque and Libre Caslon Text, both under the SIL Open Font License 1.1. Coastlines and borders from Natural Earth.'
};
