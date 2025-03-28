<script lang="ts">
 import type { TotalInsights } from "../scripts/getTotalTime.js";
 import SkillBar from "./skill-bar.svelte";
 export const ssr = true;

 const { total }: { total: TotalInsights } = $props();

 const languageColors: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Svelte: "#ff3e00",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#4fc08d",
  "React JSX": "#61dafb",
  JSON: "#000000",
  Astro: "#ff5d01",
  "Node.js": "#339933",
  SCSS: "#c6538c",
  Markdown: "#083fa1",
  Python: "#3572A5"
 };

 const topLanguages = total.languages
  .sort((a, b) => b.total_seconds - a.total_seconds)
  .slice(0, 10);

 const getProficiencyLevel = (hours: number): string => {
  if (hours >= 500) return "Expert";
  if (hours >= 200) return "Advanced";
  if (hours >= 80) return "Intermediate";
  return "Beginner";
 };

 const getProficiencyEmoji = (level: string): string => {
  switch (level) {
   case "Expert":
    return "🔥";
   case "Advanced":
    return "💪";
   case "Intermediate":
    return "👍";
   default:
    return "🌱";
  }
 };
</script>

<div class="py-4">
 <h3 class="text-accent text-lg font-semibold mb-5">
  Programming Language Proficiency
 </h3>
 <p class="text-sm mb-4 text-secondary">
  Based on {total.human_readable_total_including_other_language} of coding time tracked
  with WakaTime
 </p>

 <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
  {#each topLanguages as language}
   {@const proficiencyLevel = getProficiencyLevel(language.hours)}
   {@const emoji = getProficiencyEmoji(proficiencyLevel)}
   <SkillBar
    name={language.name}
    hours={language.hours}
    maxHours={500}
    level={`${emoji} ${proficiencyLevel}`}
    color={languageColors[language.name] || "#888888"}
   />
  {/each}
 </div>
</div>
