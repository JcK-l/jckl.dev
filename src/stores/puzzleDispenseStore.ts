import { atom } from "nanostores";
import {
  createDispensedGroups,
  type DispensedGroups,
  type PuzzleGroupKey,
} from "../data/puzzleGroups";

export const $dispensedGroups = atom<DispensedGroups>(createDispensedGroups());

export const markPuzzleGroupDispensed = (groupKey: PuzzleGroupKey) => {
  const currentGroups = $dispensedGroups.get();

  if (currentGroups[groupKey]) {
    return;
  }

  $dispensedGroups.set({
    ...currentGroups,
    [groupKey]: true,
  });
};
