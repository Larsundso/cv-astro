// Self-check for the globe's sun position (src/lib/globe/view.ts). Node 25 runs the .ts file as it is.
import assert from 'node:assert/strict';
import { subsolar } from '../src/lib/globe/view.ts';

const near = (a, b, tol, what) => assert.ok(Math.abs(a - b) <= tol, `${what}: ${a} is not within ${tol} of ${b}`);
// June solstice 2026 (21 June, 08:24 UTC): the sun stands over the Tropic of Cancer
near(subsolar(new Date('2026-06-21T12:00:00Z'))[0], 23.44, 0.3, 'June declination');
near(subsolar(new Date('2026-12-21T12:00:00Z'))[0], -23.44, 0.3, 'December declination');
// March equinox 2026 (20 March): on the equator, and at 18:00 UTC over 90 W less the equation of time (about -7.5 min)
const [lat, lon] = subsolar(new Date('2026-03-20T18:00:00Z'));
near(lat, 0, 1, 'equinox declination');
near(lon, -88.1, 1.5, 'equinox longitude at 18:00 UTC');
// early November: the sun runs about 16 minutes ahead of the clock, so at 12:00 UTC it is already 4 degrees west
near(subsolar(new Date('2026-11-03T12:00:00Z'))[1], -4.1, 1, 'November noon longitude');
console.log('sun check ok');
