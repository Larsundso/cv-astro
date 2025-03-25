<script lang="ts">
 export const ssr = true;

 import type { Snippet } from "svelte";

 const { children }: { children: Snippet } = $props();
</script>

<section class="m-5 border-accent/30 border backdrop-blur-md bg-secondary/10 hover:bg-secondary/20 rounded-xl p-6 shadow-lg hover:shadow-accent/10 transition-all duration-300 hover:border-accent/60 transform hover:-translate-y-1">
 {@render children()}
</section>

<style>
  section {
    position: relative;
    overflow: hidden;
  }
  
  section::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(230, 144, 101, 0.05), transparent);
    transition: all 0.8s ease;
  }
  
  section:hover::before {
    left: 100%;
  }
</style>
