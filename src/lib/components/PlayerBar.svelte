<script lang="ts">
  import { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    previousTrack, 
    playlist, 
    removeFromQueue 
  } from '$lib/stores/player';

  let audioRef: HTMLAudioElement;
  let currentTime = $state(0);
  let duration = $state(0);
  let volume = $state(0.8);
  let showQueue = $state(false);

  let progressPercent = $derived(
    duration ? (currentTime / duration) * 100 : 0
  );

  let volumePercent = $derived(volume * 100);

  $effect(() => {
    if (audioRef) {
      if ($isPlaying) {
        audioRef.play().catch(() => {});
      } else {
        audioRef.pause();
      }
    }
  });

  $effect(() => {
    if ($currentTrack && audioRef) {
      audioRef.src = $currentTrack.audio;
      audioRef.play().then(() => isPlaying.set(true)).catch(() => {});
    }
  });

  function formatTime(seconds: number) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function handleSeek(e: Event) {
    const target = e.target as HTMLInputElement;
    currentTime = Number(target.value);
  }

  function toggleQueue() {
    showQueue = !showQueue;
  }
</script>

<footer class="fixed bottom-0 left-0 right-0 h-20 bg-[#0D0F12]/95 border-t border-white/10 px-6 flex items-center justify-between z-50 backdrop-blur-xl">
  <audio
    bind:this={audioRef}
    bind:currentTime
    bind:duration
    bind:volume
    onended={nextTrack}
  ></audio>

  <!-- Info Canción -->
  <div class="flex items-center gap-4 w-1/4 min-w-50">
    {#if $currentTrack}
      <img
        src={$currentTrack.album?.image || $currentTrack.artist?.image}
        alt={$currentTrack.title}
        class="w-12 h-12 rounded-lg object-cover shadow-md shrink-0"
      />
      <div class="overflow-hidden">
        <h5 class="text-sm font-bold truncate text-white">{$currentTrack.title}</h5>
        <p class="text-xs text-neutral-400 truncate">{$currentTrack.artist?.name}</p>
      </div>
    {:else}
      <div class="w-12 h-12 bg-neutral-800 rounded-lg animate-pulse"></div>
      <div>
        <h5 class="text-xs font-semibold text-neutral-400">Sin reproducción</h5>
        <p class="text-[10px] text-neutral-600">Selecciona una pista</p>
      </div>
    {/if}
  </div>

  <!-- Controles Centrales -->
  <div class="flex flex-col items-center gap-1 flex-1 max-w-xl">
    <div class="flex items-center gap-4">
      <button 
        onclick={previousTrack}
        disabled={!$currentTrack}
        class="text-neutral-400 hover:text-white transition cursor-pointer disabled:opacity-30"
        title="Canción anterior"
      >
        <span class="material-symbols-outlined text-2xl">skip_previous</span>
      </button>

      <button 
        onclick={togglePlay}
        disabled={!$currentTrack}
        class="w-10 h-10 bg-[#a078ff] text-[#111827] rounded-full flex items-center justify-center hover:scale-105 transition cursor-pointer disabled:opacity-40 shadow-[0_0_15px_rgba(160,120,255,0.4)]"
      >
        <span class="material-symbols-outlined text-2xl font-black">
          {$isPlaying ? 'pause' : 'play_arrow'}
        </span>
      </button>

      <button 
        onclick={nextTrack}
        disabled={!$currentTrack}
        class="text-neutral-400 hover:text-white transition cursor-pointer disabled:opacity-30"
        title="Siguiente canción"
      >
        <span class="material-symbols-outlined text-2xl">skip_next</span>
      </button>
    </div>

    <div class="w-full flex items-center gap-3">
      <span class="text-[10px] text-neutral-400 font-mono w-8 text-right">{formatTime(currentTime)}</span>
      
      <input
        type="range"
        min="0"
        max={duration || 100}
        value={currentTime}
        oninput={handleSeek}
        disabled={!$currentTrack}
        style="background: linear-gradient(to right, #a078ff {progressPercent}%, rgba(255, 255, 255, 0.1) {progressPercent}%);"
        class="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#a078ff] transition-all"
      />

      <span class="text-[10px] text-neutral-400 font-mono w-8">{formatTime(duration)}</span>
    </div>
  </div>

  <!-- Controles Derechos -->
  <div class="flex items-center justify-end gap-4 w-1/4 min-w-50">
    <div class="flex items-center gap-2">
      <span class="material-symbols-outlined text-neutral-400 text-lg">
        {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
      </span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        bind:value={volume}
        style="background: linear-gradient(to right, #03b5d3 {volumePercent}%, rgba(255, 255, 255, 0.1) {volumePercent}%);"
        class="w-20 h-1.5 rounded-full appearance-none cursor-pointer accent-[#03b5d3] transition-all"
      />
    </div>

    <button 
      onclick={toggleQueue}
      class="p-2 text-neutral-400 hover:text-white transition cursor-pointer rounded-lg hover:bg-white/5 {showQueue ? 'text-[#a078ff]' : ''}"
      title="Cola de reproducción"
    >
      <span class="material-symbols-outlined text-xl">queue_music</span>
    </button>
  </div>
</footer>

<!-- DRAWER / PANEL LATERAL DERECHO -->
{#if showQueue}
  <div class="fixed top-0 right-0 bottom-20 w-80 bg-[#111827]/95 border-l border-white/10 z-40 backdrop-blur-2xl p-6 flex flex-col shadow-2xl transition-all">
    <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
      <h3 class="text-sm font-bold text-white flex items-center gap-2">
        <span class="material-symbols-outlined text-base text-[#a078ff]">queue_music</span>
        Cola de reproducción
      </h3>
      <button onclick={toggleQueue} class="text-neutral-400 hover:text-white transition cursor-pointer">
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto space-y-2 pr-1">
      {#if $playlist.length > 0}
        {#each $playlist as item, i}
          <div class="group flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-white/5 transition {$currentTrack?.id === item.id ? 'bg-white/10 border border-[#a078ff]/30' : ''}">
            <button 
              onclick={() => $currentTrack = item}
              class="flex items-center gap-3 text-left overflow-hidden flex-1 cursor-pointer"
            >
              <span class="text-xs text-neutral-500 font-mono w-4 shrink-0">{i + 1}</span>
              <img src={item.album?.image || item.artist?.image} alt={item.title} class="w-9 h-9 rounded-lg object-cover shrink-0" />
              <div class="overflow-hidden">
                <p class="text-xs font-bold truncate {$currentTrack?.id === item.id ? 'text-[#d0bcff]' : 'text-white'}">{item.title}</p>
                <p class="text-[10px] text-neutral-400 truncate">{item.artist?.name}</p>
              </div>
            </button>

            <button 
              onclick={() => removeFromQueue(i)}
              class="p-1 text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition cursor-pointer"
              title="Quitar de la cola"
            >
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        {/each}
      {:else}
        <div class="text-center py-20 text-neutral-500 space-y-2">
          <span class="material-symbols-outlined text-3xl">music_off</span>
          <p class="text-xs">No hay canciones en la cola</p>
        </div>
      {/if}
    </div>
  </div>
{/if}