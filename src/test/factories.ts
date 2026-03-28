import type { EndingMail } from "../stores/endingMailStore";
import type { EndingState, SentimentLabel } from "../stores/endingStore";

type EndingStateOverrides = Partial<
  Omit<EndingState, "discoveredSentiments" | "settledVideos">
> & {
  discoveredSentiments?: Partial<EndingState["discoveredSentiments"]>;
  settledVideos?: Partial<EndingState["settledVideos"]>;
};

const defaultDiscoveredSentiments = {
  negative: false,
  neutral: false,
  positive: false,
} as const;

const defaultSettledVideos = {
  negative: false,
  neutral: false,
  positive: false,
} as const;

export const createDefaultEndingState = (
  overrides: EndingStateOverrides = {}
): EndingState => {
  const { discoveredSentiments, settledVideos, ...rest } = overrides;

  return {
    discoveredSentiments: {
      ...defaultDiscoveredSentiments,
      ...discoveredSentiments,
    },
    isActive: false,
    pendingDiscovery: null,
    selectedSentiment: null,
    settledVideos: {
      ...defaultSettledVideos,
      ...settledVideos,
    },
    ...rest,
  };
};

export const createUnlockedEndingState = (
  overrides: EndingStateOverrides = {}
): EndingState => {
  return createDefaultEndingState({
    ...overrides,
    discoveredSentiments: {
      negative: true,
      neutral: true,
      positive: true,
      ...overrides.discoveredSentiments,
    },
  });
};

export const createDefaultEndingMailState = (
  overrides: Partial<Record<SentimentLabel, EndingMail | null>> = {}
) => ({
  negative: null,
  neutral: null,
  positive: null,
  ...overrides,
});
