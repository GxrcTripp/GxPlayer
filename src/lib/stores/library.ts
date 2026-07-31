import { writable } from 'svelte/store';
import type { Track, Album } from '$lib/types';

// Stores reactivos
export const favoriteTracks = writable<Track[]>([]);
export const savedAlbums = writable<Album[]>([]);

// Funciones utilitarias para alternar (toggle) canciones favoritas
export function toggleFavoriteTrack(track: Track) {
  favoriteTracks.update((tracks) => {
    const exists = tracks.some((t) => t.id === track.id);
    if (exists) {
      return tracks.filter((t) => t.id !== track.id);
    } else {
      return [...tracks, track];
    }
  });
}

// Alternar álbumes guardados
export function toggleSaveAlbum(album: Album) {
  savedAlbums.update((albums) => {
    const exists = albums.some((a) => a.id === album.id);
    if (exists) {
      return albums.filter((a) => a.id !== album.id);
    } else {
      return [...albums, album];
    }
  });
}