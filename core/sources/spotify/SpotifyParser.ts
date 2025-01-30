import { Parser } from "../Parser.ts";

export class SpotifyParser implements Parser {
  hasSong(): boolean {
    throw new Error("Method not implemented.");
  }

  isPlaying(): boolean {
    throw new Error("Method not implemented.");
  }

  songPosition(): number {
    throw new Error("Method not implemented.");
  }

  songTotalDuration(): number {
    throw new Error("Method not implemented.");
  }

  title(): string {
    throw new Error("Method not implemented.");
  }

  artist(): string {
    throw new Error("Method not implemented.");
  }

  album(): string {
    throw new Error("Method not implemented.");
  }

  coverUrl(): string {
    throw new Error("Method not implemented.");
  }
}
