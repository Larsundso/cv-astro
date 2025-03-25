<script lang="ts">
 export const ssr = true;
 const { task }: { task: string } = $props();
</script>

<div class="flex flex-row justify-center items-center gap-1">
 {task}
 <span class=" i-tabler-code -z-1" class:hidden={task !== "Development"}> </span>
 <span class=" i-tabler-tool -z-1" class:hidden={task !== "Maintenance"}> </span>
 <span class=" i-tabler-settings-up -z-1" class:hidden={task !== "Optimization"}>
 </span>
</div>
