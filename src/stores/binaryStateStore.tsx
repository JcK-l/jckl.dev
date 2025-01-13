import { atom } from 'nanostores';

export const $binaryState = atom<number>(0);

export enum BitPosition {
  FLAG_STARS_ALIGN = 0,
  FLAG_LEND_A_HAND = 1,
  FLAG_2024 = 2,
  FLAG_D = 3,
  // Add more flags as needed
}

export const setBit = (bitPosition: number) => {
  $binaryState.set($binaryState.get() | (1 << bitPosition));
};

export const clearBit = (bitPosition: number) => {
  $binaryState.set($binaryState.get() & ~(1 << bitPosition));
};

export const toggleBit = (bitPosition: number) => {
  $binaryState.set($binaryState.get() ^ (1 << bitPosition));
};

export const isBitSet = (bitPosition: number): boolean => {
  return ($binaryState.get() & (1 << bitPosition)) !== 0;
};