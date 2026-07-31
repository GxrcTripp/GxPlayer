<script lang="ts">
  import type { Track } from '$lib/types';
  import { playTrack, currentTrack, isPlaying } from '$lib/stores/player';

  let { track, index = 1 } = $props<{ track: Track; index?: number }>();
  let isCurrent = $derived($currentTrack?.id === track.id);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div 
  onclick={() => playTrack(track)}
  class="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer w-full border border-transparent hover:border-white/5"
>
  <span class="text-neutral-500 w-4 text-center text-sm font-mono">{index}</span>
  
  <div class="w-12 h-12 rounded-lg overflow-hidden shrink-0 relative">
    <img src={track.album?.image || track.artist?.image} alt={track.title} class="w-full h-full object-cover" />
    <div class="absolute inset-0 bg-black/40 items-center justify-center hidden group-hover:flex">
      <span class="text-white text-xs">{isCurrent && $isPlaying ? '⏸' : '▶'}</span>
    </div>
  </div>

  <div class="flex-1 overflow-hidden">
    <h4 class="text-white font-medium truncate text-sm {isCurrent ? 'text-[#d0bcff]' : ''}">
      {track.title}
    </h4>
    <p class="text-neutral-400 text-xs truncate">{track.artist?.name}</p>
  </div>
</div>