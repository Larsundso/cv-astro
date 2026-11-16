// The globe's view, shared by the live scene and the page (the pin's label needs it before three.js loads).
export const PIN = [60.17, 24.94] as const; // Helsinki (owner, 2026-10-28, FACTS 5): the city, never an address
// the still's centre, and the globe's radius as a share of the square stage
export const VIEW = { lat: 36, lon: -24, radius: 0.38 }; // 0.38 leaves room for the ring

const RAD = Math.PI / 180;
// where a place stands on the stage (0 to 1) in an orthographic view centred on lat, lon
export function place(lat: number, lon: number, centre = VIEW) {
	const p = lat * RAD;
	const l = (lon - centre.lon) * RAD;
	const c = centre.lat * RAD;
	return {
		x: 0.5 + VIEW.radius * Math.cos(p) * Math.sin(l),
		y: 0.5 - VIEW.radius * (Math.cos(c) * Math.sin(p) - Math.sin(c) * Math.cos(p) * Math.cos(l)),
		front: Math.sin(c) * Math.sin(p) + Math.cos(c) * Math.cos(p) * Math.cos(l) > 0.12
	};
}

// Where the sun stands overhead at a given moment, as [lat, lon]: the declination from the day of
// the year, the longitude from UTC and the equation of time. Good to about a degree, which is
// finer than the dusk band the globe draws. Check: node scripts/sun.check.mjs
export function subsolar(now: Date): [number, number] {
	const day = (now.getTime() - Date.UTC(now.getUTCFullYear(), 0, 0)) / 864e5;
	const b = (2 * Math.PI * (day - 81)) / 364;
	const minutes = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
	const hours = (now.getTime() % 864e5) / 36e5;
	const lon = -15 * (hours - 12 + minutes / 60);
	return [-23.44 * Math.cos((2 * Math.PI * (day + 10)) / 365), ((lon + 540) % 360) - 180];
}
