<script lang="ts">
 export const ssr = true;
 import type edu from "~/assets/edu.json";

 const { school }: { school: (typeof edu)[number]; i: number } = $props();
</script>

<div
 class="flex flex-col justify-evenly items-start w-full border-2px border-primary rounded-lg p-1 px-2 m-1 group"
>
 <div class="flex flex-row justify-between items-center w-full">
  <h2 class="color-text text-lg mb-1">
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
