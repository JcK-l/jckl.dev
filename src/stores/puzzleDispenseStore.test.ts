import { beforeEach, describe, expect, it } from "vitest";
import { createDispensedGroups } from "../data/puzzleGroups";
import {
  $dispensedGroups,
  clearPuzzleGroupDispensed,
  markPuzzleGroupDispensed,
} from "./puzzleDispenseStore";

describe("puzzleDispenseStore", () => {
  beforeEach(() => {
    $dispensedGroups.set(createDispensedGroups());
  });

  it("marks a puzzle group as dispensed once", () => {
    markPuzzleGroupDispensed("stars");

    expect($dispensedGroups.get().stars).toBe(true);

    const afterFirstMark = $dispensedGroups.get();

    markPuzzleGroupDispensed("stars");

    expect($dispensedGroups.get()).toBe(afterFirstMark);
  });

  it("clears a dispensed puzzle group and ignores already-cleared groups", () => {
    markPuzzleGroupDispensed("connection");

    clearPuzzleGroupDispensed("connection");

    expect($dispensedGroups.get().connection).toBe(false);

    const afterFirstClear = $dispensedGroups.get();

    clearPuzzleGroupDispensed("connection");

    expect($dispensedGroups.get()).toBe(afterFirstClear);
  });
});
