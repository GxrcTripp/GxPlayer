<script lang="ts">
  import TrackCard from '$lib/components/TrackCard.svelte';
  import AlbumCard from '$lib/components/AlbumCard.svelte';
  import { favoriteTracks, savedAlbums } from '$lib/stores/library';
  import { playTrack, playShuffle } from '$lib/stores/player';
  import type { Track } from '$lib/types';

  let { data } = $props();
  let allTracks = $derived((data.tracks ?? []) as Track[]);

  let activeTab = $state<'tracks' | 'albums'>('tracks');

  function handlePlayAllFavorites() {
    if ($favoriteTracks.length > 0) {
      playTrack($favoriteTracks[0], $favoriteTracks);
    }
  }

  function handleShuffleFavorites() {
    if ($favoriteTracks.length > 0) {
      playShuffle($favoriteTracks);
    }
  }
</script>

<div class="space-y-8">
  <!-- Encabezado de la Biblioteca -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
    <div>
      <h1 class="text-3xl font-black text-white">Tu Biblioteca</h1>
      <p class="text-xs text-neutral-400 mt-1">Colección de canciones y álbumes guardados</p>
    </div>

    <!-- Pestañas Canciones / Álbumes -->
    <div class="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10 self-start sm:self-auto">
      <button 
        onclick={() => activeTab = 'tracks'}
        class="px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer {activeTab === 'tracks' ? 'bg-[#a078ff] text-[#111827]' : 'text-neutral-400 hover:text-white'}"
      >
        Canciones ({$favoriteTracks.length})
      </button>
      <button 
        onclick={() => activeTab = 'albums'}
        class="px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer {activeTab === 'albums' ? 'bg-[#a078ff] text-[#111827]' : 'text-neutral-400 hover:text-white'}"
      >
        Álbumes ({$savedAlbums.length})
      </button>
    </div>
  </div>

  <!-- PESTAÑA CANCIONES -->
  {#if activeTab === 'tracks'}
    <section class="space-y-6">
      {#if $favoriteTracks.length > 0}
        <!-- Botones Principales de Reproducción / Aleatorio -->
        <div class="flex items-center gap-4">
          <!-- Botón Play Principal -->
          <button 
            onclick={handlePlayAllFavorites}
            class="bg-[#a078ff] hover:bg-[#8b5cf6] text-[#111827] px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(160,120,255,0.3)] hover:shadow-[0_0_25px_rgba(160,120,255,0.5)] cursor-pointer text-sm"
          >
            <span class="material-symbols-outlined text-xl font-black">play_arrow</span>
            Reproducir
          </button>

          <!-- Botón Aleatorio (Shuffle) -->
          <button 
            onclick={handleShuffleFavorites}
            class="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-5 py-2.5 rounded-full font-bold flex items-center gap-2 transition cursor-pointer text-sm"
            title="Mezclar canciones de la biblioteca"
          >
            <span class="material-symbols-outlined text-xl text-[#03b5d3]">shuffle</span>
            Aleatorio
          </button>
        </div>

        <!-- Lista de Favoritas -->
        <div class="space-y-1">
          {#each $favoriteTracks as track, i}
            <TrackCard {track} index={i + 1} />
          {/each}
        </div>
      {:else}
        <div class="text-center py-16 text-neutral-500 space-y-2">
          <span class="material-symbols-outlined text-4xl">favorite_border</span>
          <p class="text-sm">Aún no has añadido canciones a tus favoritas.</p>
        </div>
      {/if}
    </section>

  <!-- PESTAÑA ÁLBUMES -->
  {:else}
    <section>
      {#if $savedAlbums.length > 0}
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {#each $savedAlbums as album}
            <AlbumCard {album} tracks={allTracks} />
          {/each}
        </div>
      {:else}
        <div class="text-center py-16 text-neutral-500 space-y-2">
          <span class="material-symbols-outlined text-4xl">library_music</span>
          <p class="text-sm">No tienes álbumes guardados en tu biblioteca.</p>
        </div>
      {/if}
    </section>
  {/if}
</div>