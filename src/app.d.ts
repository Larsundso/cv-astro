// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	// the gateway globe's API base, set at build time from env GLOBE_API (vite.config.ts)
	const __GLOBE_API__: string;
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
