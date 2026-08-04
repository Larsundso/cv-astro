/**
 * i18n plumbing — one resolver, two statically imported wall modules.
 *
 * wall.ts (English, default locale at "/") and wall.de.ts (German, at
 * "/de/") export the same named-export surface with identical TypeScript
 * shapes; only human-readable strings differ. Components resolve their
 * copy via:
 *
 *   const locale = (Astro.currentLocale ?? "en") as Locale;
 *   const wall = getWall(locale);
 */
import * as de from "./wall.de";
import * as en from "./wall";

export type Locale = "en" | "de";

export type WallModule = typeof import("./wall");

/* The `as const` exports give wall.ts literal string types, which the
 * translated German values can never satisfy — the modules are shape-
 * identical, not value-identical. Widen the de module through unknown;
 * the build's tsc gate still checks wall.de.ts internally. */
const walls: Record<Locale, WallModule> = {
	en,
	de: de as unknown as WallModule
};

export const getWall = (locale: Locale): WallModule => walls[locale];
