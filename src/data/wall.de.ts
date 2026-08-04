/**
 * Der Rote Faden — the wall's content as structured data, German edition.
 *
 * Mirrors EVERY named export of `src/data/wall.ts` with identical TypeScript
 * shapes. Figures, ids, hrefs, stacks, logos, and dates come from
 * `~/data/snapshot` exactly like wall.ts (never retyped) — but they are
 * FORMATTED for this locale: German groups with "." and marks decimals with
 * ",", so every figure here runs through the shared helpers with L = "de".
 * "8,357 Servern" would read to a German eye as eight-point-three-five-seven.
 *
 * Voice law (German): gemessen, nüchtern, keine Werbeadjektive; jede Zahl
 * trägt ihre Einheit. Das Messdatum steht einmal
 * (`chartStrings.provenance.convention`); danach wird nur gestempelt, was
 * ein ANDERES Datum trägt. Register: durchgehend du. Brand fixtures stay
 * identical to the English wall: "Werdegang", "heute", the HEUTE stamp,
 * "Der Rote Faden".
 */
import { ai, ayako, github, ihk, SNAPSHOT_AS_OF, telemetry } from "~/data/snapshot";
import { figure, formatHM, millionsPlus } from "~/data/telemetry";
import type {
	AiPracticeEntry,
	Annotation,
	ContactEntry,
	EducationEntry,
	EmploymentEntry,
	HouseRule,
	InkKeyRow,
	ProjectEntry,
	TimelineEntry,
	WallLink
} from "./wall";

/* Shared shapes live in wall.ts; re-export them so both modules present the
 * same type surface to getWall(). */
export type {
	AiPracticeEntry,
	Annotation,
	ContactEntry,
	EducationEntry,
	EmploymentEntry,
	HouseRule,
	InkKeyRow,
	PrideInk,
	ProjectEntry,
	ProjectRole,
	TimelineEntry,
	WallLink
} from "./wall";

/* ------------------------------------------------------------------ */
/* Zahlformat — die Sprache dieser Wand, direkt an der Quelle          */
/* ------------------------------------------------------------------ */

/** Die Locale, für die jede Zahl auf dieser Wand formatiert wird. */
const L = "de" as const;
/** Eine gruppierte Zahl, z. B. 8.357. */
const n = (value: number): string => figure(value, L);
/** Eine Dauer aus Sekunden, z. B. „5.432 h 47 m“. */
const hm = (seconds: number): string => formatHM(seconds, L);
/** Die beiden Produkt-Kennzahlen, einmal formatiert. */
const users = millionsPlus(ayako.users, L);
const servers = n(ayako.servers);
/** Das Verhältnis kommt als fertiger String; nur das Dezimalzeichen dreht. */
const promptRatio = ai.promptRatio.replace(".", ",");

/* ------------------------------------------------------------------ */
/* Page metadata                                                       */
/* ------------------------------------------------------------------ */

export const meta = {
	siteName: "lars-dev.org",
	title: "Lars Böse — Fachinformatiker (IHK) · Full-Stack-Entwickler",
	description:
		`Fachinformatiker für Anwendungsentwicklung (IHK). Ich betreibe einen Discord-Bot mit ` +
		`${users} Nutzern auf ${servers} Servern — allein, seit ${ayako.inProductionSince} ` +
		`im Produktivbetrieb. ${hm(telemetry.lifetime.total.seconds)} erfasste Programmierzeit, ` +
		`Stand ${SNAPSHOT_AS_OF}.`,
	locale: "de",
	person: {
		name: "Lars Böse",
		alternateName: "Larsundso",
		jobTitle: "Full-Stack-Entwickler (Fachinformatiker für Anwendungsentwicklung, IHK)",
		email: "jobs@lars-dev.org",
		addressRegion: "Region Bodensee-Oberschwaben, Baden-Württemberg, Deutschland",
		sameAs: [
			"https://github.com/Larsundso",
			"https://wakatime.com/@Larsundso",
			"https://www.linkedin.com/in/lars-b%C3%B6se-217272351",
			"https://www.xing.com/profile/Lars_Boese",
			"https://profile.indeed.com/p/larsb-2hf1h8b"
		]
	}
} as const;

/* ------------------------------------------------------------------ */
/* Hero cluster                                                        */
/* ------------------------------------------------------------------ */

export const hero = {
	/** Brand fixture — die handschriftliche Begrüßung. */
	greeting: "Hi, ich bin Lars",
	greetingSubline: "seit Dezember 2019",
	/** Lottie asset for the handwritten greeting. */
	lottieAsset: "src/assets/Hi.json",
	name: "Lars Böse",
	signature: "Lars Boese",
	handle: "Larsundso",
	/** Typed intro card. */
	intro: [
		"Fachinformatiker für Anwendungsentwicklung (IHK) und Full-Stack-Entwickler bei der Raleo Digital GmbH, remote.",
		`Ich betreibe einen Discord-Bot mit ${users} Nutzern auf ${servers} Servern — allein, seit ${ayako.inProductionSince} im Produktivbetrieb.`
	],
	location: "Region Bodensee-Oberschwaben, Deutschland — vollständig remote.",
	languages: "Deutsch (Muttersprache) · Englisch (Arbeitssprache)",
	/** Ayako polaroid pinned beside the greeting — the product, not a
	 *  portrait: the label names it, the caption measures it. */
	polaroid: {
		image: "/Ayako.webp",
		alt: "Ayakos Avatar — die gezeichnete Figur, die als Logo des Discord-Bots dient: orangefarbenes Haar, grüne Augen, spitze Ohren.",
		/** Printed as the caption's first line: what this artifact is. */
		label: "Ayako — mein Discord-Bot",
		caption: `${users} Nutzer · ${servers} Server · ${ayako.rating.value} auf ${ayako.rating.platform}`,
		annotation: {
			text: "Rufbereitschaft: ich",
			ink: "magenta"
		} satisfies Annotation
	},
	/** Hand-annotated telemetry print-out. */
	telemetryCard: {
		title: "Erfasst, nicht geschätzt",
		/* siehe wall.ts: das Ergebnis zuerst, die Stunden als Beleg darunter */
		lines: [
			`Seit ${ayako.inProductionSince} im Produktivbetrieb — über ${ayako.generations} Generationen und ${ayako.discordLibraries} Discord-Bibliotheken hinweg.`,
			`${hm(telemetry.lifetime.total.seconds)} erfasste Programmierzeit dahinter, Stand ${SNAPSHOT_AS_OF}.`,
			`${n(telemetry.lifetime.activeDays.active)} von ${n(telemetry.lifetime.activeDays.elapsed)} Tagen aktiv — ${n(telemetry.lifetime.activeDays.ratePercent)} %, ${telemetry.trackingStart} bis ${telemetry.trackingEnd}.`
		],
		sourceNote: "WakaTime API",
		annotation: {
			text: "die 164 Tage ohne Code sind mitgezählt",
			ink: "teal"
		} satisfies Annotation
	},
	/** The pinned primary action. */
	primaryAction: {
		label: "An jobs@lars-dev.org schreiben",
		href: "mailto:jobs@lars-dev.org",
		annotation: { text: "diese Adresse erreicht mich direkt", ink: "blue" } satisfies Annotation
	},
	/** Thread endpoint stamps — the HEUTE stamp is a brand fixture. */
	threadStart: { stamp: "12/2019", label: "Dezember 2019 — der erste Pin" },
	threadEnd: { stamp: "HEUTE", label: "der Stich von heute" }
} as const;

/* ------------------------------------------------------------------ */
/* Timeline — the red thread, December 2019 to today                   */
/* ------------------------------------------------------------------ */

export const timeline: TimelineEntry[] = [
	{
		id: "start-2019",
		dateLabel: "12/2019",
		sort: "2019-12",
		title: "Der erste Pin",
		body: [
			"Dezember 2019. Ayako beginnt als einzelne JavaScript-Datei. Läuft seitdem ununterbrochen.",
			`GitHub-Account seit ${github.accountCreated}.`
		],
		annotation: { text: "eine Datei, kein Plan, keine Nutzer", ink: "green" }
	},
	{
		id: "angel-bots-era",
		dateLabel: "2021–2022",
		sort: "2021-10",
		title: "Die Bot-Jahre",
		body: [
			`${telemetry.trackingStart}: Ab hier zeichnet WakaTime auf — seither ohne Lücke.`,
			"Die Angel-Bots-Ära: Discord-Bots in JavaScript, jeder für genau eine Aufgabe — daher stammt der Großteil des JavaScripts in der Aufzeichnung " +
				`(${n(telemetry.lifetime.languages[1].hours)} h insgesamt).`
		],
		annotation: {
			text: `TypeScript: ${n(github.typescriptByteSharePercent.in2021)} % der gepushten Code-Bytes 2021 → ${n(github.typescriptByteSharePercent.in2026)} % in 2026 gepushten Repos`,
			ink: "violet"
		}
	},
	{
		id: "apprenticeship-2022",
		dateLabel: "09/2022",
		sort: "2022-09",
		title: "Drei Jahre bei der Columbus Interactive GmbH",
		body: [
			`${ihk.apprenticeship.start}: drei Jahre angestellt bei ${ihk.trainingCompany}, in Ausbildung zum ${ihk.profession} (IHK, Fachrichtung Anwendungsentwicklung, DQR-Niveau 4).`,
			`${ihk.weeklyReports} gegengezeichnete wöchentliche Ausbildungsnachweise, Nr. 0–71 — jeder einzelne von jemand anderem gelesen und unterschrieben. Berufsschule: Elektronikschule Tettnang. Abschlussprüfung: ${ihk.apprenticeship.examCycle}.`
		]
	},
	{
		id: "ihk-final-project-2025",
		dateLabel: "05/2025",
		sort: "2025-05",
		title: `IHK-Abschlussprojekt: »${ihk.finalProject.title}«`,
		body: [
			`Der Ausbildungsbetrieb hat die Arbeit beurteilt: als »selbstständig ausgeführt« abgezeichnet, unterschrieben am 2025-06-01. ${ihk.finalProject.hours} h, ${ihk.finalProject.window.start} bis ${ihk.finalProject.window.end}.`,
			`Unter Last gemessen: ${n(ihk.finalProject.loadTestServers)} simulierte Discord-Server.`
		],
		annotation: { text: "80 h ist die Obergrenze, die die IHK für das Projekt setzt", ink: "teal" }
	},
	{
		id: "raleo-2025",
		dateLabel: "2025",
		sort: "2025-06",
		title: "Raleo Digital GmbH",
		body: [
			"Seit 2025: Full-Stack-Entwickler bei der Raleo Digital GmbH (raleo.de), einem Online-Marktplatz für Heizungen, Wärmepumpen und Photovoltaik. Vollständig remote — das zweite Unternehmen an diesem Faden."
		]
	},
	{
		id: "current",
		dateLabel: "HEUTE",
		sort: "2026-08",
		title: "Der Stich von heute",
		body: [
			`Juli 2026: ${hm(telemetry.windowJuly2026.dailyAverage.seconds)} erfasste Programmierzeit pro Tag. Bester Einzeltag: ${hm(telemetry.lifetime.bestDay.seconds)} am ${telemetry.lifetime.bestDay.date}.`,
			`Der Ayako-v3-Rewrite ist in aktiver Entwicklung: ${ayako.v3.commits} Commits, ${ayako.v3.featurePlugins} Feature-Plugins, ${ayako.v3.testFiles} Testdateien direkt neben dem Code.`
		],
		annotation: { text: "der erste Pin und dieser sind derselbe Bot", ink: "green" }
	}
];

/* ------------------------------------------------------------------ */
/* Career print-outs (lifetime window)                                 */
/* ------------------------------------------------------------------ */

export const careerStats = {
	title: "Werdegang in Zahlen",
	asOf: SNAPSHOT_AS_OF,
	sourceNote: "WakaTime-API-Abruf",
	lines: [
		`${hm(telemetry.lifetime.total.seconds)} erfasste Programmierzeit.`,
		`TypeScript: ${n(telemetry.lifetime.languages[0].hours)} h — ${n(telemetry.lifetime.languages[0].percent)} % der erfassten Zeit.`,
		`${telemetry.lifetime.projectsTracked} Projekte · ${telemetry.lifetime.languagesTracked} Sprachen · ${n(telemetry.lifetime.dependenciesTracked)} Abhängigkeiten erfasst.`,
		`${n(telemetry.lifetime.remoteSshPercent)} % der Programmierzeit auf Remote-Servern über SSH; ${n(telemetry.lifetime.linuxInclWslPercent)} % der OS-Zeit unter Linux (inkl. WSL).`
	]
} as const;

export const githubStats = {
	title: "GitHub-Bilanz",
	asOf: SNAPSHOT_AS_OF,
	sourceNote: "Authentifizierter GitHub-Abruf",
	lines: [
		`${n(github.contributions.lifetime)} Beiträge seit ${github.accountCreated} — Spitzenjahr ${github.contributions.peakYear.year}: ${n(github.contributions.peakYear.contributions)}; letzte 12 Monate: ${n(github.contributions.rolling12Months)}.`,
		`${github.pullRequestsAuthored} Pull Requests insgesamt verfasst. Upstream gemerged in ${github.mergedUpstream.join(", ")}.`
	]
} as const;

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export const projects: ProjectEntry[] = [
	{
		id: "ayako",
		name: "Ayako",
		role: "flagship",
		oneLiner:
			"Multifunktionaler Discord-Bot, allein gebaut und betrieben, seit 2019 im Produktivbetrieb.",
		body: [
			"Ich entwerfe, baue, deploye und betreibe Ayako allein: Anwendungscode, Datenbank, Cache, Sharding, Metriken und Deployment.",
			`Der v3-Rewrite zerlegt den Monolithen in Redis-gebundene Prozesse, während v2 weiterläuft: Ein Bun-Gateway nimmt den Discord-Websocket entgegen und verteilt per Pub/Sub an ${ayako.v3.featurePlugins} eigenständige Feature-Plugins; Timer sind an die Redis-Keyspace-Expiry delegiert.`
		],
		facts: [
			`${servers} Server · ${users} Nutzer · ${ayako.rating.value} auf ${ayako.rating.platform}, Stand ${SNAPSHOT_AS_OF}.`,
			`Monorepo-weit: ${n(ayako.monorepo.files)} Quelldateien, ${n(ayako.monorepo.linesOfCode)} Zeilen Code (TypeScript, Svelte, Rust).`,
			`${ayako.workspace.packagesAndApps} Packages und Apps · ${ayako.workspace.dockerComposeServices} Docker-Compose-Services · ${ayako.workspace.prismaModels} Prisma-Modelle.`,
			`${n(telemetry.lifetime.ayakoFamily.hours)} h über ${ayako.generations} Generationen und ${ayako.discordLibraries} Discord-Bibliotheken — ${n(telemetry.lifetime.ayakoFamily.percent)} % der gesamten erfassten Programmierzeit.`,
			`${n(github.ayakoAuthorship.v2Percent)} % der v2-Commits auf dem Default-Branch selbst verfasst (${n(github.ayakoAuthorship.v2Commits.own)} von ${n(github.ayakoAuthorship.v2Commits.total)}).`,
			`v3: ${ayako.v3.commits} Commits, 100 % selbst verfasst · ${ayako.v3.featurePlugins} Feature-Plugins · ${ayako.v3.testFiles} Testdateien direkt neben dem Code.`
		],
		stack: [
			"TypeScript",
			"discord.js 14",
			"@discordjs/core",
			"discord-hybrid-sharding",
			"Prisma",
			"PostgreSQL 16",
			"Redis 7",
			"Rust → WASM",
			"Prometheus · Grafana",
			"Docker Compose",
			"SvelteKit",
			"Node ≥24 · Bun"
		],
		links: [
			{ label: "ayakobot.com", href: "https://ayakobot.com" },
			{ label: "GitHub: AyakoBot", href: "https://github.com/AyakoBot" },
			{ label: "top.gg-Eintrag", href: ayako.topGgUrl }
		],
		license: `v2 ${ayako.license.v2} · v3 ${ayako.license.v3}`,
		/** Public promise, made in English — quoted verbatim, never translated. */
		promise: ayako.freeForeverPromise,
		promiseNote:
			"Auf Deutsch: „Eine Funktion, die ich nicht kostenlos anbieten kann, wird nicht umgesetzt.“ Ayako ist kostenlos — das gilt seit 2019, und dabei bleibt es.",
		logo: "/Ayako.webp",
		annotation: {
			text: "jeden Ausfall seit 2019 habe ich selbst behoben",
			ink: "magenta"
		}
	},
	{
		id: "discord-bot-dashboard",
		name: "discord-bot-dashboard",
		role: "portfolio",
		oneLiner:
			"Das IHK-Abschlussprojekt als öffentliches Repo: ein Web-Dashboard plus Gateway-Cache-Microservice für Discord-Bots.",
		body: [
			"Support-Mitarbeitende authentifizieren sich mit dem Token einer Discord-Anwendung und prüfen Berechtigungskonfiguration, Rollen und Kanäle über alle ihre Server hinweg — Echtzeit-UI über Server-Sent Events, getragen von einer typisierten Redis-Cache-Schicht und einem Bot-Backend mit Sharding."
		],
		facts: [
			`${ihk.finalProject.hours} h, ${ihk.finalProject.window.start} bis ${ihk.finalProject.window.end} — vom Ausbildungsbetrieb als »selbstständig ausgeführt« abgezeichnet.`,
			`Lasttest mit ${n(ihk.finalProject.loadTestServers)} simulierten Discord-Servern (Projektdokumentation, 2025-06).`,
			"<5 s Erstladezeit bei 100 Servern · <200 ms Serverwechsel · >95 % Cache-Trefferquote · konstant 30 FPS (Projektdokumentation, 2025-06).",
			`${ihk.finalProject.code.typescript.files} TypeScript-Dateien (${n(ihk.finalProject.code.typescript.linesOfCode)} LOC) + ${ihk.finalProject.code.svelte.files} Svelte-Dateien (${n(ihk.finalProject.code.svelte.linesOfCode)} LOC).`,
			`${n(ihk.finalProject.trackedHours)} h auf dem Repo erfasst.`
		],
		stack: [
			"SvelteKit",
			"Svelte 5",
			"UnoCSS",
			"TypeScript",
			"Redis pub/sub",
			"Server-Sent Events",
			"@discordjs/core",
			"Prometheus",
			"Docker Compose"
		],
		links: [{ label: "GitHub: discord-bot-dashboard", href: ihk.finalProject.repoUrl }],
		annotation: { text: "du kannst die Prüfungsarbeit klonen und selbst laufen lassen", ink: "teal" }
	},
	{
		id: "kiyu",
		name: "Kiyu",
		role: "portfolio",
		oneLiner:
			"Zweiter Discord-Bot im Produktivbetrieb, private Codebasis: Giveaways mit Teilnahmebedingungen (Nachrichten, Voice-Minuten), Willkommens-Flows, Logging, Booster-Tracking, Embed-Builder, Online-Peak-Statistiken.",
		body: [
			"Läuft auf Hybrid-Sharding mit einem eigenen V8-Speichermonitor: Heap-Sampling alle 30 Sekunden mit Garbage-Collection-Trigger bei 85 %."
		],
		facts: [
			/* Fremdzitat: die Angabe des Repos, unverändert übernommen. */
			"Eigenangabe „10,000+ servers“ — Repo-Metadaten, nicht verifiziert.",
			`332 Dateien · ${n(17_250)} LOC · 128 Commits, 100 % selbst verfasst.`,
			"Aktiv bis 2026-06."
		],
		stack: ["TypeScript", "discord.js 14", "Prisma", "discord-hybrid-sharding", "socket.io"],
		links: [],
		annotation: {
			text: "privater Code — den Rest musst du mir also auch glauben",
			ink: "amber"
		}
	},
	{
		id: "vr-discord-vc-overlay",
		name: "VR-Discord-VC-Overlay",
		role: "vr",
		oneLiner:
			"SteamVR-Overlay in C#/.NET 8, das den Discord-Voice-Status im Headset rendert — mit interaktivem Mute und Deafen.",
		body: [
			"Discord RPC direkt über die lokale IPC-Pipe implementiert — ohne Bot-Token. Ausgeliefert als einzelne self-contained Executable mit Lizenz, Datenschutzerklärung, Nutzungsbedingungen und Release-Workflow."
		],
		facts: [`${n(4_059)} LOC in 15 Dateien.`],
		stack: ["C#/.NET 8", "SkiaSharp", "DirectX 11 (Vortice)", "OpenVR", "Kestrel", "WebSocket"],
		links: []
	},
	{
		id: "vrc-inviter",
		name: "VRC-Inviter",
		role: "vr",
		oneLiner: "Windows-Tray-Dienst, der VRChat-Einladungen automatisch nach Vorrangregeln annimmt.",
		body: [
			"Spec-first: Das Designdokument trägt das Datum 2026-04-16 — geschrieben vor der Implementierung. DPAPI-verschlüsselte Zugangsdaten, ein Web-Dashboard nur auf Loopback, SQLite-Persistenz."
		],
		facts: [`${n(4_481)} LOC in 55 Dateien · xUnit-Suite mit 7 Modulen.`],
		stack: ["C#/.NET 8", "Svelte 5", "SQLite", "xUnit", "Kestrel"],
		links: []
	},
	{
		id: "vrc-status-changer",
		name: "VRC-Status-Changer",
		role: "vr",
		oneLiner:
			"Setzt den VRChat-Profilstatus aus Live-Signalen in Prioritätsfolge: Discord-Voice-Status, dann World-ID, dann World-Tag.",
		body: [
			"Der Discord-IPC-RPC-Client — inklusive OAuth-Handshake und Frame-Protokoll — ist von Hand geschrieben, nicht aus einer Bibliothek übernommen."
		],
		facts: [`${n(2_436)} LOC in 36 Dateien · vitest-Suite mit undici MockAgent.`],
		stack: ["TypeScript", "Node.js", "vitest"],
		links: []
	},
	{
		id: "vrchat-speech-assistant",
		name: "VRChatSpeechAssistant",
		role: "vr",
		oneLiner:
			"Desktop-App aus drei Prozessen für KI-Sprache in VRChat in Echtzeit: Electron/React-Frontend, Python-FastAPI-Backend, SteamVR-Overlay.",
		body: [
			"Sprache wird lokal mit Faster-Whisper erkannt und über OSC an die VRChat-Chatbox geleitet; das Overlay rendert Dashboard-, HUD- und Handgelenks-Ansichten im Headset."
		],
		facts: [`${n(32_427)} LOC in 121 Dateien · 15 Backend-Service-Module · 19 Testdateien.`],
		stack: ["Python", "FastAPI", "Faster-Whisper", "Electron", "React", "OpenVR", "WebSocket", "OSC"],
		links: []
	},
	{
		id: "giffer",
		name: "GIFfer",
		role: "portfolio",
		oneLiner:
			"Öffentliche, von Nutzern installierbare Discord-App, die Videos und YouTube-URLs zu GIF oder MP4 konvertiert — mit Trimmen und FPS-Steuerung.",
		body: [
			"Geführt wie ein echtes Open-Source-Projekt: striktes TypeScript, Kompression mit SSH/HTTP-Upload-Fallback, Docker-Packaging und eine SECURITY.md."
		],
		facts: [`${n(3_264)} LOC striktes TypeScript in 75 Dateien.`],
		stack: ["TypeScript", "ffmpeg", "youtube-dl-exec", "SWC", "Docker"],
		links: [],
		license: "CC BY-NC 4.0"
	}
];

/** Breadth — single typed lines pinned low on the wall. */
export const breadth: { text: string; link?: WallLink }[] = [
	{
		text:
			"lars-dev.org — diese Seite: Astro 5, Svelte 5, UnoCSS auf Cloudflare. Die zentralen Kennzahlen werden zur Build-Zeit von der WakaTime-API geholt, mit einem eingecheckten Snapshot (datiert " +
			`${SNAPSHOT_AS_OF}) als Fallback.`
	},
	{
		text: "waifu-pics-api — MIT-lizenzierter npm-Wrapper für die Bild-API von waifu.pics. Das letzte Release schlägt seit dem Auslaufen der Upstream-Domain beim Import bewusst fehl, statt leere Daten zu liefern. Deprecated am 2026-05-07.",
		link: { label: "npm", href: "https://www.npmjs.com/package/waifu-pics-api" }
	},
	{
		text: `vr-diag — drei forensische PowerShell-Skripte (${n(1_202)} LOC): VR-Crash-Forensik über Event-Logs, WHEA und Minidumps; ein VR-Lag-Monitor; ein Bugcheck-Analyzer. 48 erfasste Lauf-Datensätze.`
	},
	{
		text: "Restart-VR.bat — idempotenter Windows-Batch-Orchestrator, der einen VR-Streaming-Stack über tasklist, CIM und UDP-Port-Probes hochfährt."
	},
	{
		text: "Kfz-Elektronik — Kamera-Einbau und eine 12 V LiFePO₄ Zweitbatterie nachgerüstet in einem Smart 450; Höhenkarte per ESP8266 + MQTT."
	}
];

/* ------------------------------------------------------------------ */
/* AI practice — subordinate placement by owner decision               */
/* ------------------------------------------------------------------ */

export const aiPractice = {
	/** Owner: "not what I want to be hired for exclusively." */
	placement: "subordinate",
	title: "Wie ich mit Agenten arbeite",
	intro:
		"Agenten übernehmen einen großen Teil der Tipparbeit. Hier sind die Zahlen — und die Regeln, unter denen sie laufen.",
	entries: [
		{
			id: "volume",
			title: "Volumen",
			lines: [
				`${n(ai.transcripts.count)} Claude-Code-Transkripte (${ai.transcripts.sizeMb} MB, ${n(ai.transcripts.events)} protokollierte Events) über ${ai.transcripts.days} Tage, ${ai.transcripts.window.start} bis ${ai.transcripts.window.end} — ${n(ai.sessionsPerDay)} Top-Level-Sessions pro Tag.`,
				`Session-Indizes belegen die Nutzung seit mindestens ${ai.transcripts.evidencedSince}.`
			]
		},
		{
			id: "orchestration",
			title: "Orchestrierung",
			lines: [
				`${n(ai.subagentShare.percent)} % der Transkripte (${n(ai.subagentShare.count)} von ${n(ai.subagentShare.of)}) sind Subagenten- und Workflow-Läufe, verschachtelt unter übergeordneten Sessions.`,
				`Prompt-zu-Antwort-Verhältnis in der Stichprobe: ${promptRatio} — lange autonome Läufe, ab und zu nachgesteuert.`,
				"Mehrere Sessions laufen gleichzeitig auf einem Checkout, nach schriftlichen Konventionen: atomare Claim-Locks für geteilte Logs, Commits per Pathspec gegen Index-Races, mtime-basierte Attributionsprüfung vor jedem Revert."
			]
		},
		{
			id: "adoption",
			title: "Gemessene Adoptionskurve",
			lines: [
				`AI-Coding-Anteil an der erfassten Zeit: ${n(telemetry.aiCoding.sharePercentByWindow.lifetime)} % Gesamtzeitraum → ${n(telemetry.aiCoding.sharePercentByWindow.last12Months)} % letzte 12 Monate → ${n(telemetry.aiCoding.sharePercentByWindow.july2026)} % Juli 2026 → ${n(telemetry.aiCoding.sharePercentByWindow.last7Days)} % letzte 7 Tage. ${hm(telemetry.aiCoding.lifetime.seconds)} insgesamt.`,
				`Claude Code: ${n(telemetry.windowJuly2026.claudeCodeEditorPercent)} % der Editor-Zeit im Juli 2026.`,
				`Markdown stieg von ${n(telemetry.lifetime.markdownPercent)} % der Sprachzeit im Gesamtzeitraum auf ${n(telemetry.windowJuly2026.markdownPercent)} % im Juli 2026 — die Signatur spezifikationsgetriebener, agentischer Arbeit.`
			]
		},
		{
			id: "governance",
			title: "Governance",
			lines: [
				"Agenten committen, stagen und pushen nie — jeden Commit prüfe und verfasse ich selbst.",
				"Read-only erzwinge ich, indem ich die Werkzeuge wegnehme. Ein Prompt, der höflich bittet, ist keine Kontrolle. Agenten-Output muss durch ein explizites tsc-Gate, weil eine Pipeline grün sein kann, während tsc fehlschlägt.",
				"Produktionsänderungen: ein umkehrbarer Schritt nach dem anderen, Rollback im selben Zug wie jede Mutation, Blast-Radius-Prüfung nach jeder Änderung."
			],
			annotation: { text: "Regeln, geschrieben nach Vorfällen, nicht davor", ink: "violet" }
		},
		{
			id: "memory-tooling",
			title: "Gedächtnis und Tooling",
			lines: [
				`Persistentes Gedächtnis über Sessions hinweg: ${ai.memory.notes} kuratierte Notizen in ${ai.memory.projectContexts} Projektkontexten, jede mit typisiertem Frontmatter und einem verpflichtenden „Why“.`,
				`Eine schriftliche Kostenrichtlinie schickt Implementierung und Recherche an günstigere Modelle, Review an das stärkste; ${ai.modelGenerations} Modellgenerationen innerhalb von drei Monaten im Einsatz.`,
				`${ai.installed.skills} installierte Skills, ${ai.installed.plugins} Plugins und eine Community-Agentenbibliothek mit ${ai.installed.communityAgentDefinitions} Definitionen. Den Skill zur Link-Verifikation und den Diagramm-Skill habe ich selbst geschrieben, den Rest installiert.`,
				"Vor Code, der Bibliotheken berührt, steht ein Abruf der aktuellen Dokumentation (Context7 MCP); die Repos führen Architektur-Karten und datierte Spec-Dokumente — geschrieben für Agenten und Entwickler gleichermaßen."
			]
		}
	] satisfies AiPracticeEntry[]
} as const;

/* ------------------------------------------------------------------ */
/* House rules — values card, handwritten                              */
/* ------------------------------------------------------------------ */
/* Jede Regel: eine Schlagzeile in Displaygröße plus ein tragender Satz.
 * Die Haltung wird gesagt, nicht verteidigt. */

export const houseRules = {
	title: "Hausregeln",
	/** Handwritten card (Shantell Sans); one pride ink per rule. */
	rules: [
		{
			headline: "Queer, und links.",
			text: "Die sechs Tinten an dieser Wand sind meine Arbeitsfarben, mit Absicht gewählt.",
			ink: "magenta"
		},
		{
			headline: "Keine Toleranz für Intoleranz.",
			text: "Moderation ist Infrastruktur, und ich baue und betreibe sie seit 2019.",
			ink: "violet"
		},
		{
			headline: "Klare Aufzeichnungen statt Hochglanz.",
			text: "Zu jeder Zahl hier kann ich die Quelle zeigen — auch zu denen, die mir nicht schmeicheln.",
			ink: "teal"
		},
		{
			headline: "Wenn sich diese Regeln nach Zuhause anfühlen:",
			text: "Schreib an jobs@lars-dev.org.",
			ink: "blue"
		}
	] satisfies HouseRule[]
} as const;

/* ------------------------------------------------------------------ */
/* Die Tintenlegende — die Wand nennt ihren eigenen Code               */
/* ------------------------------------------------------------------ */
/* Die sechs Aufgaben der Annotation Ink Rule, in ihren Worten und ihrer
 * Reihenfolge. Die Zeilen benennen, was eine Tinte BEDEUTET; der Farbton
 * wird gezeigt, nie ausgeschrieben. `q` nennt die Frage der Lesenden, die
 * die Tinte beantwortet — eine Legende, die nur Kategorien von innen
 * benennt, erklärt nichts. Die Überschrift ist die eine Handschrift-Zeile
 * der Wand in schlichter Tinte — sie beschriftet den Code und darf ihn
 * deshalb nicht tragen. */

export const inkKey = {
	title: "die Tinte sagt, was die Notiz behauptet",
	rows: [
		{ ink: "magenta", job: "meins allein", q: "wem gehört das, und wie groß ist es?" },
		{ ink: "violet", job: "die Arbeitsweise", q: "wie wird gearbeitet?" },
		{ ink: "teal", job: "die Herkunft", q: "woher weißt du das?" },
		{ ink: "green", job: "was noch läuft", q: "seit wann, und läuft es noch?" },
		{ ink: "amber", job: "die Grenze", q: "wo hört diese Aussage auf?" },
		{ ink: "blue", job: "der Weg zu mir", q: "was mache ich als Nächstes?" }
	] satisfies InkKeyRow[]
} as const;

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
	title: "Schreib mir",
	email: "jobs@lars-dev.org",
	/** Was er tatsächlich sucht — vom Eigentümer freigegeben, und die
	 *  einzige Stelle der Wand, die es sagt. Keine Kündigungsfrist: es
	 *  wurde keine genannt. */
	rightNow: {
		title: "Aktuell",
		lines: [
			"Seit 2025 Full-Stack-Entwickler bei der Raleo Digital GmbH. Kein dringender Wechselwunsch.",
			"Offen für Produktarbeit mit TypeScript/Node — Backend oder Full-Stack. Erzähl mir davon.",
			"Remote, oder vor Ort im Raum Bodensee-Ravensburg.",
			"Jede Mail an diese Adresse wird beantwortet."
		]
	},
	entries: [
		{
			id: "email",
			label: "E-Mail",
			value: "jobs@lars-dev.org",
			href: "mailto:jobs@lars-dev.org",
			primary: true
		},
		{ id: "github", label: "GitHub", value: "Larsundso", href: "https://github.com/Larsundso" },
		{
			id: "linkedin",
			label: "LinkedIn",
			value: "Lars Böse",
			href: "https://www.linkedin.com/in/lars-b%C3%B6se-217272351"
		},
		{
			id: "xing",
			label: "XING",
			value: "Lars Boese",
			href: "https://www.xing.com/profile/Lars_Boese"
		},
		{
			id: "indeed",
			label: "Indeed",
			value: "Lars B.",
			href: "https://profile.indeed.com/p/larsb-2hf1h8b"
		},
		{
			id: "wakatime",
			label: "WakaTime",
			value: "Larsundso",
			href: "https://wakatime.com/@Larsundso"
		}
	] satisfies ContactEntry[]
} as const;

/* ------------------------------------------------------------------ */
/* Employment & education                                              */
/* ------------------------------------------------------------------ */

export const employment: EmploymentEntry[] = [
	{
		id: "raleo",
		company: "Raleo Digital GmbH",
		role: "Full-Stack-Entwickler",
		start: "2025",
		end: null,
		note: "raleo.de — Online-Marktplatz für Heizungen, Wärmepumpen und Photovoltaik. Vollständig remote.",
		logo: "/raleo-initials.svg",
		logoNote:
			"No logo asset exists in public/. Generate an initials SVG ('R', paper/ink palette) at public/raleo-initials.svg before shipping."
	},
	{
		id: "columbus",
		company: "Columbus Interactive GmbH",
		role: "Auszubildender Fachinformatiker für Anwendungsentwicklung",
		start: "2022-09",
		end: "2025",
		note: `Ravensburg. Drei Jahre angestellt im dualen IHK-System; ${ihk.weeklyReports} gegengezeichnete wöchentliche Ausbildungsnachweise; Abschlussprüfung ${ihk.apprenticeship.examCycle}.`,
		logo: "/CI.webp"
	}
];

export const education: EducationEntry[] = [
	{
		id: "apprenticeship",
		institution: "IHK-Ausbildung — Fachinformatiker für Anwendungsentwicklung",
		detail: `Fachrichtung Anwendungsentwicklung, DQR-Niveau 4. Ausbildungsbetrieb: ${ihk.trainingCompany}. IHK-Abschlussprojekt »${ihk.finalProject.title}«, vom Betrieb als »selbstständig ausgeführt« abgezeichnet.`,
		start: "2022-09",
		end: "2025",
		logo: "/CI.webp"
	},
	{
		id: "est",
		institution: "Elektronikschule Tettnang",
		detail: "Berufsschule der Ausbildung.",
		start: "2022-09",
		end: "2025-07",
		logo: "/EST.webp"
	},
	{
		id: "bfe",
		institution: "Einjährige Berufsfachschule für Elektrotechnik",
		start: "2019-08",
		end: "2020-02",
		logo: "/GSR.webp"
	},
	{
		id: "tg",
		institution: "Technisches Gymnasium Ravensburg",
		start: "2018-08",
		end: "2018-10",
		logo: "/GSR.webp"
	},
	{
		id: "konrad",
		institution: "BZ St. Konrad Ravensburg",
		start: "2010-04",
		end: "2018-07",
		logo: "/Konrad.webp"
	}
];

/* ------------------------------------------------------------------ */
/* UI strings — shared interface contract                              */
/* ------------------------------------------------------------------ */

export const ui = {
	nav: {
		werdegang: "Werdegang",
		projects: "Projekte",
		telemetry: "Telemetrie",
		practice: "Wie ich arbeite",
		contact: "Kontakt"
	},
	skipLink: "Zum Inhalt springen",
	backToTop: "Nach oben",
	navAria: "Abschnitte",
	langSwitch: { label: "English", aria: "This page in English", href: "/", hreflang: "en" },
	opensNewTab: "(öffnet in neuem Tab)",
	footerLine: null as string | null
} as const;

/* ------------------------------------------------------------------ */
/* Section stragglers — copy hardcoded in section markup until i18n    */
/* ------------------------------------------------------------------ */
/* Mirrors wall.ts `sectionStrings` key for key; figures and dates
 * verbatim. */

export const sectionStrings = {
	/** Stamp sub-line above an as-of date, e.g. "Stand / 2026-08-03". */
	asOfStamp: "Stand",
	timeline: {
		/** Handschriftlicher Zettel neben dem Werdegang-Flyer. Er zählt die
		 *  Arbeitgeber, denn wer sie nicht zählt, liest diesen Abschnitt als
		 *  eine Stelle und ein Zeugnis. */
		headNote: "zwei Arbeitgeber seit 2022 — Beruf und Ausbildung, der Reihe nach aufgefädelt.",
		/** Education card date line while ongoing, e.g. "seit 2022-09". */
		since: (start: string) => `seit ${start}`,
		/** Flagship card: prefix of the stack line. */
		stackLabel: "Stack:",
		/** Flagship card: performance figures + provenance suffix. */
		perfLine: (figures: string) => `${figures} — Projektdokumentation, 2025-06.`
	},
	projects: {
		ayakoAlt: "Ayako, der Discord-Bot",
		v3Title: "Ayako v3 — der Rewrite",
		licenseLabel: "Lizenz:",
		vrBenchTitle: "Die VR-Werkbank",
		vrBenchNote: "Desktop-Tools für das Headset, das ich selbst trage",
		vrSketchCaption: "Wireframe-Headset, in three.js skizziert — zum Drehen ziehen",
		vrSketchAria:
			"Wireframe-Skizze eines VR-Headsets. Zum Drehen ziehen oder die Pfeiltasten drücken.",
		breadthTitle: "Auch angepinnt"
	},
	contact: {
		/** Handwritten note above the mailto pin. */
		annotation: "Die einzige Adresse, die ich veröffentliche."
	}
} as const;

/* ------------------------------------------------------------------ */
/* Chart strings — every display string getCharts.ts renders           */
/* ------------------------------------------------------------------ */
/* Mirrors wall.ts `chartStrings`: identical keys and signatures.
 * Number and date FIGURES arrive preformatted; units stay h / % / m;
 * dates stay ISO. */

/** Das Stand-Datum entfällt, wenn das Fenster davor ohnehin auf diesem
 *  Datum endet — die Wand nennt ihr Messdatum einmal. */
const asOfSuffix = (window: string, asOf: string): string =>
	window.includes(asOf) ? "" : ` · Stand ${asOf}`;

/* Die Überschriften nennen das ERGEBNIS, für das die Stunden draufgingen;
 * die Stunden belegen es in der Zeile darunter. Eine Überschrift, die ihre
 * eigene Achse benennt („Top-5-Projekte“), macht aus dem Blatt eine
 * Aussage über Fleiß — genau die Lesart, die diese Wand nicht will.
 * Interessant ist, was herauskam: ein Produkt, seit 2019 im
 * Produktivbetrieb, über sieben Generationen und drei Discord-Bibliotheken. */

export const chartStrings = {
	titles: {
		topProjects: (count: number) =>
			`Produktarbeit seit ${ayako.inProductionSince} — die Top ${count} nach erfassten Stunden`,
		ayakoFamily: `Ein Produkt, ${ayako.generations} Generationen, seit ${ayako.inProductionSince} im Produktivbetrieb`,
		topLanguages: (count: number) =>
			`Eine Sprachfamilie trägt das Produkt — Top ${count} nach erfassten Stunden`,
		weekByProject: "Woran gerade gebaut wird — nach Projekt",
		weekByLanguage: "Woran gerade gebaut wird — nach Sprache",
		activeDays: "Tage, an denen Code entstanden ist"
	},
	/** Unit + window lines (voice law). */
	units: {
		lifetimeHours: (window: string, asOf: string) =>
			`Erfasste Zeit in Stunden · Gesamtzeitraum ${window}${asOfSuffix(window, asOf)}`,
		lifetimeShare: (window: string, asOf: string) =>
			`Anteil an der gesamten erfassten Programmierzeit · Gesamtzeitraum ${window}${asOfSuffix(window, asOf)}`,
		last12MonthsHours: (window: string, asOf: string) =>
			`Erfasste Zeit in Stunden · letzte 12 Monate, ${window}${asOfSuffix(window, asOf)}`,
		weekHoursPerDay: (window: string, asOf: string) =>
			`Erfasste Stunden pro Tag · ${window}${asOfSuffix(window, asOf)}`,
		habitCells: (window: string, asOf: string) =>
			`Eine Zelle für jeden vergangenen Tag · ${window}${asOfSuffix(window, asOf)}`
	},
	tableHeads: {
		project: "Projekt",
		language: "Sprache",
		trackedTime: "Erfasste Zeit",
		share: "Anteil",
		day: "Tag",
		total: "Gesamt"
	},
	/** The "everything else" bucket (series name, legend, table column). */
	other: "Alles andere",
	/** Row label of the snapshot projects chart. */
	ayakoFamilyRow: "Ayako-Familie",
	/** ECharts axis-label template — keep the {value} placeholder. */
	axisHours: "{value} h",
	/** Alt-text intros/sentences; ranked intros are completed by the
	 *  data rows ("<intro>: name time (share); ….") in getCharts. Wer eine
	 *  Wand hört statt sie zu sehen, sieht keine Stempel — die Alt-Texte
	 *  behalten ihr Stand-Datum. */
	alt: {
		topProjectsIntro: (count: number, asOf: string) =>
			`Balkendiagramm der ${count} am meisten erfassten Projekte, Gesamtzeitraum, Stand ${asOf}`,
		ayakoFamilyIntro: (asOf: string) =>
			`Balkendiagramm der Ayako-Projektfamilie gegenüber allem anderen, Gesamtzeitraum, Stand ${asOf}`,
		topLanguagesYearIntro: (count: number, asOf: string) =>
			`Balkendiagramm der ${count} am meisten erfassten Sprachen der letzten 12 Monate, Stand ${asOf}`,
		topLanguagesLifetimeIntro: (count: number, asOf: string) =>
			`Balkendiagramm der ${count} am meisten erfassten Sprachen, Gesamtzeitraum, Stand ${asOf}`,
		weekByProject: (o: {
			start: string;
			end: string;
			topCount: number;
			weekTotal: string;
			dailyAverage: string;
			leadName: string;
			leadTime: string;
		}) =>
			`Gestapeltes Tages-Balkendiagramm der erfassten Stunden, ${o.start} bis ${o.end}, ` +
			`aufgeteilt nach den Top-${o.topCount}-Projekten der Woche plus alles andere. ` +
			`Wochensumme ${o.weekTotal}; Tagesdurchschnitt ${o.dailyAverage}. ` +
			`Führendes Projekt: ${o.leadName} mit ${o.leadTime}.`,
		weekByLanguage: (o: {
			start: string;
			end: string;
			topCount: number;
			weekTotal: string;
			dailyAverage: string;
			leadName: string;
			leadTime: string;
		}) =>
			`Gestapeltes Tages-Balkendiagramm der erfassten Stunden, ${o.start} bis ${o.end}, ` +
			`aufgeteilt nach den Top-${o.topCount}-Sprachen der Woche plus alles andere. ` +
			`Wochensumme ${o.weekTotal}; Tagesdurchschnitt ${o.dailyAverage}. ` +
			`Führende Sprache: ${o.leadName} mit ${o.leadTime}.`,
		habit: (o: {
			elapsed: string;
			start: string;
			end: string;
			active: string;
			ratePercent: number;
			asOf: string;
		}) =>
			`Strichlisten-Raster aus ${o.elapsed} Zellen, eine für jeden vergangenen Tag zwischen ${o.start} ` +
			`und ${o.end}; ${o.active} gefüllte Zellen markieren Tage mit erfasster Programmierzeit — ` +
			`${o.ratePercent} Prozent, Stand ${o.asOf}.`
	},
	/** Footnotes explaining starred (derived) figures. */
	notes: {
		projectsDerived: (asOf: string) =>
			`* Abgeleitet aus dem veröffentlichten Gesamtwert und der Ayako-Familien-Zahl, beide Stand ${asOf}.`,
		languagesDerived: (asOf: string) =>
			`* Anteil abgeleitet aus den veröffentlichten Stunden und dem Gesamtwert, Stand ${asOf}.`
	},
	/** Handschriftliche Randnotizen: jede trägt die FOLGE, die das Blatt
	 *  nicht zeichnen kann — eine Notiz, die den Balken daneben wiederholt,
	 *  ist Dekoration; der Balken beschriftet sich selbst. */
	annotations: {
		/* Lässt die Spitzenzeile bewusst weg: bei einem Live-Abruf ist das
		   irgendein Repo mit den meisten Stunden — die Ergänzung, auf die es
		   ankommt, ist, was daraus läuft, und das zeigt kein Balken hier. */
		projectLeads: (_name: string, _time: string) =>
			`Auf dem, was in diesen Stunden entstand, laufen ${servers} Server`,
		ayakoShare: (percent: number) =>
			`${users} Nutzer, ${servers} Server — und ${n(percent)} % der Aufzeichnung`,
		languageTop: (name: string, time: string) => `Das Produkt läuft auf ${name} — ${time} davon`,
		weekTotal: (total: string, leadName: string) =>
			`An ${leadName} wird weiter gebaut — ${total} davon diese Woche`,
		weekDaily: (average: string, leadName: string) =>
			`Die Änderungen landen weiter in ${leadName} — ${average} pro Tag`,
		habitRate: (ratePercent: number, sinceYear: string) =>
			`An ${n(ratePercent)} % aller Tage seit ${sinceYear} ist Code entstanden`
	},
	habit: {
		line: (active: string, elapsed: string, ratePercent: string) =>
			`${active} von ${elapsed} vergangenen Tagen mit erfasster Programmierzeit — ${ratePercent} %.`,
		/* siehe wall.ts: keine Kalender-Lesart zulassen — die Zellen werden
		   der Reihe nach gefüllt, die leeren Tage verteilen sich über den
		   gesamten Zeitraum und stehen nicht am Ende */
		smallPrint: "Zwei Zählungen, kein Kalender — die Zellen werden gezählt, nicht datiert."
	},
	/** Typed provenance-card lines (Telemetry "Quelle" card). */
	provenance: {
		/** Die Stand-Regel der Wand, einmal gesagt, damit keine Zahl sie wiederholen muss. */
		convention: (asOf: string) =>
			`Wenn an einer Zahl kein anderes Datum steht, wurde sie am ${asOf} gemessen.`,
		live: (asOf: string) =>
			`Diagramme zur Build-Zeit von der WakaTime-API abgerufen; das Fenster endet am ${asOf}.`,
		snapshot: (asOf: string) =>
			`Eingecheckte Zahlen aus dem WakaTime-API-Abruf vom ${asOf} — Live-Builds rufen zur Build-Zeit ab und ergänzen die Sieben-Tage-Diagramme.`,
		currentlyJuly2026: (display: string) =>
			`Aktuell (Juli 2026): ${display} erfasste Programmierzeit pro Tag.`
	},
	/** Telemetry section chrome around the charts (Telemetry.astro). */
	telemetrySection: {
		/* Die Unterzeile des Abschnitts: zuerst das, was aus den Stunden
		   wurde, dann der Messzeitraum. Ein Telemetrie-Abschnitt, der mit
		   „erfasst seit …“ beginnt, redet über Fleiß, bevor er gesagt hat,
		   wofür der Fleiß war. */
		trackedSince: (date: string) =>
			`Seit ${ayako.inProductionSince} im Produktivbetrieb · erfasst seit ${date}`,
		sourceHeading: "Quelle",
		dataAsTable: "Daten als Tabelle"
	},
	/** Hero telemetry print-out: live-build sentences + source line
	 *  (snapshot builds print hero.telemetryCard.lines verbatim). */
	heroTelemetry: {
		total: (total: string, asOf: string) =>
			`${total} erfasste Programmierzeit, Stand ${asOf}.`,
		activeDays: (o: {
			active: string;
			elapsed: string;
			ratePercent: string;
			start: string;
			end: string;
		}) =>
			`${o.active} von ${o.elapsed} Tagen aktiv — ${o.ratePercent} %, ${o.start} bis ${o.end}.`,
		dailyAverage: (average: string) =>
			`Tagesdurchschnitt über den Gesamtzeitraum: ${average}.`,
		sourceLine: (sourceNote: string, mode: string) => `Quelle: ${sourceNote} — ${mode}.`,
		modeLive: "zur Build-Zeit abgerufen",
		modeSnapshot: "eingecheckter Snapshot"
	}
} as const;
