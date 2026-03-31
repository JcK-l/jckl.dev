// @vitest-environment jsdom

import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { useState, type ReactNode } from "react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { PuzzleContext } from "../../context/PuzzleContext";
import { createDispensedGroups } from "../../data/puzzleGroups";
import { $gameState, GameStateFlags } from "../../stores/gameStateStore";
import { $dispensedGroups } from "../../stores/puzzleDispenseStore";
import {
  $puzzleResetRequest,
  requestPuzzleReset,
  requestPuzzleRestore,
} from "../../stores/puzzleResetStore";

vi.mock("../../utility/preloadImages", () => ({
  preloadImages: vi.fn(() => Promise.resolve()),
}));

vi.mock("./PuzzlePiece", () => ({
  PuzzlePiece: ({ id }: { id: number }) => (
    <div data-testid={`piece-${id}`}>{`piece-${id}`}</div>
  ),
}));

vi.mock("./PuzzleSignalBoard", () => ({
  PuzzleSignalBoard: () => <div data-testid="signal-board" />,
}));

vi.mock("./Puzzle", async () => {
  const React = await import("react");

  const Puzzle = React.forwardRef<SVGSVGElement, { children?: ReactNode }>(
    function MockPuzzle(_, ref) {
      return (
        <svg ref={ref} data-testid="puzzle-shell">
          {Array.from({ length: 16 }, (_, index) => (
            <image
              key={index + 1}
              id={`p${index + 1}`}
              style={{ opacity: 0 }}
            />
          ))}
        </svg>
      );
    }
  );

  return { Puzzle };
});

import { PuzzleGame } from "./PuzzleGame";

const rect = {
  width: 300,
  height: 300,
  top: 0,
  left: 0,
  right: 300,
  bottom: 300,
  x: 0,
  y: 0,
  toJSON: () => ({}),
};

const PuzzleHarness = () => {
  const [lastPiece, setLastPiece] = useState(0);
  const [totalPlacedPieces, setTotalPlacedPieces] = useState(0);

  return (
    <PuzzleContext.Provider
      value={{
        lastPiece,
        setLastPiece,
        totalPlacedPieces,
        setTotalPlacedPieces,
      }}
    >
      <button
        type="button"
        onClick={() => {
          setLastPiece(1);
          setTotalPlacedPieces(1);
          const pieceImage = document.getElementById("p1");
          if (pieceImage) {
            pieceImage.style.opacity = "1";
          }
        }}
      >
        place-piece-1
      </button>
      <div data-testid="placed-count">{totalPlacedPieces}</div>
      <PuzzleGame />
    </PuzzleContext.Provider>
  );
};

describe("PuzzleGame reset and restore behavior", () => {
  let getBoundingClientRectSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    $gameState.set(0);
    $dispensedGroups.set({
      ...createDispensedGroups(),
      stars: true,
    });
    $puzzleResetRequest.set(null);

    getBoundingClientRectSpy = vi
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockImplementation(() => rect as DOMRect);
  });

  afterEach(() => {
    getBoundingClientRectSpy.mockRestore();
  });

  it("restores a reset piece to the tray and clears the placed image", async () => {
    render(<PuzzleHarness />);

    expect(screen.getByTestId("piece-1")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /place-piece-1/i }));

    await waitFor(() => {
      expect(screen.queryByTestId("piece-1")).toBeNull();
    });

    act(() => {
      requestPuzzleReset([1]);
    });

    await waitFor(() => {
      expect(screen.getByTestId("piece-1")).toBeTruthy();
      expect(screen.getByTestId("placed-count").textContent).toBe("0");
      expect(document.getElementById("p1")?.style.opacity).toBe("0");
    });
  });

  it("re-hides a restored piece and marks the puzzle image as placed again", async () => {
    render(<PuzzleHarness />);

    fireEvent.click(screen.getByRole("button", { name: /place-piece-1/i }));

    await waitFor(() => {
      expect(screen.queryByTestId("piece-1")).toBeNull();
    });

    act(() => {
      requestPuzzleReset([1]);
    });

    await waitFor(() => {
      expect(screen.getByTestId("piece-1")).toBeTruthy();
    });

    act(() => {
      requestPuzzleRestore([1]);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("piece-1")).toBeNull();
      expect(screen.getByTestId("placed-count").textContent).toBe("1");
      expect(document.getElementById("p1")?.style.opacity).toBe("1");
    });
  });

  it("shows a solved group's pieces even if transfer bookkeeping is stale", () => {
    $gameState.set(1 << GameStateFlags.FLAG_CONNECTION);
    $dispensedGroups.set(createDispensedGroups());

    render(<PuzzleHarness />);

    expect(screen.getByTestId("piece-2")).toBeTruthy();
    expect(screen.getByTestId("piece-4")).toBeTruthy();
    expect(screen.queryByTestId("piece-1")).toBeNull();
  });
});
