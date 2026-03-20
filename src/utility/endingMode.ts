import {
  clearEndingSelection,
  commitPendingEndingDiscovery,
  getSelectedEnding,
  queuePendingEndingDiscovery,
  setSelectedEnding,
  type SentimentLabel,
} from "../stores/endingStore";
import {
  resetFinalCacheToOriginal,
  restoreFinalCacheEnding,
} from "../utility/finalCacheState";
import { applyThemeForSentiment, toggleThemes } from "../utility/toggleTheme";

const ENDING_SECTION_ID = "about";
const ORIGINAL_SECTION_ID = "crtMission";

const jumpToSection = (sectionId: string) => {
  if (typeof document === "undefined") {
    return;
  }

  const targetSection = document.getElementById(sectionId);

  if (!targetSection) {
    return;
  }

  targetSection.scrollIntoView({ behavior: "auto", block: "start" });
};

export const enterEnding = (sentiment: SentimentLabel) => {
  setSelectedEnding(sentiment);
  queuePendingEndingDiscovery(sentiment);
  toggleThemes();
};

export const activateDiscoveredEnding = (sentiment: SentimentLabel) => {
  restoreFinalCacheEnding();
  applyThemeForSentiment(sentiment);
  setSelectedEnding(sentiment, true);
  jumpToSection(ENDING_SECTION_ID);
};

export const exitEndingToOriginal = () => {
  if (getSelectedEnding() === null) {
    return;
  }

  applyThemeForSentiment(null);
  clearEndingSelection();
  resetFinalCacheToOriginal();
  jumpToSection(ORIGINAL_SECTION_ID);

  if (typeof window === "undefined") {
    commitPendingEndingDiscovery();
    return;
  }

  window.requestAnimationFrame(() => {
    commitPendingEndingDiscovery();
  });
};
