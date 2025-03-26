<script lang="ts">
 export const ssr = true;
 import type history from "~/assets/repos.json";
 const { org }: { org: (typeof history)[number] } = $props();

 const makeDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const iso = date.toISOString();
  const datePart = iso.split("T")[0];
  const [year, month] = datePart.split("-");
  return [month, year].join(".");
 };
</script>

<div class="pr-2 -ml-2 flex flex-col justify-between items-center">
 <span class="color-secondary text-xs"
  >{org.end ? makeDate(org.end) : "Today"}</span
 >

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

 <span class="color-secondary text-xs">{makeDate(org.start)}</span>
</div>
