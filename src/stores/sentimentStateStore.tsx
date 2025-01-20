import { atom } from 'nanostores';

export const $sentimentState = atom<number>(0);

export enum SentimentStateFlags {
  FLAG_ACTIVE = 0,
  FLAG_NEUTRAL = 1,
  FLAG_POSITIVE = 2,
  FLAG_NEGATIVE = 3,
  // Add more flags as needed
}

export const setBit = (bitPosition: number) => {
  $sentimentState.set($sentimentState.get() | (1 << bitPosition));
};

export const clearBit = (bitPosition: number) => {
  $sentimentState.set($sentimentState.get() & ~(1 << bitPosition));
};

export const toggleBit = (bitPosition: number) => {
  $sentimentState.set($sentimentState.get() ^ (1 << bitPosition));
};

export const isBitSet = (bitPosition: number): boolean => {
  return ($sentimentState.get() & (1 << bitPosition)) !== 0;
};

export const getSentimentState = (): SentimentStateFlags | null => {
  if (isBitSet(SentimentStateFlags.FLAG_POSITIVE)) {
    return SentimentStateFlags.FLAG_POSITIVE;
  } else if (isBitSet(SentimentStateFlags.FLAG_NEGATIVE)) {
    return SentimentStateFlags.FLAG_NEGATIVE;
  } else if (isBitSet(SentimentStateFlags.FLAG_NEUTRAL)) {
    return SentimentStateFlags.FLAG_NEUTRAL;
  } else {
    return null;
  }
};