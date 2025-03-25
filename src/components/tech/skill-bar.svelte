<script>
  import { onMount } from 'svelte';
  
  export let name;
  export let level;
  export let color = "#e69065";
  
  let barElement;
  let visible = false;
  
  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        visible = true;
        observer.unobserve(barElement);
      }
    }, { threshold: 0.1 });
    
    if (barElement) {
      observer.observe(barElement);
    }
    
    return () => {
      if (barElement) observer.unobserve(barElement);
    };
  });
</script>

<div class="mb-4" bind:this={barElement}>
  <div class="flex justify-between items-center mb-1">
    <span class="text-text text-sm font-medium">{name}</span>
    <span class="text-xs font-semibold text-accent">{level}%</span>
  </div>
  <div class="h-2 bg-secondary/30 rounded-full overflow-hidden">
    <div 
      class="h-full rounded-full transition-all duration-1000 ease-out"
      style="width: {visible ? level : 0}%; background-color: {color}; 
             box-shadow: 0 0 10px {color}40, 0 0 5px {color}20;"
    ></div>
  </div>
</div>