/* BLIND-REVIEW CAPTURE. In the repo, not a scratchpad — the previous copy was
 * deleted by a tmp reaper along with a full cycle of reports.
 *
 * THREE HARNESS BUGS HAVE EACH INVALIDATED A ROUND. Guard against all three:
 *  1. FOLD-ONLY. One screenshot per candidate scored a fold, not a site.
 *  2. TRUNCATED. MAX_FRAMES capped coverage at 44 % and reported it as full.
 *  3. fullPage ERASES THE CONCEPT. A fullPage shot renders at scroll 0, where
 *     most `.thread-path` elements are 0 % drawn — every frame showed a
 *     corkboard with NO RED THREAD, i.e. the entire organising idea invisible.
 * So: viewport screenshots at successive scroll offsets, coverage derived from
 * page height and ASSERTED at 100 %, and a hard failure if it falls short.
 * Realistic viewports only — shrinking the viewport to fit more page per frame
 * changes the layout being judged. */
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const EXE =
	process.env.PLAYWRIGHT_CHROMIUM ??
	"/home/main/.cache/ms-playwright/chromium_headless_shell-1232/chrome-headless-shell-linux64/chrome-headless-shell";
const ORIGIN = process.env.ORIGIN ?? "http://localhost:4321";
const OUT = process.env.OUT ?? "./shots";

const PASSES = [
	{ id: "en-desktop", path: "/", w: 1440, h: 900, motion: "no-preference" },
	{ id: "en-phone", path: "/", w: 390, h: 844, motion: "no-preference" },
	{ id: "de-desktop", path: "/de/", w: 1440, h: 900, motion: "no-preference" },
	{ id: "de-phone", path: "/de/", w: 390, h: 844, motion: "no-preference" }
];

const b = await chromium.launch({ executablePath: EXE });
const manifest = [];
for (const pass of PASSES) {
	const dir = `${OUT}/${pass.id}`;
	mkdirSync(dir, { recursive: true });
	const ctx = await b.newContext({
		viewport: { width: pass.w, height: pass.h },
		reducedMotion: pass.motion === "reduce" ? "reduce" : "no-preference",
		deviceScaleFactor: 1
	});
	const p = await ctx.newPage();
	await p.goto(ORIGIN + pass.path, { waitUntil: "networkidle" });
	await p.evaluate(async () => { await document.fonts.ready; });
	await p.waitForTimeout(400);
	const pageH = await p.evaluate(() => document.documentElement.scrollHeight);
	const frames = Math.ceil(pageH / pass.h);
	let covered = 0;
	for (let i = 0; i < frames; i++) {
		const y = Math.min(i * pass.h, pageH - pass.h);
		await p.evaluate(async (yy) => {
			window.scrollTo({ top: yy, behavior: "instant" });
			/* two rAFs: scroll-driven timelines resolve on the frame AFTER the
			   scroll, so one is not enough and a timeout is not deterministic */
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
		}, y);
		await p.waitForTimeout(90);
		const file = `${dir}/${String(i).padStart(3, "0")}.png`;
		await p.screenshot({ path: file });          /* NEVER fullPage */
		covered += pass.h;
	}
	const pct = Math.min(100, (100 * covered) / pageH);
	manifest.push({ pass: pass.id, viewport: `${pass.w}x${pass.h}`, pageHeight: pageH, frames, coverage: +pct.toFixed(1) });
	console.log(`${pass.id.padEnd(12)} page ${String(pageH).padStart(6)}px  ${String(frames).padStart(3)} frames  coverage ${pct.toFixed(1)}%`);
	if (pct < 100) { console.error(`FAIL: ${pass.id} covered only ${pct.toFixed(1)}% — a partial capture is not a review`); process.exitCode = 1; }
	await ctx.close();
}
writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
await b.close();
console.log(`\nmanifest: ${OUT}/manifest.json`);
