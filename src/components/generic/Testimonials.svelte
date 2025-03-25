<script>
  import { onMount } from 'svelte';
  
  // Sample testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager at TechCorp",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      text: "Lars is one of the most talented developers I've worked with. His attention to detail and problem-solving skills are exceptional. He transformed our complex requirements into an elegant solution that exceeded our expectations."
    },
    {
      name: "Michael Chen",
      role: "CTO at StartupBoost",
      image: "https://randomuser.me/api/portraits/men/44.jpg",
      text: "Working with Lars was a game-changer for our startup. His technical expertise and ability to deliver clean, efficient code on tight deadlines helped us launch our product ahead of schedule. Highly recommended!"
    },
    {
      name: "Emma Weber",
      role: "Lead Designer at CreativeFlow",
      image: "https://randomuser.me/api/portraits/women/62.jpg",
      text: "As a designer, finding a developer who can perfectly implement my designs is rare. Lars not only brought my designs to life but enhanced them with smooth animations and perfect responsiveness. A true professional."
    }
  ];
  
  let currentIndex = 0;
  let intervalId;
  
  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonials.length;
  }
  
  function prevTestimonial() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  }
  
  onMount(() => {
    // Auto-rotate testimonials
    intervalId = setInterval(() => {
      nextTestimonial();
    }, 8000);
    
    return () => {
      clearInterval(intervalId);
    };
  });
</script>

<div class="testimonials-wrapper w-full py-8 mb-8">
  <h2 class="text-accent text-2xl font-bold mb-10 text-center">What People Say</h2>
  
  <div class="testimonial-carousel relative max-w-3xl mx-auto overflow-hidden">
    <div class="testimonials-container flex transition-all duration-300 ease-in-out" style="transform: translateX(-{currentIndex * 100}%)">
      {#each testimonials as testimonial, i}
        <div class="testimonial-card w-full flex-shrink-0 p-6 bg-secondary/20 backdrop-blur-md rounded-xl border border-accent/20 shadow-lg flex flex-col md:flex-row gap-6">
          <div class="md:w-1/4 flex justify-center">
            <div class="w-24 h-24 rounded-full overflow-hidden border-2 border-accent/40">
              <img src={testimonial.image} alt={testimonial.name} class="w-full h-full object-cover" />
            </div>
          </div>
          <div class="md:w-3/4">
            <div class="mb-4">
              <svg class="w-8 h-8 text-accent/50" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.685.76-2.22.66-.53 1.19-.52 1.87.02.34.275.96.92 1.21.918l.01-.002c.307-.085.58-.247.81-.486a1.5 1.5 0 0 0 .45-1.08c-.354-1.423-1.693-2.088-3.3-2.133-1.19-.04-2.39.368-3.33 1.14-.96.773-1.5 1.83-1.5 2.94 0 1.422.55 2.52 1.58 3.31.39.302.8.54 1.21.727 0 .8.35 1.486 1.06 2.068.75.603 1.86.92 2.69.92.86 0 1.423-.097 2.05-.286.63-.19 1.21-.507 1.73-.95a4.3 4.3 0 0 0 1.19-1.64c.26-.603.4-1.247.4-1.926 0-.602-.13-1.147-.38-1.635-.25-.486-.68-.936-1.27-1.353-.6-.417-1.34-.75-2.22-1.01a9.64 9.64 0 0 1-1.71-.66c-.31-.146-.52-.298-.63-.456a.62.62 0 0 1-.17-.425c0-.2.09-.384.25-.552.21-.226.58-.413.86-.402.93.026 1.65.326 2.15.9.22.25.42.5.59.78.76.08.16.17.25.27l.05.02c.36.33.8.54 1.29.55.35 0 .7-.12.95-.35.25-.22.42-.52.45-.86.05-.5-.1-1.04-.5-1.66z" />
                <path d="M21.23 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.685.76-2.22.66-.53 1.19-.52 1.87.02.34.275.96.92 1.21.918l.01-.002c.307-.085.58-.247.81-.486a1.5 1.5 0 0 0 .45-1.08c-.354-1.423-1.693-2.088-3.3-2.133-1.19-.04-2.39.368-3.33 1.14-.96.773-1.5 1.83-1.5 2.94 0 1.422.55 2.52 1.58 3.31.39.302.8.54 1.21.727 0 .8.35 1.486 1.06 2.068.75.603 1.86.92 2.69.92.86 0 1.423-.097 2.05-.286.63-.19 1.21-.507 1.73-.95a4.3 4.3 0 0 0 1.19-1.64c.26-.603.4-1.247.4-1.926 0-.602-.13-1.147-.38-1.635-.25-.486-.68-.936-1.27-1.353-.6-.417-1.34-.75-2.22-1.01a9.64 9.64 0 0 1-1.71-.66c-.31-.146-.52-.298-.63-.456a.62.62 0 0 1-.17-.425c0-.2.09-.384.25-.552.21-.226.58-.413.86-.402.93.026 1.65.326 2.15.9.22.25.42.5.59.78.76.08.16.17.25.27l.05.02c.36.33.8.54 1.29.55.35 0 .7-.12.95-.35.25-.22.42-.52.45-.86.05-.5-.1-1.04-.5-1.66z" />
              </svg>
            </div>
            <p class="text-text/90 text-lg italic mb-4">{testimonial.text}</p>
            <div>
              <p class="font-semibold text-accent">{testimonial.name}</p>
              <p class="text-text/70 text-sm">{testimonial.role}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Navigation Buttons -->
    <button 
      class="absolute top-1/2 -translate-y-1/2 left-1 z-10 bg-background/50 backdrop-blur-sm rounded-full p-2 border border-accent/30 hover:bg-secondary/50 transition-colors" 
      on:click={prevTestimonial}
      aria-label="Previous testimonial"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button 
      class="absolute top-1/2 -translate-y-1/2 right-1 z-10 bg-background/50 backdrop-blur-sm rounded-full p-2 border border-accent/30 hover:bg-secondary/50 transition-colors" 
      on:click={nextTestimonial}
      aria-label="Next testimonial"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
    
    <!-- Indicators -->
    <div class="flex gap-2 justify-center mt-4">
      {#each testimonials as _, i}
        <button 
          class="w-2 h-2 rounded-full {i === currentIndex ? 'bg-accent' : 'bg-accent/30'} transition-colors"
          on:click={() => currentIndex = i}
          aria-label={`Go to testimonial ${i + 1}`}
        ></button>
      {/each}
    </div>
  </div>
</div>

<style>
  .testimonials-container {
    display: flex;
    width: 100%;
  }
  
  .testimonial-card {
    width: 100%;
    flex: 0 0 100%;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>