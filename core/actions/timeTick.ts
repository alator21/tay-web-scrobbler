import { ResponseType } from "@/core/domain/Communicator.ts";
import { Storage } from "@/core/domain/Storage.ts";
import { CurrentSongPersistor } from "@/core/domain/implementation/CurrentSongPersistor.ts";
import { Logger } from "loglevel";

export async function timeTick(
  logger: Logger,
  currentSongPersistor: CurrentSongPersistor,
  storage: Storage,
): Promise<Extract<ResponseType, { type: "TIME_TICK" }>> {
  const playerStatus = await storage.get("current_player");
  if (playerStatus === undefined) {
    return {
      type: "TIME_TICK",
      success: true,
    };
  }
  if (playerStatus.player === undefined) {
    return {
      type: "TIME_TICK",
      success: true,
    };
  }
  currentSongPersistor.timeTick(playerStatus.lastSongTickTime);
  if (currentSongPersistor.player === undefined) {
    logger.info(`Removing current song from 'playing now'`);
    await storage.remove("current_player");
  }
  return {
    type: "TIME_TICK",
    success: true,
  };
}
