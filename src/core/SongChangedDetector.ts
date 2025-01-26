import { Player } from "./sources/Player";

export class SongChangedDetector {
  private currentSongId: string | undefined = undefined;

  songTick(player: Player) {
    const songId = this.getSongIdentifier(player.song);
    const currentSongId = this.currentSongId;
    this.currentSongId = songId;
    if (songId !== currentSongId) {
      return true;
    }
    return false;
  }

  private getSongIdentifier(song: Player["song"]): string {
    return `${song.title}-${song.artist}-${song.album}`;
  }
}
