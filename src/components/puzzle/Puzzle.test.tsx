// @vitest-environment jsdom

import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { $endingState } from "../../stores/endingStore";
import { createDefaultEndingState } from "../../test/factories";

const puzzleContextMocks = vi.hoisted(() => ({
  totalPlacedPieces: 0,
}));

vi.mock("../../hooks/useDataContext", () => ({
  usePuzzleContext: () => ({
    lastPiece: 0,
    setLastPiece: vi.fn(),
    totalPlacedPieces: puzzleContextMocks.totalPlacedPieces,
    setTotalPlacedPieces: vi.fn(),
  }),
}));

vi.mock("framer-motion", async () => {
  const { createFramerMotionMock } = await import("../../test/mocks/framerMotion");

  return createFramerMotionMock({
    hooks: {
      scrollYProgress: 0,
    },
    motion: {
      autoAnimationComplete: true,
    },
  });
});

import { Puzzle } from "./Puzzle";

const createBounds = ({ height, width }: { height: number; width: number }) =>
  ({
    x: 0,
    y: 0,
    top: 0,
    right: width,
    bottom: height,
    left: 0,
    width,
    height,
    toJSON: () => ({}),
  }) as DOMRect;

describe("Puzzle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    puzzleContextMocks.totalPlacedPieces = 0;
    $endingState.set(createDefaultEndingState());
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => {
      return Promise.resolve();
    });
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {
      return;
    });
    Object.defineProperty(HTMLMediaElement.prototype, "readyState", {
      configurable: true,
      get: () => HTMLMediaElement.HAVE_CURRENT_DATA,
    });
    Object.defineProperty(HTMLMediaElement.prototype, "duration", {
      configurable: true,
      get: () => 12,
    });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function () {
        if (this instanceof HTMLVideoElement) {
          return createBounds({ width: 300, height: 180 });
        }

        return createBounds({ width: 300, height: 300 });
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("reveals and plays the selected ending video after the puzzle finishes", async () => {
    puzzleContextMocks.totalPlacedPieces = 16;
    $endingState.set(
      createDefaultEndingState({
        isActive: true,
        selectedSentiment: "positive",
      })
    );
    const { container } = render(<Puzzle />);

    expect(container.querySelector("video")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(container.querySelector("rect")?.style.fill).toBe(
      "var(--color-primary)"
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await act(async () => {
      await Promise.resolve();
    });

    const video = container.querySelector("video") as HTMLVideoElement | null;

    expect(video?.getAttribute("src")).toBe("/secret-SG.mp4");
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);

    fireEvent.ended(video as HTMLVideoElement);

    expect($endingState.get().settledVideos.positive).toBe(true);
    expect(video?.currentTime).toBeCloseTo(11.95);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it("shows a settled ending video immediately and parks it on the last frame", async () => {
    puzzleContextMocks.totalPlacedPieces = 16;
    $endingState.set(
      createDefaultEndingState({
        isActive: true,
        selectedSentiment: "neutral",
        settledVideos: {
          negative: false,
          neutral: true,
          positive: false,
        },
      })
    );
    const { container } = render(<Puzzle />);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    const video = container.querySelector("video") as HTMLVideoElement | null;

    expect(video).toBeTruthy();
    Object.defineProperty(video as HTMLVideoElement, "duration", {
      configurable: true,
      value: 12,
    });
    fireEvent.loadedData(video as HTMLVideoElement);
    await act(async () => {
      await Promise.resolve();
    });
    expect(video?.getAttribute("src")).toBe("/secret-neutral.mp4");
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("clears the completion state again if the placed-piece count drops back below complete", async () => {
    puzzleContextMocks.totalPlacedPieces = 16;
    $endingState.set(
      createDefaultEndingState({
        isActive: true,
        selectedSentiment: "negative",
      })
    );
    const { container, rerender } = render(<Puzzle />);

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(container.querySelector("video")).toBeTruthy();

    puzzleContextMocks.totalPlacedPieces = 8;
    rerender(<Puzzle />);

    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("rect")?.style.fill).toBe(
      "var(--color-transition2)"
    );
  });
});
