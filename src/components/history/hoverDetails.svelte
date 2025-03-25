<script lang="ts">
 export const ssr = true;
 import type history from "~/assets/repos.json";

 import Task from "./task.svelte";
 import ExpandedDetails from "./expandedDetails.svelte";

 const { org, i }: { org: (typeof history)[number]; i: number } = $props();
 const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
 const index = chars[i];
</script>

<div
 class="group-hover:op-100 group-hover:z-9 op-0 backdrop-blur-2 bg-background/25 w-100lvw h-100lvh fixed left-0 top-0 transition-all duration-300 ease-in-out pointer-events-none"
></div>

<input type="checkbox" class="hidden" id={index} name="work" />
<label
 for={index}
 class="group-hover:op-100 transition-all duration-300 ease-in-out cursor-pointer
z-10 op-0 absolute w-150% left-0 -top-50% flex flex-col justify-evenly items-start w-full border-2px border-primary rounded-lg p-1 px-2 m-1 bg-background"
>
 <div class="fixed top-0 left-0 w-0 h-0">
  <div class="relative">
   <div
    class="inner bg-background left-0 top-0 absolute w-100lvw lg:w-50lvw h-100lvh ml-0 lg:ml-50lvw z-20 of-auto translate-x-100% transition-all duration-300 ease-in-out of-x-hidden"
   >
    <ExpandedDetails {org} />
   </div>
  </div>
 </div>

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

<div
 class="fixed top-0 left-0 w-100lvw h-100lvh z-5 pointer-events-none pointer-events-blocker"
></div>

<style>
 /* Show the blocker when any checkbox is checked */
 input[name="work"]:checked ~ .pointer-events-blocker {
  display: block;
  pointer-events: auto;
 }

 /* Make sure the checked label stays interactive */
 input[name="work"]:checked + label {
  z-index: 15;
  pointer-events: auto !important;
 }

 /* Ensure content in checked label is interactive */
 input[name="work"]:checked + label > div > div {
  z-index: 19;
  height: 100lvh;
  width: 100lvw;
 }

 /* Ensure content in checked label is interactive */
 input[name="work"]:checked + label > div > div > div.inner {
  transform: translateX(0);
  z-index: 20;
  pointer-events: auto;
 }
</style>
