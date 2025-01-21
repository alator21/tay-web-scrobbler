import { initializeLastFmApi } from "@alator21/lastfm";
import { doStuff } from "../../core/background";
import { ChromeCommunicator } from "./ChromeCommunicator";
import { ChromeLastFmAuthenticator } from "./ChromeLastFmAuthenticator";
import { ChromeStorage } from "./ChromeStorage";

const CLIENT_ID = import.meta.env.VITE_LAST_FM_API_KEY;
const SHARED_SECRET = import.meta.env.VITE_LAST_FM_SHARED_SECRET;

const communicator = new ChromeCommunicator();
const authenicator = new ChromeLastFmAuthenticator(CLIENT_ID);
const storage = new ChromeStorage();

initializeLastFmApi(CLIENT_ID, SHARED_SECRET);
console.log('chrome/background.ts');
doStuff(communicator, authenicator, storage);

