<script>
  import SkillBar from './skill-bar.svelte';
</script>

<div class="py-4">
  <h3 class="text-accent text-lg font-semibold mb-5">Expertise Level</h3>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
    <SkillBar name="JavaScript" level={95} color="#f7df1e" />
    <SkillBar name="TypeScript" level={90} color="#3178c6" />
    <SkillBar name="Svelte/SvelteKit" level={92} color="#ff3e00" />
    <SkillBar name="Astro" level={88} color="#ff5d01" />
    <SkillBar name="React" level={85} color="#61dafb" />
    <SkillBar name="Vue.js" level={82} color="#4fc08d" />
    <SkillBar name="Node.js" level={90} color="#339933" />
    <SkillBar name="SQL/NoSQL" level={87} />
    <SkillBar name="HTML/CSS" level={96} color="#e34c26" />
    <SkillBar name="UX/UI Design" level={80} color="#ff7eb6" />
  </div>
</div>