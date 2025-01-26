import { LogLevel } from "./implementation/Logger.ts";
import { type Player } from "@/core/infrastructure/sources/Player.ts";

export type MessageType =
  | { type: "AUTHENTICATE" }
  | { type: "LOGOUT" }
  | { type: "PLAYER_CURRENT_STATE"; player: Player }
  | { type: "GET_CURRENT_PLAYER_STATE" }
  | { type: "GET_OPTIONS_PAGE_URL" }
  | { type: "GET_OPTIONS" }
  | {
      type: "SAVE_OPTIONS";
      options: {
        scrobblingEnabled: boolean;
        scrobbleThreshold: number;
        logLevel: LogLevel;
      };
    }
  | { type: "RESET_OPTIONS_TO_DEFAULT" }
  | { type: "KEEP_ALIVE" }
  | { type: "GET_LAST_FM_AUTH_STATUS" };

export type ResponseType =
  | { type: "AUTHENTICATE"; success: true; data: { user: string } }
  | { type: "AUTHENTICATE"; success: false; error: string }
  | { type: "LOGOUT"; success: true }
  | { type: "LOGOUT"; success: false; error: string }
  | { type: "PLAYER_CURRENT_STATE" }
  | { type: "GET_OPTIONS_PAGE_URL"; success: true; url: string }
  | {
      type: "GET_OPTIONS";
      success: true;
      options: {
        scrobblingEnabled: boolean;
        scrobbleThreshold: number;
        logLevel: LogLevel;
      };
    }
  | { type: "GET_OPTIONS"; success: false; error: string }
  | { type: "SAVE_OPTIONS"; success: true }
  | { type: "SAVE_OPTIONS"; success: false; error: string }
  | { type: "RESET_OPTIONS_TO_DEFAULT"; success: true }
  | {
      type: "GET_CURRENT_PLAYER_STATE";
      success: true;
      player: Player | undefined;
    }
  | { type: "GET_CURRENT_PLAYER_STATE"; success: false; error: string }
  | { type: "KEEP_ALIVE" }
  | {
      type: "GET_LAST_FM_AUTH_STATUS";
      success: true;
      data: { sessionKey: string; user: string } | undefined;
    }
  | { type: "GET_LAST_FM_AUTH_STATUS"; success: false; error: string };

export interface Communicator {
  sendTypedMessage<T extends MessageType>(
    message: T,
  ): Promise<Extract<ResponseType, { type: T["type"] }>>;

  addTypedListener(
    callback: (
      message: MessageType,
      sendResponse: (response: ResponseType) => void,
    ) => Promise<void>,
  ): void;
}
