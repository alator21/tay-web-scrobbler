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
      try {
        const player = {
          hasSong: parser.hasSong(),
          isPlaying: parser.isPlaying(),
          song: {
            artist: parser.artist(),
            album: parser.album(),
            coverUrl: parser.coverUrl(),
            position: parser.songPosition(),
            totalDuration: parser.songTotalDuration(),
            title: parser.title(),
          },
        };
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
