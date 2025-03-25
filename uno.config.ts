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
 rules: [
  ["text-fill-color", { "-webkit-text-fill-color": "transparent" }],
  // Custom rules for code blocks
  ["code-block-base", { 
    "position": "absolute", 
    "padding": "1rem", 
    "background-color": "rgba(10, 10, 14, 0.7)", 
    "border": "1px solid rgba(230, 144, 101, 0.3)", 
    "border-radius": "8px", 
    "font-family": "monospace", 
    "font-size": "0.8rem", 
    "box-shadow": "0 4px 20px rgba(0, 0, 0, 0.2)", 
    "opacity": "0.7", 
    "backdrop-filter": "blur(4px)" 
  }],
  ["code-keyword", { "color": "#ff79c6" }],
  ["code-function", { "color": "#50fa7b" }],
  ["code-property", { "color": "#8be9fd" }],
  ["code-string", { "color": "#f1fa8c" }],
  ["code-variable", { "color": "#bd93f9" }],
  ["code-comment", { "color": "#6272a4" }]
 ],
 transformers: [transformerDirectives(), transformerVariantGroup()],
 shortcuts: [
  ["big-text", "line-height-snug"],
  ["small-text", "line-height-normal"],
  ["code-animation", "absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-1"],
  ["no-hover-effect", "!hover:no-underline"]
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
