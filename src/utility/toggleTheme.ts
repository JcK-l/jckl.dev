import {
  setSelectedEnding,
  type SentimentLabel,
} from "../stores/endingStore";

enum Themes {
  ORIGINAL = "original",
  NEGATIVE = "negative",
  NEUTRAL = "neutral",
  POSITIVE = "positive",
}

type ThemeDefinition = {
  dataValue: string;
  label: string;
  properties: Record<string, string>;
};

const themeDefinitions: Record<Themes, ThemeDefinition> = {
  [Themes.ORIGINAL]: {
    dataValue: "original",
    label: "Original",
    properties: {
      "--color-text-color": "#1D3557",
      "--color-bg-color": "#1D3557",
      "--color-fg-color": "#F1FAEE",
      "--color-fg-color-shade": "#C8CFC5",
      "--color-title-color": "#457B9D",
      "--color-baloon1": "#E63946",
      "--color-baloon1-shade": "#BB2F3A",
      "--color-baloon2": "#457B9D",
      "--color-baloon2-shade": "#335B74",
      "--color-baloon3": "#018E42",
      "--color-baloon3-shade": "#01642F",
      "--color-primary": "#1D3557",
      "--color-secondary": "#457B9D",
      "--color-secondary-shade": "#427596",
      "--color-tertiary": "#A8DADC",
      "--color-extra1": "#9B8C77",
      "--color-extra2": "#F09D51",
      "--color-white": "#F1FAEE",
      "--color-white-shade": "#C8CFC5",
      "--color-yellow": "#F09D51",
      "--color-yellow-shade": "#C58243",
      "--color-green": "#018E42",
      "--color-green-shade": "#01642F",
      "--color-red": "#E63946",
      "--color-red-shade": "#BB2F3A",
      "--color-transition1": "#7EA5B8",
      "--color-transition2": "#B7CFD3",
      "--color-appliance-label": "#1D3557",
      "--color-appliance-shell-top": "#E9E1D4",
      "--color-appliance-shell-bottom": "#E9E1D4",
      "--color-appliance-shell-border": "#1D355722",
      "--color-appliance-shell-pattern":
        "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0)), repeating-linear-gradient(38deg, rgba(29,53,87,0.035) 0px, rgba(29,53,87,0.035) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-36deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 13px)",
      "--color-appliance-panel-top": "#F3ECE1",
      "--color-appliance-panel-bottom": "#F3ECE1",
      "--color-appliance-panel-border": "#1D35571F",
      "--color-appliance-panel-highlight": "#FFFFFF26",
      "--color-appliance-panel-pattern":
        "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0)), repeating-linear-gradient(44deg, rgba(29,53,87,0.026) 0px, rgba(29,53,87,0.026) 1px, transparent 1px, transparent 9px), repeating-linear-gradient(-44deg, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.16) 1px, transparent 1px, transparent 12px)",
      "--color-appliance-screen-bg": "#274467",
      "--color-appliance-screen-border": "#1D355738",
      "--color-appliance-screen-pattern":
        "repeating-linear-gradient(180deg, rgba(241,250,238,0.05) 0px, rgba(241,250,238,0.05) 1px, transparent 1px, transparent 5px), radial-gradient(circle at 18% 16%, rgba(168,218,220,0.18), transparent 24%)",
      "--color-appliance-screen-text": "#F1FAEE",
      "--color-appliance-screen-muted": "#A8DADC",
      "--color-appliance-control-pattern":
        "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0)), repeating-linear-gradient(42deg, rgba(29,53,87,0.03) 0px, rgba(29,53,87,0.03) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-42deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 12px)",
      "--color-appliance-control-panel-top": "#F6F0E6",
      "--color-appliance-control-panel-bottom": "#F6F0E6",
      "--color-appliance-control-panel-border": "#1D35571F",
      "--color-appliance-control-button-top": "#FBF6EE",
      "--color-appliance-control-button-bottom": "#FBF6EE",
      "--color-appliance-control-button-border": "#1D35571F",
      "--color-appliance-control-danger-top": "#F7ECE7",
      "--color-appliance-control-danger-bottom": "#F7ECE7",
      "--color-appliance-control-danger-border": "#E6394630",
      "--color-appliance-status-ready-bg": "#018E421F",
      "--color-appliance-status-ready-border": "#018E4238",
      "--color-appliance-status-too-much-bg": "#E639461F",
      "--color-appliance-status-too-much-border": "#E6394638",
      "--color-appliance-status-not-enough-bg": "#457B9D1F",
      "--color-appliance-status-not-enough-border": "#457B9D38",
    },
  },
  [Themes.NEGATIVE]: {
    dataValue: "negative",
    label: "Negative",
    properties: {
      "--color-text-color": "#F8F9FA",
      "--color-bg-color": "#212529",
      "--color-fg-color": "#495057",
      "--color-fg-color-shade": "#495057",
      "--color-title-color": "#E9ECEF",
      "--color-baloon1": "#AC3931",
      "--color-baloon1-shade": "#802A24",
      "--color-baloon2": "#5E548E",
      "--color-baloon2-shade": "#423B64",
      "--color-baloon3": "#558F54",
      "--color-baloon3-shade": "#3C643B",
      "--color-primary": "#212529",
      "--color-secondary": "#343A40",
      "--color-secondary-shade": "#2D3237",
      "--color-tertiary": "#6C757D",
      "--color-extra1": "#ADB5BD",
      "--color-extra2": "#CED4DA",
      "--color-white": "#F8F9FA",
      "--color-white-shade": "#EFF0F1",
      "--color-yellow": "#FFDD4A",
      "--color-yellow-shade": "#FFC84A",
      "--color-green": "#558F54",
      "--color-green-shade": "#50864F",
      "--color-red": "#AC3931",
      "--color-red-shade": "#802A24",
      "--color-transition1": "#3B4148",
      "--color-transition2": "#424850",
      "--color-appliance-label": "#212529",
      "--color-appliance-shell-top": "#CAC5BE",
      "--color-appliance-shell-bottom": "#CAC5BE",
      "--color-appliance-shell-border": "#21252926",
      "--color-appliance-shell-pattern":
        "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0)), repeating-linear-gradient(38deg, rgba(33,37,41,0.045) 0px, rgba(33,37,41,0.045) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-36deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 13px)",
      "--color-appliance-panel-top": "#DEDBD5",
      "--color-appliance-panel-bottom": "#DEDBD5",
      "--color-appliance-panel-border": "#21252922",
      "--color-appliance-panel-highlight": "#FFFFFF18",
      "--color-appliance-panel-pattern":
        "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0)), repeating-linear-gradient(44deg, rgba(33,37,41,0.03) 0px, rgba(33,37,41,0.03) 1px, transparent 1px, transparent 9px), repeating-linear-gradient(-44deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 12px)",
      "--color-appliance-screen-bg": "#1D2328",
      "--color-appliance-screen-border": "#CED4DA2E",
      "--color-appliance-screen-pattern":
        "repeating-linear-gradient(180deg, rgba(248,249,250,0.05) 0px, rgba(248,249,250,0.05) 1px, transparent 1px, transparent 5px), radial-gradient(circle at 18% 16%, rgba(173,181,189,0.16), transparent 24%)",
      "--color-appliance-screen-text": "#F8F9FA",
      "--color-appliance-screen-muted": "#CED4DA",
      "--color-appliance-control-pattern":
        "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0)), repeating-linear-gradient(42deg, rgba(33,37,41,0.034) 0px, rgba(33,37,41,0.034) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-42deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 12px)",
      "--color-appliance-control-panel-top": "#E8E4DE",
      "--color-appliance-control-panel-bottom": "#E8E4DE",
      "--color-appliance-control-panel-border": "#21252922",
      "--color-appliance-control-button-top": "#F0ECE6",
      "--color-appliance-control-button-bottom": "#F0ECE6",
      "--color-appliance-control-button-border": "#21252922",
      "--color-appliance-control-danger-top": "#ECE2DE",
      "--color-appliance-control-danger-bottom": "#ECE2DE",
      "--color-appliance-control-danger-border": "#AC393135",
      "--color-appliance-status-ready-bg": "#558F541F",
      "--color-appliance-status-ready-border": "#558F5438",
      "--color-appliance-status-too-much-bg": "#AC39311F",
      "--color-appliance-status-too-much-border": "#AC393138",
      "--color-appliance-status-not-enough-bg": "#5E548E1F",
      "--color-appliance-status-not-enough-border": "#5E548E38",
    },
  },
  [Themes.NEUTRAL]: {
    dataValue: "neutral",
    label: "Neutral",
    properties: {
      "--color-text-color": "#231942",
      "--color-bg-color": "#231942",
      "--color-fg-color": "#F7F5FB",
      "--color-fg-color-shade": "#CDCBCF",
      "--color-title-color": "#5E548E",
      "--color-baloon1": "#AC3931",
      "--color-baloon1-shade": "#802A24",
      "--color-baloon2": "#5E548E",
      "--color-baloon2-shade": "#423B64",
      "--color-baloon3": "#558F54",
      "--color-baloon3-shade": "#3C643B",
      "--color-primary": "#231942",
      "--color-secondary": "#5E548E",
      "--color-secondary-shade": "#423B64",
      "--color-tertiary": "#9F86C0",
      "--color-extra1": "#BE95C4",
      "--color-extra2": "#E0B1CB",
      "--color-white": "#F7F5FB",
      "--color-white-shade": "#CDCBCF",
      "--color-yellow": "#FFDD4A",
      "--color-yellow-shade": "#FFC84A",
      "--color-green": "#558F54",
      "--color-green-shade": "#50864F",
      "--color-red": "#AC3931",
      "--color-red-shade": "#802A24",
      "--color-transition1": "#918AB2",
      "--color-transition2": "#C4C0D6",
      "--color-appliance-label": "#5E548E",
      "--color-appliance-shell-top": "#E4DDE8",
      "--color-appliance-shell-bottom": "#E4DDE8",
      "--color-appliance-shell-border": "#5E548E22",
      "--color-appliance-shell-pattern":
        "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0)), repeating-linear-gradient(38deg, rgba(94,84,142,0.038) 0px, rgba(94,84,142,0.038) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-36deg, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.16) 1px, transparent 1px, transparent 13px)",
      "--color-appliance-panel-top": "#F0E8F3",
      "--color-appliance-panel-bottom": "#F0E8F3",
      "--color-appliance-panel-border": "#5E548E1E",
      "--color-appliance-panel-highlight": "#FFFFFF20",
      "--color-appliance-panel-pattern":
        "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0)), repeating-linear-gradient(44deg, rgba(94,84,142,0.028) 0px, rgba(94,84,142,0.028) 1px, transparent 1px, transparent 9px), repeating-linear-gradient(-44deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 12px)",
      "--color-appliance-screen-bg": "#231942",
      "--color-appliance-screen-border": "#5E548E33",
      "--color-appliance-screen-pattern":
        "repeating-linear-gradient(180deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 5px), radial-gradient(circle at 18% 16%, rgba(190,149,196,0.18), transparent 24%)",
      "--color-appliance-screen-text": "#F7F5FB",
      "--color-appliance-screen-muted": "#E0B1CB",
      "--color-appliance-control-pattern":
        "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0)), repeating-linear-gradient(42deg, rgba(94,84,142,0.032) 0px, rgba(94,84,142,0.032) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-42deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 12px)",
      "--color-appliance-control-panel-top": "#F3EBF5",
      "--color-appliance-control-panel-bottom": "#F3EBF5",
      "--color-appliance-control-panel-border": "#5E548E1E",
      "--color-appliance-control-button-top": "#F8F1FA",
      "--color-appliance-control-button-bottom": "#F8F1FA",
      "--color-appliance-control-button-border": "#5E548E1E",
      "--color-appliance-control-danger-top": "#F5EAEE",
      "--color-appliance-control-danger-bottom": "#F5EAEE",
      "--color-appliance-control-danger-border": "#AC393130",
      "--color-appliance-status-ready-bg": "#558F541F",
      "--color-appliance-status-ready-border": "#558F5438",
      "--color-appliance-status-too-much-bg": "#AC39311F",
      "--color-appliance-status-too-much-border": "#AC393138",
      "--color-appliance-status-not-enough-bg": "#5E548E1F",
      "--color-appliance-status-not-enough-border": "#5E548E38",
    },
  },
  [Themes.POSITIVE]: {
    dataValue: "positive",
    label: "Positive",
    properties: {
      "--color-text-color": "#FAF3DD",
      "--color-bg-color": "#461220",
      "--color-fg-color": "#B23A48",
      "--color-fg-color-shade": "#882D38",
      "--color-title-color": "#FAF3DD",
      "--color-baloon1": "#8C2F39",
      "--color-baloon1-shade": "#622128",
      "--color-baloon2": "#547AA5",
      "--color-baloon2-shade": "#3F5B7B",
      "--color-baloon3": "#1B998B",
      "--color-baloon3-shade": "#146F64",
      "--color-primary": "#461220",
      "--color-secondary": "#8C2F39",
      "--color-secondary-shade": "#622128",
      "--color-tertiary": "#EA4F5F",
      "--color-extra1": "#546462",
      "--color-extra2": "#1B998B",
      "--color-white": "#FAF3DD",
      "--color-white-shade": "#CFCAB7",
      "--color-yellow": "#FFD23F",
      "--color-yellow-shade": "#D4AF35",
      "--color-green": "#1B998B",
      "--color-green-shade": "#146F64",
      "--color-red": "#547AA5",
      "--color-red-shade": "#3F5B7B",
      "--color-transition1": "#99333E",
      "--color-transition2": "#A63743",
      "--color-appliance-label": "#461220",
      "--color-appliance-shell-top": "#E8D7C8",
      "--color-appliance-shell-bottom": "#E8D7C8",
      "--color-appliance-shell-border": "#46122022",
      "--color-appliance-shell-pattern":
        "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0)), repeating-linear-gradient(38deg, rgba(70,18,32,0.038) 0px, rgba(70,18,32,0.038) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-36deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 13px)",
      "--color-appliance-panel-top": "#F3E4D7",
      "--color-appliance-panel-bottom": "#F3E4D7",
      "--color-appliance-panel-border": "#4612201E",
      "--color-appliance-panel-highlight": "#FFF7EB22",
      "--color-appliance-panel-pattern":
        "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0)), repeating-linear-gradient(44deg, rgba(70,18,32,0.028) 0px, rgba(70,18,32,0.028) 1px, transparent 1px, transparent 9px), repeating-linear-gradient(-44deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 12px)",
      "--color-appliance-screen-bg": "#5A2230",
      "--color-appliance-screen-border": "#46122038",
      "--color-appliance-screen-pattern":
        "repeating-linear-gradient(180deg, rgba(250,243,221,0.05) 0px, rgba(250,243,221,0.05) 1px, transparent 1px, transparent 5px), radial-gradient(circle at 18% 16%, rgba(234,79,95,0.18), transparent 24%)",
      "--color-appliance-screen-text": "#FAF3DD",
      "--color-appliance-screen-muted": "#FFD23F",
      "--color-appliance-control-pattern":
        "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0)), repeating-linear-gradient(42deg, rgba(70,18,32,0.032) 0px, rgba(70,18,32,0.032) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-42deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 12px)",
      "--color-appliance-control-panel-top": "#F7EADC",
      "--color-appliance-control-panel-bottom": "#F7EADC",
      "--color-appliance-control-panel-border": "#4612201E",
      "--color-appliance-control-button-top": "#FBF0E6",
      "--color-appliance-control-button-bottom": "#FBF0E6",
      "--color-appliance-control-button-border": "#4612201E",
      "--color-appliance-control-danger-top": "#F4E5E3",
      "--color-appliance-control-danger-bottom": "#F4E5E3",
      "--color-appliance-control-danger-border": "#8C2F3935",
      "--color-appliance-status-ready-bg": "#1B998B1F",
      "--color-appliance-status-ready-border": "#1B998B38",
      "--color-appliance-status-too-much-bg": "#8C2F391F",
      "--color-appliance-status-too-much-border": "#8C2F3938",
      "--color-appliance-status-not-enough-bg": "#547AA51F",
      "--color-appliance-status-not-enough-border": "#547AA538",
    },
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

const setThemeProperties = (
  root: HTMLElement,
  properties: Record<string, string>
) => {
  Object.entries(properties).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
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

  root.dataset.theme = themeDefinition.dataValue;
  setThemeProperties(root, themeDefinition.properties);

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
