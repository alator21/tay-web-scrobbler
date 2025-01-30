import { ResponseType } from "@/core/domain/Communicator.ts";
import { Player } from "@/core/sources/Player.ts";
import { scrobble, updateNowPlaying } from "@alator21/lastfm";
import { Logger } from "loglevel";
import { CurrentSongPersistor } from "@/core/domain/implementation/CurrentSongPersistor.ts";
import { SongChangedDetector } from "@/core/domain/implementation/SongChangedDetector.ts";
import { SongListenedDetector } from "@/core/domain/implementation/SongListenedDetector.ts";
import { Storage } from "@/core/domain/Storage.ts";

export async function playerCurrentState(
  logger: Logger,
  storage: Storage,
  currentSongPersistor: CurrentSongPersistor,
  songChangedDetector: SongChangedDetector,
  songListenedDetector: SongListenedDetector,
  player: Player,
): Promise<Extract<ResponseType, { type: "PLAYER_CURRENT_STATE" }>> {
  try {
    logger.debug(`Current state of player`);
    logger.debug(player);
    const { artist, title, album, position } = player.song;
    logger.info(currentSongPersistor);
    currentSongPersistor.songTick(player);
    await storage.set("current_player", {
      player: currentSongPersistor.player,
      lastSongTickTime: Date.now(),
    });
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
    return { type: "PLAYER_CURRENT_STATE" };
  } catch (error) {
    logger.info(error);
    return { type: "PLAYER_CURRENT_STATE" };
  }
}

function getSongStartingTime(startedSecondsBefore: number): Date {
  const currentTime = new Date();
  return new Date(currentTime.getTime() - startedSecondsBefore * 1000);
}

async function getSessionKeyOrThrow(storage: Storage) {
  const session = await storage.get("last_fm_session");
  if (session === undefined) {
    throw new Error("Unauthorized");
  }
  return session.session_key;
}
