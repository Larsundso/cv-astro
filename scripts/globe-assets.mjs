// Build-time map data for the live globe's painted texture. Run by hand after a world-atlas update:
// `node scripts/globe-assets.mjs`. Writes static/globe/land.json (Natural Earth 1:110m land rings)
// and static/globe/borders.json (the borders between countries, coasts left out), both as flat
// lon,lat lists at 0.1 degree. Natural Earth is public domain; world-atlas and topojson-client are ISC.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { feature, mesh } from 'topojson-client';

const root = new URL('..', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const flat = (line) => line.flatMap(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);

const landTopo = read('node_modules/world-atlas/land-110m.json');
const rings = [];
for (const f of feature(landTopo, landTopo.objects.land).features) {
	const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
	for (const poly of polys) for (const ring of poly) rings.push(flat(ring));
}

const world = read('node_modules/world-atlas/countries-110m.json');
// a !== b keeps only arcs shared by two countries, so no coastline is drawn twice
const borders = mesh(world, world.objects.countries, (a, b) => a !== b).coordinates.map(flat);

mkdirSync(new URL('static/globe/', root), { recursive: true });
writeFileSync(new URL('static/globe/land.json', root), JSON.stringify(rings));
writeFileSync(new URL('static/globe/borders.json', root), JSON.stringify(borders));
console.log(`land.json ${rings.length} rings, borders.json ${borders.length} lines`);
