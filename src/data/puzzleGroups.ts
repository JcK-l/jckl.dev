import { GameStateFlags, hasBit } from "../stores/gameStateStore";

export type PuzzleGroupKey = "stars" | "hand" | "connection" | "crt";

export type PuzzleGroup = {
  key: PuzzleGroupKey;
  label: string;
  lightLabel: string;
  hint: string;
  flag: GameStateFlags;
  pieces: number[];
};

export type DispensedGroups = Record<PuzzleGroupKey, boolean>;

export const puzzleGroups: PuzzleGroup[] = [
  {
    key: "stars",
    label: "stars align",
    lightLabel: "Stars",
    hint: "Look up. The pattern was always there.",
    flag: GameStateFlags.FLAG_STARS_ALIGN,
    pieces: [1, 12, 13, 5],
  },
  {
    key: "hand",
    label: "a helping hand",
    lightLabel: "Handoff",
    hint: "Something is out of place. Someone is still waiting for it.",
    flag: GameStateFlags.FLAG_LEND_A_HAND,
    pieces: [15, 11, 3, 8],
  },
  {
    key: "connection",
    label: "the connection",
    lightLabel: "Connection",
    hint: "The answer isn't now. Tune to a different year.",
    flag: GameStateFlags.FLAG_CONNECTION,
    pieces: [16, 10, 2, 4],
  },
  {
    key: "crt",
    label: "the CRT cache",
    lightLabel: "Transmit",
    hint: "The screen flickers to life. Someone in the past is waiting to receive.",
    flag: GameStateFlags.FLAG_SECRET,
    pieces: [9, 7, 6, 14],
  },
];

export const createDispensedGroups = (): DispensedGroups => ({
  stars: false,
  hand: false,
  connection: false,
  crt: false,
});

export const getNextPuzzleHint = (
  binaryState: number,
  totalPlacedPieces: number
) => {
  const nextUnsolvedGroup = puzzleGroups.find((group) => {
    return !hasBit(binaryState, group.flag);
  });

  if (nextUnsolvedGroup == null) {
    return "All signal caches unlocked. Finish the picture.";
  }

  if (nextUnsolvedGroup.key === "crt" && totalPlacedPieces < 12) {
    return "The signal is ready. All that remains is to send it.";
  }

  return nextUnsolvedGroup.hint;
};
