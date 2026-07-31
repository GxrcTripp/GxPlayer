import { writable, get } from 'svelte/store';
import type { Track } from '$lib/types';

export const currentTrack = writable<Track | null>(null);
export const isPlaying = writable<boolean>(false);
export const playlist = writable<Track[]>([]);
export const currentIndex = writable<number>(-1);

export function togglePlay() {
  isPlaying.update((val) => !val);
}

// Reproducir una pista y opcionalmente cargar la lista completa
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

// Añadir una canción al FINAL de la cola
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

// Añadir canción para reproducir A CONTINUACIÓN
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

// Saltar a la siguiente canción
export function nextTrack() {
  const list = get(playlist);
  const idx = get(currentIndex);

  if (list.length === 0) return;

  const nextIdx = (idx + 1) % list.length;
  currentIndex.set(nextIdx);
  currentTrack.set(list[nextIdx]);
  isPlaying.set(true);
}

// Volver a la canción anterior
export function previousTrack() {
  const list = get(playlist);
  const idx = get(currentIndex);

  if (list.length === 0) return;

  const prevIdx = (idx - 1 + list.length) % list.length;
  currentIndex.set(prevIdx);
  currentTrack.set(list[prevIdx]);
  isPlaying.set(true);
}

// Eliminar una pista de la cola por su índice
export function removeFromQueue(index: number) {
  playlist.update((list) => list.filter((_, i) => i !== index));
}
// Reproducir una lista de canciones en orden ALEATORIO
export function playShuffle(tracks: Track[]) {
  if (tracks.length === 0) return;

  // Creamos una copia desordenada (Algoritmo Fisher-Yates)
  const shuffled = [...tracks];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Reproducimos la primera canción del grupo mezclado y cargamos la cola
  playTrack(shuffled[0], shuffled);
}