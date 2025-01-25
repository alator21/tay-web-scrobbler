import { describe, it, expect, beforeEach, setSystemTime } from 'bun:test';
import { CurrentSongPersistor } from "../CurrentSongPersistor";
import { Player } from '../sources/Player';

const SONG_A: Player = {
  hasSong: true,
  isPlaying: true,
  song: {
    title: 'Test Song A',
    artist: 'Artist A',
    album: 'Album A',
    position: 0,
    totalDuration: 100,
    coverUrl: 'http://example.com/cover.jpg'
  }
};
const SONG_B: Player = {
  hasSong: true,
  isPlaying: true,
  song: {
    title: 'Test Song B',
    artist: 'Artist B',
    album: 'Album B',
    position: 0,
    totalDuration: 200,
    coverUrl: 'http://example.com/cover.jpg'
  }
};
const THRESHOLD = 5000;
describe('CurrentSongPersistor', () => {
  let persistor: CurrentSongPersistor;

  beforeEach(() => {
    persistor = new CurrentSongPersistor(THRESHOLD);
    setSystemTime(0); // Reset to epoch between tests
  });

  it('should clear song after 5s pause', () => {
    // Initial playback
    persistor.songTick(SONG_A);
    expect(persistor.getCurrentPlayer()).toBeTruthy();

    // Simulate 6s pause
    setSystemTime(6000); // 6 seconds later

    expect(persistor.getCurrentPlayer()).toBeUndefined();
  });

  it('should retain song if pause <5s', () => {
    persistor.songTick(SONG_A);

    setSystemTime(4000);
    persistor.songTick(SONG_A);

    expect(persistor.getCurrentPlayer()).toBeTruthy();
  });

  it('should detect new song after paused session', () => {
    // Initial playback and pause
    persistor.songTick(SONG_A);
    setSystemTime(6000);
    expect(persistor.getCurrentPlayer()).toBeUndefined();

    // New song
    persistor.songTick(SONG_B);
    expect(persistor.getCurrentPlayer()).toEqual(SONG_B);
  });

  it('should handle track changes during playback', () => {
    persistor.songTick(SONG_A);
    setSystemTime(3000);

    persistor.songTick(SONG_B);

    expect(persistor.getCurrentPlayer()).toEqual(SONG_B);
  });
});
