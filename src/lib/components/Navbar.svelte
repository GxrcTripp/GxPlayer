<script lang="ts">
  let isCollapsed = $state(false);

  function toggleSidebar() {
    isCollapsed = !isCollapsed;
  }
</script>

<aside 
  class="h-full bg-[#111827]/60 backdrop-blur-xl border-r border-white/10 flex flex-col py-6 px-3 transition-all duration-300 z-30 relative {isCollapsed ? 'w-20' : 'w-60'}"
>
<!-- Encabezado + Botón de Colapsar/Abatible -->
  <div class="flex items-center justify-between mb-8 px-2 w-full">
    {#if !isCollapsed}
      <div>
        <h1 class="text-xl font-black text-[#d0bcff] tracking-tight truncate">GxPlayer</h1>
        <p class="text-[9px] text-purple-300/60 tracking-widest uppercase">Premium Audio</p>
      </div>
    {/if}
    
    <button 
      onclick={toggleSidebar}
      class="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition {isCollapsed ? 'mx-auto' : 'ml-auto'}"
      title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
    >
      <span class="material-symbols-outlined">
        {isCollapsed ? 'menu_open' : 'menu'}
      </span>
    </button>
  </div>

  <!-- Links con Íconos de Google -->
  <nav class="flex-1 space-y-2">
    <a href="#" class="flex items-center gap-4 py-3 px-3 rounded-xl text-[#d0bcff] font-bold bg-white/5 transition-all">
      <span class="material-symbols-outlined text-xl">home</span>
      {#if !isCollapsed}
        <span class="text-sm truncate">Inicio</span>
      {/if}
    </a>

    <a href="#" class="flex items-center gap-4 py-3 px-3 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
      <span class="material-symbols-outlined text-xl">explore</span>
      {#if !isCollapsed}
        <span class="text-sm truncate">Explorar</span>
      {/if}
    </a>

    <a href="#" class="flex items-center gap-4 py-3 px-3 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
      <span class="material-symbols-outlined text-xl">library_music</span>
      {#if !isCollapsed}
        <span class="text-sm truncate">Biblioteca</span>
      {/if}
    </a>
  </nav>

  <!-- Usuario -->
  <div class="mt-auto pt-4 border-t border-white/5 flex items-center gap-3">
    <div class="w-9 h-9 rounded-full border border-purple-500/30 bg-neutral-800 flex items-center justify-center font-bold text-xs text-purple-300 flex-shrink-0">
      GA
    </div>
    {#if !isCollapsed}
      <div class="overflow-hidden">
        <p class="text-xs font-bold text-white truncate">Gustavo</p>
        <p class="text-[9px] text-purple-400 uppercase font-bold">Pro User</p>
      </div>
    {/if}
  </div>
</aside>