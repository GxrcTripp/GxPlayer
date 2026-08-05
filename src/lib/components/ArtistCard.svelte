<script lang="ts">
  import type { Artist } from "$lib/types";
  let { artist } = $props<{ artist: Artist }>();
  import gsap from "gsap";
  import { onMount } from "svelte";

  const estado = $state<{
    elementoAnimado: null | HTMLElement;
  }>({
    elementoAnimado: null,
  });

  onMount(() => {
    gsap.from(estado.elementoAnimado, {
      rotation: 360,
      opacity: 0,
      delay: 1,
      translateX: -150,
      stagger: 2,
    });
  });
</script>

<a
  href="/artists/{artist.id}"
  class="text-center group cursor-pointer flex-col items-center w-full block"
  bind:this={estado.elementoAnimado}
>
  <div
    class="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-transparent transition-all duration-500 artist-halo relative mb-3"
  >
    <img
      src={artist.image || artist.thumbnail}
      alt={artist.name}
      class="w-full h-full object-cover"
    />
  </div>

  <p
    class="text-white font-medium truncate w-full text-sm group-hover:underline decoration-[#d0bcff] decoration-2"
  >
    {artist.name}
  </p>
  <p class="text-[10px] text-purple-300 uppercase tracking-widest mt-0.5">
    Artista
  </p>
</a>
