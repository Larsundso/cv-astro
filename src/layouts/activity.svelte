<script lang="ts">
 export const ssr = true;

 import Container from "~/components/container.svelte";
 import getCharts from "~/components/scripts/getCharts.js";

 const charts = getCharts();
</script>

<Container>
 <h1 class="text-primary font-bold text-xl">Activity</h1>

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
</Container>
