import { puzzleGroups } from "../data/puzzleGroups";
import {
  $gameState,
  GameStateFlags,
  clearBit as clearGameStateBit,
  setBit as setGameStateBit,
} from "../stores/gameStateStore";
import {
  clearPuzzleGroupDispensed,
  markPuzzleGroupDispensed,
} from "../stores/puzzleDispenseStore";
import {
  requestPuzzleReset,
  requestPuzzleRestore,
} from "../stores/puzzleResetStore";

export const crtPieceIds =
  puzzleGroups.find((group) => group.key === "crt")?.pieces ?? [];

export const hasFinalCacheUnlocked = (gameState = $gameState.get()) => {
  return (gameState & (1 << GameStateFlags.FLAG_SECRET)) !== 0;
};

export const prepareFinalCacheEnding = () => {
  setGameStateBit(GameStateFlags.FLAG_SECRET);
};

export const completeFinalCacheDelivery = () => {
  prepareFinalCacheEnding();
  markPuzzleGroupDispensed("crt");
};

export const restoreFinalCacheEnding = () => {
  completeFinalCacheDelivery();
  requestPuzzleRestore(crtPieceIds);
};

export const resetFinalCacheToOriginal = () => {
  clearGameStateBit(GameStateFlags.FLAG_SECRET);
  clearPuzzleGroupDispensed("crt");
  requestPuzzleReset(crtPieceIds);
};
