<script lang="ts">
 export const ssr = true;

 import edu from "~/assets/edu.json";
 import Container from "~/components/container.svelte";
 import Place from "~/components/education/place.svelte";
</script>

<Container>
 <h1 class="text-primary font-bold text-xl">My education</h1>

 <div class="flex flex-col justify-center items-start gap-1 ml-2 mt-5">
  {#each edu as school, i}
   <Place {school} {i} />
  {/each}
 </div>
</Container>
