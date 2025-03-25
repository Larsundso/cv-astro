<script lang="ts">
 export const ssr = true;

 import { onMount } from 'svelte';
 import history from "~/assets/repos.json";
 import Container from "~/components/container.svelte";
 import Org from "~/components/history/org.svelte";
 
 let mounted = false;
 
 onMount(() => {
   mounted = true;
 });
</script>

<Container>
 <div class="relative">
   <h1 class="text-accent font-bold text-2xl mb-6 relative">
     Professional Experience
     <span class="block h-0.5 w-1/3 bg-accent/70 mt-2"></span>
   </h1>
   
   <!-- Timeline Line -->
   <div class="absolute left-0 top-16 bottom-4 w-px bg-accent/30"></div>

   <div class="flex flex-col justify-center items-start gap-6 ml-10 mt-8">
    {#each history.sort((a, b) => b.start - a.start) as org, i}
     <div 
       class="timeline-item" 
       style="--delay: {i * 0.15}s; opacity: {mounted ? 1 : 0}; transform: translateY({mounted ? 0 : '20px'});"
     >
       <div class="absolute -left-10 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
         <div class="w-2 h-2 bg-background rounded-full"></div>
       </div>
       <Org {org} {i} />
     </div>
    {/each}
   </div>
 </div>
</Container>

<style>
  .timeline-item {
    position: relative;
    transition: opacity 0.5s ease, transform 0.5s ease;
    transition-delay: var(--delay);
  }
</style>
