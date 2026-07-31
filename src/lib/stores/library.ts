import { writable } from 'svelte/store';
import type { Track, Album } from '$lib/types';

// Leer inicial de localStorage (solo en cliente)
const initialFavorites: Track[] = typeof window !== 'undefined' 
  ? JSON.parse(localStorage.getItem('gx_favorites') || '[]') 
  : [];

const initialSavedAlbums: Album[] = typeof window !== 'undefined' 
  ? JSON.parse(localStorage.getItem('gx_saved_albums') || '[]') 
  : [];

export const favoriteTracks = writable<Track[]>(initialFavorites);
export const savedAlbums = writable<Album[]>(initialSavedAlbums);

// Guardar en localStorage cuando cambie el store
if (typeof window !== 'undefined') {
  favoriteTracks.subscribe((value) => {
    localStorage.setItem('gx_favorites', JSON.stringify(value));
  });

  savedAlbums.subscribe((value) => {
    localStorage.setItem('gx_saved_albums', JSON.stringify(value));
  });
}

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