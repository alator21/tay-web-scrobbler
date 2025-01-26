export interface Parser {
  hasSong(): boolean;

  isPlaying(): boolean;

  /*
   * Current second(progress) of the song  [ **01:20** / 03:05 ]
   * */
  songPosition(): number;

  /*
   * How long the song lasts in total(seconds) [ 01:20 / **03:05** ]
   * */
  songTotalDuration(): number;

  title(): string;

  artist(): string;

  album(): string;

  coverUrl(): string;
}
