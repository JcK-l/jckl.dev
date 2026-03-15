import { GameStateFlags } from "../stores/gameStateStore";

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
    hint: "Next lead: align the constellation.",
    flag: GameStateFlags.FLAG_STARS_ALIGN,
    pieces: [1, 12, 13, 5],
  },
  {
    key: "hand",
    label: "a helping hand",
    lightLabel: "Hand",
    hint: "Next lead: something in the CRT mission still needs a hand.",
    flag: GameStateFlags.FLAG_LEND_A_HAND,
    pieces: [15, 11, 3, 8],
  },
  {
    key: "connection",
    label: "the connection",
    lightLabel: "Line",
    hint: "Next lead: the phone line is hiding a code.",
    flag: GameStateFlags.FLAG_CONNECTION,
    pieces: [16, 10, 2, 4],
  },
  {
    key: "crt",
    label: "the CRT cache",
    lightLabel: "CRT",
    hint: "Next lead: wake the CRT to release the final cache.",
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

export const isFlagActive = (binaryState: number, flag: GameStateFlags) =>
  (binaryState & (1 << flag)) !== 0;

export const getNextPuzzleHint = (
  binaryState: number,
  totalPlacedPieces: number
) => {
  const nextUnsolvedGroup = puzzleGroups.find((group) => {
    return !isFlagActive(binaryState, group.flag);
  });

  if (nextUnsolvedGroup == null) {
    return "All signal caches unlocked. Finish the picture.";
  }

  if (nextUnsolvedGroup.key === "crt" && totalPlacedPieces < 12) {
    return "Next lead: keep assembling the picture. The CRT wakes once the board is nearly complete.";
  }

  return nextUnsolvedGroup.hint;
};
