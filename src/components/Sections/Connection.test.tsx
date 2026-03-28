// @vitest-environment jsdom

import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDispensedGroups } from "../../data/puzzleGroups";
import { $gameState, GameStateFlags } from "../../stores/gameStateStore";
import { $dispensedGroups } from "../../stores/puzzleDispenseStore";
import { $endingState } from "../../stores/endingStore";
import { $phoneResultMode, resetPhoneResult } from "../../stores/phoneStore";
import { createDefaultEndingState } from "../../test/factories";

vi.mock("../BetweenLands", async () => {
  const { MockBetweenLands } = await import("../../test/mocks/layout");

  return {
    BetweenLands: MockBetweenLands,
  };
});

vi.mock("../appliance/ApplianceShell", () => ({
  ApplianceShell: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../appliance/ApplianceTerminal", () => ({
  ApplianceTerminal: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../phone/Phonewave", () => ({
  Phonewave: ({
    variant,
    onSequenceComplete,
  }: {
    variant: "idle" | "result";
    onSequenceComplete?: () => void;
  }) => (
    <div data-testid="phonewave">
      <span>{`variant:${variant}`}</span>
      {variant === "result" ? (
        <button type="button" onClick={onSequenceComplete}>
          finish-phonewave-sequence
        </button>
      ) : null}
    </div>
  ),
}));

vi.mock("../puzzle/PuzzlePieceTransfer", async () => {
  const { MockPuzzlePieceTransfer } = await import("../../test/mocks/layout");

  return {
    PuzzlePieceTransfer: MockPuzzlePieceTransfer,
  };
});

import Connection from "./Connection";

describe("Connection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    $endingState.set(createDefaultEndingState());
    $gameState.set(0);
    $dispensedGroups.set(createDispensedGroups());
    resetPhoneResult();
    vi.stubGlobal(
      "ResizeObserver",
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

  it("shows the idle phonewave panel before the connection is unlocked", () => {
    render(<Connection />);

    expect(screen.getByText("variant:idle")).toBeTruthy();
  });

  it("shows the neutral fallback panel instead of phonewave during the neutral ending", () => {
    $endingState.set({
      ...createDefaultEndingState(),
      isActive: true,
      selectedSentiment: "neutral",
    });

    render(<Connection />);

    expect(
      screen.getByText("[boot] temporal relay not yet initialized")
    ).toBeTruthy();
    expect(screen.queryByTestId("phonewave")).toBeNull();
  });

  it("waits for the phonewave result sequence before triggering the connection transfer", () => {
    render(<Connection />);

    expect(screen.getByText("trigger:0")).toBeTruthy();

    act(() => {
      $gameState.set(1 << GameStateFlags.FLAG_CONNECTION);
      $phoneResultMode.set("connection");
    });

    expect(screen.getByText("variant:result")).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(220);
    });

    expect(screen.getByText("trigger:0")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: /finish-phonewave-sequence/i })
    );

    act(() => {
      vi.advanceTimersByTime(220);
    });

    expect(screen.getByText("trigger:1")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: /complete-transfer/i })
    );

    expect($dispensedGroups.get().connection).toBe(true);
  });
});
