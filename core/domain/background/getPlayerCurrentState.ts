import { ResponseType } from "@/core/domain/Communicator.ts";
import { CurrentSongPersistor } from "@/core/domain/CurrentSongPersistor.ts";

export async function getPlayerCurrentState(
  currentSongPersistor: CurrentSongPersistor,
  sendResponse: (response: ResponseType) => void,
) {
  sendResponse({
    type: "GET_CURRENT_PLAYER_STATE",
    success: true,
    player: currentSongPersistor.getCurrentPlayer(),
  });
}
