<script lang="ts">
  import TrackCard from '$lib/components/TrackCard.svelte';
  import AlbumCard from '$lib/components/AlbumCard.svelte';
  import ArtistCard from '$lib/components/ArtistCard.svelte';
  import type { Track, Album, Artist } from '$lib/types';

  let { 
    allTracks = [], 
    allAlbums = [], 
    allArtists = [], 
    onSelectAlbum, 
    onSelectArtist 
  } = $props<{
    allTracks?: Track[];
    allAlbums?: Album[];
    allArtists?: Artist[];
    onSelectAlbum?: (album: Album) => void;
    onSelectArtist?: (artist: Artist) => void;
  }>();

  let searchQuery = $state('');
  let filterCategory = $state<'all' | 'tracks' | 'albums' | 'artists'>('all');

  // Filtrado reactivo en tiempo real
  let matchingTracks = $derived.by(() => {
    if (!searchQuery.trim()) return allTracks;
    const q = searchQuery.toLowerCase();
    return allTracks.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.artist?.name.toLowerCase().includes(q) ||
      t.album?.title.toLowerCase().includes(q)
    );
  });

  let matchingAlbums = $derived.by(() => {
    if (!searchQuery.trim()) return allAlbums;
    const q = searchQuery.toLowerCase();
    return allAlbums.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.artist?.name.toLowerCase().includes(q)
    );
  });

  let matchingArtists = $derived.by(() => {
    if (!searchQuery.trim()) return allArtists;
    const q = searchQuery.toLowerCase();
    return allArtists.filter(a => a.name.toLowerCase().includes(q));
  });
</script>

<div class="space-y-8">
  <!-- Header de Explorar + Input de Búsqueda -->
  <div class="space-y-4">
    <h1 class="text-3xl font-black text-white">Explorar</h1>

    <div class="relative w-full max-w-2xl">
      <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xl pointer-events-none">
        search
      </span>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Buscar canciones, artistas o álbumes..."
        class="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#a078ff] focus:ring-1 focus:ring-[#a078ff] transition backdrop-blur-xl"
      />
      {#if searchQuery}
        <button 
          onclick={() => searchQuery = ''}
          class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition"
        >
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      {/if}
    </div>

    <!-- Chips de Filtro -->
    <div class="flex items-center gap-2 pt-2">
      <button 
        onclick={() => filterCategory = 'all'}
        class="px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer {filterCategory === 'all' ? 'bg-[#a078ff] text-[#111827]' : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'}"
      >
        Todo
      </button>
      <button 
        onclick={() => filterCategory = 'tracks'}
        class="px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer {filterCategory === 'tracks' ? 'bg-[#a078ff] text-[#111827]' : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'}"
      >
        Canciones ({matchingTracks.length})
      </button>
      <button 
        onclick={() => filterCategory = 'albums'}
        class="px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer {filterCategory === 'albums' ? 'bg-[#a078ff] text-[#111827]' : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'}"
      >
        Álbumes ({matchingAlbums.length})
      </button>
      <button 
        onclick={() => filterCategory = 'artists'}
        class="px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer {filterCategory === 'artists' ? 'bg-[#a078ff] text-[#111827]' : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'}"
      >
        Artistas ({matchingArtists.length})
      </button>
    </div>
  </div>

  <!-- RESULTADOS -->

  <!-- 1. Artistas -->
  {#if (filterCategory === 'all' || filterCategory === 'artists') && matchingArtists.length > 0}
    <section>
      <h3 class="text-xl font-bold text-white mb-4">Artistas</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {#each matchingArtists as artist}
          <ArtistCard {artist} onSelect={onSelectArtist} />
        {/each}
      </div>
    </section>
  {/if}

  <!-- 2. Álbumes -->
  {#if (filterCategory === 'all' || filterCategory === 'albums') && matchingAlbums.length > 0}
    <section>
      <h3 class="text-xl font-bold text-white mb-4">Álbumes</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {#each matchingAlbums as album}
          <AlbumCard {album} tracks={allTracks} onSelect={onSelectAlbum} />
        {/each}
      </div>
    </section>
  {/if}

  <!-- 3. Canciones -->
  {#if (filterCategory === 'all' || filterCategory === 'tracks') && matchingTracks.length > 0}
    <section>
      <h3 class="text-xl font-bold text-white mb-4">Canciones</h3>
      <div class="space-y-1">
        {#each matchingTracks as track, i}
          <TrackCard {track} index={i + 1} />
        {/each}
      </div>
    </section>
  {/if}

  <!-- Sin Resultados -->
  {#if matchingTracks.length === 0 && matchingAlbums.length === 0 && matchingArtists.length === 0}
    <div class="text-center py-16 text-neutral-500 space-y-2">
      <span class="material-symbols-outlined text-4xl">search_off</span>
      <p class="text-sm">No se encontraron resultados para "{searchQuery}".</p>
    </div>
  {/if}
</div>