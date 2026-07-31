<script lang="ts">
  import { currentTrack, isPlaying, togglePlay } from '$lib/stores/player';

  let audioRef: HTMLAudioElement;
  let currentTime = $state(0);
  let duration = $state(0);
  let volume = $state(0.8);

  // Porcentaje de progreso de la canción (0% a 100%)
  let progressPercent = $derived(
    duration ? (currentTime / duration) * 100 : 0
  );

  // Porcentaje de volumen (0% a 100%)
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
</script>

<footer class="fixed bottom-0 left-0 right-0 h-20 bg-[#0D0F12]/95 border-t border-white/10 px-6 flex items-center justify-between z-50 backdrop-blur-xl">
  <audio
    bind:this={audioRef}
    bind:currentTime
    bind:duration
    bind:volume
    onended={() => isPlaying.set(false)}
  ></audio>

  <!-- Track Info -->
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
    <div class="flex items-center gap-6">
      <button 
        onclick={togglePlay}
        disabled={!$currentTrack}
        class="w-10 h-10 bg-[#a078ff] text-[#111827] rounded-full flex items-center justify-center hover:scale-105 transition cursor-pointer disabled:opacity-40 shadow-[0_0_15px_rgba(160,120,255,0.4)]"
      >
        <span class="material-symbols-outlined text-2xl font-black">
          {$isPlaying ? 'pause' : 'play_arrow'}
        </span>
      </button>
    </div>

    <!-- Timeline Slider con rellenado dinámico -->
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

  <!-- Control de Volumen con rellenado dinámico -->
  <div class="flex items-center justify-end gap-3 w-1/4 min-w-37.5">
    <span class="material-symbols-outlined text-neutral-400 text-lg">
      {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
    </span>
    
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      bind:value={volume}
      style="background: linear-gradient(to right, #a078ff {volumePercent}%, rgba(255, 255, 255, 0.1) {volumePercent}%);"
      class="w-24 h-1.5 rounded-full appearance-none cursor-pointer accent-[#a078ff] transition-all"
    />
  </div>
</footer>