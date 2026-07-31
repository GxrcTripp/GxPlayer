<script lang="ts">
  import type { Album, Track } from '$lib/types';
  import { playTrack } from '$lib/stores/player';
  import { savedAlbums, toggleSaveAlbum } from '$lib/stores/library';

  let { album, tracks = [] } = $props<{ album: Album; tracks?: Track[] }>();

  let isSaved = $derived($savedAlbums.some(a => a.id === album.id));

  function handlePlayClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const albumTracks = tracks.filter(t => t.albumId === album.id || t.album?.id === album.id);
    if (albumTracks.length > 0) {
      playTrack(albumTracks[0], albumTracks);
    }
  }

  function handleToggleSave(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveAlbum(album);
  }
</script>

<a href="/albums/{album.id}" class="group cursor-pointer text-left w-full block">
  <div class="aspect-square rounded-2xl overflow-hidden mb-3 glass-panel border-0 group-hover:border-white/10 transition-all relative">
    <img 
      src={album.image || album.thumbnail} 
      alt={album.title} 
      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    
    <!-- Capa Hover con Botones -->
    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <!-- Botón Play Central -->
      <button 
        onclick={handlePlayClick}
        class="w-12 h-12 bg-[#d0bcff] rounded-full flex items-center justify-center text-[#3c0091] shadow-xl hover:scale-110 transition-transform cursor-pointer"
        title="Reproducir álbum directo"
      >
        <span class="material-symbols-outlined text-2xl">play_arrow</span>
      </button>

      <!-- Botón Favorito en Esquina Superior -->
      <button 
        onclick={handleToggleSave}
        class="absolute top-2 right-2 w-9 h-9 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer"
        title={isSaved ? "Quitar de la biblioteca" : "Guardar en la biblioteca"}
      >
        <span class="material-symbols-outlined text-sm {isSaved ? 'text-[#a078ff] fill-current' : ''}">
          {isSaved ? 'bookmark' : 'bookmark_add'}
        </span>
      </button>
    </div>
  </div>

  <h4 class="text-white font-bold truncate text-sm group-hover:underline decoration-[#d0bcff] decoration-2">
    {album.title}
  </h4>
  <p class="text-neutral-400 text-xs truncate group-hover:text-neutral-200 transition-colors">
    {album.artist?.name ?? 'Álbum'}
  </p>
</a>