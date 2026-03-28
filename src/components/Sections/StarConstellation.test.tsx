// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDispensedGroups } from "../../data/puzzleGroups";
import { $endingState } from "../../stores/endingStore";
import { $gameState, GameStateFlags, hasBit } from "../../stores/gameStateStore";
import { $dispensedGroups } from "../../stores/puzzleDispenseStore";
import { createDefaultEndingState } from "../../test/factories";

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

import StarConstellation from "./StarConstellation";

describe("StarConstellation", () => {
  beforeEach(() => {
    $endingState.set(createDefaultEndingState());
    $gameState.set(0);
    $dispensedGroups.set(createDispensedGroups());
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
        unobserve() {}
      }
    );
  });

  it("unlocks the stars group and triggers its piece transfer", async () => {
    const { container } = render(<StarConstellation />);
    const activationPath = container.querySelector("path.cursor-pointer");

    expect(activationPath).toBeTruthy();

    fireEvent.click(activationPath!);

    await waitFor(() => {
      expect(hasBit($gameState.get(), GameStateFlags.FLAG_STARS_ALIGN)).toBe(
        true
      );
      expect(screen.getByText("trigger:1")).toBeTruthy();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /complete-transfer/i })
    );

    expect($dispensedGroups.get().stars).toBe(true);
  });

  it("hides the constellation interaction during the negative ending", () => {
    $endingState.set(
      createDefaultEndingState({
        selectedSentiment: "negative",
      })
    );

    const { container } = render(<StarConstellation />);

    expect(container.querySelector("path.cursor-pointer")).toBeNull();
    expect(screen.getByTestId("stars").textContent).toBe("stars:off");
  });
});
