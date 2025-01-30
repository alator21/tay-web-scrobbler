import { ResponseType } from "@/core/domain/Communicator.ts";
import { Logger } from "loglevel";
import { storage } from "@/core/dependencies/popup.ts";

export async function getPlayerCurrentState(
  logger: Logger,
): Promise<Extract<ResponseType, { type: "GET_CURRENT_PLAYER_STATE" }>> {
  const playerStatus = await storage.get("current_player");
  logger.debug(`Getting current player current state`);
  logger.debug(playerStatus);
  return {
    type: "GET_CURRENT_PLAYER_STATE",
    success: true,
    player: playerStatus === undefined ? undefined : playerStatus.player,
  };
}
