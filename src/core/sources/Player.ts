export type Player = {
  hasSong: boolean;
  isPlaying: boolean;
  song: {
    position: number;
    totalDuration: number;
    title: string;
    artist: string;
    album: string;
    coverUrl: string;
  };
};
