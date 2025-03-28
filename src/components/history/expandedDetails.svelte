<script lang="ts">
 export const ssr = true;
 import type history from "~/assets/repos.json";
 import Task from "./task.svelte";
 import Icon from "../generic/icon.svelte";

 const { org }: { org: (typeof history)[number] } = $props();
</script>

<div
 class="rounded-lg border-2px border-accent/20 m-3 px-4 py-3 w-95% h-max shadow-lg bg-gradient-to-b from-transparent to-accent/5 hover:border-accent/40 transition-all duration-300"
>
 <h2 class="text-xl font-bold mb-2 text-accent">
  {org.name}
  <span class="block h-0.5 w-1/4 bg-accent/50 mt-1"></span>
 </h2>
 <span class="text-text/90 text-sm">{org.desc}</span>

 <h3
  class="text-lg mt-4 font-semibold mb-3 text-accent relative border-b border-accent/30 pb-1"
 >
  Projects
 </h3>

 <div class="w-full flex flex-col gap-3 justify-center items-center">
  {#each org.repos as repo}
   <div
    class="flex flex-col justify-center items-start flex-wrap text-secondary border border-accent/10 rounded-lg p-3 hover:shadow-sm transition-all duration-300 ease-out hover:border-accent/30 w-full bg-secondary/10 backdrop-blur-sm"
   >
    <h2
     class="text-accent font-bold text-base mb-2 pb-1 w-full flex items-center gap-2"
    >
     {repo.name}
     <div class="flex-1 border-b border-accent/20 ml-2"></div>
    </h2>

    <div class="w-full flex flex-wrap">
     <!-- Tech Section -->
     <div class="mb-3 pr-4 flex-1 min-w-[200px]">
      <span class="text-accent font-medium text-xs tracking-wider">Tech</span>
      <div class="text-accent flex flex-row gap-3 flex-wrap mt-1">
       {#each repo.tech as tech}
        <div
         class="transition-all duration-150 hover:scale-105 hover:light:drop-shadow-[0_0_1px_#e5530b] hover:dark:drop-shadow-[0_0_1px_#f4651c]"
        >
         <Icon type={tech} />
        </div>
       {/each}
      </div>
     </div>

     <!-- URLs Section (if it exists) -->
     {#if repo.urls.length}
      <div class="mb-3 pr-4 flex-1 min-w-[200px]">
       <span class="text-accent font-medium text-xs tracking-wider">URLs</span
       >
       <div class="flex flex-wrap gap-1.5 mt-1">
        {#each repo.urls as url}
         <a
          href="https://{url.url}"
          target="_blank"
          class="flex flex-row gap-1.5 items-center hover:scale-105 transition-all duration-200 ease-in-out hover:bg-white/15 px-2 py-1 rounded-md bg-white/5"
          rel="noopener noreferrer"
         >
          <img
           src="https://www.google.com/s2/favicons?domain_url={url.url}&sz=128"
           alt=""
           width="16"
           height="16"
           class="rounded-sm"
           loading="lazy"
          />
          <span class="text-text text-xs">{url.title}</span>
         </a>
        {/each}
       </div>
      </div>
     {/if}

     <!-- Tasks Section -->
     <div class="mb-3 flex-1 min-w-[200px]">
      <span class="text-accent font-medium text-xs tracking-wider">Tasks</span
      >
      <div class="text-accent flex flex-row gap-1.5 flex-wrap mt-1">
       {#each repo.tasks as task}
        <Task {task} />
       {/each}
      </div>
     </div>
    </div>
   </div>
  {/each}
 </div>
</div>
