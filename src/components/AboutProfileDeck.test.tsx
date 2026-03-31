// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createFramerMotionMock } from "../test/mocks/framerMotion";

const mockPuzzleState = vi.hoisted(() => ({
  totalPlacedPieces: 0,
}));

vi.mock("framer-motion", () => ({
  ...createFramerMotionMock({ hooks: {} }),
  animate: () => ({
    stop: vi.fn(),
  }),
}));

vi.mock("../hooks/useDataContext", () => ({
  usePuzzleContext: () => ({
    lastPiece: 0,
    setLastPiece: vi.fn(),
    totalPlacedPieces: mockPuzzleState.totalPlacedPieces,
    setTotalPlacedPieces: vi.fn(),
  }),
}));

import { AboutProfileDeck, getAboutDeckSwipeStep } from "./AboutProfileDeck";

describe("AboutProfileDeck", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "ResizeObserver", {
      configurable: true,
      writable: true,
      value: class {
        observe() {}
        disconnect() {}
      },
    });
  });

  beforeEach(() => {
    mockPuzzleState.totalPlacedPieces = 0;
  });

  it("shows the locked archive state before any profile module is unlocked", () => {
    render(<AboutProfileDeck />);

    expect(
      screen.getByText("Place 04 pieces to bring the first profile module online.")
    ).toBeTruthy();
    expect(screen.getByText("next unlock 04")).toBeTruthy();
    expect(screen.getByText("Profile archive is warming up.")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /open about card/i }).length).toBe(
      1
    );
  });

  it("surfaces unlocked modules and lets the deck navigation switch the active card", () => {
    mockPuzzleState.totalPlacedPieces = 8;

    render(<AboutProfileDeck />);

    expect(
      screen.getByText("Swipe through unlocked notes or keep assembling pieces to reach 12.")
    ).toBeTruthy();
    expect(screen.getByText("next unlock 12")).toBeTruthy();
    expect(screen.getByText("Pattern matching keeps me hooked.")).toBeTruthy();
    expect(screen.getByText("Music is how I clear the buffer.")).toBeTruthy();

    const firstCardButton = screen.getByRole("button", {
      name: "Open about card 1",
    });
    const secondCardButton = screen.getByRole("button", {
      name: "Open about card 2",
    });

    expect(firstCardButton.style.opacity).toBe("0.35");
    expect(secondCardButton.style.opacity).toBe("1");

    fireEvent.click(firstCardButton);

    expect(firstCardButton.style.opacity).toBe("1");
    expect(secondCardButton.style.opacity).toBe("0.35");
  });

  it("announces when all profile modules are online", () => {
    mockPuzzleState.totalPlacedPieces = 16;

    render(<AboutProfileDeck />);

    expect(
      screen.getByText(
        "All profile modules are online. Swipe through the stack or finish the puzzle to close the loop."
      )
    ).toBeTruthy();
    expect(screen.getByText("next unlock complete")).toBeTruthy();
    expect(screen.getByText("Computers have always been the home base.")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /open about card/i }).length).toBe(
      3
    );
  });

  it("treats a modest horizontal drag as an intentional deck swipe on mobile widths", () => {
    expect(
      getAboutDeckSwipeStep({
        deckWidth: 320,
        offsetX: -52,
        velocityX: -120,
      })
    ).toBe(1);
    expect(
      getAboutDeckSwipeStep({
        deckWidth: 320,
        offsetX: 54,
        velocityX: 110,
      })
    ).toBe(-1);
    expect(
      getAboutDeckSwipeStep({
        deckWidth: 320,
        offsetX: -22,
        velocityX: -80,
      })
    ).toBe(0);
  });
});
