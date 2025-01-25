import { Player } from "./sources/Player";

export class SongListenedDetector {
  private durationListenedThreshold: number;
  private currentSongId: string | undefined = undefined;
  private lastPosition: number = 0;
  private thresholdReached: boolean = false;
  private ticksSinceStart: number = 0;

  constructor(durationListenedThreshold: number) {
    if (durationListenedThreshold < 0 || durationListenedThreshold > 1) {
      throw new Error("Threshold must be between 0 and 1");
    }
    this.durationListenedThreshold = durationListenedThreshold;
  }

  songTick(player: Player): boolean {
    const { position, totalDuration } = player.song;
    const songId = this.getSongIdentifier(player.song);

    this.validatePosition(position, totalDuration);

    // Reset state if: song changed OR position moved backward
    if (this.shouldResetState(songId, position)) {
      this.resetSongState(songId, position);
    }

    this.updatePlaybackState(position);

    return this.checkThreshold(totalDuration);
  }

  private getSongIdentifier(song: Player['song']): string {
    return `${song.title}-${song.artist}-${song.album}`;
  }

  private validatePosition(position: number, totalDuration: number): void {
    if (position < 0 || position > totalDuration) {
      throw new Error(`Invalid position: ${position} for duration ${totalDuration}`);
    }
  }

  private shouldResetState(newSongId: string, newPosition: number): boolean {
    return this.currentSongId !== newSongId || newPosition < this.lastPosition;
  }

  private resetSongState(newSongId: string | undefined, currentPosition: number): void {
    this.currentSongId = newSongId;
    this.lastPosition = currentPosition;
    this.thresholdReached = false;
    this.ticksSinceStart = 0;
  }

  private updatePlaybackState(newPosition: number): void {
    this.ticksSinceStart++;
    this.lastPosition = newPosition;
  }

  private checkThreshold(totalDuration: number): boolean {
    if (this.thresholdReached) return false;

    const requiredTicks = Math.ceil(totalDuration * this.durationListenedThreshold);
    this.thresholdReached = this.ticksSinceStart >= requiredTicks;

    return this.thresholdReached;
  }

  updateThreshold(durationListenedThreshold: number) {
    if (durationListenedThreshold < 0 || durationListenedThreshold > 1) {
      throw new Error("Threshold must be between 0 and 1");
    }
    this.durationListenedThreshold = durationListenedThreshold;
  }

}
