<script lang="ts">
 export const ssr = true;
 import type history from "~/assets/repos.json";
 import Border from "./border.svelte";
 import Preview from "./preview.svelte";

 const { org, i }: { org: (typeof history)[number]; i: number } = $props();
</script>

<div class="flex flex-row justify-start items-stretch w-full">
 <Border {org} />

 <div class="relative w-full">
  <Preview {org} {i} />
 </div>
</div>
