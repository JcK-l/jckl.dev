import {
  clearEndingSelection,
  commitPendingEndingDiscovery,
  getSelectedEnding,
  markEndingVideoSettled,
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
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const targetSection = document.getElementById(sectionId);

  if (!targetSection) {
    return;
  }

  const targetBounds = targetSection.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const isAlreadyNearViewportTop =
    targetBounds.top >= -24 && targetBounds.top <= viewportHeight * 0.35;

  if (isAlreadyNearViewportTop) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  targetSection.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
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
  const selectedEnding = getSelectedEnding();

  if (selectedEnding === null) {
    return;
  }

  markEndingVideoSettled(selectedEnding);
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
