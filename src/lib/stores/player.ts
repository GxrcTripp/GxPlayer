import { writable, get } from 'svelte/store';
import type { Track } from '$lib/types';

// Valores iniciales desde localStorage
const initialTrack: Track | null = typeof window !== 'undefined'
  ? JSON.parse(localStorage.getItem('gx_current_track') || 'null')
  : null;

const initialPlaylist: Track[] = typeof window !== 'undefined'
  ? JSON.parse(localStorage.getItem('gx_playlist') || '[]')
  : [];

const initialIndex: number = typeof window !== 'undefined'
  ? JSON.parse(localStorage.getItem('gx_current_index') || '-1')
  : -1;

export const currentTrack = writable<Track | null>(initialTrack);
// Al recargar la página la ponemos en pausado por defecto para no asustar al usuario con audio automático
export const isPlaying = writable<boolean>(false);
export const playlist = writable<Track[]>(initialPlaylist);
export const currentIndex = writable<number>(initialIndex);

// Sincronizar automáticamente con localStorage ante cualquier cambio
if (typeof window !== 'undefined') {
  currentTrack.subscribe((val) => {
    if (val) localStorage.setItem('gx_current_track', JSON.stringify(val));
    else localStorage.removeItem('gx_current_track');
  });

  playlist.subscribe((val) => {
    localStorage.setItem('gx_playlist', JSON.stringify(val));
  });

  currentIndex.subscribe((val) => {
    localStorage.setItem('gx_current_index', JSON.stringify(val));
  });
}

export function togglePlay() {
  isPlaying.update((val) => !val);
}

export function playTrack(track: Track, tracksQueue: Track[] = []) {
  currentTrack.set(track);
  isPlaying.set(true);

  if (tracksQueue.length > 0) {
    playlist.set(tracksQueue);
    const idx = tracksQueue.findIndex((t) => t.id === track.id);
    currentIndex.set(idx !== -1 ? idx : 0);
  } else {
    const currentList = get(playlist);
    const idx = currentList.findIndex((t) => t.id === track.id);
    if (idx !== -1) {
      currentIndex.set(idx);
    } else {
      playlist.update((list) => [...list, track]);
      currentIndex.set(get(playlist).length - 1);
    }
  }
}

export function addToQueue(track: Track) {
  playlist.update((list) => {
    if (list.some((t) => t.id === track.id)) return list;
    return [...list, track];
  });

  if (!get(currentTrack)) {
    currentTrack.set(track);
    currentIndex.set(0);
  }
}

export function playNext(track: Track) {
  const list = get(playlist);
  const idx = get(currentIndex);

  if (list.length === 0) {
    playTrack(track);
    return;
  }

  const newList = [...list];
  newList.splice(idx + 1, 0, track);
  playlist.set(newList);
}

export function nextTrack() {
  const list = get(playlist);
  const idx = get(currentIndex);

  if (list.length === 0) return;

  const nextIdx = (idx + 1) % list.length;
  currentIndex.set(nextIdx);
  currentTrack.set(list[nextIdx]);
  isPlaying.set(true);
}

export function previousTrack() {
  const list = get(playlist);
  const idx = get(currentIndex);

  if (list.length === 0) return;

  const prevIdx = (idx - 1 + list.length) % list.length;
  currentIndex.set(prevIdx);
  currentTrack.set(list[prevIdx]);
  isPlaying.set(true);
}

export function removeFromQueue(index: number) {
  playlist.update((list) => list.filter((_, i) => i !== index));
}

export function playShuffle(tracks: Track[]) {
  if (tracks.length === 0) return;

  const shuffled = [...tracks];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  playTrack(shuffled[0], shuffled);
}