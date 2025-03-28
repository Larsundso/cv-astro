<script lang="ts">
 export const ssr = true;

 import edu from "~/assets/edu.json";
 import Container from "~/components/container.svelte";
 import Place from "~/components/education/place.svelte";
</script>

<Container>
 <div class="relative">
  <h1 class="text-2xl font-bold mb-6 text-accent relative">
   My Education
   <span class="block h-0.5 w-1/3 bg-accent/70 mt-2"></span>
  </h1>

  <div class="flex flex-col justify-center items-start gap-6 mt-8">
   {#each edu as school, i}
    <Place {school} {i} />
   {/each}
  </div>
 </div>
</Container>
