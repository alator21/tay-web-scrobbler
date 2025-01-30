import { describe, it, expect, beforeEach } from "bun:test";
import { SongListenedDetector } from "../SongListenedDetector.ts";
import { Player } from "@/core/sources/Player.ts";

type Song = {
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
};
const THRESHOLD = 0.7;
const SONG_A = {
  title: "Test Song A",
  artist: "Artist A",
  album: "Album A",
  coverUrl: "http://example.com/cover.jpg",
};
const SONG_B = {
  title: "Test Song B",
  artist: "Artist B",
  album: "Album B",
  coverUrl: "http://example.com/cover.jpg",
};

const TOTAL_DURATION = 100;
const REQUIRED_TICKS = Math.ceil(TOTAL_DURATION * THRESHOLD); // 70

describe("SongListenedDetector", () => {
  let detector: SongListenedDetector;

  beforeEach(() => {
    detector = new SongListenedDetector(true, THRESHOLD);
  });

  const createSongState = (
    position: number,
    totalDuration: number,
    song: Song,
  ): Player => ({
    hasSong: true,
    isPlaying: true,
    song: {
      ...song,
      position,
      totalDuration,
    },
  });

  // Basic functionality
  it("should trigger exactly once when threshold is reached", () => {
    for (let i = 1; i <= REQUIRED_TICKS; i++) {
      const state = createSongState(i, TOTAL_DURATION, SONG_A);
      expect(detector.songTick(state)).toBe(i === REQUIRED_TICKS);
    }

    // Verify subsequent ticks don't trigger
    const postState = createSongState(
      REQUIRED_TICKS + 1,
      TOTAL_DURATION,
      SONG_A,
    );
    expect(detector.songTick(postState)).toBe(false);
  });

  // Song changes
  it("should reset counter when switching songs", () => {
    // Listen to 50 ticks of Song A
    for (let i = 1; i <= 50; i++) {
      const state = createSongState(i, TOTAL_DURATION, SONG_A);
      expect(detector.songTick(state)).toBe(false);
    }

    // Switch to Song B
    const songBState = createSongState(1, TOTAL_DURATION, SONG_B);
    expect(detector.songTick(songBState)).toBe(false);
    expect(detector["ticksSinceStart"]).toBe(1);
  });

  // Backward seeks
  it("should reset counter on backward position movement", () => {
    // Listen to position 50
    for (let i = 1; i <= 50; i++) {
      const state = createSongState(i, TOTAL_DURATION, SONG_A);
      detector.songTick(state);
    }

    // Seek back to 40
    const seekBackState = createSongState(40, TOTAL_DURATION, SONG_A);
    expect(detector.songTick(seekBackState)).toBe(false);
    expect(detector["ticksSinceStart"]).toBe(1);
  });

  // Forward skips
  it("should accumulate time across forward skips", () => {
    // Listen to first 30 seconds
    for (let i = 1; i <= 30; i++) {
      const state = createSongState(i, TOTAL_DURATION, SONG_A);
      detector.songTick(state);
    }

    // Skip to 60 seconds
    const skipState = createSongState(60, TOTAL_DURATION, SONG_A);
    detector.songTick(skipState);

    // Listen until threshold (70 total seconds needed)
    for (let i = 61; i <= 60 + (REQUIRED_TICKS - 31); i++) {
      const state = createSongState(i, TOTAL_DURATION, SONG_A);
      expect(detector.songTick(state)).toBe(i === 60 + (REQUIRED_TICKS - 31));
    }
  });

  // Short songs
  it("should handle 1-second song correctly", () => {
    const totalDuration = 1;

    const firstTick = createSongState(1, totalDuration, SONG_A);
    expect(detector.songTick(firstTick)).toBe(true);
  });

  // Error cases
  it("should throw on invalid constructor arguments", () => {
    expect(() => new SongListenedDetector(true, -0.1)).toThrow();
    expect(() => new SongListenedDetector(true, 1.1)).toThrow();
  });

  it("should throw on invalid position values", () => {
    const invalidState = createSongState(101, 100, SONG_A);
    expect(() => detector.songTick(invalidState)).toThrow();
  });

  // Looping/replaying
  it("should reset counter when song restarts", () => {
    // Complete playback
    for (let i = 1; i <= TOTAL_DURATION; i++) {
      const state = createSongState(i, TOTAL_DURATION, SONG_A);
      expect(detector.songTick(state)).toBe(i === REQUIRED_TICKS);
    }

    // Restart song
    const restartState = createSongState(0, TOTAL_DURATION, SONG_A);
    expect(detector.songTick(restartState)).toBe(false);
    expect(detector["ticksSinceStart"]).toBe(1);
  });

  // Multiple songs
  it("should track different songs independently", () => {
    const durationA = 100,
      durationB = 200;

    // Halfway through Song A
    for (let i = 1; i <= 50; i++) {
      const state = createSongState(i, durationA, SONG_A);
      expect(detector.songTick(state)).toBe(false);
    }

    // Switch to Song B and reach threshold
    const requiredBTicks = Math.ceil(durationB * THRESHOLD);
    for (let i = 1; i <= requiredBTicks; i++) {
      const state = createSongState(i, durationB, SONG_B);
      expect(detector.songTick(state)).toBe(i === requiredBTicks);
    }
  });

  // Fragmented listening
  it("should accumulate non-consecutive playback", () => {
    // First session: 0-40s
    for (let i = 1; i <= 40; i++) {
      const state = createSongState(i, TOTAL_DURATION, SONG_A);
      expect(detector.songTick(state)).toBe(false);
    }

    // Later session: 60-90s (30 seconds)
    for (let i = 61; i < 90; i++) {
      const state = createSongState(i, TOTAL_DURATION, SONG_A);
      expect(detector.songTick(state)).toBe(false);
    }

    // Should trigger on 90th tick (40 + 30 = 70)
    const triggerState = createSongState(91, TOTAL_DURATION, SONG_A);
    expect(detector.songTick(triggerState)).toBe(true);
  });

  describe("Looped Song Handling", () => {
    it("should require full threshold again after natural loop", () => {
      // First complete playthrough
      for (let i = 1; i <= TOTAL_DURATION; i++) {
        const state = createSongState(i, TOTAL_DURATION, SONG_A);
        expect(detector.songTick(state)).toBe(i === REQUIRED_TICKS);
      }

      // Song loops back to start
      const loopedState = createSongState(0, TOTAL_DURATION, SONG_A);
      expect(detector.songTick(loopedState)).toBe(false);
      expect(detector["ticksSinceStart"]).toBe(1);

      // Verify threshold needs to be reached again
      for (let i = 1; i < REQUIRED_TICKS; i++) {
        const state = createSongState(i, TOTAL_DURATION, SONG_A);
        expect(detector.songTick(state)).toBe(i === REQUIRED_TICKS - 1);
      }
    });

    it("should reset counter on manual restart before song end", () => {
      // Listen to first 50 seconds
      for (let i = 1; i <= 50; i++) {
        const state = createSongState(i, TOTAL_DURATION, SONG_A);
        expect(detector.songTick(state)).toBe(false);
      }

      // User manually restarts song
      const restartState = createSongState(0, TOTAL_DURATION, SONG_A);
      expect(detector.songTick(restartState)).toBe(false);
      expect(detector["ticksSinceStart"]).toBe(1);

      // Should require full 70 ticks from restart
      for (let i = 1; i < REQUIRED_TICKS; i++) {
        const state = createSongState(i, TOTAL_DURATION, SONG_A);
        expect(detector.songTick(state)).toBe(i === REQUIRED_TICKS - 1);
      }
    });

    it("should handle multiple consecutive loops", () => {
      expect(
        detector.songTick(createSongState(0, TOTAL_DURATION, SONG_A)),
      ).toBe(false);
      for (let i = 1; i < REQUIRED_TICKS; i++) {
        const result = detector.songTick(
          createSongState(i, TOTAL_DURATION, SONG_A),
        );
        expect(result).toBe(i === REQUIRED_TICKS - 1);
      }

      expect(
        detector.songTick(createSongState(0, TOTAL_DURATION, SONG_A)),
      ).toBe(false);
      for (let i = 1; i < REQUIRED_TICKS; i++) {
        const result = detector.songTick(
          createSongState(i, TOTAL_DURATION, SONG_A),
        );
        expect(result).toBe(i === REQUIRED_TICKS - 1);
      }

      expect(
        detector.songTick(createSongState(0, TOTAL_DURATION, SONG_A)),
      ).toBe(false);
      for (let i = 1; i < REQUIRED_TICKS; i++) {
        const result = detector.songTick(
          createSongState(i, TOTAL_DURATION, SONG_A),
        );
        expect(result).toBe(i === REQUIRED_TICKS - 1);
      }
    });

    it("should reset progress if looping after partial playback", () => {
      // Partial playback (50 ticks)
      for (let i = 1; i <= 50; i++) {
        expect(
          detector.songTick(createSongState(i, TOTAL_DURATION, SONG_A)),
        ).toBe(false);
      }

      // Loop before reaching threshold
      const loopState = createSongState(0, TOTAL_DURATION, SONG_A);
      expect(detector.songTick(loopState)).toBe(false);

      // Verify full threshold required
      for (let i = 1; i < REQUIRED_TICKS; i++) {
        const state = createSongState(i, TOTAL_DURATION, SONG_A);
        expect(detector.songTick(state)).toBe(i === REQUIRED_TICKS - 1);
      }
    });
  });
});
