import { ResponseType } from "@/core/domain/Communicator.ts";
import { Logger } from "loglevel";
import { CurrentSongPersistor } from "@/core/domain/implementation/CurrentSongPersistor.ts";
import { storage } from "@/core/dependencies/popup.ts";

export async function getPlayerCurrentState(
  logger: Logger,
  currentSongPersistor: CurrentSongPersistor,
): Promise<Extract<ResponseType, { type: "GET_CURRENT_PLAYER_STATE" }>> {
  console.log({ currentSongPersistor });
  logger.info({ currentSongPersistor });
  const playerStatus = await storage.get("current_player");
  return {
    type: "GET_CURRENT_PLAYER_STATE",
    success: true,
    player: playerStatus === undefined ? undefined : playerStatus.player,
  };
}
