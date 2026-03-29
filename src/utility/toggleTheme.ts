import {
  setSelectedEnding,
  type SentimentLabel,
} from "../stores/endingStore";

export enum Themes {
  ORIGINAL = "original",
  NEGATIVE = "negative",
  NEUTRAL = "neutral",
  POSITIVE = "positive",
}

type ThemeDefinition = {
  dataValue: string;
  label: string;
};

export const themeDefinitions: Record<Themes, ThemeDefinition> = {
  [Themes.ORIGINAL]: {
    dataValue: "original",
    label: "Original",
  },
  [Themes.NEGATIVE]: {
    dataValue: "negative",
    label: "Negative",
  },
  [Themes.NEUTRAL]: {
    dataValue: "neutral",
    label: "Neutral",
  },
  [Themes.POSITIVE]: {
    dataValue: "positive",
    label: "Positive",
  },
};

const debugThemeOrder = [
  Themes.ORIGINAL,
  Themes.NEUTRAL,
  Themes.POSITIVE,
  Themes.NEGATIVE,
] as const;

const themeEntries = Object.entries(themeDefinitions).map(
  ([theme, definition]) => [theme as Themes, definition] as const
);

const themeByDataValue = new Map(
  themeEntries.map(
    ([theme, definition]) => [definition.dataValue, theme] as const
  )
);

const getThemeForSentiment = (sentiment: SentimentLabel | null): Themes => {
  switch (sentiment) {
    case "negative":
      return Themes.NEGATIVE;
    case "neutral":
      return Themes.NEUTRAL;
    case "positive":
      return Themes.POSITIVE;
    default:
      return Themes.ORIGINAL;
  }
};

const getAppliedTheme = (): Themes => {
  if (typeof document === "undefined") {
    return Themes.ORIGINAL;
  }

  return (
    themeByDataValue.get(document.documentElement.dataset.theme ?? "") ??
    Themes.ORIGINAL
  );
};

const applyTheme = (theme: Themes) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const themeDefinition = themeDefinitions[theme];

  if (theme === Themes.ORIGINAL) {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = themeDefinition.dataValue;
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("themechange"));
  }
};

export const applyThemeForSentiment = (sentiment: SentimentLabel | null) => {
  applyTheme(getThemeForSentiment(sentiment));
};

export const getCurrentThemeLabel = () => {
  return themeDefinitions[getAppliedTheme()].label;
};

export const cycleDebugTheme = () => {
  const currentTheme = getAppliedTheme();
  const currentIndex = debugThemeOrder.indexOf(currentTheme);
  const nextTheme =
    debugThemeOrder[(currentIndex + 1) % debugThemeOrder.length] ??
    Themes.ORIGINAL;

  applyTheme(nextTheme);

  return themeDefinitions[nextTheme].label;
};

export const toggleThemes = (selectedSentiment: SentimentLabel) => {
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let currentInterval = 3000;
  const minInterval = 150;
  const decayFactor = 0.98;
  const selectedTheme = getThemeForSentiment(selectedSentiment);

  let currentTheme: Themes = selectedTheme;

  function startDecayingInterval() {
    if (intervalId) {
      clearInterval(intervalId);
    }

    const adjustInterval = () => {
      applyTheme(currentTheme);
      currentTheme =
        currentTheme === Themes.ORIGINAL ? selectedTheme : Themes.ORIGINAL;

      if (currentInterval > minInterval) {
        const jump = (currentInterval - minInterval) * decayFactor;
        currentInterval -= jump;

        if (intervalId) {
          clearInterval(intervalId);
        }

        intervalId = setInterval(
          adjustInterval,
          Math.max(currentInterval, minInterval)
        );
        return;
      }

      if (intervalId !== null) {
        clearInterval(intervalId);
      }

      applyTheme(selectedTheme);
      setSelectedEnding(selectedSentiment, true);
    };

    intervalId = setInterval(adjustInterval, currentInterval);
  }

  startDecayingInterval();
};
