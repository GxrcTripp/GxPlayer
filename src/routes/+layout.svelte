<script lang="ts">
  import "./layout.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import PlayerBar from "$lib/components/PlayerBar.svelte";
  import Lenis from "lenis";
  import { onMount } from "svelte";
  let { children } = $props();

  onMount(() => {
    const lenis = new Lenis({
      autoRaf: true,
    });
  });
</script>

<div
  class="h-screen w-screen bg-[#0D0F12] text-[#e2e2e6] flex flex-col overflow-hidden relative"
>
  <!-- Área de Sidebar + Contenido Principal de cada ruta -->
  <div class="flex flex-1 overflow-hidden pb-20">
    <Navbar />

    <main class="flex-1 overflow-y-auto p-6">
      {@render children()}
    </main>
  </div>

  <!-- Player Bar fijo abajo -->
  <PlayerBar />
</div>
