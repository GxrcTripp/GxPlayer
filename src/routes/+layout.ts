import axios from "axios";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
  const [tracksRes, albumsRes, artistsRes] = await Promise.all([
    axios.get("https://leonardoapi.vercel.app/api/tracks"),
    axios.get("https://leonardoapi.vercel.app/api/albums"),
    axios.get("https://leonardoapi.vercel.app/api/artists")
  ]);

  return {
    tracks: tracksRes.data.tracks,
    albums: albumsRes.data.albums,
    artists: artistsRes.data.artists
  };
};