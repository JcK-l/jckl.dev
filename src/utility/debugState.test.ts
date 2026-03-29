// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { $endingMailBySentiment } from "../stores/endingMailStore";
import { $endingState } from "../stores/endingStore";
import { $gameState, GameStateFlags, hasBit } from "../stores/gameStateStore";
import { $dispensedGroups } from "../stores/puzzleDispenseStore";
import { $currentDate, $pastDate } from "../stores/stringStore";
import {
  applyDebugSeed,
  getDebugPuzzleState,
  openDebugEnding,
  resetDebugState,
  setDebugPuzzleState,
} from "./debugState";

describe("debugState", () => {
  beforeEach(() => {
    resetDebugState();
    delete document.documentElement.dataset.theme;
  });

  it("applies the CRT-ready preset with matching flags, groups, and dates", () => {
    applyDebugSeed("crt-ready");

    expect(hasBit($gameState.get(), GameStateFlags.FLAG_STARS_ALIGN)).toBe(true);
    expect(hasBit($gameState.get(), GameStateFlags.FLAG_LEND_A_HAND)).toBe(true);
    expect(hasBit($gameState.get(), GameStateFlags.FLAG_CONNECTION)).toBe(true);
    expect(hasBit($gameState.get(), GameStateFlags.FLAG_CRT)).toBe(false);
    expect($dispensedGroups.get()).toEqual({
      stars: true,
      hand: true,
      connection: true,
      crt: false,
    });
    expect($currentDate.get()).toBe("Mar 29, 2026");
    expect($pastDate.get()).toBe("May 14, 2023");
  });

  it("opens a preview ending with mail, theme, and completed puzzle state", () => {
    openDebugEnding("positive");

    expect($endingState.get().selectedSentiment).toBe("positive");
    expect($endingState.get().isActive).toBe(true);
    expect($endingMailBySentiment.get().positive?.name).toBe("Ada Lovelace");
    expect(document.documentElement.dataset.theme).toBe("positive");
    expect(getDebugPuzzleState()).toEqual({
      lastPiece: 0,
      totalPlacedPieces: 16,
    });
  });

  it("updates the shared puzzle debug state live", () => {
    setDebugPuzzleState({
      lastPiece: 5,
      totalPlacedPieces: 12,
    });

    expect(getDebugPuzzleState()).toEqual({
      lastPiece: 5,
      totalPlacedPieces: 12,
    });
  });
});
