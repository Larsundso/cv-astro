// @ts-check
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import lottie from "astro-integration-lottie";
import { defineConfig, passthroughImageService } from "astro/config";
import UnoCSS from "unocss/astro";

// https://astro.build/config
export default defineConfig({
 integrations: [
  lottie(),
  svelte(),
  UnoCSS({ injectReset: true }),
  sitemap(),
  icon({ include: { "tabler": ["*"] } }),
 ],
 server: { host: true },
 site: "https://astro.build",
 image: { service: passthroughImageService() },
});
