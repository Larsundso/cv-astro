import presetRemToPx from "@unocss/preset-rem-to-px";
import {
 defineConfig,
 presetIcons,
 presetTypography,
 presetWebFonts,
 transformerDirectives,
 transformerVariantGroup
} from "unocss";
import { presetWind3 } from "unocss";
import presetAnimations from "unocss-preset-animations";
import presetTheme from "unocss-preset-theme";
import type { Theme } from "unocss/preset-mini";

export default defineConfig({
 rules: [["text-fill-color", { "-webkit-text-fill-color": "transparent" }]],
 transformers: [transformerDirectives(), transformerVariantGroup()],
 theme: {},
 shortcuts: [
  ["big-text", "line-height-snug"],
  ["small-text", "line-height-normal"]
 ],
 presets: [
  presetTheme<Theme>({
   theme: {
    light: {
     colors: {
      text: "#1b1613",
      background: "#f7f1ee",
      primary: "#6e3c21",
      secondary: "#e69065",
      accent: "#e5530b"
     }
    },
    dark: {
     colors: {
      text: "#f0f0f0",
      background: "#0e0a12",
      primary: "#ff8a5b",
      secondary: "#9c4dcc",
      accent: "#00d9ff"
     }
    }
   }
  }),
  presetAnimations(),
  presetRemToPx(),
  presetIcons({
   scale: 1.2,
   extraProperties: { display: "inline-block", "vertical-align": "middle" }
  }),
  presetTypography(),
  presetWind3(),
  presetWebFonts({
   fonts: {
    poppins: {
     name: "Carrois Gothic",
     weights: ["400", "500", "600", "700", "800"],
     provider: "google"
    },
    serif: "DM Serif Display",
    mono: "DM Mono",
    clock: "Bungee Outline",
    card: "Mina"
   }
  })
 ]
});
