import axios from "axios";

export const load = () => {
    const tracks = axios.get("https://leonardoapi.vercel.app/api/tracks")
}