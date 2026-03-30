// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  $endingState,
  getEndingState,
  setSelectedEnding,
} from "../stores/endingStore";
import { createDefaultEndingState } from "../test/factories";

const finalCacheMocks = vi.hoisted(() => ({
  resetFinalCacheToOriginal: vi.fn(),
  restoreFinalCacheEnding: vi.fn(),
}));

const themeMocks = vi.hoisted(() => ({
  applyThemeForSentiment: vi.fn(),
  toggleThemes: vi.fn(),
}));

vi.mock("../utility/finalCacheState", () => ({
  resetFinalCacheToOriginal: finalCacheMocks.resetFinalCacheToOriginal,
  restoreFinalCacheEnding: finalCacheMocks.restoreFinalCacheEnding,
}));

vi.mock("../utility/toggleTheme", () => ({
  applyThemeForSentiment: themeMocks.applyThemeForSentiment,
  toggleThemes: themeMocks.toggleThemes,
}));

import {
  activateDiscoveredEnding,
  enterEnding,
  exitEndingToOriginal,
} from "./endingMode";

describe("endingMode", () => {
  beforeEach(() => {
    $endingState.set(createDefaultEndingState());
    finalCacheMocks.resetFinalCacheToOriginal.mockReset();
    finalCacheMocks.restoreFinalCacheEnding.mockReset();
    themeMocks.applyThemeForSentiment.mockReset();
    themeMocks.toggleThemes.mockReset();
    vi.restoreAllMocks();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });
    document.body.innerHTML = "";
  });

  it("queues the ending discovery and starts the theme transition", () => {
    enterEnding("positive");

    expect(getEndingState().pendingDiscovery).toBe("positive");
    expect(themeMocks.toggleThemes).toHaveBeenCalledWith("positive");
  });

  it("restores a discovered ending, applies its theme, and scrolls to the ending section", () => {
    const section = document.createElement("section");
    section.id = "about";
    section.getBoundingClientRect = vi.fn(() => ({
      top: 480,
      left: 0,
      right: 0,
      bottom: 640,
      width: 0,
      height: 160,
      x: 0,
      y: 480,
      toJSON: () => ({}),
    })) as typeof section.getBoundingClientRect;
    section.scrollIntoView = vi.fn();
    document.body.appendChild(section);

    activateDiscoveredEnding("neutral");

    expect(finalCacheMocks.restoreFinalCacheEnding).toHaveBeenCalledTimes(1);
    expect(themeMocks.applyThemeForSentiment).toHaveBeenCalledWith("neutral");
    expect(getEndingState().selectedSentiment).toBe("neutral");
    expect(getEndingState().isActive).toBe(true);
    expect(section.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("exits the active ending, resets the final cache, and commits pending discovery on the next frame", () => {
    const scrollTo = vi.fn();
    const section = document.createElement("section");
    section.id = "crtMission";
    section.getBoundingClientRect = vi.fn(() => ({
      top: 360,
      left: 0,
      right: 0,
      bottom: 760,
      width: 0,
      height: 400,
      x: 0,
      y: 360,
      toJSON: () => ({}),
    })) as typeof section.getBoundingClientRect;
    section.scrollIntoView = vi.fn();
    Object.defineProperty(window, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 120,
    });
    document.body.appendChild(section);

    setSelectedEnding("positive", true);
    $endingState.set({
      ...getEndingState(),
      pendingDiscovery: "neutral",
    });

    exitEndingToOriginal();

    expect(themeMocks.applyThemeForSentiment).toHaveBeenCalledWith(null);
    expect(finalCacheMocks.resetFinalCacheToOriginal).toHaveBeenCalledTimes(1);
    expect(getEndingState().selectedSentiment).toBeNull();
    expect(getEndingState().isActive).toBe(false);
    expect(getEndingState().pendingDiscovery).toBeNull();
    expect(getEndingState().discoveredSentiments.neutral).toBe(true);
    expect(getEndingState().settledVideos.positive).toBe(true);
    expect(section.scrollIntoView).not.toHaveBeenCalled();
    expect(scrollTo).toHaveBeenCalledWith({
      behavior: "smooth",
      top: 280,
    });
  });
});
