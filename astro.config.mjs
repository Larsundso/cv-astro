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
  sitemap({
   i18n: {
    defaultLocale: "en",
    locales: { en: "en", de: "de" },
   },
  }),
  icon(),
 ],
 i18n: {
  defaultLocale: "en",
  locales: ["en", "de"],
  routing: { prefixDefaultLocale: false },
 },
 server: { host: true },
 site: "https://lars-dev.org",
 image: { service: passthroughImageService() },
});
