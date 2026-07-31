<script lang="ts">
  import { page } from '$app/stores';
  import TrackCard from '$lib/components/TrackCard.svelte';
  import type { Track, Album } from '$lib/types';
  import { playTrack } from '$lib/stores/player';

  // Svelte 5 runes: Recibimos data de los layouts superiores
  let { data } = $props();

  // Obtenemos el ID del álbum desde los parámetros de la URL
  let albumId = $derived($page.params.id);

  // Aseguramos arreglos seguros
  let tracks = $derived((data.tracks ?? []) as Track[]);
  let albums = $derived((data.albums ?? []) as Album[]);

  // Buscamos el álbum y sus canciones correspondientes
  let currentAlbum = $derived(albums.find(a => String(a.id) === String(albumId)));
  let albumTracks = $derived(tracks.filter(t => String(t.albumId) === String(albumId) || String(t.album?.id) === String(albumId)));

  function playAll() {
    if (albumTracks.length > 0) {
      playTrack(albumTracks[0]);
    }
  }
</script>

<div class="space-y-8">
  {#if currentAlbum}
    <!-- Botón Volver -->
    <a 
      href="/" 
      class="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-2 rounded-full transition text-sm border border-white/10"
    >
      <span class="material-symbols-outlined text-sm">arrow_back</span> Volver al inicio
    </a>

    <!-- Banner Header del Álbum -->
    <div class="flex flex-col sm:flex-row items-center sm:items-end gap-6 glass-panel p-6 rounded-3xl border border-white/10">
      <div class="w-48 h-48 sm:w-56 sm:h-56 overflow-hidden rounded-2xl shadow-2xl shrink-0 border border-white/10">
        <img 
          src={currentAlbum.image || currentAlbum.thumbnail} 
          alt={currentAlbum.title} 
          class="w-full h-full object-cover" 
        />
      </div>

      <div class="flex-1 text-center sm:text-left space-y-3">
        <span class="text-xs uppercase tracking-widest font-bold text-[#d0bcff]">Álbum</span>
        <h1 class="text-3xl sm:text-5xl font-black text-white leading-tight">{currentAlbum.title}</h1>
        <p class="text-neutral-400 text-sm">
          {currentAlbum.artist?.name ?? 'Varios Artistas'} • {albumTracks.length} {albumTracks.length === 1 ? 'canción' : 'canciones'}
        </p>

        <div class="pt-2">
          <button 
            onclick={playAll}
            disabled={albumTracks.length === 0}
            class="bg-[#a078ff] hover:bg-[#8b5cf6] text-[#111827] px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(160,120,255,0.3)] cursor-pointer disabled:opacity-40"
          >
            <span class="material-symbols-outlined text-2xl font-black">play_arrow</span>
            Reproducir
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de Canciones del Álbum -->
    <section>
      <h3 class="text-xl font-bold text-white mb-4">Canciones</h3>
      {#if albumTracks.length > 0}
        <div class="space-y-1">
          {#each albumTracks as track, i}
            <TrackCard {track} index={i + 1} />
          {/each}
        </div>
      {:else}
        <p class="text-neutral-500 text-sm italic">No hay canciones registradas en este álbum.</p>
      {/if}
    </section>
  {:else}
    <!-- Estado mientras carga o si no se encuentra -->
    <div class="py-20 text-center space-y-4">
      <p class="text-neutral-400 text-lg">Cargando detalles del álbum o no fue encontrado...</p>
      <a href="/" class="text-[#d0bcff] hover:underline font-bold text-sm">Volver al inicio</a>
    </div>
  {/if}
</div>