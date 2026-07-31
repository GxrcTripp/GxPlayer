export interface Artist {
  id: string;
  name: string;
  image: string;
  thumbnail: string;
}

export interface Album {
  id: string;
  title: string;
  image: string;
  thumbnail: string;
  artist?: Artist;
}

export interface Track {
  id: string;
  title: string;
  audio: string;
  artist: Artist;
  album: Album;
}