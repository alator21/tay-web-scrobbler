import { describe, it, expect, beforeEach, setSystemTime } from "bun:test";
import { CurrentSongPersistor } from "../CurrentSongPersistor.ts";
import { Player } from "@/core/sources/Player.ts";

const SONG_A: Player = {
  hasSong: true,
  isPlaying: true,
  song: {
    title: "Test Song A",
    artist: "Artist A",
    album: "Album A",
    position: 0,
    totalDuration: 100,
    coverUrl: "http://example.com/cover.jpg",
  },
};
const SONG_B: Player = {
  hasSong: true,
  isPlaying: true,
  song: {
    title: "Test Song B",
    artist: "Artist B",
    album: "Album B",
    position: 0,
    totalDuration: 200,
    coverUrl: "http://example.com/cover.jpg",
  },
};
const THRESHOLD = 5000;
describe("CurrentSongPersistor", () => {
  let persistor: CurrentSongPersistor;

  beforeEach(() => {
    persistor = new CurrentSongPersistor(THRESHOLD);
    setSystemTime(0); // Reset to epoch between tests
  });

  it("should clear song after 5s pause", async () => {
    // Initial playback
    persistor.songTick(SONG_A);
    const songTickTime = Date.now();
    persistor.timeTick(songTickTime);
    expect(persistor.player).toBeTruthy();

    // Simulate 6s pause
    setSystemTime(6000); // 6 seconds later
    persistor.timeTick(songTickTime);

    expect(persistor.player).toBeUndefined();
  });

  it("should retain song if pause <5s", async () => {
    persistor.songTick(SONG_A);
    const songTickTime = Date.now();
    persistor.timeTick(songTickTime);

    setSystemTime(4000);
    persistor.songTick(SONG_A);
    const songTickTime2 = Date.now();
    persistor.timeTick(songTickTime2);

    expect(persistor.player).toBeTruthy();
  });

  it("should detect new song after paused session", async () => {
    // Initial playback and pause
    persistor.songTick(SONG_A);
    const songTickTime = Date.now();
    persistor.timeTick(songTickTime);
    setSystemTime(6000);
    persistor.timeTick(songTickTime);
    expect(persistor.player).toBeUndefined();

    // New song
    persistor.songTick(SONG_B);
    const songTickTime2 = Date.now();
    persistor.timeTick(songTickTime2);
    expect(persistor.player).toEqual(SONG_B);
  });

  it("should handle track changes during playback", async () => {
    persistor.songTick(SONG_A);
    const songTickTime = Date.now();
    persistor.timeTick(songTickTime);
    setSystemTime(3000);
    persistor.timeTick(songTickTime);

    persistor.songTick(SONG_B);
    const songTickTime2 = Date.now();
    persistor.timeTick(songTickTime2);
    expect(persistor.player).toEqual(SONG_B);
  });
});
