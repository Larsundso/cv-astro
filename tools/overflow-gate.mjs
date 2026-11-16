/* THE CONTENT-LOSS GATE.
 *
 * Kept in the REPO and not in a scratchpad: the original lived in a session
 * scratchpad and was deleted by a tmp reaper roughly half an hour after its
 * last green run, together with the twelve faculty reports and every other
 * probe older than a day. An instrument that five cycles of work depend on
 * does not belong somewhere that garbage-collects by age.
 *
 * WHY IT EXISTS. `documentElement.scrollWidth - clientWidth` is a NULL
 * INSTRUMENT on this page: `html { overflow-x: clip }` suppresses the
 * scrollbar AND the delta while content is silently cut off. Every matrix run
 * for five cycles used it and read 0 while 20 text runs were gone.
 * `document.body.scrollWidth` sees it.
 *
 * CALIBRATION. The 1.2deg pin tilt inflates a card's bounding box BY DESIGN,
 * so it is neutralised before measuring layout or it contributes ~5px of
 * false positive. With `rotate: none` injected the clean baseline reads
 * EXACTLY 320 === 320 in both locales, so this runs at ZERO tolerance rather
 * than an invented one.
 *
 * IT FAILS ON CONTENT LOSS, NOT BOX OVERHANG. `body.scrollWidth` also counts
 * decorative overhang — a stamp rotated past a card's edge, a pin head —
 * which `overflow-x: clip` exists to absorb and which costs a reader nothing.
 * The defect this gate is for is TEXT THAT IS GONE, so that is what it fails
 * on; bodyOverflow stays in the output as the diagnostic that made it
 * findable in the first place.
 *
 * RUN:  npx astro build && npx astro preview --port 4321
 *       node tools/overflow-gate.mjs
 * Needs `playwright-core` resolvable and a Chromium headless shell; override
 * the binary with PLAYWRIGHT_CHROMIUM, the origin with ORIGIN. */
import { chromium } from "playwright-core";

const EXE =
	process.env.PLAYWRIGHT_CHROMIUM ??
	"/home/main/.cache/ms-playwright/chromium_headless_shell-1232/chrome-headless-shell-linux64/chrome-headless-shell";
const ORIGIN = process.env.ORIGIN ?? "http://localhost:4321";

const cells = [];
for (const root of [16, 20, 24, 32]) for (const width of [320, 390, 1440]) cells.push({ root, width });

const b = await chromium.launch({ executablePath: EXE });
let bad = 0;
console.log("locale root width  bodyOverflow  lostRuns  docDelta(null instrument)");
for (const [loc, path] of [["EN", "/"], ["DE", "/de/"]]) {
	for (const { root, width } of cells) {
		const p = await b.newPage({ viewport: { width, height: 844 } });
		const cdp = await p.context().newCDPSession(p);
		await cdp.send("Page.setFontSizes", { fontSizes: { standard: root, fixed: root } }).catch(() => {});
		await p.goto(ORIGIN + path, { waitUntil: "networkidle" });
		await p.waitForTimeout(120);
		const r = await p.evaluate(() => {
			const s = document.createElement("style");
			s.textContent = ".pinned{rotate:none !important}";
			document.head.appendChild(s);
			const cw = document.documentElement.clientWidth;
			let lost = 0;
			const worst = [];
			const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
			let n;
			while ((n = walk.nextNode())) {
				const t = n.nodeValue.trim();
				if (t.length < 3) continue;
				let skip = false;
				for (let el = n.parentElement; el; el = el.parentElement) {
					const cs = getComputedStyle(el);
					/* legitimate scrollers are not content loss */
					if (cs.overflowX === "auto" || cs.overflowX === "scroll") { skip = true; break; }
					/* visually-hidden text is clipped BY DESIGN and is still in the
					   accessibility tree — counting it is a false positive */
					if (cs.clipPath !== "none" || el.classList.contains("sr-only")) { skip = true; break; }
					if (cs.visibility === "hidden" || cs.display === "none") { skip = true; break; }
				}
				if (skip) continue;
				const rg = document.createRange();
				rg.selectNodeContents(n);
				for (const rc of rg.getClientRects()) {
					if (rc.width < 1) continue;
					const over = Math.round(rc.right - cw);
					if (over > 1) { lost++; worst.push({ over, t: t.slice(0, 44) }); break; }
				}
			}
			worst.sort((a, z) => z.over - a.over);
			const out = {
				body: document.body.scrollWidth - document.body.clientWidth,
				doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
				lost,
				worst: worst.slice(0, 2)
			};
			s.remove();
			return out;
		});
		const ok = r.lost === 0;
		if (!ok) bad++;
		console.log(
			`${loc}     ${String(root).padEnd(4)} ${String(width).padEnd(5)} ${String(r.body).padEnd(13)} ${String(r.lost).padEnd(9)} ${r.doc}${ok ? "" : "   <-- FAIL"}`
		);
		if (!ok) r.worst.forEach((w) => console.log(`        +${w.over}px  "${w.t}"`));
		await p.close();
	}
}
console.log(
	bad === 0
		? `\nGATE GREEN — 0 of ${cells.length * 2} cells lose content`
		: `\n${bad} of ${cells.length * 2} cells LOSE CONTENT`
);
await b.close();
process.exit(bad === 0 ? 0 : 1);
