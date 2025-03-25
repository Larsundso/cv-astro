<script lang="ts">
 type IconType =
  | "Svelte"
  | "UnoCSS"
  | "Astro"
  | "VueJS"
  | "ReactJS"
  | "CSS3"
  | "ThreeJS"
  | "Vite"
  | "Lottie"
  | "TypeScript"
  | "TailwindCSS"
  | "JavaScript"
  | "HTML5"
  | "Twig"
  | "SvelteKit"
  | "NodeJS"
  | "PostgreSQL"
  | "Prisma"
  | "SocketIO"
  | "Redis"
  | "Deno"
  | "ExpressJS"
  | "DiscordAPI"
  | "PHP"
  | "Git"
  | "GitHub"
  | "Docker"
  | "Cloudflare"
  | "Ubuntu"
  | "LinkedIn"
  | "XING"
  | "Indeed"
  | "WakaTime"
  | "Python"
  | "Java"
  | "MQTT"
  | "ESP"
  | "Networking"
  | "Cisco"
  | "SCSS"
  | "Bootstrap"
  | "Handlebars"
  | "Typo3"
  | "CraftCMS";

 const links: { url: string; type: IconType }[] = [
  { url: "https://svelte.dev", type: "Svelte" },
  { url: "https://unocss.dev", type: "UnoCSS" },
  { url: "https://astro.build", type: "Astro" },
  { url: "https://vuejs.org", type: "VueJS" },
  { url: "https://react.dev", type: "ReactJS" },
  { url: "https://wikipedia.org/wiki/CSS3", type: "CSS3" },
  { url: "https://threejs.org", type: "ThreeJS" },
  { url: "https://vite.dev", type: "Vite" },
  { url: "https://lottielab.com", type: "Lottie" },
  { url: "https://www.typescriptlang.org", type: "TypeScript" },
  { url: "https://tailwindcss.com", type: "TailwindCSS" },
  { url: "https://wikipedia.org/wiki/JavaScript", type: "JavaScript" },
  { url: "https://wikipedia.org/wiki/HTML5", type: "HTML5" },
  { url: "https://twig.symfony.com", type: "Twig" },
  { url: "https://kit.svelte.dev", type: "SvelteKit" },
  { url: "https://nodejs.org/en", type: "NodeJS" },
  { url: "https://www.postgresql.org", type: "PostgreSQL" },
  { url: "https://prisma.io", type: "Prisma" },
  { url: "https://socket.io", type: "SocketIO" },
  { url: "https://redis.io", type: "Redis" },
  { url: "https://deno.com", type: "Deno" },
  { url: "https://expressjs.com", type: "ExpressJS" },
  { url: "https://discord.sex", type: "DiscordAPI" },
  { url: "https://www.php.net", type: "PHP" },
  { url: "https://git-scm.com", type: "Git" },
  { url: "https://github.com", type: "GitHub" },
  { url: "https://docker.com", type: "Docker" },
  { url: "https://cloudflare.com", type: "Cloudflare" },
  { url: "https://ubuntu.com", type: "Ubuntu" },
  {
   url: "https://www.linkedin.com/in/lars-b%C3%B6se-217272351",
   type: "LinkedIn"
  },
  { url: "https://www.xing.com/profile/Lars_Boese", type: "XING" },
  { url: "https://profile.indeed.com/p/larsb-2hf1h8b", type: "Indeed" },
  { url: "https://wakatime.com/@Larsundso", type: "WakaTime" },
  { url: "https://www.python.org/", type: "Python" },
  { url: "https://www.java.com/", type: "Java" },
  { url: "https://mqtt.org/", type: "MQTT" },
  { url: "https://my-esp-idf.readthedocs.io/", type: "ESP" },
  { url: "https://www.netacad.com/networking", type: "Networking" },
  { url: "https://www.cisco.com/", type: "Cisco" },
  { url: "https://sass-lang.com/", type: "SCSS" },
  { url: "https://getbootstrap.com/", type: "Bootstrap" },
  { url: "https://handlebarsjs.com/", type: "Handlebars" },
  { url: "https://typo3.org/", type: "Typo3" },
  { url: "https://craftcms.com/", type: "CraftCMS" }
 ];

 const nonTabler: IconType[] = [
  "WakaTime",
  "Indeed",
  "UnoCSS",
  "Lottie",
  "PostgreSQL",
  "Redis",
  "ExpressJS",
  "Typo3"
 ];

 const { type }: { type: string } = $props();
</script>

<a
 href={links.find((l) => l.type === type)?.url || "#"}
 target="_blank"
 class="flex flex-col items-center justify-center min-w-15 max-w-15 transition-all duration-150
hover:scale-105 hover:light:drop-shadow-[0_0_1px_#e5530b] hover:dark:drop-shadow-[0_0_1px_#f4651c]"
>
 {#if !nonTabler.includes(type as IconType)}
  <span
   class="-z-1 w-8 h-8
   {type === 'Git' ? 'i-tabler-brand-git' : ''}
   {type === 'Git' ? 'i-tabler-brand-git' : ''}
   {type === 'GitHub' ? 'i-tabler-brand-github' : ''}
   {type === 'Docker' ? 'i-tabler-brand-docker' : ''}
   {type === 'Cloudflare' ? 'i-tabler-brand-cloudflare' : ''}
   {type === 'Ubuntu' ? 'i-tabler-brand-ubuntu' : ''}
   {type === 'LinkedIn' ? 'i-tabler-brand-linkedin' : ''}
   {type === 'XING' ? 'i-tabler-brand-xing' : ''}
   {type === 'SvelteKit' || type === 'Svelte' ? 'i-tabler-brand-svelte' : ''}
   {type === 'Astro' ? 'i-tabler-brand-astro' : ''}
   {type === 'VueJS' ? 'i-tabler-brand-vue' : ''}
   {type === 'ReactJS' ? 'i-tabler-brand-react' : ''}
   {type === 'CSS3' ? 'i-tabler-brand-css3' : ''}
   {type === 'ThreeJS' ? 'i-tabler-brand-threejs' : ''}
   {type === 'Vite' ? 'i-tabler-brand-vite' : ''}
   {type === 'TypeScript' ? 'i-tabler-brand-typescript' : ''}
   {type === 'TailwindCSS' ? 'i-tabler-brand-tailwind' : ''}
   {type === 'JavaScript' ? 'i-tabler-brand-javascript' : ''}
   {type === 'HTML5' ? 'i-tabler-brand-html5' : ''}
   {type === 'Twig' ? 'i-tabler-brand-symfony' : ''}
   {type === 'NodeJS' ? 'i-tabler-brand-nodejs' : ''}
   {type === 'Prisma' ? 'i-tabler-brand-prisma' : ''}
   {type === 'SocketIO' ? 'i-tabler-brand-socket-io' : ''}
   {type === 'Deno' ? 'i-tabler-brand-deno' : ''}
   {type === 'DiscordAPI' ? 'i-tabler-brand-discord' : ''}
   {type === 'PHP' ? 'i-tabler-brand-php' : ''}
   {type === 'Python' ? 'i-tabler-brand-python' : ''}
   {type === 'Java' ? 'i-tabler-coffee' : ''}
   {type === 'MQTT' ? 'i-tabler-air-conditioning' : ''}
   {type === 'ESP' ? 'i-tabler-circuit-changeover' : ''}
   {type === 'Networking' ? 'i-tabler-network' : ''}
   {type === 'Cisco' ? 'i-tabler-router' : ''}
   {type === 'SCSS' ? 'i-tabler-brand-sass' : ''}
   {type === 'Bootstrap' ? 'i-tabler-brand-bootstrap' : ''}
   {type === 'Handlebars' ? 'i-tabler-moustache' : ''}
   {type === 'CraftCMS' ? 'i-tabler-square-rounded-letter-c-filled' : ''}
   "
  ></span>
 {:else if type === "WakaTime"}
  <svg
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 75 75"
   fill="none"
   class="w-8 h-8 text-accent"
  >
   <circle cx="37.5" cy="37.5" r="34.5" stroke="currentColor" stroke-width="6"
   ></circle>
   <path
    d="M23.5 32L32.1956 44.3569C32.5901 44.9175 33.4189 44.924 33.8221 44.3696L36.1556 41.1611C36.5651 40.5981 37.4102 40.6153 37.7964 41.1945L40.1984 44.7976C40.586 45.379 41.4353 45.3938 41.8428 44.8261L55 26.5"
    stroke="currentColor"
    stroke-width="6"
    stroke-linecap="round"
    stroke-linejoin="round"
   ></path>
  </svg>
 {:else if type === "Indeed"}
  <svg
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 60 85"
   fill="none"
   class="w-8 h-8 text-accent"
  >
   <path
    d="M29 77.5C29.0511 77.5746 29.1021 77.6481 29.1532 77.7204M29.1532 77.7204C34.1727 84.8276 39.2543 80.8507 41.3427 77.7415C41.448 77.5846 41.5 77.3997 41.5 77.2107V45.3685C41.5 44.5698 40.5993 44.0817 39.8885 44.4458C36.3882 46.2392 32.8882 46.4375 30.7463 46.2103C30.1038 46.1421 29.4932 46.6203 29.4862 47.2664L29.1532 77.7204ZM3 42.5C9.5 20.5 28.5 -11.5 56.5 12.5"
    stroke="currentColor"
    stroke-width="6"
    stroke-linecap="round"
    stroke-linejoin="round"
   ></path>
   <circle cx="35" cy="28" r="8" stroke="currentColor" stroke-width="6"
   ></circle>
  </svg>
 {:else if type === "UnoCSS"}
  <svg
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 78 79"
   fill="none"
   class="w-8 h-8 color-accent"
  >
   <path
    d="M74 16.4131V33.9131C74 34.4654 73.5523 34.9131 73 34.9131H44C43.4477 34.9131 43 34.4654 43 33.9131V16.8913C43 9.71734 50 3.5 58 3.5C66.5 3.5 74 9.23908 74 16.4131Z"
    stroke="currentColor"
    stroke-width="6"
    stroke-linecap="round"
    stroke-linejoin="round"
   ></path>
   <path
    d="M3 63L3 45.5001C3 44.9478 3.44772 44.5001 4 44.5001L33 44.5001C33.5523 44.5001 34 44.9478 34 45.5001V62.5218C34 69.6957 27 75.9131 19 75.9131C10.5 75.9131 3 70.174 3 63Z"
    stroke="currentColor"
    stroke-width="6"
    stroke-linecap="round"
    stroke-linejoin="round"
   ></path>
   <circle cx="59" cy="60" r="16" stroke="currentColor" stroke-width="6"
   ></circle>
  </svg>
 {:else if type === "Lottie"}
  <svg
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 68 68"
   fill="none"
   class="w-8 h-8 color-accent p-1"
  >
   <rect
    x="3"
    y="3"
    width="62"
    height="62"
    rx="3"
    stroke="currentColor"
    stroke-width="7"
   ></rect>
   <path
    d="M16.5 49C37.5 49 31.5 18.5 52 18.5"
    stroke="currentColor"
    stroke-width="7"
    stroke-linecap="round"
   ></path>
  </svg>
 {:else if type === "PostgreSQL"}
  <svg
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 91 88"
   fill="none"
   class="w-8 h-8 color-accent"
  >
   <path
    d="M35.5 10C29 15.5 28 25.5 28 28.5M35.5 10C30 7.66667 17.5 4.6 11.5 11C5.5 17.4 7 24.5 8 30.5C8.83333 36.1667 11.6 49.2 16 56C20.3481 62.7198 23.7522 60.8785 24.9578 59.0649C24.9866 59.0215 25.0173 58.9804 25.0518 58.9413L32.5 50.5M35.5 10C37.6667 8.33334 44.1 5.60001 52.5 8.00001M32.5 50.5C30.8333 49.6667 27.6 46.6 28 41C28.5 34 28 31.5 28 28.5M32.5 50.5L38.5 52.5M28 28.5C31.1667 26.6667 38.2 23.9 41 27.5C42.2 29.1 42.5 34.1667 42.5 36.5C42.5 38.3333 42.3 42.5 41.5 44.5C40.5 47 39 49.5 38.5 52.5M52.5 8.00001C60.9 10.4 66.3333 18.6667 68 22.5C68.2275 23.1067 68.5171 24.1758 68.6899 25.5M52.5 8.00001C58.1667 5.66667 71 3.30001 79 14.5C81.5 19 80.5 31.9 68.5 51.5M66.5 49C68.5 46.6 68.6667 42 68.5 40C68.1667 38.5 67.7 34.6 68.5 31C68.936 29.0381 68.8968 27.086 68.6899 25.5M66.5 49L60 36.5C58.3333 32.8333 56.7 25.5 63.5 25.5C65.9 25.5 67.9599 25.5 68.6899 25.5M66.5 49L68.5 51.5M38.5 52.5C40.1667 52.3333 43.6 52.9 44 56.5M38.5 52.5C38.5 54.1586 37.5097 58.4581 30.6013 58.4997C30.5354 58.5001 30.4651 58.5067 30.4008 58.5209C28.0314 59.0447 29.1779 60.6712 30 61C37.6 64.2 42.5 59.3333 44 56.5M68.5 51.5V52.5M44 56.5V73.5C43.8333 76 46 82 51.5 82C54.5 82 60.8 80.8 62 76C63.1019 71.5924 64.0071 62.9126 64.4058 58.1678M68.5 52.5C64.9727 52.5 64.3574 55.3801 64.4908 56.9074C64.4963 56.9696 64.4976 57.0314 64.4928 57.0937C64.4672 57.4228 64.4382 57.7823 64.4058 58.1678M68.5 52.5C69.2847 53.2847 72.4044 54.4537 78.7776 53.2514C79.4063 53.1329 80.0059 53.6213 79.7888 54.2231C78.3962 58.082 70.4053 59.3799 64.4058 58.1678"
    stroke="currentColor"
    stroke-width="6"
    stroke-linecap="round"
    stroke-linejoin="round"
   ></path>
   <path
    d="M36.1733 31.5011H36.268"
    stroke="currentColor"
    stroke-width="6"
    stroke-linecap="round"
   ></path>
   <path
    d="M63.3138 30.2896H63.3844"
    stroke="currentColor"
    stroke-width="6"
    stroke-linecap="round"
   ></path>
  </svg>
 {:else if type === "Redis"}
  <svg
   xmlns="http://www.w3.org/2000/svg"
   class="w-8 h-8 color-accent"
   viewBox="0 0 74 63"
   fill="none"
  >
   <path
    d="M5 34V45.307C5 45.7238 5.25857 46.097 5.64888 46.2433L36.6489 57.8683C36.8753 57.9532 37.1247 57.9532 37.3511 57.8683L68.3511 46.2433C68.7414 46.097 69 45.7238 69 45.307V34M5 34L36.6489 45.8683C36.8753 45.9532 37.1247 45.9532 37.3511 45.8683L69 34M5 34V22M69 34V22M69 22V18.6635C69 18.2614 68.7592 17.8984 68.3887 17.7421L37.3887 4.66398C37.1402 4.55914 36.8598 4.55914 36.6113 4.66398L5.6113 17.7421C5.24083 17.8984 5 18.2614 5 18.6635V22M69 22L37.3511 33.8683C37.1247 33.9532 36.8753 33.9532 36.6489 33.8683L5 22"
    stroke="currentColor"
    stroke-width="6"
   ></path>
  </svg>
 {:else if type === "ExpressJS"}
  <svg
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 78 47"
   fill="none"
   class="w-8 h-8 color-accent"
  >
   <path
    d="M73.5 5.5L59.25 23.75M45 42L59.25 23.75M59.25 23.75L45 5.5L73.5 42M4.5 23.75H35C35.5523 23.75 36.0012 23.3021 35.9899 22.7499C35.7961 13.3607 32.7481 4.5 20 4.5C8 4.5 4.5 14.8252 4.5 23.75ZM4.5 23.75C4.5 38.5 15 41.5 20 41.5C22 41.5 28.5 42 35 34.5"
    stroke="currentColor"
    stroke-width="6"
    stroke-linecap="round"
    stroke-linejoin="round"
   ></path>
  </svg>
 {:else if type === "Typo3"}
  <svg
   viewBox="0 0 63 66"
   fill="none"
   xmlns="http://www.w3.org/2000/svg"
   class="w-8 h-8 color-accent"
  >
   <path
    d="M4.00002 15.5C2.5 20 5.50003 30 6.50002 33C7.5 36 8.5 38.5 8.5 38.5L11 44L14 49.5C22 63 26.5 63 29 62C29.0467 61.9873 29.0941 61.9734 29.1421 61.9583C34.7451 60.204 48.9703 43.0128 45.5 44.5C40.0716 46.8265 34 36.6667 31.5 31C28.8333 25.5 24.0936 13.1644 25.5 10C27.1 6.40002 26.5 5.83335 26 6.00002C20.4 7.20002 15 8.83335 13 9.50002C8.50257 11.0568 4.50001 13.5 4.00002 15.5Z"
    stroke="currentColor"
    stroke-width="6"
   />
   <path
    d="M58 21C61 11 62 7.00001 47.5 5.00001C37.801 3.66222 31.5 -1.49999 39 20C40 22.5 41.4464 25.929 41.5 26C44.5 32.5 49.0609 43.3477 58 21Z"
    stroke="currentColor"
    stroke-width="6"
   />
  </svg>
 {/if}
 <div class="color-secondary">{type}</div>
</a>
