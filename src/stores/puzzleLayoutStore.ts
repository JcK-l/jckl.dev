import { atom } from "nanostores";

export const $puzzlePieceSize = atom(0);

export const setPuzzlePieceSize = (pieceSize: number) => {
  $puzzlePieceSize.set(pieceSize);
};
