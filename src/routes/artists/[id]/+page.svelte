<script lang="ts">
  import { page } from '$app/stores';
  import TrackCard from '$lib/components/TrackCard.svelte';
  import AlbumCard from '$lib/components/AlbumCard.svelte';
  import type { Track, Album, Artist } from '$lib/types';
  import { playTrack } from '$lib/stores/player';

  let { data } = $props();

  let artistId = $derived($page.params.id);
  let tracks = $derived(data.tracks as Track[]);
  let albums = $derived(data.albums as Album[]);
  let artists = $derived(data.artists as Artist[]);

  let currentArtist = $derived(artists.find(a => a.id === artistId));
  let artistTracks = $derived(tracks.filter(t => t.artistId === artistId || t.artist?.id === artistId));
  let artistAlbums = $derived(albums.filter(a => a.artist?.id === artistId || (a as any).artistId === artistId));

  function playAll() {
    if (artistTracks.length > 0) {
      playTrack(artistTracks[0]);
    }
  }
</script>

{#if currentArtist}
  <div class="space-y-8">
    <a href="/" class="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-2 rounded-full transition text-sm border border-white/10">
      <span class="material-symbols-outlined text-sm">arrow_back</span> Volver al inicio
    </a>

    <!-- Banner Artista -->
    <div class="flex flex-col sm:flex-row items-center sm:items-end gap-6 glass-panel p-6 rounded-3xl border border-white/10">
      <div class="w-48 h-48 sm:w-56 sm:h-56 overflow-hidden rounded-full shadow-2xl shrink-0 border border-white/10">
        <img src={currentArtist.image || currentArtist.thumbnail} alt={currentArtist.name} class="w-full h-full object-cover" />
      </div>

      <div class="flex-1 text-center sm:text-left space-y-3">
        <span class="text-xs uppercase tracking-widest font-bold text-[#d0bcff]">Artista Verificado</span>
        <h1 class="text-3xl sm:text-5xl font-black text-white leading-tight">{currentArtist.name}</h1>
        <p class="text-neutral-400 text-sm">{artistAlbums.length} álbumes • {artistTracks.length} canciones</p>

        <div class="pt-2">
          <button onclick={playAll} class="bg-[#a078ff] hover:bg-[#8b5cf6] text-[#111827] px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(160,120,255,0.3)] cursor-pointer">
            <span class="material-symbols-outlined text-2xl font-black">play_arrow</span> Reproducir
          </button>
        </div>
      </div>
    </div>

    <!-- Canciones Popular (2 Columnas) -->
    <section>
      <h3 class="text-xl font-bold text-white mb-4">Canciones Populares</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
        {#each artistTracks as track, i}
          <TrackCard {track} index={i + 1} />
        {/each}
      </div>
    </section>

    <!-- Discografía -->
    {#if artistAlbums.length > 0}
      <section>
        <h3 class="text-xl font-bold text-white mb-4">Discografía</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {#each artistAlbums as album}
            <AlbumCard {album} {tracks} />
          {/each}
        </div>
      </section>
    {/if}
  </div>
{:else}
  <div class="py-20 text-center space-y-4">
    <p class="text-neutral-400 text-lg">Artista no encontrado</p>
    <a href="/" class="text-[#d0bcff] hover:underline font-bold text-sm">Volver al inicio</a>
  </div>
{/if}