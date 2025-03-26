<script lang="ts">
 export const ssr = true;

 import type { Snippet } from "svelte";

 const { children }: { children: Snippet } = $props();
</script>

<section class="relative m-5 border-accent/30 border transform backdrop-blur bg-secondary/10 rounded-xl p-6 shadow-lg transition-all duration-300 of-hidden
hover:border-accent/60 hover:-translate-y-1 hover:bg-secondary/20 hover:shadow-accent/10
before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:transition-all before:duration-800 before:ease before:bg-gradient-to-r before:from-transparent before:via-[rgba(230,144,101,0.1)] before:to-transparent
hover:before:left-full
">
 {@render children()}
</section>