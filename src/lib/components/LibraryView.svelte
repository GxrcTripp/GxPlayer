<script lang="ts">
  import TrackCard from '$lib/components/TrackCard.svelte';
  import AlbumCard from '$lib/components/AlbumCard.svelte';
  import { favoriteTracks, savedAlbums } from '$lib/stores/library';
  import type { Album, Track } from '$lib/types';

  let { allTracks = [], onSelectAlbum } = $props<{ 
    allTracks?: Track[]; 
    onSelectAlbum?: (album: Album) => void 
  }>();

  let activeTab = $state<'tracks' | 'albums'>('tracks');
</script>

<div class="space-y-8">
  <!-- Encabezado de la Biblioteca -->
  <div class="flex items-center justify-between border-b border-white/10 pb-4">
    <div>
      <h1 class="text-3xl font-black text-white">Tu Biblioteca</h1>
      <p class="text-xs text-neutral-400 mt-1">Colección de canciones y álbumes guardados</p>
    </div>

    <!-- Pestañas Canciones / Álbumes -->
    <div class="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
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

  <!-- Contenido según la pestaña activa -->
  {#if activeTab === 'tracks'}
    <section>
      {#if $favoriteTracks.length > 0}
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
  {:else}
    <section>
      {#if $savedAlbums.length > 0}
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {#each $savedAlbums as album}
            <AlbumCard {album} tracks={allTracks} onSelect={onSelectAlbum} />
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