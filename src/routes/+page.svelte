<script lang="ts">
    import TrackCard from "$lib/components/TrackCard.svelte";
    import AlbumCard from "$lib/components/AlbumCard.svelte";
    import ArtistCard from "$lib/components/ArtistCard.svelte";
    import type { Track, Album, Artist } from "$lib/types";
    import { playTrack } from "$lib/stores/player";

    let { data } = $props();

    let tracks = $derived(data.tracks as Track[]);
    let albums = $derived(data.albums as Album[]);
    let artists = $derived(data.artists as Artist[]);

    let selectedAlbum = $state<Album | null>(null);
    let selectedArtist = $state<Artist | null>(null);

    // Estado para desplegar más canciones
    let showAllTracks = $state(false);

    // Canciones filtradas según la selección
    let filteredTracks = $derived.by(() => {
        if (selectedAlbum) {
            return tracks.filter(
                (t) =>
                    t.albumId === selectedAlbum.id ||
                    t.album?.id === selectedAlbum.id,
            );
        }
        if (selectedArtist) {
            return tracks.filter(
                (t) =>
                    t.artistId === selectedArtist.id ||
                    t.artist?.id === selectedArtist.id,
            );
        }
        return tracks;
    });

    // Si no está desplegado, mostramos como máximo 10 canciones (5 por columna)
    let displayedTracks = $derived.by(() => {
        if (showAllTracks) return filteredTracks;
        return filteredTracks.slice(0, 10);
    });

    // Dividimos la lista mostrada en dos columnas (mitad izquierda, mitad derecha)
    let leftColumnTracks = $derived.by(() => {
        const half = Math.ceil(displayedTracks.length / 2);
        return displayedTracks.slice(0, half);
    });

    let rightColumnTracks = $derived.by(() => {
        const half = Math.ceil(displayedTracks.length / 2);
        return displayedTracks.slice(half);
    });

    // Álbumes del artista
    let artistAlbums = $derived.by(() => {
        if (selectedArtist) {
            return albums.filter(
                (a) =>
                    a.artist?.id === selectedArtist.id ||
                    (a as any).artistId === selectedArtist.id,
            );
        }
        return [];
    });

    function clearSelection() {
        selectedAlbum = null;
        selectedArtist = null;
        showAllTracks = false;
    }

    function playAllFiltered() {
        if (filteredTracks.length > 0) {
            playTrack(filteredTracks[0]);
        }
    }

    function selectAlbumFromArtist(album: Album) {
        selectedArtist = null;
        selectedAlbum = album;
        showAllTracks = false;
    }
</script>

<div class="space-y-10">
    {#if selectedAlbum || selectedArtist}
        <!-- VISTA DETALLADA (ÁLBUM O ARTISTA) -->
        <div class="space-y-8">
            <!-- Botón Volver -->
            <button
                onclick={clearSelection}
                class="bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-2 rounded-full transition text-sm flex items-center gap-2 border border-white/10 cursor-pointer"
            >
                <span class="material-symbols-outlined text-sm">arrow_back</span
                > Volver al inicio
            </button>

            <!-- Banner Header -->
            <div
                class="flex flex-col sm:flex-row items-center sm:items-end gap-6 glass-panel p-6 rounded-3xl border border-white/10"
            >
                <div
                    class="w-48 h-48 sm:w-56 sm:h-56 overflow-hidden shadow-2xl flex-shrink-0 border border-white/10 {selectedArtist
                        ? 'rounded-full'
                        : 'rounded-2xl'}"
                >
                    <img
                        src={selectedAlbum
                            ? selectedAlbum.image || selectedAlbum.thumbnail
                            : selectedArtist?.image ||
                              selectedArtist?.thumbnail}
                        alt={selectedAlbum?.title || selectedArtist?.name}
                        class="w-full h-full object-cover"
                    />
                </div>

                <div class="flex-1 text-center sm:text-left space-y-3">
                    <span
                        class="text-xs uppercase tracking-widest font-bold text-[#d0bcff]"
                    >
                        {selectedAlbum ? "Álbum" : "Artista Verificado"}
                    </span>
                    <h1
                        class="text-3xl sm:text-5xl font-black text-white leading-tight"
                    >
                        {selectedAlbum
                            ? selectedAlbum.title
                            : selectedArtist?.name}
                    </h1>
                    <p class="text-neutral-400 text-sm">
                        {#if selectedAlbum}
                            {selectedAlbum.artist?.name ?? "Varios Artistas"} • {filteredTracks.length}
                            {filteredTracks.length === 1
                                ? "canción"
                                : "canciones"}
                        {:else}
                            {artistAlbums.length}
                            {artistAlbums.length === 1 ? "álbum" : "álbumes"} • {filteredTracks.length}
                            {filteredTracks.length === 1
                                ? "canción"
                                : "canciones"}
                        {/if}
                    </p>

                    <div class="pt-2">
                        <button
                            onclick={playAllFiltered}
                            disabled={filteredTracks.length === 0}
                            class="bg-[#a078ff] hover:bg-[#8b5cf6] text-[#111827] px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300 mx-auto sm:mx-0 shadow-[0_0_20px_rgba(160,120,255,0.3)] hover:shadow-[0_0_30px_rgba(160,120,255,0.5)] cursor-pointer disabled:opacity-40 disabled:hover:shadow-none"
                        >
                            <span
                                class="material-symbols-outlined text-2xl font-black"
                                >play_arrow</span
                            >
                            Reproducir
                        </button>
                    </div>
                </div>
            </div>

            <!-- 1. CANCIONES PRIMERO (EN 2 COLUMNAS: 1-5 e 6-10) -->
            <section>
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-white">
                        {selectedArtist
                            ? "Canciones Populares"
                            : "Canciones del Álbum"}
                    </h3>
                </div>

                {#if displayedTracks.length > 0}
                    <!-- Grilla de 2 columnas balanceadas -->
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1"
                    >
                        <!-- Columna Izquierda (Items 1 a 5) -->
                        <div class="space-y-1">
                            {#each leftColumnTracks as track, i}
                                <TrackCard {track} index={i + 1} />
                            {/each}
                        </div>

                        <!-- Columna Derecha (Items 6 a 10) -->
                        <div class="space-y-1">
                            {#each rightColumnTracks as track, i}
                                <TrackCard
                                    {track}
                                    index={leftColumnTracks.length + i + 1}
                                />
                            {/each}
                        </div>
                    </div>

                    <!-- Botón de Ver Más / Ver Menos -->
                    {#if filteredTracks.length > 10}
                        <div class="mt-4 text-center sm:text-left">
                            <button
                                onclick={() => (showAllTracks = !showAllTracks)}
                                class="text-xs font-bold text-[#d0bcff] hover:underline cursor-pointer inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition"
                            >
                                {showAllTracks
                                    ? "Mostrar menos"
                                    : `Ver todas las canciones (${filteredTracks.length})`}
                                <span class="material-symbols-outlined text-sm">
                                    {showAllTracks
                                        ? "expand_less"
                                        : "expand_more"}
                                </span>
                            </button>
                        </div>
                    {/if}
                {:else}
                    <p class="text-neutral-500 text-sm italic">
                        No hay canciones registradas para esta selección.
                    </p>
                {/if}
            </section>

            <!-- 2. DISCOGRAFÍA / ÁLBUMES DEBAJO DE LAS CANCIONES -->
            {#if selectedArtist && artistAlbums.length > 0}
                <section class="pt-4">
                    <h3 class="text-xl font-bold text-white mb-4">
                        Discografía / Álbumes
                    </h3>
                    <div
                        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                    >
                        {#each artistAlbums as album}
                            <AlbumCard
                                {album}
                                {tracks}
                                onSelect={selectAlbumFromArtist}
                            />
                        {/each}
                    </div>
                </section>
            {/if}
        </div>
    {:else}
        <!-- VISTA HOME PRINCIPAL -->

        <!-- Artistas Top -->
        <section>
            <h3 class="text-xl font-bold text-white mb-6">Artistas Top</h3>
            <div
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
            >
                {#each artists as artist}
                    <ArtistCard
                        {artist}
                        onSelect={(a) => (selectedArtist = a)}
                    />
                {/each}
            </div>
        </section>

        <!-- Álbumes -->
        <section>
            <h3 class="text-xl font-bold text-white mb-6">Álbumes para ti</h3>
            <div
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            >
                {#each albums as album}
                    <AlbumCard
                        {album}
                        {tracks}
                        onSelect={(a) => (selectedAlbum = a)}
                    />
                {/each}
            </div>
        </section>

        <!-- Canciones -->
        <section>
            <h3 class="text-xl font-bold text-white mb-6">
                Todas las Canciones
            </h3>
            <div class="space-y-1">
                {#each tracks as track, i}
                    <TrackCard {track} index={i + 1} />
                {/each}
            </div>
        </section>
    {/if}
</div>
