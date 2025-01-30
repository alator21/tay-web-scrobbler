import { Player } from "@/core/sources/Player.ts";

export class CurrentSongPersistor {
  private _player: Player | undefined = undefined;
  private readonly pauseThreshold: number;

  constructor(pauseThreshold: number) {
    this.pauseThreshold = pauseThreshold;
  }

  songTick(player: Player): void {
    this._player = player;
  }

  // is called every second. If X time has passed since last song tick, it unsets the current song
  timeTick(lastSongTickTime: number): void {
    const currentTime = Date.now();
    if (currentTime - lastSongTickTime > this.pauseThreshold) {
      this._player = undefined;
    }
  }

  get player(): Player | undefined {
    return this._player;
  }
}
