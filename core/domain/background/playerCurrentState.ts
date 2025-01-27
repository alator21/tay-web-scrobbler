import { logger } from "@/core/domain/implementation/Logger.ts";
import { Storage } from "@/core/domain/Storage.ts";
import { ResponseType } from "@/core/domain/Communicator.ts";
import { Player } from "@/core/infrastructure/sources/Player.ts";
import { CurrentSongPersistor } from "@/core/domain/CurrentSongPersistor.ts";
import { SongChangedDetector } from "@/core/domain/implementation/SongChangedDetector.ts";
import { SongListenedDetector } from "@/core/domain/implementation/SongListenedDetector.ts";
import { getSessionKeyOrThrow } from "@/core/domain/background/common.ts";
import { scrobble, updateNowPlaying } from "@alator21/lastfm";

export async function playerCurrentState(
  storage: Storage,
  currentSongPersistor: CurrentSongPersistor,
  songChangedDetector: SongChangedDetector,
  songListenedDetector: SongListenedDetector,
  player: Player,
  sendResponse: (response: ResponseType) => void,
) {
  try {
    logger.debug(`Current state of player`);
    logger.debug(player);
    const { artist, title, album, position } = player.song;
    currentSongPersistor.songTick(player);
    const songChanged = songChangedDetector.songTick(player);
    const shouldScrobbleSong = songListenedDetector.songTick(player);
    if (songChanged) {
      logger.info(`Song changed. Now playing: ${title} by ${artist}`);
      const sessionKey = await getSessionKeyOrThrow(storage);
      await updateNowPlaying({ sessionKey, artist, track: title, album });
    }
    if (shouldScrobbleSong) {
      logger.info(`Scrobbling song: ${title} by ${artist}`);

      const sessionKey = await getSessionKeyOrThrow(storage);
      await scrobble({
        sessionKey,
        artist,
        album,
        timestamp: getSongStartingTime(position),
        track: title,
      });
    }
    sendResponse({ type: "PLAYER_CURRENT_STATE" });
  } catch (error) {
    logger.info(error);
    sendResponse({ type: "PLAYER_CURRENT_STATE" });
  }
}

function getSongStartingTime(startedSecondsBefore: number): Date {
  const currentTime = new Date();
  return new Date(currentTime.getTime() - startedSecondsBefore * 1000);
}
