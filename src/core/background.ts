import { LastFmAuthenticator } from "./LastFmAuthenticator";
import { Communicator } from "./Communicator";
import { getSession, scrobble, updateNowPlaying } from "@alator21/lastfm";
import { Storage } from "./Storage";
import { SongListenedDetector } from "./SongListenedDetector";
import { logger } from "./Logger";
import { SongChangedDetector } from "./SongChangedDetector";
import { CurrentSongPersistor } from "./CurrentSongPersistor";

export function doStuff(
  communicator: Communicator,
  lastFmAuthenticator: LastFmAuthenticator,
  storage: Storage,
  songListenedDetector: SongListenedDetector,
  songChangedDetector: SongChangedDetector,
  currentSongPersistor: CurrentSongPersistor
) {
  try {
    logger.info('Adding typed listener');
    communicator.addTypedListener(async (message, sendResponse) => {
      switch (message.type) {
        case 'AUTHENTICATE': {
          try {
            const status = await storage.get('last_fm_session');
            if (status !== undefined) {
              sendResponse({ type: 'AUTHENTICATE', success: false, error: `You can't login when you are already logged in.` });
              break;
            }
            const session = await getLastFmSession(lastFmAuthenticator);
            storage.set('last_fm_session', { session_key: session.key, user: session.name });
            sendResponse({ type: 'AUTHENTICATE', success: true, data: { user: session.name } });
          } catch (error) {
            sendResponse({ type: 'AUTHENTICATE', success: false, error: `error while authenticating` });
          }
          break;
        }
        case "LOGOUT": {
          try {
            const status = await storage.get('last_fm_session');
            if (status === undefined) {
              sendResponse({ type: 'LOGOUT', success: false, error: `You can't logout when you are not logged in.` });
              break;
            }
            await storage.removeAll();
            sendResponse({ type: 'LOGOUT', success: true });
          } catch (error) {
            sendResponse({ type: 'LOGOUT', success: false, error: `error while logging out` });
          }
          break;
        }
        case "PLAYER_CURRENT_STATE": {
          try {
            const { player } = message;
            logger.debug(`Current state of player`);
            logger.debug(player);
            const { artist, title, album, position } = player.song;
            currentSongPersistor.songTick(player);
            const songChanged = songChangedDetector.songTick(player);
            const shouldScrobbleSong = songListenedDetector.songTick(player);
            if (songChanged) {
              logger.info(`Song changed. Now playing: ${title} by ${artist}`);
              await updateCurrentSong(storage, title, artist, album);
            }
            if (shouldScrobbleSong) {
              logger.info(`Scrobbling song: ${title} by ${artist}`);
              await scrobbleSong(storage, title, artist, album, getSongStartingTime(position));
            }
            sendResponse({ type: 'PLAYER_CURRENT_STATE' });
          } catch (error) {
            logger.info(error);
            sendResponse({ type: 'PLAYER_CURRENT_STATE' });
          }
          break;
        }
        case "GET_CURRENT_PLAYER_STATE": {
          sendResponse({ type: 'GET_CURRENT_PLAYER_STATE', success: true, player: currentSongPersistor.getCurrentPlayer() });
          break;
        }
        case "KEEP_ALIVE": {
          sendResponse({ type: 'KEEP_ALIVE' });
          break;
        }
        case 'GET_LAST_FM_AUTH_STATUS': {
          try {
            const status = await storage.get('last_fm_session');
            logger.debug({ status });
            sendResponse({ type: 'GET_LAST_FM_AUTH_STATUS', success: true, data: status !== undefined ? { sessionKey: status.session_key, user: status.user } : undefined });
          } catch (error) {
            sendResponse({ type: 'GET_LAST_FM_AUTH_STATUS', success: false, error: `error while getting status` });
          }
          break;
        }
      }
    });
  }
  catch (error) {
    logger.info(error);
  }
}

function getSongStartingTime(startedSecondsBefore: number): Date {
  const currentTime = new Date();
  return new Date(currentTime.getTime() - startedSecondsBefore * 1000);
}

async function getLastFmSession(authenticator: LastFmAuthenticator) {
  const authToken = await authenticator.authenticate();
  const { session } = await getSession({ authToken });
  return session;
}

async function scrobbleSong(storage: Storage, track: string, artist: string, album: string, timestamp: Date) {
  const sessionKey = await getSessionKeyOrThrow(storage);
  await scrobble({ sessionKey, artist, album, timestamp, track });
}

async function updateCurrentSong(storage: Storage, track: string, artist: string, album: string) {
  const sessionKey = await getSessionKeyOrThrow(storage);
  await updateNowPlaying({ sessionKey, artist, track, album });
}


async function getSessionKeyOrThrow(storage: Storage) {
  const session = await storage.get('last_fm_session');
  if (session === undefined) {
    throw new Error('Unauthorized');
  }
  return session.session_key;
}

