<script lang="ts">
  import type { Track } from '$lib/types';
  import { playTrack, addToQueue, playNext, currentTrack, isPlaying } from '$lib/stores/player';
  import { favoriteTracks, toggleFavoriteTrack } from '$lib/stores/library';

  let { track, index = 1 } = $props<{ track: Track; index?: number }>();
  let isCurrent = $derived($currentTrack?.id === track.id);
  let isLiked = $derived($favoriteTracks.some(t => t.id === track.id));

  let showMenu = $state(false);

  function handleLike(e: MouseEvent) {
    e.stopPropagation();
    toggleFavoriteTrack(track);
  }

  function handleAddToQueue(e: MouseEvent) {
    e.stopPropagation();
    addToQueue(track);
    showMenu = false;
  }

  function handlePlayNext(e: MouseEvent) {
    e.stopPropagation();
    playNext(track);
    showMenu = false;
  }

  function toggleMenu(e: MouseEvent) {
    e.stopPropagation();
    showMenu = !showMenu;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  onclick={() => playTrack(track)}
  class="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer w-full border border-transparent hover:border-white/5 relative"
>
  <span class="text-neutral-500 w-4 text-center text-sm font-mono">{index}</span>
  
  <div class="w-12 h-12 rounded-lg overflow-hidden shrink-0 relative">
    <img src={track.album?.image || track.artist?.image} alt={track.title} class="w-full h-full object-cover" />
    <div class="absolute inset-0 bg-black/40 items-center justify-center hidden group-hover:flex">
      <span class="text-white text-xs">{isCurrent && $isPlaying ? '⏸' : '▶'}</span>
    </div>
  </div>

  <div class="flex-1 overflow-hidden">
    <h4 class="text-white font-medium truncate text-sm {isCurrent ? 'text-[#d0bcff]' : ''}">
      {track.title}
    </h4>
    <p class="text-neutral-400 text-xs truncate">{track.artist?.name}</p>
  </div>

  <!-- Botones de Acción -->
  <div class="flex items-center gap-1">
    <button 
      onclick={handleLike}
      class="p-2 text-neutral-500 hover:text-white transition cursor-pointer"
      title={isLiked ? "Quitar de favoritos" : "Guardar en favoritos"}
    >
      <span class="material-symbols-outlined text-lg {isLiked ? 'text-[#a078ff] fill-current' : ''}">
        {isLiked ? 'favorite' : 'favorite_border'}
      </span>
    </button>

    <div class="relative">
      <button 
        onclick={toggleMenu}
        class="p-2 text-neutral-500 hover:text-white transition cursor-pointer rounded-lg hover:bg-white/10"
        title="Más opciones"
      >
        <span class="material-symbols-outlined text-lg">more_vert</span>
      </button>

      {#if showMenu}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
          onclick={(e) => { e.stopPropagation(); showMenu = false; }} 
          class="fixed inset-0 z-40"
        ></div>

        <div class="absolute right-0 top-10 w-48 bg-[#181e29] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-0.5 backdrop-blur-xl">
          <button 
            onclick={handleAddToQueue}
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-neutral-200 hover:text-white hover:bg-white/10 transition text-left cursor-pointer"
          >
            <span class="material-symbols-outlined text-base text-[#a078ff]">queue</span>
            Añadir al final de la cola
          </button>

          <button 
            onclick={handlePlayNext}
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-neutral-200 hover:text-white hover:bg-white/10 transition text-left cursor-pointer"
          >
            <span class="material-symbols-outlined text-base text-[#03b5d3]">playlist_play</span>
            Reproducir a continuación
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>