import { atom } from "nanostores";

type PuzzleResetRequest = {
  action: "reset" | "restore";
  pieceIds: number[];
  token: number;
};

export const $puzzleResetRequest = atom<PuzzleResetRequest | null>(null);

export const requestPuzzleReset = (pieceIds: number[]) => {
  const currentRequest = $puzzleResetRequest.get();

  $puzzleResetRequest.set({
    action: "reset",
    pieceIds,
    token: (currentRequest?.token ?? 0) + 1,
  });
};

export const requestPuzzleRestore = (pieceIds: number[]) => {
  const currentRequest = $puzzleResetRequest.get();

  $puzzleResetRequest.set({
    action: "restore",
    pieceIds,
    token: (currentRequest?.token ?? 0) + 1,
  });
};
