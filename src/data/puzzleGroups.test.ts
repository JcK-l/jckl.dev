import { describe, expect, it } from "vitest";
import { GameStateFlags } from "../stores/gameStateStore";
import { getNextPuzzleHint } from "./puzzleGroups";

const createState = (flags: GameStateFlags[]) => {
  return flags.reduce((value, flag) => value | (1 << flag), 0);
};

describe("getNextPuzzleHint", () => {
  it("starts with the stars hint", () => {
    expect(getNextPuzzleHint(0, 0)).toBe("Look up. The pattern was always there.");
  });

  it("shows the special CRT readiness hint before twelve pieces are placed", () => {
    const solvedPrelude = createState([
      GameStateFlags.FLAG_STARS_ALIGN,
      GameStateFlags.FLAG_LEND_A_HAND,
      GameStateFlags.FLAG_CONNECTION,
    ]);

    expect(getNextPuzzleHint(solvedPrelude, 11)).toBe(
      "The screen flickers to life. All that's left is to send the signal."
    );
  });

  it("shows the completion hint once every group is solved", () => {
    const allSolved = createState([
      GameStateFlags.FLAG_STARS_ALIGN,
      GameStateFlags.FLAG_LEND_A_HAND,
      GameStateFlags.FLAG_CONNECTION,
      GameStateFlags.FLAG_SECRET,
    ]);

    expect(getNextPuzzleHint(allSolved, 16)).toBe(
      "All signal caches unlocked. Finish the picture."
    );
  });
});
