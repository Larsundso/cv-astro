// Where a three.js scene may run at all: not under Save-Data (the data-saver flag) and not without
// WebGL2. The relief asks only this, since it can stand still.
export function sceneAllowed() {
	const net = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
	if (net?.saveData) return false;
	return !!document.createElement('canvas').getContext('webgl2');
}
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
// Where the live globe may run: the poster wins under reduced motion as well. The globe's scene itself
// falls back to the poster when its first 90 frames run slower than about 18 a second.
export const motionAllowed = () => !reducedMotion() && sceneAllowed();
