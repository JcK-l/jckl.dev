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

type ScrollAlignment = "start" | "center";

const jumpToSection = (
  sectionId: string,
  alignment: ScrollAlignment = "start"
) => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const targetElement = document.getElementById(sectionId);

  if (!targetElement) {
    return;
  }

  const targetBounds = targetElement.getBoundingClientRect();
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const behavior = prefersReducedMotion ? "auto" : "smooth";

  if (alignment === "center") {
    const viewportCenter = viewportHeight / 2;
    const sectionCenter = targetBounds.top + targetBounds.height / 2;
    const isAlreadyNearViewportCenter =
      Math.abs(sectionCenter - viewportCenter) <= 48;

    if (isAlreadyNearViewportCenter) {
      return;
    }

    const currentScrollTop =
      window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

    window.scrollTo({
      behavior,
      top: Math.max(0, currentScrollTop + sectionCenter - viewportCenter),
    });
    return;
  }

  const isAlreadyNearViewportTop =
    targetBounds.top >= -24 && targetBounds.top <= viewportHeight * 0.35;

  if (isAlreadyNearViewportTop) {
    return;
  }

  targetElement.scrollIntoView({
    behavior,
    block: "start",
  });
};

export const enterEnding = (sentiment: SentimentLabel) => {
  queuePendingEndingDiscovery(sentiment);
  toggleThemes(sentiment);
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

  if (typeof window === "undefined") {
    commitPendingEndingDiscovery();
    jumpToSection(ORIGINAL_SECTION_ID, "center");
    return;
  }

  window.requestAnimationFrame(() => {
    commitPendingEndingDiscovery();

    // Let the original timeline and rediscovered balloons settle before measuring.
    window.requestAnimationFrame(() => {
      jumpToSection(ORIGINAL_SECTION_ID, "center");
    });
  });
};
