import { YtMusicParser } from "@/core/sources/yt-music/YtMusicParser.ts";
import { playerCurrentState } from "@/core/actions/playerCurrentState.ts";
import {
  logger,
  storage,
  currentSongPersistor,
  songChangedDetector,
  songListenedDetector,
} from "@/core/dependencies/content.ts";
import { Parser } from "@/core/sources/Parser.ts";
import { timeTick } from "@/core/actions/timeTick.ts";

export default defineContentScript({
  matches: ["*://music.youtube.com/*"],
  main() {
    logger.info("content.ts");
    const SONG_TICK_INTERVAL_MS = 1000;

    const parser: Parser = new YtMusicParser();

    async function sendCurrentPlayer() {
      const domSnapshot = document.querySelector("body")!;
      try {
        const player = {
          hasSong: parser.hasSong(domSnapshot),
          isPlaying: parser.isPlaying(domSnapshot),
          song: {
            artist: parser.artist(domSnapshot),
            album: parser.album(domSnapshot),
            coverUrl: parser.coverUrl(domSnapshot),
            position: parser.songPosition(domSnapshot),
            totalDuration: parser.songTotalDuration(domSnapshot),
            title: parser.title(domSnapshot),
          },
        };
        if (player.song.totalDuration < player.song.position) {
          logger.warn(
            "Player contained current position greater than the total duration",
          );
          return;
        }
        logger.debug({ player });
        if (!player.isPlaying) {
          return;
        }
        await playerCurrentState(
          logger,
          storage,
          currentSongPersistor,
          songChangedDetector,
          songListenedDetector,
          player,
        );
      } catch (error) {
        logger.info("got an error in content");
        logger.info({ error });
      }
    }

    setInterval(async () => {
      logger.debug("interval");
      await sendCurrentPlayer();
    }, SONG_TICK_INTERVAL_MS);

    setInterval(async () => {
      await timeTick(logger, currentSongPersistor, storage);
    }, SONG_TICK_INTERVAL_MS);
  },
});
