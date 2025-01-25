import { initializeLastFmApi } from "@alator21/lastfm";
import { doStuff } from "../../core/background";
import { ChromeCommunicator } from "./ChromeCommunicator";
import { ChromeLastFmAuthenticator } from "./ChromeLastFmAuthenticator";
import { ChromeStorage } from "./ChromeStorage";
import { SongListenedDetector } from "../../core/SongListenedDetector";
import { logger } from "../../core/Logger";
import { SongChangedDetector } from "../../core/SongChangedDetector";
import { CurrentSongPersistor } from "../../core/CurrentSongPersistor";

const CLIENT_ID = import.meta.env.VITE_LAST_FM_API_KEY;
const SHARED_SECRET = import.meta.env.VITE_LAST_FM_SHARED_SECRET;

const communicator = new ChromeCommunicator();
const authenicator = new ChromeLastFmAuthenticator(CLIENT_ID);
const storage = new ChromeStorage();
const songListenedDetector = new SongListenedDetector(0.7);
const songChangedDetector = new SongChangedDetector();
const currentSongPersistor = new CurrentSongPersistor(5000);

initializeLastFmApi(CLIENT_ID, SHARED_SECRET);
logger.info('chrome/background.ts');
doStuff(communicator, authenicator, storage, songListenedDetector, songChangedDetector, currentSongPersistor);

