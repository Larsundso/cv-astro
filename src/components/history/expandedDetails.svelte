<script lang="ts">
 export const ssr = true;
 import type history from "~/assets/repos.json";
 import Task from "./task.svelte";
 import Icon from "../generic/icon.svelte";

 const { org }: { org: (typeof history)[number] } = $props();
</script>

<div class="rounded-md border-2px border-accent m-4 px-3 py-2 w-95% h-max">
 <h2 class="color-primary font-bold text-2xl">{org.name}</h2>
 <span class="text-text">{org.desc}</span>

 <h3 class="color-primary text-xl mt-5 font-bold mb-2.5">Projects</h3>

 <div class="w-full flex flex-col gap-2.5 justify-center items-center">
  {#each org.repos as repo}
   <div
    class="flex flex-col justify-center items-start flex-wrap color-secondary border-2px w-full border-primary rounded-lg p-4"
   >
    <h2 class="color-primary font-bold text-md mb-4">{repo.name}</h2>

    <span class=" color-primary">Used Tech</span>
    <div class="color-accent flex flex-row gap-10 flex-wrap mt-2 ml-1">
     {#each repo.tech as tech}
      <Icon type={tech} />
     {/each}
    </div>

    {#if repo.urls.length}
     <h2 class="color-primary mt-2">URLs</h2>
    {/if}
    {#each repo.urls as url}
     <a
      href="https://{url.url}"
      target="_blank"
      class="flex flex-row-reverse gap-2 items-center mt-2 hover:scale-105 transition-all duration-100 ease-in-out hover:bg-white/10 px-2 py-1 rounded-md"
      rel="noopener noreferrer"
     >
      <span class="color-text text-sm">{url.title}</span>
      <img
       src="https://www.google.com/s2/favicons?domain_url={url.url}&sz=128"
       alt=""
       width="32"
       height="32"
       class="rounded-md"
       loading="lazy"
      />
     </a>
    {/each}

    <span class="color-primary mt-4">Tasks</span>
    <div class="color-accent flex flex-row gap-2 flex-wrap">
     {#each repo.tasks as task}
      <Task {task} />
     {/each}
    </div>
   </div>
  {/each}
 </div>
</div>
