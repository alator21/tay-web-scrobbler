export interface Parser {
  hasSong(parent: HTMLElement): boolean;

  isPlaying(parent: HTMLElement): boolean;

  /*
   * Current second(progress) of the song  [ **01:20** / 03:05 ]
   * */
  songPosition(parent: HTMLElement): number;

  /*
   * How long the song lasts in total(seconds) [ 01:20 / **03:05** ]
   * */
  songTotalDuration(parent: HTMLElement): number;

  title(parent: HTMLElement): string;

  artist(parent: HTMLElement): string;

  album(parent: HTMLElement): string;

  coverUrl(parent: HTMLElement): string;
}
