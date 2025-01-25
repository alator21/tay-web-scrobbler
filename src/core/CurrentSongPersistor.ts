import { Player } from "./sources/Player";

export class CurrentSongPersistor {
  private player: Player | undefined = undefined;
  private lastSongTickTime: number | undefined = undefined;
  private readonly pauseThreshold: number;

  constructor(pauseThreshold: number) {
    this.pauseThreshold = pauseThreshold;
  }


  songTick(player: Player): void {
    this.player = player;
    this.lastSongTickTime = Date.now();
  }

  getCurrentPlayer(): Player | undefined {
    const currentTime = Date.now();
    if (this.lastSongTickTime === undefined) {
      return undefined;
    }
    if (currentTime - this.lastSongTickTime > this.pauseThreshold) {
      this.player = undefined;
    }
    return this.player;
  }
}
