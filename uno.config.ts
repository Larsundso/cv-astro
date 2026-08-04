import {
 defineConfig,
 presetIcons,
 presetWebFonts,
 presetWind3,
 transformerDirectives,
 transformerVariantGroup
} from "unocss";

/**
 * Der Rote Faden — pinboard wall.
 * Color utilities reference the custom properties authored in
 * src/styles/wall.css, so tokens and utilities stay in lockstep.
 * Faces (one physical material each): display = flyer headlines,
 * body = copy, typed = index cards, hand = annotations.
 */
export default defineConfig({
 theme: {
  colors: {
   cork: { DEFAULT: "var(--cork)", deep: "var(--cork-deep)" },
   paper: { DEFAULT: "var(--paper)", aged: "var(--paper-aged)" },
   ink: {
    DEFAULT: "var(--ink)",
    soft: "var(--ink-soft)",
    magenta: "var(--ink-magenta)",
    violet: "var(--ink-violet)",
    teal: "var(--ink-teal)",
    green: "var(--ink-green)",
    amber: "var(--ink-amber)",
    blue: "var(--ink-blue)"
   },
   thread: "var(--thread)",
   brass: "var(--brass)"
  },
  boxShadow: {
   pin: "var(--pin-shadow)"
  }
 },
 transformers: [transformerDirectives(), transformerVariantGroup()],
 presets: [
  presetWind3(),
  presetIcons({
   scale: 1.2,
   extraProperties: { display: "inline-block", "vertical-align": "middle" }
  }),
  presetWebFonts({
   provider: "google",
   fonts: {
    display: { name: "League Gothic", weights: ["400"] },
    body: { name: "Atkinson Hyperlegible", weights: ["400", "700"], italic: true },
    typed: { name: "Courier Prime", weights: ["400", "700"] },
    hand: { name: "Shantell Sans", weights: ["400", "500", "700"] }
   }
  })
 ]
});
