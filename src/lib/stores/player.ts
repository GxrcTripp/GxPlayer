import { writable } from 'svelte/store';
import type { Track } from '$lib/types';

export const currentTrack = writable<Track | null>(null);
export const isPlaying = writable<boolean>(false);

export function playTrack(track: Track) {
  currentTrack.set(track);
  isPlaying.set(true);
}

export function togglePlay() {
  isPlaying.update((playing) => !playing);
}