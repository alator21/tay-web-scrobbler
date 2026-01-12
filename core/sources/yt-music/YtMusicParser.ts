import { ParseError } from "../ParseError.ts";
import { Parser } from "../Parser.ts";
import { queryElement } from "../utils.ts";

export class YtMusicParser implements Parser {
  hasSong(parent: HTMLElement): boolean {
    const element = queryElement(
      parent,
      HTMLElement,
      "yt-formatted-string.title.ytmusic-player-bar",
    );
    const content = element.textContent;
    if (content === null) {
      throw new ParseError();
    }
    return content.length > 0;
  }
  isPlaying(parent: HTMLElement): boolean {
    const title = this.title(parent);
    // When a song is playing, the tab title is prefixed with the song name.
    return title.length > 0 && document.title.startsWith(title);
  }
  songPosition(parent: HTMLElement): number {
    return this.parseTimeInfo(parent).current;
  }
  songTotalDuration(parent: HTMLElement): number {
    return this.parseTimeInfo(parent).total;
  }
  title(parent: HTMLElement): string {
    const element = queryElement(
      parent,
      HTMLElement,
      "yt-formatted-string.title.ytmusic-player-bar",
    );
    const title = element.textContent;
    if (title === null) {
      throw new ParseError();
    }
    return title;
  }
  artist(parent: HTMLElement): string {
    const element = queryElement(
      parent,
      HTMLAnchorElement,
      "span.subtitle.ytmusic-player-bar>yt-formatted-string>a",
    );
    const artist = element.textContent;
    if (artist === null) {
      throw new ParseError();
    }
    return artist;
  }
  album(parent: HTMLElement): string {
    const element = queryElement(
      parent,
      HTMLAnchorElement,
      "yt-formatted-string.byline.style-scope.ytmusic-player-bar > a:last-of-type",
    );
    const album = element.textContent;
    if (album === null) {
      throw new ParseError();
    }
    return album;
  }
  coverUrl(parent: HTMLElement): string {
    const element = queryElement(
      parent,
      HTMLImageElement,
      "div.thumbnail-image-wrapper.ytmusic-player-bar>img",
    );
    return element.src;
  }

  private parseTimeInfo(parent: HTMLElement) {
    const element = queryElement(parent, HTMLSpanElement, "span.time-info");
    const content = element.textContent; // '0:20 / 3:41'
    if (content === null) {
      throw new ParseError();
    }
    const timeInfo = content.split("/"); // ['0:20','3:41']
    const rawCurrent = timeInfo[0].trim().split(":"); // ['0','20']
    const rawTotal = timeInfo[1].trim().split(":"); // ['3','41']
    return {
      current: this.parseTime(rawCurrent),
      total: this.parseTime(rawTotal),
    };
  }

  /*
   * Calculates the number of seconds based on an array of string digits. e.g. ['15','22']
   * If the array contains 2 items, the 1st represents the minutes and the 2nd the seconds.
   * If the array contains 3 items, the 1st represents the hours, the 2nd represents the minutes and the 3rd the seconds.
   * */
  private parseTime(time: Array<string>) {
    if (time.length < 2 || time.length > 3) {
      throw new Error(`Could not parse "${time}"`);
    }
    const firstNumber = time[0];
    const secondNumber = time[1];
    if (time.length === 2) {
      return parseInt(firstNumber) * 60 + parseInt(secondNumber);
    }
    const thirdNumber = time[2];
    return (
      parseInt(firstNumber) * 3600 +
      parseInt(secondNumber) * 60 +
      parseInt(thirdNumber)
    );
  }
}
