<script lang="ts">
 export const ssr = true;
 import type edu from "~/assets/edu.json";

 const { school }: { school: (typeof edu)[number]; i: number } = $props();
</script>

<div
 class="flex flex-col justify-evenly items-start w-full border-2px border-accent/20 rounded-lg p-3 m-1 group hover:border-accent/40 transition-all duration-300 bg-secondary/10 backdrop-blur-sm"
>
 <div class="flex flex-row justify-between items-center w-full">
  <h2 class="text-accent text-lg mb-1 font-semibold">
   {school.name}
  </h2>
  <img
   src={`/${school.logo}`}
   alt=""
   width="32"
   height="32"
   loading="eager"
   class="rounded-md mt-1"
  />
 </div>
</div>
