<script lang="ts">
  import { page } from '$app/stores';
  let isCollapsed = $state(false);

  function toggleSidebar() {
    isCollapsed = !isCollapsed;
  }
</script>

<aside class="h-full bg-[#111827]/60 backdrop-blur-xl border-r border-white/10 flex flex-col py-6 px-3 transition-all duration-300 z-30 relative {isCollapsed ? 'w-20' : 'w-60'}">
  <div class="flex items-center justify-between mb-8 px-2 w-full">
    {#if !isCollapsed}
      <div>
        <h1 class="text-xl font-black text-[#d0bcff] tracking-tight truncate">GxPlayer</h1>
        <p class="text-[9px] text-purple-300/60 tracking-widest uppercase">Premium Audio</p>
      </div>
    {/if}
    
    <button onclick={toggleSidebar} class="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition {isCollapsed ? 'mx-auto' : 'ml-auto'}">
      <span class="material-symbols-outlined">{isCollapsed ? 'menu_open' : 'menu'}</span>
    </button>
  </div>

  <nav class="flex-1 space-y-2">
    <a href="/" class="flex items-center gap-4 py-3 px-3 rounded-xl font-bold transition-all {$page.url.pathname === '/' ? 'text-[#d0bcff] bg-white/5 border-r-2 border-[#a078ff]' : 'text-neutral-400 hover:text-white hover:bg-white/5'}">
      <span class="material-symbols-outlined text-xl">home</span>
      {#if !isCollapsed}<span class="text-sm truncate">Home</span>{/if}
    </a>

    <a href="/explore" class="flex items-center gap-4 py-3 px-3 rounded-xl font-bold transition-all {$page.url.pathname.startsWith('/explore') ? 'text-[#d0bcff] bg-white/5 border-r-2 border-[#a078ff]' : 'text-neutral-400 hover:text-white hover:bg-white/5'}">
      <span class="material-symbols-outlined text-xl">explore</span>
      {#if !isCollapsed}<span class="text-sm truncate">Explore</span>{/if}
    </a>

    <a href="/library" class="flex items-center gap-4 py-3 px-3 rounded-xl font-bold transition-all {$page.url.pathname.startsWith('/library') ? 'text-[#d0bcff] bg-white/5 border-r-2 border-[#a078ff]' : 'text-neutral-400 hover:text-white hover:bg-white/5'}">
      <span class="material-symbols-outlined text-xl">library_music</span>
      {#if !isCollapsed}<span class="text-sm truncate">Library</span>{/if}
    </a>
  </nav>
</aside>