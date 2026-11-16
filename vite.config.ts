import process from 'node:process';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import extractorSvelte from '@unocss/extractor-svelte';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';

// the gateway globe's API base: a build-time setting, Ayako's public API by default (keep in step with scripts/stats.mjs)
const globeApi = (process.env.GLOBE_API || 'https://api.ayakobot.com/bot').replace(/\/$/, '');

export default defineConfig({
	plugins: [
		// UnoCSS must come before sveltekit()
		UnoCSS({ extractors: [extractorSvelte()] }),
		sveltekit({
			compilerOptions: {
				// runes mode is mandatory for this project (owner brief)
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// dist/ is where the Astro build wrote, so the host's output folder stays as it is
			adapter: adapter({ pages: 'dist', assets: 'dist' })
		})
	],
	define: { __GLOBE_API__: JSON.stringify(globeApi) },
	// lightningcss corrupts animation-timeline; esbuild keeps scroll-driven animations intact
	build: { cssMinify: 'esbuild' }
});
