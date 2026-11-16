// Runs before every build (package.json "build"). Two re-reads, each keeping the last good file on failure:
// 1. Ayako's scale from https://api.ayakobot.com/v1/bot/stats (GET only; HEAD gets a 403) into
//    src/lib/stats.json with the Europe/Berlin date of the reading (owner, 2026-10-28, FACTS 5).
//    guildInstallCount is never kept.
// 2. The gateway globe's snapshot from {GLOBE_API}/gateway/snapshot into static/globe-snapshot.json,
//    only when the API says connected; then the still is redrawn from it (scripts/globe-assets.mjs).
//    Only the known aggregate fields are copied: no ID, no payload, no locale ever reaches the file.
// The build never fails here: a failed read prints a warning and the page prints the last good reading.
// Self-check: node scripts/stats.mjs --selftest
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
// keep in step with vite.config.ts
const GLOBE_API = (process.env.GLOBE_API || 'https://api.ayakobot.com/bot').replace(/\/$/, '');
const STATS = 'https://api.ayakobot.com/v1/bot/stats';

const count = (n) => Number.isSafeInteger(n) && n > 0;
const berlinDay = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(d);

export function readStats(body, day = berlinDay()) {
	if (!body || !count(body.guildCount) || !count(body.userCount) || !count(body.userInstallCount)) return null;
	return { members: body.userCount, servers: body.guildCount, userInstalls: body.userInstallCount, readOn: day };
}

const num = (n, lo, hi) => typeof n === 'number' && Number.isFinite(n) && n >= lo && n <= hi;
export function readSnapshot(body) {
	if (!body || body.connected !== true || typeof body.measured !== 'string' || Number.isNaN(Date.parse(body.measured))) return null;
	if (!num(body.windowSeconds, 1, 86400) || !num(body.ratePerSecond, 0, 1e6) || !Array.isArray(body.points)) return null;
	const points = body.points.filter((p) => Array.isArray(p) && p.length === 3 && num(p[0], -90, 90) && num(p[1], -180, 180) && num(p[2], 0, 1));
	if (!points.length || points.length > 2000) return null;
	return {
		measured: new Date(body.measured).toISOString(),
		windowSeconds: body.windowSeconds,
		ratePerSecond: body.ratePerSecond,
		points: points.map(([lat, lon, share]) => [lat, lon, share]),
		connected: true
	};
}

async function getJson(url) {
	const res = await fetch(url, { signal: AbortSignal.timeout(10_000), headers: { accept: 'application/json' } });
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}

if (process.argv.includes('--selftest')) {
	const assert = (await import('node:assert/strict')).default;
	const s = readStats({ guildCount: 8529, userCount: 2844485, guildInstallCount: 8529, userInstallCount: 1720 }, '2026-10-24');
	assert.deepEqual(s, { members: 2844485, servers: 8529, userInstalls: 1720, readOn: '2026-10-24' });
	assert.equal(readStats({ guildCount: 0, userCount: 1, userInstallCount: 1 }), null);
	assert.equal(readStats({ guildCount: 1.5, userCount: 1, userInstallCount: 1 }), null);
	assert.equal(readStats({ guildCount: '8529', userCount: 1, userInstallCount: 1 }), null);
	assert.equal(berlinDay(new Date('2026-10-27T23:30:00Z')), '2026-10-28');
	const snap = { measured: '2026-10-28T17:30:23.823Z', windowSeconds: 60, ratePerSecond: 21.7, connected: true, guild: '42', points: [[40, -98, 0.4, '1234'], [38, -98, 0.6], ['x', 1, 0.1]] };
	assert.deepEqual(readSnapshot(snap).points, [[38, -98, 0.6]]);
	assert.ok(!JSON.stringify(readSnapshot(snap)).includes('42'));
	assert.equal(readSnapshot({ ...snap, connected: false }), null);
	console.log('selftest ok');
	process.exit(0);
}

try {
	const s = readStats(await getJson(STATS));
	if (!s) throw new Error('unexpected shape');
	writeFileSync(new URL('src/lib/stats.json', root), JSON.stringify(s, null, '\t') + '\n');
	console.log(`stats: ${s.members} members, ${s.servers} servers, ${s.userInstalls} user installs, read ${s.readOn}`);
} catch (e) {
	const old = JSON.parse(readFileSync(new URL('src/lib/stats.json', root), 'utf8'));
	console.warn(`WARNING stats: ${STATS} failed (${e.message}); keeping the reading of ${old.readOn}`);
}

try {
	const snap = readSnapshot(await getJson(`${GLOBE_API}/gateway/snapshot`));
	if (!snap) throw new Error('not connected or unexpected shape');
	writeFileSync(new URL('static/globe-snapshot.json', root), JSON.stringify(snap) + '\n');
	console.log(`globe: ${snap.ratePerSecond} events per second, ${snap.points.length} bins, measured ${snap.measured}`);
} catch (e) {
	console.warn(`WARNING globe: ${GLOBE_API}/gateway/snapshot failed (${e.message}); keeping static/globe-snapshot.json`);
}
// the poster is a frame of the live scene: scripts/still.mjs retakes it by hand
