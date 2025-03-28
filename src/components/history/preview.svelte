<script lang="ts">
 export const ssr = true;
 import type history from "~/assets/repos.json";
 import HoverDetails from "./hoverDetails.svelte";

 const { org, i }: { org: (typeof history)[number]; i: number } = $props();
</script>

<div
 class="flex flex-col justify-evenly items-start w-full border-2px border-primary rounded-lg p-1 px-2 m-1 group"
>
 <div class="flex flex-row justify-between items-center w-full">
  <h2 class="color-text text-lg mb-1">{org.name}<span class="ml-1 text-xs color-accent">{org.repos.length} Projects - Hover me</span></h2>
  <img
   src={`/${org.logo}`}
   alt=""
   width="32"
   height="32"
   loading="eager"
   class="rounded-md mt-1"
  />
 </div>

 <div class="color-secondary text-xs mb-2">{org.shortDesc}</div>

 <HoverDetails {org} {i} />
</div>
