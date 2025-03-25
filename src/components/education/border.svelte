<script lang="ts">
 export const ssr = true;
 import type edu from "~/assets/edu.json";
 const { school }: { school: (typeof edu)[number] } = $props();
</script>

<div class="pr-2 -ml-2 flex flex-col justify-between items-center">
 <span class="color-secondary text-xs">{school.end}</span>

 <div class="h-full min-h-30px w-0 relative mx-2.5">
  <div
   class="absolute inset-y-20 left-0 top-1/2 -translate-y-1/2 bg-gradient-to-t from-transparent via-indigo-500 to-transparent w-[2px] h-3/4 blur-sm"
  ></div>
  <div
   class="absolute inset-y-20 left-0 top-1/2 -translate-y-1/2 bg-gradient-to-t from-transparent via-indigo-500 to-transparent w-[1px] h-3/4"
  ></div>
  <div
   class="absolute inset-x-60 left-0 top-1/2 -translate-y-1/2 bg-gradient-to-t from-transparent via-red-500 to-transparent w-[5px] h-1/4 blur-sm"
  ></div>
  <div
   class="absolute inset-y-60 left-0 top-1/2 -translate-y-1/2 bg-gradient-to-t from-transparent via-red-500 to-transparent w-[1px] h-1/4"
  ></div>
 </div>

 <span class="color-secondary text-xs">{school.start}</span>
</div>
