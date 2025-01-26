import { Communicator, MessageType, ResponseType } from "../Communicator.ts";
import { logger } from "./Logger.ts";

export class BrowserCommunicator implements Communicator {
  sendTypedMessage<T extends MessageType>(
    message: T,
  ): Promise<Extract<ResponseType, { type: T["type"] }>> {
    logger.debug(message);
    return new Promise((resolve) => {
      browser.runtime.sendMessage(message, (response: ResponseType) => {
        resolve(response as Extract<ResponseType, { type: T["type"] }>);
      });
    });
  }
  addTypedListener(
    callback: (
      message: MessageType,
      sendResponse: (response: ResponseType) => void,
    ) => Promise<void>,
  ): void {
    browser.runtime.onMessage.addListener((message, _, sendResponse) => {
      callback(
        message as MessageType,
        sendResponse as (response: ResponseType) => void,
      );
      return true;
    });
  }
}
