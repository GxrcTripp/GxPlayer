import axios from "axios";

export const load = async () => {
    const tracks = await axios.get("https://leonardoapi.vercel.app/api/tracks")
}