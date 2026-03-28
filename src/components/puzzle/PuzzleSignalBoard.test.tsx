// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDispensedGroups } from "../../data/puzzleGroups";
import { $endingState } from "../../stores/endingStore";
import { GameStateFlags } from "../../stores/gameStateStore";
import { createDefaultEndingState } from "../../test/factories";

const endingModeMocks = vi.hoisted(() => ({
  exitEndingToOriginal: vi.fn(),
}));

vi.mock("../../utility/endingMode", () => ({
  exitEndingToOriginal: endingModeMocks.exitEndingToOriginal,
}));

vi.mock("../appliance/ApplianceShell", () => ({
  ApplianceShell: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../appliance/ApplianceTerminal", () => ({
  ApplianceTerminal: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { PuzzleSignalBoard } from "./PuzzleSignalBoard";

describe("PuzzleSignalBoard", () => {
  beforeEach(() => {
    $endingState.set(createDefaultEndingState());
    endingModeMocks.exitEndingToOriginal.mockReset();
  });

  it("shows the return action when the puzzle is complete during an active ending", () => {
    $endingState.set(
      createDefaultEndingState({
        isActive: true,
        selectedSentiment: "positive",
      })
    );

    render(
      <PuzzleSignalBoard
        binaryState={0}
        dispensedGroups={createDispensedGroups()}
        totalPlacedPieces={16}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /return/i }));

    expect(endingModeMocks.exitEndingToOriginal).toHaveBeenCalledTimes(1);
  });

  it("lights a group when its solved flag is set even if it was not dispensed", () => {
    render(
      <PuzzleSignalBoard
        binaryState={1 << GameStateFlags.FLAG_CONNECTION}
        dispensedGroups={createDispensedGroups()}
        totalPlacedPieces={2}
      />
    );

    expect(screen.getByText("Look up. The pattern was always there.")).toBeTruthy();

    const connectionLabel = screen.getByText("Connection");
    const connectionLight = connectionLabel.parentElement?.querySelector(
      "span span"
    ) as HTMLElement | null;

    expect(connectionLight).toBeTruthy();
    expect(connectionLight?.style.boxShadow).toContain("var(--color-extra2)");
  });
});
