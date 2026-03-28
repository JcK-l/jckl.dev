// @vitest-environment jsdom

import { useContext } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PuzzleContext, PuzzleProvider } from "./PuzzleContext";

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
});
