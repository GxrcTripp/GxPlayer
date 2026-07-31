<script lang="ts">
  import TrackCard from '$lib/components/TrackCard.svelte';
  import AlbumCard from '$lib/components/AlbumCard.svelte';
  import ArtistCard from '$lib/components/ArtistCard.svelte';
  import type { Track, Album, Artist } from '$lib/types';

  let { data } = $props();

  let tracks = $derived(data.tracks as Track[]);
  let albums = $derived(data.albums as Album[]);
  let artists = $derived(data.artists as Artist[]);
</script>

<div class="space-y-10">
  <!-- Artistas Top -->
  <section>
    <h3 class="text-xl font-bold text-white mb-6">Artistas Top</h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {#each artists as artist}
        <ArtistCard {artist} />
      {/each}
    </div>
  </section>

  <!-- Álbumes -->
  <section>
    <h3 class="text-xl font-bold text-white mb-6">Álbumes para ti</h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {#each albums as album}
        <AlbumCard {album} {tracks} />
      {/each}
    </div>
  </section>

  <!-- Canciones -->
  <section>
    <h3 class="text-xl font-bold text-white mb-6">Todas las Canciones</h3>
    <div class="space-y-1">
      {#each tracks as track, i}
        <TrackCard {track} index={i + 1} />
      {/each}
    </div>
  </section>
</div>