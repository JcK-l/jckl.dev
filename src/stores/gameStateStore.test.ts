import { beforeEach, describe, expect, it } from "vitest";
import {
  $gameState,
  GameStateFlags,
  clearBit,
  hasBit,
  isBitSet,
  setBit,
  toggleBit,
} from "./gameStateStore";

describe("gameStateStore", () => {
  beforeEach(() => {
    $gameState.set(0);
  });

  it("treats enum values as bit positions", () => {
    setBit(GameStateFlags.FLAG_CRT);

    expect($gameState.get()).toBe(1 << GameStateFlags.FLAG_CRT);
    expect(hasBit($gameState.get(), GameStateFlags.FLAG_CRT)).toBe(true);
    expect(hasBit($gameState.get(), GameStateFlags.FLAG_CONNECTION)).toBe(
      false
    );
  });

  it("reports bits from the shared store via isBitSet", () => {
    setBit(GameStateFlags.FLAG_SECRET);

    expect(isBitSet(GameStateFlags.FLAG_SECRET)).toBe(true);
    expect(isBitSet(GameStateFlags.FLAG_STARS_ALIGN)).toBe(false);
  });

  it("clears bits that were previously set", () => {
    setBit(GameStateFlags.FLAG_CONNECTION);
    clearBit(GameStateFlags.FLAG_CONNECTION);

    expect($gameState.get()).toBe(0);
  });

  it("toggles bits on and off", () => {
    toggleBit(GameStateFlags.FLAG_LEND_A_HAND);
    expect(isBitSet(GameStateFlags.FLAG_LEND_A_HAND)).toBe(true);

    toggleBit(GameStateFlags.FLAG_LEND_A_HAND);
    expect(isBitSet(GameStateFlags.FLAG_LEND_A_HAND)).toBe(false);
  });
});
