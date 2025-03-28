<script lang="ts">
 export const ssr = true;
 import type history from "~/assets/repos.json";
 import HoverDetails from "./hoverDetails.svelte";

 const { org, i }: { org: (typeof history)[number]; i: number } = $props();
</script>

<div
 class="flex flex-col justify-evenly items-start w-full border-2px border-accent/20 rounded-lg p-3 m-1 group hover:border-accent/40 transition-all duration-300 bg-secondary/10 backdrop-blur-sm"
>
 <div class="flex flex-row justify-between items-center w-full">
  <h2 class="text-accent text-lg mb-1 font-semibold">{org.name}<span class="ml-2 text-xs text-secondary">({org.repos.length} Projects) - Hover me</span></h2>
  <img
   src={`/${org.logo}`}
   alt=""
   width="32"
   height="32"
   loading="eager"
   class="rounded-md mt-1"
  />
 </div>

 <div class="text-text/90 text-sm mb-2">{org.shortDesc}</div>
 <HoverDetails {org} {i} />
</div>
