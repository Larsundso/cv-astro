// Runs before every build (package.json "build"), after stats.mjs: re-reads the hours WakaTime has
// tracked into src/lib/hours.json, for the relief of languages and projects (src/lib/relief).
// The build never fails here: a failed or stale read prints a warning and the last good file stays.
//
// WakaTime's API as of 2026-11 (https://wakatime.com/developers, read 2026-11-16):
// - API keys are write-only and serve the editor plugins alone. Reading needs an OAuth 2.0 access
//   token (waka_tok_...) sent as "Authorization: Bearer". For one's own account the token comes from
//   https://wakatime.com/oauth; the scope this script needs is read_stats. The old site's WAKA_KEY
//   with Basic auth no longer reads anything.
// - Without a token only the public profile answers, and it carries no totals and no projects. Its
//   rows give ai_coding_seconds and manual_coding_seconds as strings in place of total_seconds.
// - A range of a year or more is recalculated on request: the answer may be a 202 or carry
//   is_up_to_date: false, and the caller is expected to ask again.
//
// ENV (or .env): WAKA_TOKEN. Without it the languages come from the public profile and the
// projects keep their last reading.
// Self-check: node scripts/waka.mjs --selftest
import { readFileSync, writeFileSync } from 'node:fs';

const API = 'https://wakatime.com/api/v1';
const HANDLE = 'Larsundso'; // the public profile, FACTS 1
const OUT = new URL('../src/lib/hours.json', import.meta.url);

// Every project is named (owner, 2026-11-16: "name them all, ill tell which not to name after").
// A name listed here is struck: its hours stay in the total and in the count, and the name never
// reaches the file. Compared without regard to case. Clients stay unnamed (FACTS 3) and some projects
// must never be traced from this site (FACTS 13), so this list has to be filled before a deploy.
export const STRUCK = [];
// A language or a project counts only with more than this many hours (owner, 2026-11-16: "languages and
// repos only count when over 10h"). Whatever stays below never reaches the file; the total keeps it.
export const LEAST_HOURS = 10;

const berlinDay = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(d);
const secs = (n) => (Number.isFinite(n) && n >= 0 && n < 1e10 ? Math.round(n) : null);
// a row's seconds in either shape: total_seconds (with a token) or the public pair of strings
const rowSeconds = (r) =>
	typeof r?.total_seconds === 'number' ? secs(r.total_seconds) : r?.ai_coding_seconds != null && r?.manual_coding_seconds != null ? secs(Number(r.ai_coding_seconds) + Number(r.manual_coding_seconds)) : null;
const rows = (list) =>
	(Array.isArray(list) ? list : [])
		.map((r) => [typeof r?.name === 'string' ? r.name.trim().slice(0, 60) : '', rowSeconds(r)])
		.filter(([name, s]) => name && s)
		.sort((a, b) => b[1] - a[1]);
const sum = (list) => list.reduce((a, [, s]) => a + s, 0);

// "since Oct 29 2021" (public) or an ISO start (with a token), as a day
export function sinceDay(d) {
	if (typeof d?.start === 'string' && !Number.isNaN(Date.parse(d.start))) return berlinDay(new Date(d.start));
	const m = /^since ([A-Z][a-z]{2}) (\d{1,2}) (\d{4})$/.exec(d?.human_readable_range ?? '');
	const month = m ? 'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(m[1]) / 3 : -1;
	return m && Number.isInteger(month) && month >= 0 ? `${m[3]}-${String(month + 1).padStart(2, '0')}-${m[2].padStart(2, '0')}` : null;
}

// One answer of /stats/all_time, checked. Null while WakaTime is still calculating or the shape is off.
export function readHours(body, day = berlinDay(), struck = STRUCK, least = LEAST_HOURS) {
	const d = body?.data;
	if (!d || d.range !== 'all_time' || d.is_up_to_date !== true) return null;
	const languages = rows(d.languages);
	if (languages.length < 3) return null;
	const counts = ([, s]) => s > least * 3600;
	const out = {
		since: sinceDay(d),
		leastHours: least,
		pauseMinutes: Number.isInteger(d.timeout) && d.timeout > 0 ? d.timeout : null,
		languages: { readOn: day, total: secs(d.total_seconds_including_other_language) || sum(languages), rows: languages.filter(counts) },
		projects: null
	};
	const all = rows(d.projects);
	const hide = struck.map((n) => n.toLowerCase());
	if (all.length) out.projects = { readOn: day, total: sum(all), rows: all.filter(([n]) => !hide.includes(n.toLowerCase())).filter(counts) };
	return out;
}

async function ask(token) {
	const url = token ? `${API}/users/current/stats/all_time` : `${API}/users/${HANDLE}/stats/all_time`;
	for (let attempt = 1; ; attempt++) {
		const res = await fetch(url, { signal: AbortSignal.timeout(20_000), headers: { accept: 'application/json', ...(token && { authorization: `Bearer ${token}` }) } });
		if (res.status === 401 || res.status === 403) throw new Error(`HTTP ${res.status}: the token is refused (it must be an OAuth token with the scope read_stats; API keys are write-only)`);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const body = await res.json();
		if (res.status === 200 && body?.data?.is_up_to_date === true) return body;
		if (attempt === 6) throw new Error('WakaTime is still calculating');
		await new Promise((r) => setTimeout(r, 5000));
	}
}

if (process.argv.includes('--selftest')) {
	const assert = (await import('node:assert/strict')).default;
	const head = { range: 'all_time', is_up_to_date: true, timeout: 15 };
	const pub = (name, ai, manual) => ({ name, ai_coding_seconds: ai, manual_coding_seconds: manual });
	const open = { data: { ...head, human_readable_range: 'since Oct 29 2021', languages: [pub('JavaScript', '10.4', '3589.6'), pub('TypeScript', '100', '7100.2'), pub('Svelte', '0', '60'), pub('Lua', '0', '0'), { name: 7, total_seconds: 5 }] } };
	const a = readHours(open, '2026-11-16', [], 0);
	assert.deepEqual(a.languages, { readOn: '2026-11-16', total: 10860, rows: [['TypeScript', 7200], ['JavaScript', 3600], ['Svelte', 60]] });
	assert.equal(a.since, '2021-10-29');
	assert.equal(a.pauseMinutes, 15);
	assert.equal(a.projects, null, 'the public profile names no project');
	const signed = {
		data: {
			...head,
			start: '2021-10-28T22:00:00Z',
			total_seconds_including_other_language: 9000.4,
			languages: ['TypeScript', 'JavaScript', 'Svelte'].map((name) => ({ name, total_seconds: 3000 })),
			projects: [{ name: 'Ayako-v2', total_seconds: 5000 }, { name: 'service', total_seconds: 1000 }, { name: 'secret-client', total_seconds: 2500 }, { name: 'Discord-Bot-Dashboard', total_seconds: 500 }]
		}
	};
	const b = readHours(signed, '2026-11-16', ['Secret-Client'], 0);
	assert.equal(b.since, '2021-10-29', 'the start is read as a Berlin day');
	assert.equal(b.languages.total, 9000);
	assert.deepEqual(b.projects, { readOn: '2026-11-16', total: 9000, rows: [['Ayako-v2', 5000], ['service', 1000], ['Discord-Bot-Dashboard', 500]] });
	assert.ok(!JSON.stringify(b).includes('secret'), 'a struck project keeps its name to itself');
	assert.equal(readHours(signed, '2026-11-16', [], 0).projects.rows.length, 4, 'every project is named unless it is struck');
	const c = readHours(signed, '2026-11-16', [], 1);
	assert.deepEqual(c.projects.rows, [['Ayako-v2', 5000]], 'a project counts only with more than the least hours');
	assert.deepEqual(c.languages.rows, [], 'and so does a language (3,000 s is under an hour)');
	assert.equal(c.projects.total, 9000, 'the total keeps what the rows leave out');
	assert.equal(readHours({ data: { ...open.data, is_up_to_date: false } }), null);
	assert.equal(readHours({ data: { ...open.data, range: 'last_7_days' } }), null);
	assert.equal(sinceDay({ human_readable_range: 'last 7 days' }), null);
	console.log('selftest ok');
	process.exit(0);
}

try {
	process.loadEnvFile(new URL('../.env', import.meta.url));
} catch {
	// no .env: the environment decides
}
const token = process.env.WAKA_TOKEN?.trim();
const old = JSON.parse(readFileSync(OUT, 'utf8'));

try {
	const now = readHours(await ask(token));
	if (!now) throw new Error('unexpected shape');
	const next = { since: now.since ?? old.since, pauseMinutes: now.pauseMinutes ?? old.pauseMinutes, leastHours: now.leastHours, languages: now.languages, projects: now.projects ?? old.projects };
	// one row to a line
	writeFileSync(OUT, JSON.stringify(next, null, '\t').replace(/\[\n\t+("[^"]*"),\n\t+(\d+)\n\t+\]/g, '[$1, $2]') + '\n');
	console.log(`hours: ${Math.floor(next.languages.total / 3600)} h, ${next.languages.rows.length} languages over ${next.leastHours} h, read ${next.languages.readOn}`);
	if (now.projects) console.log(`hours: ${now.projects.rows.length} projects over ${next.leastHours} h, ${STRUCK.length} names struck, read ${now.projects.readOn}`);
	else console.warn(`WARNING hours: the projects keep their reading of ${old.projects.readOn} (${token ? 'the answer carried none' : 'no WAKA_TOKEN'})`);
} catch (e) {
	console.warn(`WARNING hours: WakaTime failed (${e.message}); keeping the reading of ${old.languages.readOn}`);
}
