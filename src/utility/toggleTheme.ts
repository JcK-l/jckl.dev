import {
  getSentimentState,
  setBit,
  SentimentStateFlags,
} from "../stores/sentimentStateStore";

enum Themes {
  FLAG_ORIGINAL = 0,
  FLAG_NEGATIVE = SentimentStateFlags.FLAG_NEGATIVE,
  FLAG_NEUTRAL = SentimentStateFlags.FLAG_NEUTRAL,
  FLAG_POSITIVE = SentimentStateFlags.FLAG_POSITIVE,
}

type ThemeDefinition = {
  dataValue: string;
  label: string;
  properties: Record<string, string>;
};

const themeDefinitions: Record<Themes, ThemeDefinition> = {
  [Themes.FLAG_ORIGINAL]: {
    dataValue: "original",
    label: "Original",
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
      "--color-appliance-shell-top": "#F6F1EA",
      "--color-appliance-shell-bottom": "#ECE6DF",
      "--color-appliance-shell-border": "#4036572E",
      "--color-appliance-shell-pattern":
        "radial-gradient(circle at 16% 14%, rgba(190,149,196,0.16), transparent 24%), radial-gradient(circle at 84% 8%, rgba(224,177,203,0.18), transparent 30%), repeating-linear-gradient(0deg, rgba(94,84,142,0.032) 0px, rgba(94,84,142,0.032) 1px, transparent 1px, transparent 9px), repeating-linear-gradient(90deg, rgba(224,177,203,0.05) 0px, rgba(224,177,203,0.05) 1px, transparent 1px, transparent 14px)",
      "--color-appliance-shell-vent":
        "repeating-linear-gradient(90deg, rgba(35,25,66,0.16) 0px, rgba(35,25,66,0.16) 5px, transparent 5px, transparent 9px)",
      "--color-appliance-panel-top": "#F5EFE8",
      "--color-appliance-panel-bottom": "#EBE5DD",
      "--color-appliance-panel-border": "#4036571F",
      "--color-appliance-panel-highlight": "#FFFFFF66",
      "--color-appliance-panel-pattern":
        "repeating-radial-gradient(circle at 0 0, rgba(94,84,142,0.04) 0 1px, transparent 1px 14px), repeating-linear-gradient(180deg, rgba(224,177,203,0.08) 0 1px, transparent 1px 6px)",
      "--color-appliance-screen-bg": "#322746",
      "--color-appliance-screen-border": "#4036572E",
      "--color-appliance-screen-pattern":
        "repeating-linear-gradient(180deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 5px), radial-gradient(circle at 18% 16%, rgba(190,149,196,0.18), transparent 24%)",
      "--color-appliance-screen-text": "#F7F5FB",
      "--color-appliance-screen-muted": "#E0B1CB",
      "--color-appliance-control-pattern":
        "repeating-linear-gradient(90deg, rgba(94,84,142,0.06) 0px, rgba(94,84,142,0.06) 1px, transparent 1px, transparent 10px), radial-gradient(circle at 14% 18%, rgba(224,177,203,0.26), transparent 22%)",
      "--color-appliance-control-vent":
        "repeating-linear-gradient(180deg, rgba(35,25,66,0.12) 0px, rgba(35,25,66,0.12) 2px, transparent 2px, transparent 6px)",
      "--color-appliance-control-panel-top": "#FFFFFF",
      "--color-appliance-control-panel-bottom": "#F4EEF7",
      "--color-appliance-control-panel-border": "#2319421A",
      "--color-appliance-control-button-top": "#FFFFFF",
      "--color-appliance-control-button-bottom": "#F5F0F9",
      "--color-appliance-control-button-border": "#2319421A",
      "--color-appliance-control-danger-top": "#FFFFFF",
      "--color-appliance-control-danger-bottom": "#F9EEEE",
      "--color-appliance-control-danger-border": "#AC39312E",
      "--color-appliance-status-ready-bg": "#558F541F",
      "--color-appliance-status-ready-border": "#558F5438",
      "--color-appliance-status-too-much-bg": "#AC39311F",
      "--color-appliance-status-too-much-border": "#AC393138",
      "--color-appliance-status-not-enough-bg": "#5E548E1F",
      "--color-appliance-status-not-enough-border": "#5E548E38",
    },
  },
  [Themes.FLAG_NEGATIVE]: {
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
      "--color-appliance-shell-top": "#606B75",
      "--color-appliance-shell-bottom": "#535D67",
      "--color-appliance-shell-border": "#EFF0F133",
      "--color-appliance-shell-pattern":
        "radial-gradient(circle at 16% 14%, rgba(173,181,189,0.18), transparent 24%), radial-gradient(circle at 84% 8%, rgba(206,212,218,0.18), transparent 30%), repeating-linear-gradient(0deg, rgba(173,181,189,0.05) 0px, rgba(173,181,189,0.05) 1px, transparent 1px, transparent 9px), repeating-linear-gradient(90deg, rgba(206,212,218,0.05) 0px, rgba(206,212,218,0.05) 1px, transparent 1px, transparent 14px)",
      "--color-appliance-shell-vent":
        "repeating-linear-gradient(90deg, rgba(33,37,41,0.2) 0px, rgba(33,37,41,0.2) 5px, transparent 5px, transparent 9px)",
      "--color-appliance-panel-top": "#6A7480",
      "--color-appliance-panel-bottom": "#5B6670",
      "--color-appliance-panel-border": "#EFF0F126",
      "--color-appliance-panel-highlight": "#FFFFFF33",
      "--color-appliance-panel-pattern":
        "repeating-radial-gradient(circle at 0 0, rgba(206,212,218,0.06) 0 1px, transparent 1px 14px), repeating-linear-gradient(180deg, rgba(173,181,189,0.08) 0 1px, transparent 1px 6px)",
      "--color-appliance-screen-bg": "#1D2328",
      "--color-appliance-screen-border": "#CED4DA2E",
      "--color-appliance-screen-pattern":
        "repeating-linear-gradient(180deg, rgba(248,249,250,0.05) 0px, rgba(248,249,250,0.05) 1px, transparent 1px, transparent 5px), radial-gradient(circle at 18% 16%, rgba(173,181,189,0.16), transparent 24%)",
      "--color-appliance-screen-text": "#F8F9FA",
      "--color-appliance-screen-muted": "#CED4DA",
      "--color-appliance-control-pattern":
        "repeating-linear-gradient(90deg, rgba(173,181,189,0.08) 0px, rgba(173,181,189,0.08) 1px, transparent 1px, transparent 10px), radial-gradient(circle at 14% 18%, rgba(206,212,218,0.22), transparent 22%)",
      "--color-appliance-control-vent":
        "repeating-linear-gradient(180deg, rgba(33,37,41,0.18) 0px, rgba(33,37,41,0.18) 2px, transparent 2px, transparent 6px)",
      "--color-appliance-control-panel-top": "#F8F9FA",
      "--color-appliance-control-panel-bottom": "#E5EAED",
      "--color-appliance-control-panel-border": "#21252924",
      "--color-appliance-control-button-top": "#F8F9FA",
      "--color-appliance-control-button-bottom": "#DDE3E7",
      "--color-appliance-control-button-border": "#21252924",
      "--color-appliance-control-danger-top": "#F8F9FA",
      "--color-appliance-control-danger-bottom": "#EFE4E4",
      "--color-appliance-control-danger-border": "#AC393135",
      "--color-appliance-status-ready-bg": "#558F541F",
      "--color-appliance-status-ready-border": "#558F5438",
      "--color-appliance-status-too-much-bg": "#AC39311F",
      "--color-appliance-status-too-much-border": "#AC393138",
      "--color-appliance-status-not-enough-bg": "#5E548E1F",
      "--color-appliance-status-not-enough-border": "#5E548E38",
    },
  },
  [Themes.FLAG_NEUTRAL]: {
    dataValue: "neutral",
    label: "Neutral",
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
      "--color-appliance-shell-top": "#EEF6F2",
      "--color-appliance-shell-bottom": "#DDE8E3",
      "--color-appliance-shell-border": "#1D35572E",
      "--color-appliance-shell-pattern":
        "radial-gradient(circle at 16% 14%, rgba(168,218,220,0.2), transparent 24%), radial-gradient(circle at 84% 8%, rgba(240,157,81,0.16), transparent 30%), repeating-linear-gradient(0deg, rgba(69,123,157,0.04) 0px, rgba(69,123,157,0.04) 1px, transparent 1px, transparent 9px), repeating-linear-gradient(90deg, rgba(168,218,220,0.06) 0px, rgba(168,218,220,0.06) 1px, transparent 1px, transparent 14px)",
      "--color-appliance-shell-vent":
        "repeating-linear-gradient(90deg, rgba(29,53,87,0.18) 0px, rgba(29,53,87,0.18) 5px, transparent 5px, transparent 9px)",
      "--color-appliance-panel-top": "#F6FCF8",
      "--color-appliance-panel-bottom": "#E4F0EA",
      "--color-appliance-panel-border": "#1D355724",
      "--color-appliance-panel-highlight": "#FFFFFF55",
      "--color-appliance-panel-pattern":
        "repeating-radial-gradient(circle at 0 0, rgba(168,218,220,0.08) 0 1px, transparent 1px 14px), repeating-linear-gradient(180deg, rgba(240,157,81,0.08) 0 1px, transparent 1px 6px)",
      "--color-appliance-screen-bg": "#274467",
      "--color-appliance-screen-border": "#1D355738",
      "--color-appliance-screen-pattern":
        "repeating-linear-gradient(180deg, rgba(241,250,238,0.05) 0px, rgba(241,250,238,0.05) 1px, transparent 1px, transparent 5px), radial-gradient(circle at 18% 16%, rgba(168,218,220,0.18), transparent 24%)",
      "--color-appliance-screen-text": "#F1FAEE",
      "--color-appliance-screen-muted": "#A8DADC",
      "--color-appliance-control-pattern":
        "repeating-linear-gradient(90deg, rgba(69,123,157,0.08) 0px, rgba(69,123,157,0.08) 1px, transparent 1px, transparent 10px), radial-gradient(circle at 14% 18%, rgba(168,218,220,0.22), transparent 22%)",
      "--color-appliance-control-vent":
        "repeating-linear-gradient(180deg, rgba(29,53,87,0.16) 0px, rgba(29,53,87,0.16) 2px, transparent 2px, transparent 6px)",
      "--color-appliance-control-panel-top": "#FFFFFF",
      "--color-appliance-control-panel-bottom": "#E9F4EF",
      "--color-appliance-control-panel-border": "#1D355724",
      "--color-appliance-control-button-top": "#FFFFFF",
      "--color-appliance-control-button-bottom": "#E7F1ED",
      "--color-appliance-control-button-border": "#1D355724",
      "--color-appliance-control-danger-top": "#FFFFFF",
      "--color-appliance-control-danger-bottom": "#FBE7EA",
      "--color-appliance-control-danger-border": "#E6394630",
      "--color-appliance-status-ready-bg": "#018E421F",
      "--color-appliance-status-ready-border": "#018E4238",
      "--color-appliance-status-too-much-bg": "#E639461F",
      "--color-appliance-status-too-much-border": "#E6394638",
      "--color-appliance-status-not-enough-bg": "#457B9D1F",
      "--color-appliance-status-not-enough-border": "#457B9D38",
    },
  },
  [Themes.FLAG_POSITIVE]: {
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
      "--color-appliance-shell-top": "#F5E7DC",
      "--color-appliance-shell-bottom": "#EAD8CD",
      "--color-appliance-shell-border": "#46122033",
      "--color-appliance-shell-pattern":
        "radial-gradient(circle at 16% 14%, rgba(234,79,95,0.16), transparent 24%), radial-gradient(circle at 84% 8%, rgba(27,153,139,0.18), transparent 30%), repeating-linear-gradient(0deg, rgba(140,47,57,0.04) 0px, rgba(140,47,57,0.04) 1px, transparent 1px, transparent 9px), repeating-linear-gradient(90deg, rgba(27,153,139,0.05) 0px, rgba(27,153,139,0.05) 1px, transparent 1px, transparent 14px)",
      "--color-appliance-shell-vent":
        "repeating-linear-gradient(90deg, rgba(70,18,32,0.2) 0px, rgba(70,18,32,0.2) 5px, transparent 5px, transparent 9px)",
      "--color-appliance-panel-top": "#FFF4EA",
      "--color-appliance-panel-bottom": "#F2E1D5",
      "--color-appliance-panel-border": "#46122024",
      "--color-appliance-panel-highlight": "#FFF7EB55",
      "--color-appliance-panel-pattern":
        "repeating-radial-gradient(circle at 0 0, rgba(234,79,95,0.08) 0 1px, transparent 1px 14px), repeating-linear-gradient(180deg, rgba(27,153,139,0.08) 0 1px, transparent 1px 6px)",
      "--color-appliance-screen-bg": "#5A2230",
      "--color-appliance-screen-border": "#46122038",
      "--color-appliance-screen-pattern":
        "repeating-linear-gradient(180deg, rgba(250,243,221,0.05) 0px, rgba(250,243,221,0.05) 1px, transparent 1px, transparent 5px), radial-gradient(circle at 18% 16%, rgba(234,79,95,0.18), transparent 24%)",
      "--color-appliance-screen-text": "#FAF3DD",
      "--color-appliance-screen-muted": "#FFD23F",
      "--color-appliance-control-pattern":
        "repeating-linear-gradient(90deg, rgba(140,47,57,0.08) 0px, rgba(140,47,57,0.08) 1px, transparent 1px, transparent 10px), radial-gradient(circle at 14% 18%, rgba(27,153,139,0.18), transparent 22%)",
      "--color-appliance-control-vent":
        "repeating-linear-gradient(180deg, rgba(70,18,32,0.18) 0px, rgba(70,18,32,0.18) 2px, transparent 2px, transparent 6px)",
      "--color-appliance-control-panel-top": "#FFF8EE",
      "--color-appliance-control-panel-bottom": "#F4E1D6",
      "--color-appliance-control-panel-border": "#46122024",
      "--color-appliance-control-button-top": "#FFF8EE",
      "--color-appliance-control-button-bottom": "#F0DBD0",
      "--color-appliance-control-button-border": "#46122024",
      "--color-appliance-control-danger-top": "#FFF8EE",
      "--color-appliance-control-danger-bottom": "#F0D6DB",
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
  Themes.FLAG_ORIGINAL,
  Themes.FLAG_NEUTRAL,
  Themes.FLAG_POSITIVE,
  Themes.FLAG_NEGATIVE,
] as const;

const themeEntries = Object.entries(themeDefinitions).map(
  ([theme, definition]) => [Number(theme) as Themes, definition] as const
);

const themeByDataValue = new Map(
  themeEntries.map(([theme, definition]) => [definition.dataValue, theme] as const)
);

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
    return Themes.FLAG_ORIGINAL;
  }

  return (
    themeByDataValue.get(document.documentElement.dataset.theme ?? "") ??
    Themes.FLAG_ORIGINAL
  );
};

const applyTheme = (theme: Themes | null) => {
  if (theme === null || typeof document === "undefined") {
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

export const getCurrentThemeLabel = () => {
  return themeDefinitions[getAppliedTheme()].label;
};

export const cycleDebugTheme = () => {
  const currentTheme = getAppliedTheme();
  const currentIndex = debugThemeOrder.indexOf(currentTheme);
  const nextTheme =
    debugThemeOrder[(currentIndex + 1) % debugThemeOrder.length] ??
    Themes.FLAG_ORIGINAL;

  applyTheme(nextTheme);

  return themeDefinitions[nextTheme].label;
};

export const toggleThemes = () => {
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let currentInterval = 3000;
  const minInterval = 150;
  const decayFactor = 0.98;
  const sentimentState = getSentimentState();

  if (sentimentState === null) {
    return;
  }

  const selectedTheme = sentimentState as unknown as Themes;
  let currentTheme: Themes = selectedTheme;

  function startDecayingInterval() {
    if (intervalId) {
      clearInterval(intervalId);
    }

    const adjustInterval = () => {
      applyTheme(currentTheme);
      currentTheme =
        currentTheme === Themes.FLAG_ORIGINAL
          ? selectedTheme
          : Themes.FLAG_ORIGINAL;

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
      setBit(SentimentStateFlags.FLAG_ACTIVE);
    };

    intervalId = setInterval(adjustInterval, currentInterval);
  }

  startDecayingInterval();
};
