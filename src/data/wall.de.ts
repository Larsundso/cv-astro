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
 * identical to the English wall: "Werdegang" and "Der Rote Faden".
 * The date stamps do NOT: the English build now prints "TODAY", because a
 * German date stamp is furniture rather than an artefact and does no work
 * for an English reader. "HEUTE" is correct here and stays here.
 */
import { ai, ayako, github, ihk, SNAPSHOT_AS_OF, telemetry } from "~/data/snapshot";
import { figure, formatHCoarse, formatHMCoarse, millionsPlus, pct } from "~/data/telemetry";
/* EINE URL IST KEINE ÜBERSETZUNG. Die zwölf Messe-Domains und ihre Namen sind
 * auf beiden Wänden dieselben, also stehen sie einmal — in wall.ts — und
 * werden hier importiert statt abgetippt. Zwölf handkopierte URLs sind zwölf
 * Gelegenheiten, dass die Wände auseinanderlaufen, und `fairnamic.com`,
 * `pferdbodensee.de` und `tuningworldbodensee.com` sind genau die Schreibungen,
 * die man beim Abtippen falsch rät. Dasselbe Muster wie bei `splitLangRuns`
 * weiter unten: Logik und Daten werden geteilt, nur Sprache nicht. */
import { MESSE_FAIRS } from "./wall";
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
/** Eine Dauer aus Sekunden: „5.432 h“ · „5 h 53 m“ — siehe telemetry.ts. */
const hm = (seconds: number): string => formatHMCoarse(seconds, L);
/** Eine Stundenzahl: „2.800 h“ · „102,4 h“. */
const h = (hours: number): string => formatHCoarse(hours, L);
/** Ein Anteil, fest mit seiner Einheit verbunden: „90,6 %“. */
const pc = (value: number): string => pct(value, L);
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
	/* siehe wall.ts: die maschinenlesbare Identität steht nur hier. Das
	   Layout tippte sie früher ein zweites Mal ab — mit „Lars Boese“ und
	   einem rohen »ö« in der LinkedIn-URL. */
	person: {
		name: "Lars Böse",
		givenName: "Lars",
		familyName: "Böse",
		alternateName: ["Lars Boese", "Larsundso"],
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

/* ------------------------------------------------------------------ */
/* Der Senioritäts-Anker — Rechnung, kein Adjektiv                     */
/* ------------------------------------------------------------------ */
/* Siehe wall.ts: die Karte nannte Rolle, Arbeitgeber, Region und Sprachen
 * und KEINE Dauer — die erste Aussage über das Niveau war damit der
 * Columbus-Briefkopf, „Auszubildender … 2022-09 – 2025“, und daraus rechnet
 * ein Screener ein Jahr nach dem Abschluss. Dezember 2019 bis 2026-08-03
 * sind sechs Jahre und acht Monate, nicht sieben: auf dieser Wand wird
 * keine Zahl freundlicher gerundet. Die Monate werden aus zwei Literalen
 * gerechnet, der Zeitraum steht daneben, damit die Rechnung nachprüfbar
 * ist — kein Wert kommt aus einer Uhr. */
const PRODUCTION_START = { display: "12/2019", year: 2019, month: 12 } as const;

const productionMonths = (() => {
	const [year, month] = SNAPSHOT_AS_OF.split("-").map(Number) as [number, number];
	return (year - PRODUCTION_START.year) * 12 + (month - PRODUCTION_START.month);
})();

/** Die Spanne im Dativ, für „seit …“: „6 Jahren und 8 Monaten“.
 *  (Die Nominativform „6 Jahre 8 Monate“, die die englische Wand als
 *  Zahlenform führt, wird hier nicht mehr gebraucht: nach „seit“ steht der
 *  Dativ, und der Satz beginnt jetzt bei der Person, nicht beim Bot.)
 *  Der Numerus wird mitgeführt, damit aus einem künftigen Abstand nicht
 *  „seit 1 Jahren“ wird. */
const declined = (count: number, one: string, many: string): string =>
	`${count} ${count === 1 ? one : many}`;
const productionSpanSince = `${declined(Math.floor(productionMonths / 12), "Jahr", "Jahren")} und ${declined(productionMonths % 12, "Monat", "Monaten")}`;

/** Das Abschlussjahr, aus dem Prüfungstermin, den die Wand ohnehin nennt. */
const qualifiedYear = ihk.apprenticeship.examCycle.replace(/\D+/g, "");

export const hero = {
	/** Brand fixture — die handschriftliche Begrüßung. */
	greeting: "Hi, ich bin Lars",
	greetingSubline: "seit Dezember 2019",
	/** Lottie asset for the handwritten greeting. */
	lottieAsset: "src/assets/Hi.json",
	name: "Lars Böse",
	signature: "Lars Boese",
	handle: "Larsundso",
	/** Typed intro card. `intro[2]` ist der Senioritäts-Anker und steht
	 *  direkt unter dem Satz, den er beziffert.
	 *
	 *  KEINE ÜBERSETZUNG DER BERUFSBEZEICHNUNG, absichtlich: die englische
	 *  Wand erklärt „Fachinformatiker für Anwendungsentwicklung“ inzwischen
	 *  in einem Einschub, weil sie es muss. Hier braucht es keinen — und
	 *  diese Asymmetrie ist korrekte zweisprachige Praxis, keine
	 *  Inkonsistenz.
	 *
	 *  DIE INDIZES TRAGEN — siehe wall.ts: Hero.astro liest [0], [1] und [2]
	 *  einzeln und zerlegt [2]; die Liste wird nicht durchlaufen. Also nur
	 *  anhängen, nie einschieben.
	 *
	 *  [3] und [4] sind Defekt 3 und Defekt 2, beide für das erste Viewport:
	 *  im ersten Bildschirm stand keine einzige Technologie (das erste
	 *  „TypeScript“ kam bei 18,8 % Seitentiefe), und der Satz, der sagt, was
	 *  er sucht, stand genau einmal — bei 95,4 %. [3] nennt die Zahl, die die
	 *  Wand ohnehin veröffentlicht, und zwar für TypeScript ALLEIN: 55,59 %
	 *  ist ein WakaTime-SPRACHANTEIL, und Node ist eine Laufzeitumgebung, die
	 *  in dieser Erhebung überhaupt nicht vorkommt. [4] ist Wort für Wort
	 *  `contact.rightNow.lines[0]` ohne die Aufforderung, die zur Karte mit
	 *  der Adresse gehört. „Kein dringender Wechselwunsch“ wird bewusst NICHT
	 *  mit nach oben genommen — das ist eine offene Entscheidung des
	 *  Eigentümers.
	 *
	 *  [5] ist die Überschrift des einzigen fremdbestätigten Belegs der Wand;
	 *  die Begründung steht am Eintrag selbst.
	 *
	 *  ALLE WERDEN GERENDERT. Hero.astro:234 baut `recordRest` als
	 *  `intro.filter((_, i) => i > SENIORITY_LINE && i !== post?.at)` und
	 *  druckt in ARRAY-REIHENFOLGE — das „hört bei [2] auf“, das hier stand,
	 *  ist zwei Builds alt. Die Folge, ausgesprochen statt überrascht: Weil
	 *  nur angehängt werden darf, steht [5] HINTER dem Angebot in [4],
	 *  obwohl die Karte „erst der Beleg, dann das Angebot“ verlangt. Das ist
	 *  eine Frage der RENDER-Reihenfolge und gehört Hero.astro; hier bleibt
	 *  es beim Anhängen. */
	intro: [
		"Fachinformatiker für Anwendungsentwicklung (IHK) und Full-Stack-Entwickler bei der Raleo Digital GmbH, remote.",
		`Ich betreibe einen Discord-Bot mit ${users} Nutzern auf ${servers} Servern — allein, seit ${ayako.inProductionSince} im Produktivbetrieb.`,
		/* Siehe wall.ts: kein Satz dieser Seite machte Lars zum Subjekt einer
		   Dauer. „Das sind …“ ist kein Bindewort, sondern eine anaphorische
		   Umformulierung — die „das heißt“-Konstruktion, deren Funktion es
		   ist, das Folgende als WIEDERHOLUNG des Vorhergehenden zu
		   kennzeichnen. Und nimmt man sie weg, bleibt als Subjekt der Bot
		   übrig. Jetzt steht die Person davor, im Präsens mit „seit“ — die
		   deutsche Form für eine laufende Spanne —, Bezug, Zahlen und
		   Zeitraum unverändert, die Rechnung bleibt auf der Karte
		   nachprüfbar. */
		`Ich baue und betreibe ihn seit ${productionSpanSince} — ${PRODUCTION_START.display} bis ${SNAPSHOT_AS_OF}. Abschluss ${qualifiedYear}, davor drei Jahre betriebliche Ausbildung.`,
		`TypeScript im Alltag — ${pc(telemetry.lifetime.languages[0].percent)} der gesamten erfassten Programmierzeit, Stand ${SNAPSHOT_AS_OF}.`,
		/* „Produktarbeit“ ist kein deutsches Wort. Es ist eine verständliche
		   Lehnübersetzung von „product work“, die in keiner Stellenanzeige, bei
		   keinem Recruiter und bei keinem Entwickler vorkommt — und sie stand
		   ausgerechnet auf den beiden Zeilen, die sagen, was er sucht, also auf
		   dem Satz, den ein Recruiter nach Stichwort abgleicht. */
		"Offen für Produktentwicklung mit TypeScript/Node — Backend oder Full-Stack.",
		/* [5] — siehe wall.ts: die einzige Aussage dieser Wand, für die
		   jemand Drittes geradesteht, stand bei 90,3 % Seitentiefe (y 14.139
		   von 15.651 am Desktop, 84,6 % am Telefon), hinter rund zweihundert
		   selbst gemessenen Zahlen. Alles andere hier misst er an seiner
		   eigenen Arbeit selbst; diese Merges haben Maintainer geprüft, die ihm
		   nichts schulden.
		   NUR DIE ÜBERSCHRIFT: die vollständige Liste der 8 Repositories, die
		   Zahlen pro Repository und die Suche bleiben genau dort, wo sie sind
		   (`githubStats`). Nur angehängt, nie eingeschoben — Hero.astro liest
		   [0], [1] und [2] über den Index. */
		`Code von mir ist in discord.js, unocss und tsx gemerged. ${github.mergedUpstream.count} Pull Requests in ` +
			`${github.mergedUpstream.repositories.length} Repositories, die mir nicht gehören — geprüft ${github.mergedUpstream.checkedOn}.`
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
		/* „Rufbereitschaft“ MUSSTE WEG, und es war die folgenreichste
		   Wortänderung der Seite. Rufbereitschaft ist in Deutschland ein
		   definierter arbeitsrechtlicher Status: geregelt und vergütet. Auf ein
		   privates Projekt angewandt macht das Wort aus dem Projekt ARBEIT —
		   und zwar genau an der Stelle, an der ein Arbeitgeber die Frage nach
		   der Nebentätigkeit stellt und die Antwort „keine Arbeit“ lauten muss.
		   Dazu war es eine englische Doppelpunkt-Apposition, die im Deutschen
		   nicht als Satz durchgeht. Der Witz der englischen Wand („one on-call
		   rotation, and it is me“) bleibt, der Rechtsbegriff geht. */
		annotation: {
			text: "die Bereitschaft bin ich",
			ink: "magenta"
		} satisfies Annotation
	},
	/** Hand-annotated telemetry print-out. */
	telemetryCard: {
		title: "Erfasst, nicht geschätzt",
		/* siehe wall.ts: das Ergebnis zuerst, die Stunden als Beleg darunter */
		lines: [
			`Seit ${ayako.inProductionSince} im Produktivbetrieb — über ${ayako.generations} Generationen und ${ayako.discordLibraries} Discord-Bibliotheken hinweg.`,
			/* Siehe wall.ts: „dahinter" band die Gesamtsumme an ein einziges
			   Produkt, wahrend die Projektkarte fur denselben Geltungsbereich
			   2.800 h nennt — dieselbe Formulierung, zwei Zahlen im Verhaltnis
			   1,94:1. */
			`${hm(telemetry.lifetime.total.seconds)} erfasste Programmierzeit insgesamt, Stand ${SNAPSHOT_AS_OF} — davon ${hm(telemetry.lifetime.ayakoFamily.seconds)} auf diesem System.`,
			`${n(telemetry.lifetime.activeDays.active)} von ${n(telemetry.lifetime.activeDays.elapsed)} Tagen aktiv — ${pc(telemetry.lifetime.activeDays.ratePercent)}, ${telemetry.trackingStart} bis ${telemetry.trackingEnd}.`
		],
		sourceNote: "WakaTime API",
		annotation: {
			text: "die 164 Tage ohne Code sind mitgezählt",
			ink: "teal"
		} satisfies Annotation
	},
	/**
	 * The pinned primary action.
	 *
	 * UNRENDERED — siehe wall.ts: kein Component liest `primaryAction`, in
	 * keinem der beiden Builds. Bleibt stehen, weil der erste sichtbare
	 * mailto erst bei 86,7 % Seitentiefe kommt und genau dieses Objekt die
	 * fertige Vorlage für einen Hero-CTA ist.
	 */
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

/* DEFEKT 1: IM WERDEGANG KAM DIE PERSON NICHT VOR. Erste-Person-Belege pro
 * Abschnitt: Hero 4, Projekte 2, Telemetrie 1, „Wie ich arbeite“ 11,
 * Kontakt 4 — und Werdegang 0, auf 257 deutschen Wörtern. Die sechs Sätze
 * mit finitem Verb hatten als Subjekt *Ayako*, *WakaTime*, *jemand
 * anderes*, *der Ausbildungsbetrieb* und *der Rewrite*. Ausgerechnet der
 * Abschnitt, den eine Personalabteilung zuerst liest, war der einzige ohne
 * handelnde Person. Drei Sätze gehören jetzt ihm: der erste Pin, die
 * Ausbildung, der aktuelle Arbeitgeber. Keine Angabe, keine Zahl und kein
 * Datum hat sich geändert — nur das Subjekt.
 *
 * Bewusst NICHT umgeschrieben: die WakaTime-Zeile (dort ist wirklich das
 * Instrument der Handelnde), die Zeile über die Ausbildungsnachweise (ihr
 * ganzer Sinn ist, dass JEMAND ANDERES unterschrieben hat) und die
 * v3-Zeile (Zustand des Rewrites ist die Angabe; die Autorschaft steht
 * gemessen zwei Abschnitte weiter). */

export const timeline: TimelineEntry[] = [
	{
		id: "start-2019",
		dateLabel: "12/2019",
		sort: "2019-12",
		title: "Der erste Pin",
		body: [
			/* NICHT „ununterbrochen“: weiter unten auf derselben Wand steht
			   „jeden Ausfall seit 2019 habe ich selbst behoben“. Wo es
			   Ausfälle gab, kann nichts ununterbrochen gelaufen sein — und
			   auf einer Wand, deren ganzer Anspruch die Nachprüfbarkeit ist,
			   war das der einzige unbelegte Satz. „Seitdem im
			   Produktivbetrieb“ deckt sich mit dem englischen Text. */
			"Dezember 2019. Ich schreibe Ayako als einzelne JavaScript-Datei — und halte sie seitdem im Produktivbetrieb.",
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
			/* „ohne Lücke“ bezog sich grammatisch auf das Programmieren, nicht
			   auf die Messung — und 164 Tage der Aufzeichnung tragen keinen
			   Code. Lückenlos ist die AUFZEICHNUNG. */
			`${telemetry.trackingStart}: Ab hier zeichnet WakaTime auf — die Aufzeichnung läuft seitdem ohne Unterbrechung.`,
			"Die Angel-Bots-Ära: Discord-Bots in JavaScript, jeder für genau eine Aufgabe — daher stammt der Großteil des JavaScripts in der Aufzeichnung " +
				`(${h(telemetry.lifetime.languages[1].hours)} insgesamt).`
		],
		annotation: {
			text: `TypeScript: ${pc(github.typescriptByteSharePercent.in2021)} der gepushten Code-Bytes 2021 → ${pc(github.typescriptByteSharePercent.in2026)} in 2026 gepushten Repos`,
			ink: "violet"
		}
	},
	{
		id: "apprenticeship-2022",
		dateLabel: "09/2022",
		sort: "2022-09",
		title: "Drei Jahre bei der Columbus Interactive GmbH",
		body: [
			/* Kein „in Ravensburg“: `ihk.trainingCompany` lautet bereits
			   „Columbus Interactive GmbH, Ravensburg“ — der Ort stünde sonst
			   zweimal in einem Satz. Und der Betrieb steht am Satzende, weil
			   die Apposition „GmbH, Ravensburg“ mitten im Satz ein zweites
			   Komma bräuchte, das der Satz nicht hergibt. */
			/* HIER GEHT DAS HISTORISCHE PRÄSENS DANEBEN, und nur hier. Als
			   Erzählform trägt es diese Wand („Ich schreibe Ayako als einzelne
			   JavaScript-Datei“) und bleibt überall sonst stehen. Auf dieser
			   Zeile aber sucht eine deutsche Personalabteilung den STATUS, und
			   „Ich mache drei Jahre Ausbildung zum …“ liest sich als laufend —
			   also genau falsch für jemanden, der 2025 abgeschlossen hat, und
			   falsch an der einen Stelle, an der die Fehllesung Geld kostet.
			   Vergangenheitsform, sonst unverändert: Datum, Betrieb, Niveau und
			   Berufsbezeichnung stehen wie zuvor. */
			`${ihk.apprenticeship.start}: Ich habe drei Jahre Ausbildung zum ${ihk.profession} (IHK, DQR-Niveau 4) gemacht, angestellt bei der ${ihk.trainingCompany}.`,
			`${ihk.weeklyReports} gegengezeichnete wöchentliche Ausbildungsnachweise, Nr. 0–71 — jeder einzelne von jemand anderem gelesen und unterschrieben. Berufsschule: ${ihk.vocationalSchool}. Abschlussprüfung: ${ihk.apprenticeship.examCycle}.`
		]
	},
	{
		id: "ihk-final-project-2025",
		dateLabel: "05/2025",
		sort: "2025-05",
		title: `IHK-Abschlussprojekt: »${ihk.finalProject.title}«`,
		body: [
			`Der Ausbildungsbetrieb hat die Arbeit beurteilt: als »selbstständig ausgeführt« abgezeichnet, Unterschriftsdatum 2025-06-01. ${h(ihk.finalProject.hours)}, ${ihk.finalProject.window.start} bis ${ihk.finalProject.window.end}.`,
			`Unter Last gemessen: ${n(ihk.finalProject.loadTestServers)} echte Discord-Server — über den Token meines eigenen Bots, nicht simuliert.`
		],
		annotation: { text: `${h(ihk.finalProject.hours)} ist die Obergrenze, die die IHK für das Projekt setzt`, ink: "teal" }
	},
	{
		id: "raleo-2025",
		dateLabel: "2025",
		sort: "2025-06",
		title: "Raleo Digital GmbH",
		/* Siehe wall.ts: die Karte, die vier Hiring-Gutachter unabhängig
		   voneinander als das größte Problem benannt haben — 0 Technologien,
		   0 Zahlen, 0 Ergebnisse, und die Hälfte davon über das Geschäft des
		   ARBEITGEBERS statt über die Arbeit. Vom Eigentümer geliefert am
		   2026-08-08, nach seiner Freigaberegel: keine internen System- oder
		   Repository-Namen, kein Hersteller und kein Lieferant genannt. */
		body: [
			"Seit Juli 2025 bin ich Full-Stack-Entwickler bei der Raleo Digital GmbH (raleo.de), einem Online-Marktplatz für Heizungen, Wärmepumpen und Photovoltaik. Vollständig remote — das zweite Unternehmen an diesem Faden.",
			"Stack: TypeScript und Node.",
			"Mir gehört der Ingest-Dienst, auf dem der Marktplatz läuft. Er holt regelmäßig Verfügbarkeit, Preis, Bestand, Bilder und Beschreibungen von Herstellerseiten in die Produktdatenbank und zieht Versanddokumente aus Lieferantenportalen, damit Kundinnen und Kunden wissen, wo ihre Bestellung steht.",
			"Er ist systemkritisch, und die Fehlerfälle sind teuer statt peinlich: Ein falscher Bestand kostet Geld, eine veraltete Verfügbarkeit kostet den Verkauf.",
			"Die Quellen sind nicht dafür gebaut, maschinell gelesen zu werden, sie wehren sich dagegen, und sie ändern sich ohne Ankündigung. Der größte Teil der Arbeit ist, das unbeaufsichtigte Einsammeln trotzdem korrekt zu halten."
		]
	},
	{
		id: "current",
		dateLabel: "HEUTE",
		sort: "2026-08",
		title: "Der Stich von heute",
		body: [
			`Juli 2026: ${hm(telemetry.windowJuly2026.dailyAverage.seconds)} erfasste Programmierzeit pro Tag. Bester Einzeltag: ${telemetry.lifetime.bestDay.date} mit ${hm(telemetry.lifetime.bestDay.seconds)}.`,
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
		`TypeScript: ${h(telemetry.lifetime.languages[0].hours)} — ${pc(telemetry.lifetime.languages[0].percent)} der erfassten Zeit.`,
		`${telemetry.lifetime.projectsTracked} Projekte · ${telemetry.lifetime.languagesTracked} Sprachen · ${n(telemetry.lifetime.dependenciesTracked)} Abhängigkeiten erfasst.`,
		`${pc(telemetry.lifetime.remoteSshPercent)} der Programmierzeit auf Remote-Servern über SSH; ${pc(telemetry.lifetime.linuxInclWslPercent)} der OS-Zeit unter Linux (inkl. WSL).`
	]
} as const;

/* ------------------------------------------------------------------ */
/* Kundenarbeit — die drei angestellten Jahre, belegt                  */
/* ------------------------------------------------------------------ */
/** Siehe die Begründung in wall.ts. Die `Tasks`-Angaben sind exakt die,
 *  die auf der Vorgängerseite pro Website veröffentlicht waren: Was nur
 *  gewartet wurde, heißt gewartet — nie gebaut. */
export const clientWork = {
	title: "Was ich dort ausgeliefert habe",
	/* Siehe wall.ts: verkauft war das als Anpassungsfähigkeit, und das belegt
	   es nicht. Neun der 25 wurden nur gewartet, überwiegend Typo3 — wer eine
	   Typo3-Seite wartet, belegt damit, dass er angestellt war und zuverlässig
	   erschienen ist, nicht dass er zwischen Paradigmen wechselt. Was dieser
	   Abschnitt als einziger belegt: die einzigen drei Jahre dieser Wand, in
	   denen jemand anderes entschieden hat, woran er arbeitet — mit
	   gegengezeichnetem Papier darüber. Alles andere hier ist Arbeit, die er
	   sich selbst zugeschnitten hat. Der Hinweis auf den fremden Stack bleibt,
	   mit Datum, rutscht aber unter die Liste, die er erklärt. */
	/* Beide Verben im Präteritum: „entschieden hat, woran ich arbeite“ mischt
	   Vergangenheit und Gegenwart und lässt sich als „entscheidet bis heute“
	   lesen — derselbe Fehler wie beim historischen Präsens auf der
	   Ausbildungskarte, nur andersherum. */
	lead: "Drei Jahre, in denen jemand anderes entschied, woran ich arbeitete. 25 Websites im Produktivbetrieb sind dabei entstanden, in einem Stack, den ich vorher nicht benutzt hatte. Alles andere an dieser Wand habe ich mir selbst zugeschnitten; das hier sind die drei Jahre mit gegengezeichnetem Papier dahinter.",
	tagNote: "Aufgeteilt so, wie ich es festgehalten habe: was ich entwickelt habe, und was ich nur gewartet habe.",
	groups: [
		{
			label: "Entwickelt und gewartet",
			items: [
				{
					name: "Messe Friedrichshafen — 13 Messe-Websites",
					stack: "CraftCMS · PHP · Twig · SCSS · Bootstrap",
					href: "https://messe-friedrichshafen.de/",
					/* Der Klartext, den das Component heute druckt — aus der
					   Liste gebaut, damit Namen und Links nicht auseinanderlaufen
					   können. */
					also: MESSE_FAIRS.map((fair) => fair.label).join(", "),
					alsoLinks: MESSE_FAIRS
				},
				{
					name: "Simply-V",
					stack: "CraftCMS · TypeScript · PHP · Twig · SCSS",
					href: "https://simply-v.de/"
				},
				{
					name: "Columbus Interactive",
					stack: "PHP · SCSS · CSS3",
					href: "https://columbus-interactive.de/"
				}
			]
		},
		{
			label: "Entwickelt",
			items: [
				{
					name: "MP Family Office",
					stack: "Bootstrap · Handlebars · TypeScript · Docker · SCSS",
					href: "https://mp-familyoffice.de/"
				}
			]
		},
		{
			label: "Gewartet",
			items: [
				{ name: "Medizin Campus Bodensee", stack: "PHP · SCSS", href: "https://medizin-campus-bodensee.de/" },
				{ name: "Paravan", stack: "Typo3", href: "https://paravan.de/" },
				{ name: "Eisele", stack: "Typo3", href: "https://eisele.de/" },
				{ name: "ID-S", stack: "Handlebars · PHP · Typo3", href: "https://id-s.de/" },
				{ name: "EBZ Group", stack: "Typo3", href: "https://ebz-group.com/" },
				{ name: "Columbus AG", stack: "VueJS", href: "https://columbus.ag/" },
				{ name: "Hobart", stack: "PHP", href: "https://hobart.de/" },
				{ name: "Arnold Next-G", stack: "Handlebars", href: "https://arnoldnextg.de/" },
				{ name: "Lightweight", stack: "SCSS · CSS3", href: "https://lightweight.info/" }
			]
		}
	],
	/* Das Versprechen der Nachprüfbarkeit trägt jetzt sein Prüfdatum, und die
	   Aufteilung wird ausgezählt statt angedeutet: 16 entwickelt, 9 nur
	   gewartet, 25 insgesamt. Wer die Liste selbst zählt, kommt auf dasselbe. */
	close: "Alle sind bis heute online, die Arbeit lässt sich also öffnen statt glauben. Alle 25 geprüft 2026-08-10. 16 der 25 habe ich entwickelt, 9 nur gewartet. Vor dem 2022-09-01 habe ich kein PHP, kein Typo3 und kein CraftCMS geschrieben — und heute schreibe ich keins davon."
} as const;

export const githubStats = {
	title: "GitHub-Bilanz",
	asOf: SNAPSHOT_AS_OF,
	sourceNote: "Authentifizierter GitHub-Abruf",
	lines: [
		`${n(github.contributions.lifetime)} Beiträge seit ${github.accountCreated} — Spitzenjahr ${github.contributions.peakYear.year}: ${n(github.contributions.peakYear.contributions)}; letzte 12 Monate: ${n(github.contributions.rolling12Months)}.`,
		`${github.pullRequestsAuthored} Pull Requests insgesamt verfasst.`,
		`${github.mergedUpstream.count} davon gemerged in ${github.mergedUpstream.repositories.length} Repositories, die mir nicht gehören: ${github.mergedUpstream.repositories.map((r) => r.repo).join(", ")}. Geprüft ${github.mergedUpstream.checkedOn}.`,
		/* Siehe wall.ts: die einzige Stelle der Wand, an der ihre eigene Regel
		   nicht angewandt war — Bernstein heißt hier „die Grenze: wo hört diese
		   Aussage auf?“. Am 2026-08-10 unangemeldet gegen die GitHub-Such-API
		   nachgeprüft: total_count 11, Merge-Daten 2022-10-27 bis 2024-11-25.
		   Nach den TITELN gezählt, damit dieselbe Zahl herauskommt, wenn jemand
		   alle elf öffnet. Die beiden PRs in discordjs/discord.js und
		   discordjs/discord-api-types sind EIN Feature über Bibliothek und
		   Typen-Paket, NICHT „dieselbe Änderung am selben Tag“ (so stand es im
		   Gutachten): 2024-08-14 und 2024-08-20, sechs Tage auseinander. Diese
		   Formulierung bitte nicht zurückholen. */
		`Die Grenze: Der jüngste der elf ist von ${github.mergedUpstream.newestMergedOn}. Nach den Titeln sind zwei davon Tippfehler-Korrekturen in der Dokumentation und einer ein Dependency-Update. Der größte ergänzt eine Methode zum Widerrufen von OAuth2-Tokens — zwei Pull Requests, discord.js und das zugehörige Types-Paket.`
	],
	/** Die Suche, die genau diese elf zurückgibt — nachlaufen statt glauben. */
	search: {
		label: "die Suche, die sie zurückgibt",
		href: github.mergedUpstream.searchUrl
	} satisfies WallLink
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
			/* siehe wall.ts: eine Zählung, keine Schätzung. Die Zeilenzahl bleibt
			   in snapshot.ts stehen — sie ist nur nicht die Zahl, mit der diese
			   Karte aufmacht. */
			`Monorepo-weit: ${n(ayako.monorepo.files)} Quelldateien in ${ayako.workspace.packagesAndApps} Packages (TypeScript, Svelte, Rust).`,
			`${ayako.workspace.dockerComposeServices} Docker-Compose-Services · ${ayako.workspace.prismaModels} Prisma-Modelle.`,
			`${h(telemetry.lifetime.ayakoFamily.hours)} über ${ayako.generations} Generationen und ${ayako.discordLibraries} Discord-Bibliotheken — ${pc(telemetry.lifetime.ayakoFamily.percent)} der gesamten erfassten Programmierzeit.`,
			/* Siehe wall.ts: die Zahl stimmt, ihre Beschriftung beantwortete die
			   falsche Frage. „99,8 % selbst verfasst“ liest sich 2026 als Aussage
			   darüber, wer den Code geschrieben hat — und das kann sie strukturell
			   nicht sein, weil die Governance-Karte zwei Abschnitte weiter das
			   Ergebnis garantiert: „Agenten committen, stagen und pushen nie.“ Unter
			   dieser Regel stünden dort 99,8 %, egal wer entworfen hat.
			   NEU BESCHRIFTET, NICHT GESTRICHEN: Was die Zahl beantwortet, ist, ob
			   noch jemand beigetragen hat — und Alleinbesitz an einem Produkt mit
			   2,4 Mio. Nutzern ist der Punkt dieser Karte. Unangemeldet gegen den
			   GitHub-Contributors-Endpunkt geprüft, 2026-08-10: AyakoBot/Ayako-v2
			   führt genau zwei Mitwirkende, Larsundso mit 2.325 und dependabot[bot]
			   mit 5. Deshalb steht der Rest jetzt da, statt als Lücke zu wirken. */
			`Bei v2 gibt es außer mir keinen weiteren Mitwirkenden: ${n(github.ayakoAuthorship.v2Commits.own)} von ${n(github.ayakoAuthorship.v2Commits.total)} Commits auf dem Default-Branch sind meine — ${pc(github.ayakoAuthorship.v2Percent)}. Die übrigen ${n(github.ayakoAuthorship.v2Commits.total - github.ayakoAuthorship.v2Commits.own)} stammen von dependabot.`,
			/* v3 bekommt dieselbe Beschriftung, und dort ist sie die stärkere:
			   kein einziger Commit kommt von jemand anderem, dependabot inklusive. */
			`v3: ${ayako.v3.commits} Commits, kein weiterer Mitwirkender · ${ayako.v3.featurePlugins} Feature-Plugins · ${ayako.v3.testFiles} Testdateien direkt neben dem Code.`
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
		/**
		 * DEFEKT 4, UND AUF DIESER WAND WAR ER SCHLIMMER. Der größte Satz der
		 * Seite war eine Absage — „A feature that I cannot provide for free
		 * will not be implemented.“ —, und auf der deutschen Wand stand er in
		 * 38 px auf ENGLISCH, während das Deutsche in einer handschriftlichen
		 * Notiz mit 13,97 px daneben lag: laut war fremd, leise war die eigene
		 * Sprache. Beides ist getauscht. Das Plakat sagt jetzt auf Deutsch,
		 * was das Versprechen für Lesende bedeutet; das englische Original
		 * bleibt vollständig erhalten — als Zitat in der Notiz, wo ein Zitat
		 * auch als Zitat gelesen wird. Gestrichen wurde nichts.
		 *
		 * BLOCKIERT DURCH Projects.astro:193: dort steht
		 * `<blockquote lang="en"><p>“{promise}”</p></blockquote>`. Die
		 * Anführungszeichen und das `lang="en"` kommen aus dem Component —
		 * beide müssen weg, sonst steht deutscher Text unter englischer
		 * Sprachauszeichnung, also genau der Fehler, der hier behoben wird.
		 */
		promise: "Ayako ist seit 2019 kostenlos — und bleibt es.",
		/* Die Notiz trägt, was das Plakat nicht mehr sagt: das Versprechen im
		   Wortlaut. Es wurde auf Englisch gegeben und wird deshalb auf
		   Englisch zitiert; die Übersetzung steht daneben, nicht an seiner
		   Stelle. */
		promiseNote: `Öffentlich gegeben, im Wortlaut: „${ayako.freeForeverPromise}“ — auf Deutsch: „Eine Funktion, die ich nicht kostenlos anbieten kann, wird nicht umgesetzt.“`,
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
			`${h(ihk.finalProject.hours)}, ${ihk.finalProject.window.start} bis ${ihk.finalProject.window.end} — vom Ausbildungsbetrieb als »selbstständig ausgeführt« abgezeichnet.`,
			`Lasttest mit ${n(ihk.finalProject.loadTestServers)} echten Discord-Servern, über den Live-Token meines eigenen Bots (Projektdokumentation, 2025-06).`,
			"<5 s Erstladezeit bei 100 Servern · <200 ms Serverwechsel · >95 % Cache-Trefferquote · konstant 30 FPS (Projektdokumentation, 2025-06).",
			`${ihk.finalProject.code.typescript.files} TypeScript-Dateien (${n(ihk.finalProject.code.typescript.linesOfCode)} LOC) + ${ihk.finalProject.code.svelte.files} Svelte-Dateien (${n(ihk.finalProject.code.svelte.linesOfCode)} LOC).`,
			`${h(ihk.finalProject.trackedHours)} auf dem Repo erfasst.`
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
			"Läuft auf Hybrid-Sharding mit einem eigenen V8-Speichermonitor: Heap-Sampling alle 30 Sekunden mit Garbage-Collection-Trigger bei 85 %."
		],
		facts: [
			/* Fremdzitat: die Angabe des Repos, unverändert übernommen. */
			"Eigenangabe „10,000+ servers“ — Repo-Metadaten, nicht verifiziert.",
			/* Dieselbe Neubeschriftung wie auf der Ayako-Karte, aus demselben
			   Grund. Dieses Repository ist privat, die Zahl also — anders als bei
			   v2 — von außen nicht nachprüfbar; die bernsteinfarbene Notiz der
			   Karte sagt das bereits. */
			`332 Dateien · ${n(17_250)} LOC · 128 Commits, kein weiterer Mitwirkender.`,
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
		name: "SteamVR-Discord-Overlay",
		role: "vr",
		oneLiner:
			"SteamVR-Overlay in C#/.NET 8, das den Discord-Voice-Status im Headset rendert — mit interaktivem Mute und Deafen.",
		body: [
			"Discord RPC direkt über die lokale IPC-Pipe implementiert — ohne Bot-Token. Ausgeliefert als einzelne self-contained Executable mit Lizenz, Datenschutzerklärung, Nutzungsbedingungen und Release-Workflow."
		],
		/* Siehe wall.ts: Die GitHub-Beschreibung dieses Projekts beginnt mit
		   "This project is majorly AI genned" — vom Eigentümer selbst, öffentlich.
		   Die Karte zeigte nur die Zeilenzahl, und genau die bläht KI-Generierung
		   auf. Vom Eigentümer bestätigt, 2026-08-08. */
		facts: [
			"Überwiegend KI-generiert, wie es im Repository steht.",
			`${n(4_059)} LOC in 15 Dateien.`
		],
		stack: ["C#/.NET 8", "SkiaSharp", "DirectX 11 (Vortice)", "OpenVR", "Kestrel", "WebSocket"],
		links: [{ label: "das Repository", href: "https://github.com/Larsundso/SteamVR-Discord-Overlay" }]
	},
	{
		id: "vrc-inviter",
		name: "VRC-Inviter",
		role: "vr",
		oneLiner: "Windows-Tray-Dienst, der VRChat-Einladungen automatisch nach Vorrangregeln annimmt.",
		body: [
			"Spec-first: Das Designdokument trägt das Datum 2026-04-16 — geschrieben vor der Implementierung. DPAPI-verschlüsselte Zugangsdaten, ein Web-Dashboard nur auf Loopback, SQLite-Persistenz."
		],
		facts: [`${n(4_481)} LOC in 55 Dateien · xUnit-Suite mit 7 Modulen.`,
			"Kein öffentliches Repository — dieses hier lässt sich nicht nachprüfen."
		],
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
		facts: [`${n(2_436)} LOC in 36 Dateien · vitest-Suite mit undici MockAgent.`,
			"Kein öffentliches Repository — dieses hier lässt sich nicht nachprüfen."
		],
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
		facts: [`${n(32_427)} LOC in 121 Dateien · 15 Backend-Service-Module · 19 Testdateien.`,
			"Kein öffentliches Repository — dieses hier lässt sich nicht nachprüfen."
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
			"Geführt mit der Disziplin eines öffentlichen Projekts: striktes TypeScript, Kompression mit SSH/HTTP-Upload-Fallback, Docker-Packaging und eine SECURITY.md."
		],
		/* Siehe wall.ts: Die GitHub-Beschreibung dieses Projekts beginnt mit
		   "This project is majorly AI genned" — vom Eigentümer selbst, öffentlich.
		   Die Karte zeigte nur die Zeilenzahl, und genau die bläht KI-Generierung
		   auf. Vom Eigentümer bestätigt, 2026-08-08. */
		facts: [
			"Überwiegend KI-generiert, wie es im Repository steht.",
			`${n(3_264)} LOC striktes TypeScript in 75 Dateien.`
		],
		stack: ["TypeScript", "ffmpeg", "youtube-dl-exec", "SWC", "Docker"],
		links: [{ label: "das Repository", href: "https://github.com/Larsundso/GIFfer" }],
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
		text: "waifu-pics-api — MIT-lizenzierter npm-Wrapper für die Bild-API von waifu.pics. Das letzte Release schlägt seit dem Auslaufen der Upstream-Domain beim Import bewusst fehl, statt leere Daten zu liefern. Deprecated: 2026-05-07.",
		link: { label: "npm", href: "https://www.npmjs.com/package/waifu-pics-api" }
	},
	{
		text: `vr-diag — drei forensische PowerShell-Skripte (${n(1_202)} LOC): VR-Crash-Forensik über Event-Logs, WHEA und Minidumps; ein VR-Lag-Monitor; ein Bugcheck-Analyzer. 48 erfasste Lauf-Datensätze.`
	},
	{
		text: "Restart-VR.bat — idempotenter Windows-Batch-Orchestrator, der einen VR-Streaming-Stack über tasklist, CIM und UDP-Port-Probes hochfährt."
	},
	{
		text: "Kfz-Elektronik — Kamera-Einbau und eine 12 V LiFePO₄ Zweitbatterie nachgerüstet in einem Smart 450; Höhenkarte per ESP8266 + MQTT."
	}
];

/* ------------------------------------------------------------------ */
/* AI practice — subordinate placement by owner decision               */
/* ------------------------------------------------------------------ */

export const aiPractice = {
	/** Owner: "not what I want to be hired for exclusively." */
	placement: "subordinate",
	title: "Wie ich mit Agenten arbeite",
	/* siehe wall.ts: die Kontrolle steht im Satz hinten, wo das Gewicht
	   liegt. Agenten tippen nicht, sie entwerfen. */
	intro:
		"Agenten liefern Entwürfe. Entschieden, geprüft und committet wird von mir. Hier sind die Zahlen — und die Regeln, unter denen sie laufen.",
	entries: [
		{
			id: "volume",
			title: "Volumen",
			lines: [
				`${n(ai.transcripts.count)} Claude-Code-Transkripte (${ai.transcripts.sizeMb} MB, ${n(ai.transcripts.events)} protokollierte Events) über ${ai.transcripts.days} Tage, ${ai.transcripts.window.start} bis ${ai.transcripts.window.end} — ${n(ai.sessionsPerDay)} Top-Level-Sessions pro Tag.`,
				`Session-Indizes belegen die Nutzung seit mindestens ${ai.transcripts.evidencedSince}.`
			]
		},
		{
			id: "orchestration",
			title: "Orchestrierung",
			lines: [
				`${pc(ai.subagentShare.percent)} der Transkripte (${n(ai.subagentShare.count)} von ${n(ai.subagentShare.of)}) sind Subagenten- und Workflow-Läufe, verschachtelt unter übergeordneten Sessions.`,
				`Prompt-zu-Antwort-Verhältnis in der Stichprobe: ${promptRatio} — lange autonome Läufe, ab und zu nachgesteuert.`,
				"Mehrere Sessions laufen gleichzeitig auf einem Checkout, nach schriftlichen Konventionen: atomare Claim-Locks für geteilte Logs, Commits per Pathspec gegen Index-Races, mtime-basierte Attributionsprüfung vor jedem Revert."
			]
		},
		{
			id: "adoption",
			/* siehe wall.ts: keine Kurve. Vier Fenster, mit Pfeilen verbunden,
			   luden dazu ein, vier aufeinanderfolgende Zeiträume zu lesen —
			   sie überlappen sich aber, und eines enthält die anderen. */
			title: "Gemessene KI-Nutzung",
			lines: [
				"„AI Coding“ ist eine WakaTime-Kategorie erfasster Zeit: wie viel der gemessenen Programmierzeit in KI-gestützten Sitzungen lief — nicht, wie viel des Codes eine KI geschrieben hat.",
				`Gesamtzeitraum (${telemetry.trackingStart} bis ${telemetry.trackingEnd}): ${pc(telemetry.aiCoding.sharePercentByWindow.lifetime)}. Die 12 Monate bis ${SNAPSHOT_AS_OF}: ${pc(telemetry.aiCoding.sharePercentByWindow.last12Months)}. Juli 2026, der Kalendermonat: ${pc(telemetry.aiCoding.sharePercentByWindow.july2026)}. Die 7 Tage bis ${SNAPSHOT_AS_OF}: ${pc(telemetry.aiCoding.sharePercentByWindow.last7Days)}.`,
				"Vier Fenster, keine vier Zeiträume — sie überlappen sich. Der Gesamtzeitraum enthält alle, und sowohl der Juli 2026 als auch die letzten sieben Tage liegen innerhalb der letzten 12 Monate. Vier Zoomstufen auf dieselbe Aufzeichnung, keine Kurve.",
				`${pc(telemetry.aiCoding.last12MonthsShareOfLifetimePercent)} der jemals erfassten AI-Coding-Zeit fällt in die letzten 12 Monate. ${hm(telemetry.aiCoding.lifetime.seconds)} insgesamt.`,
				`Claude Code: ${pc(telemetry.windowJuly2026.claudeCodeEditorPercent)} der Editor-Zeit im Juli 2026.`,
				`Markdown stieg von ${pc(telemetry.lifetime.markdownPercent)} der Sprachzeit im Gesamtzeitraum auf ${pc(telemetry.windowJuly2026.markdownPercent)} im Juli 2026 — die Signatur spezifikationsgetriebener, agentischer Arbeit.`
			]
		},
		{
			id: "governance",
			title: "Governance",
			lines: [
				"Agenten committen, stagen und pushen nie — jeden Commit verfasse und prüfe ich selbst.",
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
		/* „woher weißt du das?“ legte ein an den Eigentümer gerichtetes du in
		   den Mund der Lesenden — die Legende spricht aber für sie, nicht zu
		   ihm. */
		{ ink: "teal", job: "die Herkunft", q: "woher kommt die Zahl?" },
		/* die einzige Verbalphrase unter sechs Nominalphrasen */
		{ ink: "green", job: "die Laufzeit", q: "seit wann, und läuft es noch?" },
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
	 *  wurde keine genannt, und es wird keine unterstellt.
	 *
	 *  DIE REIHENFOLGE TRÄGT, und der letzte Eingriff hat die Bremse an die
	 *  lautere Stelle geschoben. Vorher stand sie zuerst — richtige
	 *  Diagnose, falsches Mittel: die erste Position ist das Thema, die
	 *  letzte ist der Fokus, die betonteste Stelle des Blocks. Schwach ist
	 *  die Mitte, und dort steht der Vorbehalt jetzt: Angebot → Vorbehalt →
	 *  Bedingungen → Versprechen. Gestrichen wurde nichts.
	 *
	 *  Und das Versprechen bekommt sein Subjekt zurück: „Jede Mail … wird
	 *  beantwortet“ war das einzige Versprechen der Wand, dessen
	 *  Versprechender grammatisch fehlte.
	 *
	 *  Der Ort steht nur auf REGIONS-Ebene, wie im Kopf und im Fuß der
	 *  Seite. „Bodensee-Ravensburg“ nannte eine Stadt. */
	rightNow: {
		title: "Aktuell",
		lines: [
			/* „Produktarbeit“ gibt es im Deutschen nicht — siehe hero.intro. Das
			   ist die zweite der beiden Zeilen, die sagen, was er sucht, und
			   damit der Satz, den ein Recruiter nach Stichwort abgleicht. */
			"Offen für Produktentwicklung mit TypeScript/Node — Backend oder Full-Stack. Erzähl mir davon.",
			"Seit 2025 Full-Stack-Entwickler bei der Raleo Digital GmbH. Kein dringender Wechselwunsch.",
			"Remote, oder vor Ort in der Region Bodensee-Oberschwaben.",
			"Ich beantworte jede Mail an diese Adresse."
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
		/* „Auszubildender“ steht im Deutschen nicht attributiv vor der
		   Berufsbezeichnung — es heißt „Auszubildender ZUM …“. Erste
		   Berufsbezeichnung, die eine deutsche Personalabteilung liest. */
		role: "Auszubildender zum Fachinformatiker für Anwendungsentwicklung",
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
		/* „Fachrichtung Anwendungsentwicklung“ stand hier ein zweites Mal —
		   die Institution darüber heißt bereits „… für Anwendungsentwicklung“.
		   Die englische Wand behält ihre Entsprechung: dort ist sie die
		   einzige Erklärung der Fachrichtung, hier ist sie Wiederholung. */
		detail: `DQR-Niveau 4. Ausbildungsbetrieb: ${ihk.trainingCompany}. IHK-Abschlussprojekt »${ihk.finalProject.title}«, vom Betrieb als »selbstständig ausgeführt« abgezeichnet.`,
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
/* Fremdsprachige Passagen                                             */
/* ------------------------------------------------------------------ */
/* Auf der englischen Wand stehen vier deutsche Fachbegriffe mitten im
 * englischen Fließtext; sie werden dort mit `lang="de"` ausgezeichnet
 * (siehe wall.ts). Diese Wand steht komplett unter `<html lang="de">` —
 * es gibt hier keine fremdsprachige Passage, also ist die Liste leer.
 * Der Scanner selbst ist Logik, keine Übersetzung, und wird geteilt. */
export const germanRuns: readonly string[] = [];

export { splitLangRuns } from "./wall";
export type { LangRun } from "./wall";
/* Damit dieses Modul weiterhin JEDEN benannten Export von wall.ts spiegelt —
 * die Zusage im Kopf dieser Datei. Der Wert ist derselbe, nicht nur die Form. */
export { MESSE_FAIRS };

/* ------------------------------------------------------------------ */
/* UI strings — shared interface contract                              */
/* ------------------------------------------------------------------ */

export const ui = {
	nav: {
		/** Das Schild über dem Abschnitt. */
		werdegang: "Werdegang",
		/**
		 * Dasselbe Ziel in der Navigation und am Randlineal — siehe wall.ts:
		 * dort ist „Werdegang“ das einzige Nav-Label, das seinem englischen
		 * Publikum sein Ziel nicht verrät, und bekommt deshalb einen
		 * englischen Wegweiser. Auf dieser Wand verrät das Wort sein Ziel
		 * bereits, also steht in beiden Rollen dasselbe. Der Schlüssel
		 * existiert hier trotzdem: `getWall` castet dieses Modul durch
		 * `unknown`, ein fehlender Schlüssel fällt also nicht in tsc auf,
		 * sondern erst als `undefined` auf der Seite.
		 */
		werdegangWayfinding: "Werdegang",
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
		/**
		 * Handschriftlicher Zettel neben dem Werdegang-Flyer. Er zählt die
		 * Arbeitgeber, denn wer sie nicht zählt, liest diesen Abschnitt als
		 * eine Stelle und ein Zeugnis.
		 *
		 * ER NENNT JETZT DIE STELLE — siehe wall.ts. Der Kopf des Abschnitts
		 * zeigte 16 Jahre („2010 – heute“) und eine Anzahl; die aktuelle Stelle
		 * stand erst 3.802 px weiter unten. Sie steht im ZETTEL und nicht in
		 * `headDates`: `.rf-headdates` wird roh gerendert (kein
		 * `splitLangRuns`, also erreicht `properNouns` die Zeile nie) und steht
		 * außerhalb der `hyphens: manual`-Liste in wall.css, während
		 * `html:lang(de)` `hyphenate-limit-chars: 6 3 3` setzt — „Raleo Digital
		 * GmbH“ könnte dort als `Digi-/tal` brechen. Der Zettel ist
		 * `.hand-note`: keine Trennung, Breite bereits gedeckelt.
		 */
		headNote:
			"zwei Arbeitgeber seit 2022 — aktuell Full-Stack-Entwickler bei der Raleo Digital GmbH. Beruf und Ausbildung, der Reihe nach aufgefädelt.",
		/** Scope line under the Werdegang rule; see wall.ts. */
		headDates: "2010 – heute",
		/** Education card date line while ongoing, e.g. "seit 2022-09". */
		since: (start: string) => `seit ${start}`,
		/** Titel der EINEN Schulzeit-Karte — siehe wall.ts: aus drei Karten
		 *  wird eine, alle Institutionen und alle Daten bleiben stehen. */
		schooling: "Schulzeit",
		/** Der Satz dieser Karte — siehe wall.ts: NOCH NICHT GERENDERT,
		 *  gehört direkt unter die Überschrift. Sie ist die einzige Karte der
		 *  Wand ohne einen einzigen Satz, und die Schlussfolgerung, die man
		 *  aus drei nackten Datumszeilen zieht, ist nicht die freundliche.
		 *  Der Satz fügt keine Angabe hinzu, die nicht in den Daten steht. */
		schoolingNote:
			"Allgemeinbildende Schulzeit vor der Ausbildung, vollständig aufgeführt — auch die beiden Einträge, die nur wenige Monate gedauert haben. Entweder ist die Aufzeichnung vollständig oder sie ist es nicht.",
		/** Eine Schulzeile: Zeitraum, dann Institution. */
		schoolLine: (dates: string, institution: string) => `${dates} · ${institution}`,
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
		/* siehe wall.ts: das Canvas trägt jetzt `touch-action: pan-y`, der
		   Zug gehört also nur noch der Waagerechten — und genau die gewichtet
		   die Drehung. Eine Beschriftung, nicht zwei. */
		vrSketchCaption: "Wireframe-Headset, in three.js skizziert — seitwärts ziehen zum Drehen",
		/* `role="img"` kündigt eine Grafik an und bietet keine Bedienung an;
		   das Canvas ist außerdem nicht mehr fokussierbar (WCAG 2.5.7 will
		   eine Ein-Zeiger-Alternative, keine Tastatur-Alternative). Also
		   benennt die Beschriftung nur noch, was zu sehen ist. */
		vrSketchAria: "Wireframe-Skizze eines VR-Headsets.",
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
		/* dritte und letzte Fundstelle von „Produktarbeit“ — das Wort ist keine
		   Frage des Registers, es existiert im Deutschen nicht, also fällt es
		   auch aus einer Diagramm-Überschrift */
		topProjects: (count: number) =>
			`Produktentwicklung seit ${ayako.inProductionSince} — die Top ${count} nach erfassten Stunden`,
		ayakoFamily: `Ein Produkt, ${ayako.generations} Generationen, seit ${ayako.inProductionSince} im Produktivbetrieb`,
		topLanguages: (count: number) =>
			`Eine Sprachfamilie trägt das Produkt — Top ${count} nach erfassten Stunden`,
		weekByProject: "Woran gerade gebaut wird — nach Projekt",
		weekByLanguage: "Woran gerade gebaut wird — nach Sprache",
		activeDays: "Tage, an denen Code entstanden ist"
	},
	/** Unit + window lines (voice law). */
	units: {
		/* Das Komma der Apposition, das die englische Zeile führt und diese
		   verlor: „Gesamtzeitraum, 2021-10-29 → 2026-08-03“. */
		lifetimeHours: (window: string, asOf: string) =>
			`Erfasste Zeit in Stunden · Gesamtzeitraum, ${window}${asOfSuffix(window, asOf)}`,
		lifetimeShare: (window: string, asOf: string) =>
			`Anteil an der gesamten erfassten Programmierzeit · Gesamtzeitraum, ${window}${asOfSuffix(window, asOf)}`,
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
	axisHours: "{value} h",
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
		/* siehe wall.ts: das Blatt zeigt eine kuratierte Auswahl, keine
		   Rangliste — Daten- und Auszeichnungsformate sind ausgenommen. */
		appLanguagesLifetimeIntro: (count: number, asOf: string) =>
			`Balkendiagramm der ${count} am meisten erfassten Anwendungssprachen — Daten- und Auszeichnungsformate ausgenommen — ` +
			`mit einem letzten Balken für alles andere; Gesamtzeitraum, Stand ${asOf}`,
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
			`* Anteil abgeleitet aus den veröffentlichten Stunden und dem Gesamtwert; die Zeile „Alles andere“ ist dieser Gesamtwert minus die veröffentlichten Zeilen. Beides Stand ${asOf}.`
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
			`${users} Nutzer, ${servers} Server — und ${pc(percent)} der Aufzeichnung`,
		languageTop: (name: string, time: string) => `Das Produkt läuft auf ${name} — ${time} davon`,
		weekTotal: (total: string, leadName: string) =>
			`An ${leadName} wird weiter gebaut — ${total} davon diese Woche`,
		weekDaily: (average: string, leadName: string) =>
			`Die Änderungen landen weiter in ${leadName} — ${average} pro Tag`,
		habitRate: (ratePercent: number, sinceYear: string) =>
			`An ${pc(ratePercent)} aller Tage seit ${sinceYear} ist Code entstanden`
	},
	habit: {
		line: (active: string, elapsed: string, ratePercent: string) =>
			`${active} von ${elapsed} vergangenen Tagen mit erfasster Programmierzeit — ${ratePercent} %.`,
		/* siehe wall.ts: keine Kalender-Lesart zulassen — die Zellen werden
		   der Reihe nach gefüllt, die leeren Tage verteilen sich über den
		   gesamten Zeitraum und stehen nicht am Ende */
		smallPrint: "Zwei Zählungen, kein Kalender — die Zellen werden gezählt, nicht datiert."
	},
	/** Typed provenance-card lines (Telemetry "Quelle" card). */
	provenance: {
		/** Die Stand-Regel der Wand, einmal gesagt, damit keine Zahl sie
		 *  wiederholen muss.
		 *
		 *  OHNE PRÄPOSITION VOR DEM ISO-DATUM: „am 2026-08-03“ ist die
		 *  deutlichste Übersetzungsspur im deutschen Text — gesprochen wird
		 *  „am dritten August“, geschrieben steht hier ein ISO-Datum, und die
		 *  beiden passen nicht zusammen. Das ISO-Format bleibt (zwei
		 *  Datumsformate auf einer Wand kosten mehr als die milde Fremdheit
		 *  eines deutschen ISO-Datums); die Präposition geht. */
		convention: (asOf: string) =>
			`Wenn an einer Zahl kein anderes Datum steht, gilt das Messdatum ${asOf}.`,
		live: (asOf: string) =>
			`Diagramme zur Build-Zeit von der WakaTime-API abgerufen; Fensterende: ${asOf}.`,
		snapshot: (asOf: string) =>
			`Eingecheckte Zahlen aus dem WakaTime-API-Abruf vom ${asOf} — Live-Builds rufen zur Build-Zeit ab und ergänzen die Sieben-Tage-Diagramme.`,
		currentlyJuly2026: (display: string) =>
			`Aktuell (Juli 2026): ${display} erfasste Programmierzeit pro Tag.`,
		/** Warum auf den Karten volle Stunden stehen — und wie der exakte
		 *  Wert lautet. */
		precision: (shown: string, exact: string) =>
			`Gesamtwert, exakt wie abgerufen: ${exact}. Auf den Karten steht ${shown}. WakaTime misst keine Dauer, es baut sie: Heartbeats, die innerhalb eines Zeitfensters von 15 Minuten aufeinanderfolgen, werden zusammengezogen — in dieser Größenordnung ist die Minutenstelle also nichts, was das Instrument bestimmen kann, und sie zu drucken hieße, eine Genauigkeit anzubieten, die die Methode nicht hat. Aufgerundet wird nichts; in den Datentabellen steht jeder exakte Wert.`,
		/** Die Adresse, für die die Karte bisher nur das Instrument nannte. */
		endpoint: (url: string) => `Prüf es selbst — öffentlich, ohne Schlüssel: ${url}`,
		/** Was dieser Endpunkt belegt — und das eine, was er nicht belegt. */
		checkable: (o: { reconstructed: string; shortfall: string; checkedOn: string }) =>
			`Er bestätigt die Sprachanteile bis auf Hundertstel genau; die kleinen Abweichungen sind Drift: Diese Seite ist datiert, der Endpunkt ist live. Den Gesamtwert bestätigt er nicht: Die Programmieraktivität steht auf diesem Profil auf privat, die API hält den Gesamtwert also zurück, und die einzige verbleibende Rekonstruktion — die Sprachzeilen aufaddieren — kommt auf ${o.reconstructed} und damit ${o.shortfall} zu wenig, weil die API für die Zeile „Other“ keine manuelle Zeit ausweist. Diese Lücke ist der Sammelposten, keine Zahl zu meinen Gunsten — und der eine Wert hier, den du heute nicht nachprüfen kannst. Nachgeprüft ohne Anmeldung, ${o.checkedOn}.`,
		/** Ein datierter Snapshot driftet gegen einen Live-Abruf; sag es,
		 *  bevor jemand den Unterschied findet und ihn für Nachlässigkeit
		 *  hält. */
		drift: (live: string, printed: string, checkedOn: string) =>
			`Ein datierter Snapshot driftet gegen einen Live-Abruf, und das soll er: Stand ${checkedOn} meldete derselbe Endpunkt für AI Coding ${live}, wo diese Wand ${printed} druckt — zwei Tage früher gemessen.`
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
			`${o.active} von ${o.elapsed} Tagen aktiv — ${o.ratePercent} %, ${o.start} bis ${o.end}.`,
		dailyAverage: (average: string) =>
			`Tagesdurchschnitt über den Gesamtzeitraum: ${average}.`,
		sourceLine: (sourceNote: string, mode: string) => `Quelle: ${sourceNote} — ${mode}.`,
		modeLive: "zur Build-Zeit abgerufen",
		modeSnapshot: "eingecheckter Snapshot"
	}
} as const;
