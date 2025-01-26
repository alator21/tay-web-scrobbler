import { logger } from "@/core/domain/implementation/Logger.ts";
import { YtMusicParser } from "@/core/infrastructure/sources/yt-music/YtMusicParser.ts";
import { BrowserCommunicator } from "@/core/domain/implementation/BrowserCommunicator.ts";
import { Communicator } from "@/core/domain/Communicator.ts";

export default defineContentScript({
  matches: ["*://music.youtube.com/*"],
  main() {
    logger.info("content.ts");
    const parser = new YtMusicParser();
    const communicator = new BrowserCommunicator();

    function sendCurrentPlayer(communicator: Communicator) {
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
        communicator.sendTypedMessage({ type: "PLAYER_CURRENT_STATE", player });
      } catch (error) {
        logger.info("got an error in content");
        logger.info({ error });
      }
    }

    setInterval(() => {
      logger.debug("keep alive");
      communicator.sendTypedMessage({ type: "KEEP_ALIVE" });
    }, 20000);

    setInterval(() => {
      logger.debug("interval");
      sendCurrentPlayer(communicator);
    }, 1000);
  },
});
