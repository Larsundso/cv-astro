<script lang="ts">
 export const ssr = true;

 import history from "~/assets/repos.json";
 import Container from "~/components/container.svelte";
 import Org from "~/components/history/org.svelte";
</script>

<Container>
 <div class="relative">
  <h1 class="text-accent font-bold text-2xl mb-6 relative">
   Professional Experience
   <span class="block h-0.5 w-1/3 bg-accent/70 mt-2"></span>
  </h1>

  <div class="flex flex-col justify-center items-start gap-6 mt-8">
   {#each history.sort((a, b) => b.start - a.start) as org, i}
    <div class="relative w-full">
     <Org {org} {i} />
    </div>
   {/each}
  </div>
 </div>
</Container>
