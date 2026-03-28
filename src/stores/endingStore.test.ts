import { beforeEach, describe, expect, it } from "vitest";
import {
  $endingState,
  clearEndingSelection,
  commitPendingEndingDiscovery,
  hasUnlockedAllEndings,
  markDiscoveredEnding,
  queuePendingEndingDiscovery,
  setEndingActive,
  setSelectedEnding,
} from "./endingStore";
import { createDefaultEndingState } from "../test/factories";

describe("endingStore", () => {
  beforeEach(() => {
    $endingState.set(createDefaultEndingState());
  });

  it("selects and activates an ending together", () => {
    setSelectedEnding("positive", true);

    expect($endingState.get().selectedSentiment).toBe("positive");
    expect($endingState.get().isActive).toBe(true);
  });

  it("does not activate ending mode when nothing is selected", () => {
    setEndingActive(true);

    expect($endingState.get().isActive).toBe(false);
  });

  it("clears selection and deactivates ending mode", () => {
    setSelectedEnding("negative", true);
    clearEndingSelection();

    expect($endingState.get().selectedSentiment).toBe(null);
    expect($endingState.get().isActive).toBe(false);
  });

  it("commits a pending discovery and clears the queue", () => {
    queuePendingEndingDiscovery("neutral");

    expect(commitPendingEndingDiscovery()).toBe("neutral");
    expect($endingState.get().pendingDiscovery).toBe(null);
    expect($endingState.get().discoveredSentiments.neutral).toBe(true);
  });

  it("recognizes when all endings have been discovered", () => {
    markDiscoveredEnding("negative");
    markDiscoveredEnding("neutral");
    markDiscoveredEnding("positive");

    expect(hasUnlockedAllEndings()).toBe(true);
  });
});
