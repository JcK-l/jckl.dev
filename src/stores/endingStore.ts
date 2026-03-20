import { atom } from "nanostores";

export const sentimentLabels = ["negative", "neutral", "positive"] as const;

export type SentimentLabel = (typeof sentimentLabels)[number];

export type DiscoveredSentiments = Record<SentimentLabel, boolean>;

export type EndingState = {
  discoveredSentiments: DiscoveredSentiments;
  isActive: boolean;
  pendingDiscovery: SentimentLabel | null;
  selectedSentiment: SentimentLabel | null;
};

const createDiscoveredSentiments = (): DiscoveredSentiments => ({
  negative: false,
  neutral: false,
  positive: false,
});

const defaultEndingState: EndingState = {
  discoveredSentiments: createDiscoveredSentiments(),
  isActive: false,
  pendingDiscovery: null,
  selectedSentiment: null,
};

export const $endingState = atom<EndingState>(defaultEndingState);

const setEndingState = (nextEndingState: Partial<EndingState>) => {
  $endingState.set({
    ...$endingState.get(),
    ...nextEndingState,
  });
};

export const getEndingState = () => {
  return $endingState.get();
};

export const getSelectedEnding = () => {
  return getEndingState().selectedSentiment;
};

export const hasSelectedEnding = (endingState = getEndingState()) => {
  return endingState.selectedSentiment !== null;
};

export const isEndingSelected = (
  sentiment: SentimentLabel,
  endingState = getEndingState()
) => {
  return endingState.selectedSentiment === sentiment;
};

export const isEndingActive = (
  sentiment?: SentimentLabel,
  endingState = getEndingState()
) => {
  if (!endingState.isActive) {
    return false;
  }

  return sentiment == null ? true : endingState.selectedSentiment === sentiment;
};

export const hasUnlockedAllEndings = (endingState = getEndingState()) => {
  return sentimentLabels.every((sentiment) => {
    return endingState.discoveredSentiments[sentiment];
  });
};

export const hasVisibleEndingBalloons = (endingState = getEndingState()) => {
  return (
    endingState.pendingDiscovery !== null ||
    sentimentLabels.some((sentiment) => {
      return endingState.discoveredSentiments[sentiment];
    })
  );
};

export const setSelectedEnding = (
  sentiment: SentimentLabel | null,
  isActive = false
) => {
  setEndingState({
    isActive: sentiment === null ? false : isActive,
    selectedSentiment: sentiment,
  });
};

export const clearEndingSelection = () => {
  setSelectedEnding(null);
};

export const setEndingActive = (isActive: boolean) => {
  setEndingState({
    isActive:
      isActive && getEndingState().selectedSentiment !== null
        ? isActive
        : false,
  });
};

export const markDiscoveredEnding = (sentiment: SentimentLabel) => {
  const endingState = getEndingState();

  const nextDiscoveredSentiments = {
    ...endingState.discoveredSentiments,
    [sentiment]: true,
  };

  setEndingState({
    discoveredSentiments: nextDiscoveredSentiments,
  });

  return nextDiscoveredSentiments;
};

export const queuePendingEndingDiscovery = (sentiment: SentimentLabel) => {
  setEndingState({
    pendingDiscovery: sentiment,
  });
};

export const clearPendingEndingDiscovery = () => {
  setEndingState({
    pendingDiscovery: null,
  });
};

export const commitPendingEndingDiscovery = () => {
  const { pendingDiscovery } = getEndingState();

  if (pendingDiscovery === null) {
    return null;
  }

  markDiscoveredEnding(pendingDiscovery);
  clearPendingEndingDiscovery();

  return pendingDiscovery;
};
