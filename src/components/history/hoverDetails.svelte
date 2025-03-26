<script lang="ts">
 export const ssr = true;
 import history from "~/assets/repos.json";

 import Task from "./task.svelte";
 import ExpandedDetails from "./expandedDetails.svelte";

 const { org, i }: { org: (typeof history)[number]; i: number } = $props();
 const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
 const index = chars[i];
</script>

<div
 class="group-hover:op-100 group-hover:z-9 op-0 backdrop-blur-2 bg-background/25 w-100lvw h-100lvh fixed left-0 bottom-0 transition-all duration-300 ease-in-out pointer-events-none"
></div>

<input type="checkbox" class="hidden" id={index} name="work" />
<label
 for={index}
 class="group-hover:op-100 transition-all duration-300 ease-in-out cursor-pointer
z-10 op-0 absolute w-150% left-0 -top-50% flex flex-col justify-evenly items-start w-full border-2px border-primary rounded-lg p-1 px-2 m-1 bg-background"
 class:-top-50%={org.name !==
  history.sort((a, b) => b.start - a.start).at(-1)?.name}
 class:bottom-0={org.name ===
  history.sort((a, b) => b.start - a.start).at(-1)?.name}
>
 <h3 class="text-lg color-primary font-bold">
  {org.name}<span class="ml-1 text-xs color-accent">Click to see more</span>
 </h3>
 <span class="color-text">{org.desc}</span>

 <div
  class="flex flex-row justify-start items-center gap-1 flex-wrap color-secondary gap-2"
 >
  {#each [...new Set(org.repos.map((r) => r.tasks).flat())] as task}
   <Task {task} />
  {/each}
 </div>
</label>
