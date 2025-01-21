export type Player = {
  hasSong: boolean;
  isPlaying: boolean;
  song: {
    position: number | undefined;
    totalDuration: number | undefined;
    title: string;
    artist: string;
    album: string;
    coverUrl: string;
  }
};
