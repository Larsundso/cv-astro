/**
 * Der Rote Faden — the wall's content as structured data, German edition.
 *
 * Mirrors EVERY named export of `src/data/wall.ts` with identical TypeScript
 * shapes. Figures, ids, hrefs, stacks, logos, and dates are identical —
 * templated from `~/data/snapshot` exactly like wall.ts (never retyped).
 * Only human-readable strings are German.
 *
 * Voice law (German): gemessen, nüchtern, keine Werbeadjektive; jede Zahl
 * trägt ihre Einheit und ihr Stand-Datum ("Stand YYYY-MM-DD", ISO wie im
 * Original). Brand fixtures stay identical to the English wall: "Werdegang",
 * "heute", the HEUTE stamp, "Hi, ich bin Lars", "Der Rote Faden".
 *
 * Number style note: grouped figures keep the site-wide en-US grouping
 * ("7,000", "2,325") because the snapshot's fixed display strings
 * ("5,432 h 47 m") use it — mixed grouping on one wall would be worse.
 * Flagged for owner review in the hand-off notes.
 */
import { ai, ayako, github, ihk, SNAPSHOT_AS_OF, telemetry } from "~/data/snapshot";
import type {
	AiPracticeEntry,
	Annotation,
	ContactEntry,
	EducationEntry,
	EmploymentEntry,
	HouseRule,
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
	PrideInk,
	ProjectEntry,
	ProjectRole,
	TimelineEntry,
	WallLink
} from "./wall";

/* ------------------------------------------------------------------ */
/* Page metadata                                                       */
/* ------------------------------------------------------------------ */

export const meta = {
	siteName: "lars-dev.org",
	title: "Lars Böse — Fachinformatiker (IHK) · Full-Stack-Entwickler",
	description:
		`Fachinformatiker für Anwendungsentwicklung (IHK). Ich betreibe einen Discord-Bot mit ` +
		`${ayako.usersDisplay} Nutzern auf ${ayako.serversDisplay} Servern — allein, in Produktion ` +
		`seit ${ayako.inProductionSince}. ${telemetry.lifetime.total.display} erfasste Programmierzeit, ` +
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
	/** Brand fixture — identical in both languages. */
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
		`Ich betreibe einen Discord-Bot mit ${ayako.usersDisplay} Nutzern auf ${ayako.serversDisplay} Servern — allein, in Produktion seit ${ayako.inProductionSince} (Stand ${SNAPSHOT_AS_OF}).`
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
		caption: `${ayako.usersDisplay} Nutzer · ${ayako.serversDisplay} Server · ${ayako.rating.value} auf ${ayako.rating.platform}, Stand ${SNAPSHOT_AS_OF}`,
		annotation: {
			text: "in Produktion seit 2019 — eine Person betreibt das alles",
			ink: "magenta"
		} satisfies Annotation
	},
	/** Hand-annotated telemetry print-out. */
	telemetryCard: {
		title: "Erfasst, nicht geschätzt",
		lines: [
			`${telemetry.lifetime.total.display} erfasste Programmierzeit, Stand ${SNAPSHOT_AS_OF}.`,
			`${telemetry.lifetime.activeDays.active.toLocaleString("en-US")} von ${telemetry.lifetime.activeDays.elapsed.toLocaleString("en-US")} Tagen aktiv — ${telemetry.lifetime.activeDays.ratePercent} %, ${telemetry.trackingStart} bis ${telemetry.trackingEnd}.`,
			`Tagesdurchschnitt über den Gesamtzeitraum: ${telemetry.lifetime.dailyAverage.display}.`
		],
		sourceNote: "WakaTime API",
		annotation: { text: "der Zähler läuft seit 2021 jeden Tag", ink: "teal" } satisfies Annotation
	},
	/** The pinned primary action. */
	primaryAction: {
		label: "An jobs@lars-dev.org schreiben",
		href: "mailto:jobs@lars-dev.org",
		annotation: { text: "diese Adresse erreicht mich direkt", ink: "blue" } satisfies Annotation
	},
	/** Thread endpoint stamps — the HEUTE stamp is a brand fixture. */
	threadStart: { stamp: "12/2019", label: "Dezember 2019 — der erste Pin" },
	threadEnd: { stamp: "HEUTE", label: "der jüngste Stich" }
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
			"Dezember 2019. Ayako beginnt als einzelne JavaScript-Datei. Seitdem ununterbrochen in Produktion.",
			`GitHub-Account seit ${github.accountCreated}.`
		],
		annotation: { text: "hier beginnt der Faden", ink: "green" }
	},
	{
		id: "angel-bots-era",
		dateLabel: "2021–2022",
		sort: "2021-10",
		title: "Die Bot-Jahre",
		body: [
			`${telemetry.trackingStart}: Die WakaTime-Telemetrie beginnt aufzuzeichnen und läuft seither ununterbrochen.`,
			"Die Angel-Bots-Ära: Discord-Bots in JavaScript, jeder für genau eine Aufgabe — daher stammt der Großteil des JavaScripts in der Aufzeichnung " +
				`(${telemetry.lifetime.languages[1].hours.toLocaleString("en-US")} h insgesamt, Stand ${SNAPSHOT_AS_OF}).`
		],
		annotation: {
			text: `TypeScript: ${github.typescriptByteSharePercent.in2021} % der gepushten Code-Bytes 2021 → ${github.typescriptByteSharePercent.in2026} % in 2026 gepushten Repos`,
			ink: "violet"
		}
	},
	{
		id: "apprenticeship-2022",
		dateLabel: "09/2022",
		sort: "2022-09",
		title: "Ausbildung",
		body: [
			`${ihk.apprenticeship.start}: ${ihk.profession} (IHK, Fachrichtung Anwendungsentwicklung, DQR-Niveau 4) bei ${ihk.trainingCompany}.`,
			`Berufsschule: Elektronikschule Tettnang. ${ihk.weeklyReports} gegengezeichnete wöchentliche Ausbildungsnachweise, Nr. 0–71. Abschlussprüfung: ${ihk.apprenticeship.examCycle}.`
		]
	},
	{
		id: "ihk-final-project-2025",
		dateLabel: "05/2025",
		sort: "2025-05",
		title: `IHK-Abschlussprojekt: »${ihk.finalProject.title}«`,
		body: [
			`${ihk.finalProject.hours} h, ${ihk.finalProject.window.start} bis ${ihk.finalProject.window.end} — vom Ausbildungsbetrieb als »selbstständig ausgeführt« bestätigt, unterschriebene Bestätigung vom 2025-06-01.`,
			`Lasttest mit ${ihk.finalProject.loadTestServers.toLocaleString("en-US")} simulierten Discord-Servern.`
		],
		annotation: { text: "das geprüfte Stück — der Code ist öffentlich", ink: "teal" }
	},
	{
		id: "raleo-2025",
		dateLabel: "2025",
		sort: "2025-06",
		title: "Raleo Digital GmbH",
		body: [
			"Seit 2025: Full-Stack-Entwickler bei der Raleo Digital GmbH (raleo.de), einem Online-Marktplatz für Heizungen, Wärmepumpen und Photovoltaik. Vollständig remote."
		]
	},
	{
		id: "current",
		dateLabel: "HEUTE",
		sort: "2026-08",
		title: "Der jüngste Stich",
		body: [
			`Juli 2026: ${telemetry.windowJuly2026.dailyAverage.display} erfasste Programmierzeit pro Tag. Bester Einzeltag: ${telemetry.lifetime.bestDay.display} am ${telemetry.lifetime.bestDay.date}.`,
			`Der Ayako-v3-Rewrite ist in aktiver Entwicklung: ${ayako.v3.commits} Commits, ${ayako.v3.featurePlugins} Feature-Plugins, ${ayako.v3.testFiles} Testdateien direkt neben dem Code, Stand ${SNAPSHOT_AS_OF}.`
		],
		annotation: { text: "der Faden ist nicht abgerissen", ink: "green" }
	}
];

/* ------------------------------------------------------------------ */
/* Career print-outs (lifetime window)                                 */
/* ------------------------------------------------------------------ */

export const careerStats = {
	title: "Karriere-Telemetrie",
	asOf: SNAPSHOT_AS_OF,
	sourceNote: "WakaTime-API-Abruf",
	lines: [
		`${telemetry.lifetime.total.display} erfasste Programmierzeit, Stand ${SNAPSHOT_AS_OF}.`,
		`TypeScript: ${telemetry.lifetime.languages[0].hours.toLocaleString("en-US")} h — ${telemetry.lifetime.languages[0].percent} % der erfassten Zeit.`,
		`${telemetry.lifetime.projectsTracked} Projekte · ${telemetry.lifetime.languagesTracked} Sprachen · ${telemetry.lifetime.dependenciesTracked.toLocaleString("en-US")} Abhängigkeiten erfasst.`,
		`${telemetry.lifetime.remoteSshPercent} % der Programmierzeit auf Remote-Servern über SSH; ${telemetry.lifetime.linuxInclWslPercent} % der OS-Zeit unter Linux (inkl. WSL).`
	]
} as const;

export const githubStats = {
	title: "GitHub-Bilanz",
	asOf: SNAPSHOT_AS_OF,
	sourceNote: "Authentifizierter GitHub-Abruf",
	lines: [
		`${github.contributions.lifetime.toLocaleString("en-US")} Beiträge seit ${github.accountCreated}, Stand ${SNAPSHOT_AS_OF} — Spitzenjahr ${github.contributions.peakYear.year}: ${github.contributions.peakYear.contributions.toLocaleString("en-US")}; letzte 12 Monate: ${github.contributions.rolling12Months.toLocaleString("en-US")}.`,
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
		oneLiner: "Multifunktionaler Discord-Bot, allein gebaut und betrieben, in Produktion seit 2019.",
		body: [
			"Eine Person entwirft, baut, deployt und betreibt Ayako: Anwendungscode, Datenbank, Cache, Sharding, Metriken und Deployment.",
			`Der v3-Rewrite zerlegt den Monolithen in Redis-gebundene Prozesse, während v2 weiterläuft: Ein Bun-Gateway nimmt den Discord-Websocket entgegen und verteilt per Pub/Sub an ${ayako.v3.featurePlugins} eigenständige Feature-Plugins; Timer sind an die Redis-Keyspace-Expiry delegiert.`
		],
		facts: [
			`${ayako.serversDisplay} Server · ${ayako.usersDisplay} Nutzer · ${ayako.rating.value} auf ${ayako.rating.platform}, Stand ${SNAPSHOT_AS_OF}.`,
			`Monorepo-weit: ${ayako.monorepo.files.toLocaleString("en-US")} Quelldateien, ${ayako.monorepo.linesOfCode.toLocaleString("en-US")} Zeilen Code (TypeScript, Svelte, Rust), gemessen am ${SNAPSHOT_AS_OF}.`,
			`${ayako.workspace.packagesAndApps} Packages und Apps · ${ayako.workspace.dockerComposeServices} Docker-Compose-Services · ${ayako.workspace.prismaModels} Prisma-Modelle.`,
			`${telemetry.lifetime.ayakoFamily.hours.toLocaleString("en-US")} h über ${ayako.generations} Generationen und ${ayako.discordLibraries} Discord-Bibliotheken — ${telemetry.lifetime.ayakoFamily.percent} % der gesamten erfassten Programmierzeit, Stand ${SNAPSHOT_AS_OF}.`,
			`${github.ayakoAuthorship.v2Percent} % der v2-Commits auf dem Default-Branch selbst verfasst (${github.ayakoAuthorship.v2Commits.own.toLocaleString("en-US")} von ${github.ayakoAuthorship.v2Commits.total.toLocaleString("en-US")}), Stand ${SNAPSHOT_AS_OF}.`,
			`v3: ${ayako.v3.commits} Commits, 100 % selbst verfasst · ${ayako.v3.featurePlugins} Feature-Plugins · ${ayako.v3.testFiles} Testdateien direkt neben dem Code, Stand ${SNAPSHOT_AS_OF}.`
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
			text: `${telemetry.lifetime.ayakoFamily.percent} % von allem, was ich je erfasst habe, steckt hier drin`,
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
			`${ihk.finalProject.hours} h, ${ihk.finalProject.window.start} bis ${ihk.finalProject.window.end} — vom Ausbildungsbetrieb als »selbstständig ausgeführt« bestätigt.`,
			`Lasttest mit ${ihk.finalProject.loadTestServers.toLocaleString("en-US")} simulierten Discord-Servern (Projektdokumentation, 2025-06).`,
			"<5 s Erstladezeit bei 100 Servern · <200 ms Serverwechsel · >95 % Cache-Trefferquote · konstant 30 FPS (Projektdokumentation, 2025-06).",
			`${ihk.finalProject.code.typescript.files} TypeScript-Dateien (${ihk.finalProject.code.typescript.linesOfCode.toLocaleString("en-US")} LOC) + ${ihk.finalProject.code.svelte.files} Svelte-Dateien (${ihk.finalProject.code.svelte.linesOfCode.toLocaleString("en-US")} LOC), gemessen am ${SNAPSHOT_AS_OF}.`,
			`${ihk.finalProject.trackedHours} h auf dem Repo erfasst, Stand ${SNAPSHOT_AS_OF}.`
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
		annotation: { text: "geprüft, bestätigt und öffentlich — alles drei zugleich", ink: "teal" }
	},
	{
		id: "kiyu",
		name: "Kiyu",
		role: "portfolio",
		oneLiner:
			"Zweiter Discord-Bot in Produktion, private Codebasis: Giveaways mit Teilnahmebedingungen (Nachrichten, Voice-Minuten), Willkommens-Flows, Logging, Booster-Tracking, Embed-Builder, Online-Peak-Statistiken.",
		body: [
			"Läuft auf Hybrid-Sharding mit einem eigenen V8-Speichermonitor: Heap-Sampling alle 30 Sekunden mit Garbage-Collection-Trigger bei 85 %."
		],
		facts: [
			"Eigenangabe „10,000+ servers“ — Repo-Metadaten, nicht verifiziert.",
			`332 Dateien · 17,250 LOC · 128 Commits, 100 % selbst verfasst, gemessen am ${SNAPSHOT_AS_OF}.`,
			"Aktiv bis 2026-06."
		],
		stack: ["TypeScript", "discord.js 14", "Prisma", "discord-hybrid-sharding", "socket.io"],
		links: [],
		annotation: {
			text: "„10,000+ servers“ ist die Angabe des Repos selbst — ich habe sie nicht nachgeprüft",
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
		facts: [`4,059 LOC in 15 Dateien, gemessen am ${SNAPSHOT_AS_OF}.`],
		stack: ["C#/.NET 8", "SkiaSharp", "DirectX 11 (Vortice)", "OpenVR", "Kestrel", "WebSocket"],
		links: []
	},
	{
		id: "vrc-inviter",
		name: "VRC-Inviter",
		role: "vr",
		oneLiner: "Windows-Tray-Dienst, der VRChat-Einladungen automatisch nach Vorrangregeln annimmt.",
		body: [
			"Spec-first: Das Designdokument ist auf den 2026-04-16 datiert, vor der Implementierung. DPAPI-verschlüsselte Zugangsdaten, ein Web-Dashboard nur auf Loopback, SQLite-Persistenz."
		],
		facts: [`4,481 LOC in 55 Dateien · xUnit-Suite mit 7 Modulen, gemessen am ${SNAPSHOT_AS_OF}.`],
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
		facts: [`2,436 LOC in 36 Dateien · vitest-Suite mit undici MockAgent, gemessen am ${SNAPSHOT_AS_OF}.`],
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
		facts: [
			`32,427 LOC in 121 Dateien · 15 Backend-Service-Module · 19 Testdateien, gemessen am ${SNAPSHOT_AS_OF}.`
		],
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
		facts: [`3,264 LOC striktes TypeScript in 75 Dateien, gemessen am ${SNAPSHOT_AS_OF}.`],
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
		text: "vr-diag — drei forensische PowerShell-Skripte (1,202 LOC): VR-Crash-Forensik über Event-Logs, WHEA und Minidumps; ein VR-Lag-Monitor; ein Bugcheck-Analyzer. 48 erfasste Lauf-Datensätze."
	},
	{
		text: "Restart-VR.bat — idempotenter Windows-Batch-Orchestrator, der einen VR-Streaming-Stack über tasklist, CIM und UDP-Port-Probes hochfährt."
	},
	{
		text: "Kfz-Elektronik — Kamera-Einbau und ein Zweitbatterie-Ausbau mit 12 V LiFePO₄ in einem Smart 450; Höhenkarte per ESP8266 + MQTT."
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
		"KI-gestützte Entwicklung ist Teil meiner Toolchain, nicht die Schlagzeile. Die Zahlen darunter sind gemessen, nicht geschätzt.",
	entries: [
		{
			id: "volume",
			title: "Volumen",
			lines: [
				`${ai.transcripts.count.toLocaleString("en-US")} Claude-Code-Transkripte (${ai.transcripts.sizeMb} MB, ${ai.transcripts.events.toLocaleString("en-US")} protokollierte Events) über ${ai.transcripts.days} Tage, ${ai.transcripts.window.start} bis ${ai.transcripts.window.end} — ${ai.sessionsPerDay} Top-Level-Sessions pro Tag.`,
				`Session-Indizes belegen die Nutzung seit mindestens ${ai.transcripts.evidencedSince}.`
			]
		},
		{
			id: "orchestration",
			title: "Orchestrierung, nicht Chat",
			lines: [
				`${ai.subagentShare.percent} % der Transkripte (${ai.subagentShare.count.toLocaleString("en-US")} von ${ai.subagentShare.of.toLocaleString("en-US")}) sind Subagenten- und Workflow-Läufe, verschachtelt unter übergeordneten Sessions.`,
				`Prompt-zu-Antwort-Verhältnis in der Stichprobe: ${ai.promptRatio} — lange autonome Läufe mit gelegentlichem Nachsteuern, kein Chat Zug um Zug.`,
				"Mehrere Sessions laufen gleichzeitig auf einem Checkout, nach schriftlichen Konventionen: atomare Claim-Locks für geteilte Logs, Commits per Pathspec gegen Index-Races, mtime-basierte Attributionsprüfung vor jedem Revert."
			]
		},
		{
			id: "adoption",
			title: "Gemessene Adoptionskurve",
			lines: [
				`AI-Coding-Anteil an der erfassten Zeit: ${telemetry.aiCoding.sharePercentByWindow.lifetime} % Gesamtzeitraum → ${telemetry.aiCoding.sharePercentByWindow.last12Months} % letzte 12 Monate → ${telemetry.aiCoding.sharePercentByWindow.july2026} % Juli 2026 → ${telemetry.aiCoding.sharePercentByWindow.last7Days} % letzte 7 Tage, Stand ${SNAPSHOT_AS_OF}. ${telemetry.aiCoding.lifetime.display} insgesamt.`,
				`Claude Code: ${telemetry.windowJuly2026.claudeCodeEditorPercent} % der Editor-Zeit im Juli 2026.`,
				`Markdown stieg von ${telemetry.lifetime.markdownPercent} % der Sprachzeit im Gesamtzeitraum auf ${telemetry.windowJuly2026.markdownPercent} % im Juli 2026 — die Signatur spezifikationsgetriebener, agentischer Arbeit.`
			]
		},
		{
			id: "governance",
			title: "Governance",
			lines: [
				"Agenten committen, stagen und pushen nie — jeden Commit prüfe und verfasse ich selbst.",
				"Read-only-Mandate erzwingt die Toolset-Beschränkung, nicht der Prompt-Text; Agenten-Output muss explizite tsc-Gates passieren, weil Pipelines grün sein können, während tsc fehlschlägt.",
				"Produktionsänderungen: ein umkehrbarer Schritt nach dem anderen, Rollback im selben Zug wie jede Mutation, Blast-Radius-Prüfung nach jeder Änderung."
			],
			annotation: { text: "Regeln, geschrieben nach Vorfällen, nicht davor", ink: "violet" }
		},
		{
			id: "memory-tooling",
			title: "Gedächtnis und Tooling",
			lines: [
				`Persistentes Gedächtnis über Sessions hinweg: ${ai.memory.notes} kuratierte Notizen in ${ai.memory.projectContexts} Projektkontexten, jede mit typisiertem Frontmatter und einem verpflichtenden „Why“.`,
				`Eine schriftliche Kostenrichtlinie leitet Implementierung und Recherche zu günstigeren Modellen und Review zum stärksten; ${ai.modelGenerations} Modellgenerationen innerhalb von drei Monaten im Einsatz.`,
				`${ai.installed.skills} installierte Skills, ${ai.installed.plugins} Plugins und eine Community-Agentenbibliothek mit ${ai.installed.communityAgentDefinitions} Definitionen — installiert, nicht alles selbst verfasst. Zum selbst verfassten Teil gehören ein Skill zur Link-Verifikation und ein Skill zum Erstellen von Diagrammen.`,
				"Vor Code, der Bibliotheken berührt, steht ein Abruf der aktuellen Dokumentation (Context7 MCP); die Repos führen Architektur-Karten und datierte Spec-Dokumente — geschrieben für Agenten und Entwickler gleichermaßen."
			]
		}
	] satisfies AiPracticeEntry[]
} as const;

/* ------------------------------------------------------------------ */
/* House rules — values card, handwritten                              */
/* ------------------------------------------------------------------ */

export const houseRules = {
	title: "Hausregeln",
	/** Handwritten card (Shantell Sans); one pride ink per rule. */
	rules: [
		{
			text: "Das ist ein queerfreundlicher Raum. Die sechs Pride-Tinten an dieser Wand sind meine Arbeitsfarben — nimm sie weg, und die Wand ergibt keinen Sinn mehr.",
			ink: "magenta"
		},
		{
			text: "Keine Toleranz für Intoleranz. Moderation ist Infrastruktur, und ich baue und betreibe sie seit 2019.",
			ink: "violet"
		},
		{
			text: "Klare Aufzeichnungen statt Hochglanz. Jede Zahl an dieser Wand trägt ihre Einheit und ihr Stand-Datum.",
			ink: "teal"
		},
		{
			text: "Wenn sich diese Regeln nach Zuhause anfühlen: Schreib an jobs@lars-dev.org.",
			ink: "blue"
		}
	] satisfies HouseRule[],
	note: "Hausregeln sind Kriterien für gegenseitige Passung, keine Dekoration."
} as const;

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
	title: "Schreib mir",
	email: "jobs@lars-dev.org",
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
		note: "Ravensburg. Ausbildungsbetrieb im dualen IHK-System; Abschlussprüfung Sommer 2025.",
		logo: "/CI.webp"
	}
];

export const education: EducationEntry[] = [
	{
		id: "apprenticeship",
		institution: "IHK-Ausbildung — Fachinformatiker für Anwendungsentwicklung",
		detail: `Fachrichtung Anwendungsentwicklung, DQR-Niveau 4. Ausbildungsbetrieb: ${ihk.trainingCompany}. IHK-Abschlussprojekt »${ihk.finalProject.title}«, vom Betrieb als »selbstständig ausgeführt« bestätigt.`,
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
		/** Handwritten scrap beside the Werdegang flyer. */
		headNote: "Beruf und Ausbildung, der Reihe nach vernäht — eine Geschichte, ein Faden.",
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
 * Number and date FIGURES arrive preformatted (identical across
 * locales); units stay h / % / m; dates stay ISO. */

export const chartStrings = {
	titles: {
		topProjects: (n: number) => `Top-${n}-Projekte`,
		ayakoFamily: "Ayako-Projektfamilie",
		topLanguages: (n: number) => `Top-${n}-Sprachen`,
		weekByProject: "Die letzten 7 Tage nach Projekt",
		weekByLanguage: "Die letzten 7 Tage nach Sprache",
		activeDays: "Aktive Tage"
	},
	/** Unit + window + as-of lines (voice law). */
	units: {
		lifetimeHours: (window: string, asOf: string) =>
			`Erfasste Zeit in Stunden · Gesamtzeitraum ${window} · Stand ${asOf}`,
		lifetimeShare: (window: string, asOf: string) =>
			`Anteil an der gesamten erfassten Programmierzeit · Gesamtzeitraum ${window} · Stand ${asOf}`,
		last12MonthsHours: (window: string, asOf: string) =>
			`Erfasste Zeit in Stunden · letzte 12 Monate, ${window} · Stand ${asOf}`,
		weekHoursPerDay: (window: string, asOf: string) =>
			`Erfasste Stunden pro Tag · ${window} · Stand ${asOf}`,
		habitCells: (window: string, asOf: string) =>
			`Eine Zelle für jeden vergangenen Tag · ${window} · Stand ${asOf}`
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
	 *  data rows ("<intro>: name time (share); ….") in getCharts. */
	alt: {
		topProjectsIntro: (n: number, asOf: string) =>
			`Balkendiagramm der ${n} am meisten erfassten Projekte, Gesamtzeitraum, Stand ${asOf}`,
		ayakoFamilyIntro: (asOf: string) =>
			`Balkendiagramm der Ayako-Projektfamilie gegenüber allem anderen, Gesamtzeitraum, Stand ${asOf}`,
		topLanguagesYearIntro: (n: number, asOf: string) =>
			`Balkendiagramm der ${n} am meisten erfassten Sprachen der letzten 12 Monate, Stand ${asOf}`,
		topLanguagesLifetimeIntro: (n: number, asOf: string) =>
			`Balkendiagramm der ${n} am meisten erfassten Sprachen, Gesamtzeitraum, Stand ${asOf}`,
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
	/** Handwritten margin notes quoting the headline figure. */
	annotations: {
		projectLeads: (name: string, time: string) => `${name} führt — ${time}`,
		ayakoShare: (percent: number) => `${percent} % der gesamten erfassten Zeit: Ayako`,
		languageTop: (name: string, time: string) => `${name}: ${time}`,
		weekTotal: (total: string, leadName: string) =>
			`${total} diese Woche — vor allem ${leadName}`,
		weekDaily: (average: string, leadName: string) =>
			`${average} pro Tag — vor allem ${leadName}`,
		habitRate: (ratePercent: number, sinceYear: string) =>
			`${ratePercent} % aller Tage seit ${sinceYear}`
	},
	habit: {
		line: (active: string, elapsed: string, ratePercent: number) =>
			`${active} von ${elapsed} vergangenen Tagen mit erfasster Programmierzeit — ${ratePercent} %.`,
		smallPrint: "Die Zellen zählen Tage der Reihe nach — eine Strichliste, kein Kalender."
	},
	/** Typed provenance-card lines (Telemetry "Quelle" card). */
	provenance: {
		live: (asOf: string) =>
			`Diagramme zur Build-Zeit von der WakaTime-API abgerufen; das Fenster endet am ${asOf}.`,
		snapshot: (asOf: string) =>
			`Eingecheckte Zahlen aus dem WakaTime-API-Abruf vom ${asOf} — Live-Builds rufen zur Build-Zeit ab und ergänzen die Sieben-Tage-Diagramme.`,
		currentlyJuly2026: (display: string) =>
			`Aktuell (Juli 2026): ${display} erfasste Programmierzeit pro Tag.`
	},
	/** Telemetry section chrome around the charts (Telemetry.astro). */
	telemetrySection: {
		trackedSince: (date: string) => `Erfasst seit ${date}`,
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
			ratePercent: number;
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
