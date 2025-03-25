<script lang="ts">
 export const ssr = true;
 import type edu from "~/assets/edu.json";
 import Border from "./border.svelte";
 import Preview from "./preview.svelte";

 const { school, i }: { school: (typeof edu)[number]; i: number } = $props();
</script>

<div class="flex flex-row justify-start items-stretch w-full">
 <Border {school} />

 <div class="relative w-full">
  <Preview {school} {i} />
 </div>
</div>
