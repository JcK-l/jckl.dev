// @vitest-environment jsdom

import { useContext } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { PuzzleContext, PuzzleProvider } from "./PuzzleContext";
import {
  DEBUG_PUZZLE_STATE_EVENT,
  type DebugPuzzleState,
} from "../utility/debugState";

const PuzzleContextConsumer = () => {
  const context = useContext(PuzzleContext);

  if (!context) {
    return null;
  }

  return (
    <div>
      <p>last:{context.lastPiece}</p>
      <p>total:{context.totalPlacedPieces}</p>
      <button
        type="button"
        onClick={() => {
          context.setLastPiece(4);
        }}
      >
        Set last
      </button>
      <button
        type="button"
        onClick={() => {
          context.setTotalPlacedPieces(7);
        }}
      >
        Set total
      </button>
    </div>
  );
};

describe("PuzzleProvider", () => {
  beforeEach(() => {
    window.__jcklE2EPuzzleState__ = undefined;
  });

  it("provides the puzzle state and lets consumers update it", () => {
    render(
      <PuzzleProvider>
        <PuzzleContextConsumer />
      </PuzzleProvider>
    );

    expect(screen.getByText("last:0")).toBeTruthy();
    expect(screen.getByText("total:0")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Set last" }));
    fireEvent.click(screen.getByRole("button", { name: "Set total" }));

    expect(screen.getByText("last:4")).toBeTruthy();
    expect(screen.getByText("total:7")).toBeTruthy();
  });

  it("syncs external debug puzzle updates into the provider", () => {
    render(
      <PuzzleProvider>
        <PuzzleContextConsumer />
      </PuzzleProvider>
    );

    act(() => {
      window.dispatchEvent(
        new CustomEvent<DebugPuzzleState>(DEBUG_PUZZLE_STATE_EVENT, {
          detail: {
            lastPiece: 9,
            totalPlacedPieces: 16,
          },
        })
      );
    });

    return waitFor(() => {
      expect(screen.getByText("last:9")).toBeTruthy();
      expect(screen.getByText("total:16")).toBeTruthy();
    });
  });
});
