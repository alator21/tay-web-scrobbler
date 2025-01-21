import { Communicator, MessageType, ResponseType } from "../../core/Communicator";

export class ChromeCommunicator implements Communicator {
  sendTypedMessage<T extends MessageType>(message: T): Promise<Extract<ResponseType, { type: T["type"]; }>> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response: ResponseType) => {
        resolve(response as Extract<ResponseType, { type: T['type'] }>);
      });
    });
  }
  addTypedListener(callback: (message: MessageType, sendResponse: (response: ResponseType) => void) => void): void {
    chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
      callback(message as MessageType, sendResponse as (response: ResponseType) => void);
      return true;
    });
  }
}
