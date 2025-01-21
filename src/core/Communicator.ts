export type MessageType =
  | { type: 'AUTHENTICATE' }
  | { type: 'LOGOUT' }
  | { type: 'SCROBBLE', artist: string, track: string, timestamp: Date }
  | { type: 'UPDATE_NOW_PLAYING', artist: string, track: string }
  | { type: 'GET_LAST_FM_AUTH_STATUS' };

export type ResponseType =
  | { type: 'AUTHENTICATE', success: true, data: { user: string } }
  | { type: 'AUTHENTICATE', success: false, error: string }
  | { type: 'LOGOUT', success: true }
  | { type: 'LOGOUT', success: false, error: string }
  | { type: 'SCROBBLE', success: true }
  | { type: 'SCROBBLE', success: false, error: string }
  | { type: 'UPDATE_NOW_PLAYING', success: true }
  | { type: 'UPDATE_NOW_PLAYING', success: false, error: string }
  | { type: 'GET_LAST_FM_AUTH_STATUS', success: true, data: { sessionKey: string, user: string } | undefined }
  | { type: 'GET_LAST_FM_AUTH_STATUS', success: false, error: string };



export interface Communicator {
  sendTypedMessage<T extends MessageType>(
    message: T
  ): Promise<Extract<ResponseType, { type: T['type'] }>>


  addTypedListener(
    callback: (
      message: MessageType,
      sendResponse: (response: ResponseType) => void
    ) => void
  ): void
}
