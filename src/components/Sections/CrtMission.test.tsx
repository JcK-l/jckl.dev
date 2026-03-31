// @vitest-environment jsdom

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDispensedGroups } from "../../data/puzzleGroups";
import { $endingState } from "../../stores/endingStore";
import { $gameState, GameStateFlags, hasBit } from "../../stores/gameStateStore";
import { $dispensedGroups } from "../../stores/puzzleDispenseStore";
import { createDefaultEndingState } from "../../test/factories";

const endingModeMocks = vi.hoisted(() => ({
  activateDiscoveredEnding: vi.fn(),
}));

vi.mock("framer-motion", async () => {
  const {
    createAnimationControls,
    createMotionProxy,
  } = await import("../../test/mocks/framerMotion");

  return {
    motion: createMotionProxy(),
    useAnimation: () => createAnimationControls(),
  };
});

vi.mock("../BetweenLands", async () => {
  const { MockBetweenLands } = await import("../../test/mocks/layout");

  return {
    BetweenLands: MockBetweenLands,
  };
});

vi.mock("../puzzle/PuzzlePieceTransfer", async () => {
  const { MockPuzzlePieceTransfer } = await import("../../test/mocks/layout");

  return {
    PuzzlePieceTransfer: MockPuzzlePieceTransfer,
  };
});

vi.mock("../Stars", () => ({
  Stars: ({ turnOff }: { turnOff?: boolean }) => (
    <div data-testid="stars">{turnOff ? "stars:off" : "stars:on"}</div>
  ),
}));

vi.mock("../../utility/endingMode", () => ({
  activateDiscoveredEnding: endingModeMocks.activateDiscoveredEnding,
}));

import CrtMission from "./CrtMission";

describe("CrtMission", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    $endingState.set(createDefaultEndingState());
    $gameState.set(0);
    $dispensedGroups.set(createDispensedGroups());
    endingModeMocks.activateDiscoveredEnding.mockReset();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
        unobserve() {}
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("powers the handoff sequence and triggers the hand piece transfer", () => {
    render(<CrtMission />);

    expect(screen.getByText("trigger:0")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /trigger-crt/i }));

    act(() => {
      vi.advanceTimersByTime(550);
    });

    expect(hasBit($gameState.get(), GameStateFlags.FLAG_LEND_A_HAND)).toBe(
      true
    );

    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(screen.getByText("trigger:1")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: /complete-transfer/i })
    );

    expect($dispensedGroups.get().hand).toBe(true);
  });

  it("activates a discovered ending when its balloon is clicked", () => {
    $endingState.set(
      createDefaultEndingState({
        discoveredSentiments: {
          positive: true,
        },
      })
    );

    render(<CrtMission />);

    const positiveBalloon = screen.getByLabelText(
      /switch to the positive timeline/i
    );

    expect(positiveBalloon.getAttribute("filter")).toBe(
      "url(#missionBalloonGlow)"
    );

    fireEvent.click(positiveBalloon);

    expect(endingModeMocks.activateDiscoveredEnding).toHaveBeenCalledWith(
      "positive"
    );
  });
});
