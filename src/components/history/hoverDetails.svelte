<script lang="ts">
 export const ssr = true;
 import history from "~/assets/repos.json";

 import Task from "./task.svelte";
 import ExpandedDetails from "./expandedDetails.svelte";

 const { org, i }: { org: (typeof history)[number]; i: number } = $props();
 const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
 const index = chars[i];

 const isLast =
  org.name === history.sort((a, b) => b.start - a.start).at(-1)?.name;
</script>

<div
 class="group-hover:op-100 group-hover:z-9 op-0 backdrop-blur-2 bg-background/25 w-100lvw h-100lvh fixed left-0 bottom-0 transition-all duration-300 ease-in-out pointer-events-none"
></div>

<input type="checkbox" class="hidden peer" id={index} name="work" />
<label
 for={index}
 class="group-hover:op-100 transition-all duration-300 ease-in-out cursor-pointer group-hover:translate-y-0 translate-y-20
z-10 op-0 absolute w-150% left-0 -top-50% flex flex-col justify-evenly items-start w-full border-2px border-primary rounded-lg p-1 px-2 m-1 bg-background h-fit"
 class:-top-50%={!isLast}
 class:bottom-0={isLast}
 class:-mt-7.5%={isLast}
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

<label
 for={index}
 class="fixed left-0 top-0 w-full h-full z-50 bg-background/80 backdrop-blur-md hidden
 peer-checked:flex peer-checked:op-100 op-0 transition-all justify-center items-start overflow-y-auto py-2"
>
 <div class="relative max-w-3xl w-full">
  <div
   class="fixed top-5.5 right-7 cursor-pointer z-20 p-2 bg-primary/20 hover:bg-primary/40 rounded-full transition-all"
  >
   <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6 color-accent"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
   >
    <path
     stroke-linecap="round"
     stroke-linejoin="round"
     stroke-width="2"
     d="M6 18L18 6M6 6l12 12"
    />
   </svg>
  </div>
  <ExpandedDetails {org} />
 </div>
</label>
