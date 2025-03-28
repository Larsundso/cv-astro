<script lang="ts">
 export const ssr = true;

 import Container from "~/components/container.svelte";
 import getCharts from "~/components/scripts/getCharts.js";

 const charts = getCharts();
</script>

<Container>
 <div class="relative">
  <h1 class="text-2xl font-bold mb-6 text-accent relative">
   Activity
   <span class="block h-0.5 w-1/3 bg-accent/70 mt-2"></span>
  </h1>

  <div class="flex flex-row justify-center items-center flex-wrap">
   {#each charts.top as c}
    <div class="flex flex-col items-center justify-center">
     <img
      src={`data:image/svg+xml,${encodeURIComponent(c)}`}
      alt=""
      loading="lazy"
     />
    </div>
   {/each}
  </div>

  <div class="flex flex-row justify-center items-center flex-wrap">
   {#each charts.recent as c}
    <div class="flex flex-col items-center justify-center">
     <img
      src={`data:image/svg+xml,${encodeURIComponent(c)}`}
      alt=""
      loading="lazy"
     />
    </div>
   {/each}
  </div>
 </div>
</Container>
