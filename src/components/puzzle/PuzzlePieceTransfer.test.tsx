// @vitest-environment jsdom

import { act, render } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { $puzzlePieceSize } from "../../stores/puzzleLayoutStore";

const pieceImageMocks = vi.hoisted(() => ({
  preloadPieceImages: vi.fn(() => Promise.resolve()),
}));

vi.mock("framer-motion", async () => {
  const { createMotionProxy } = await import("../../test/mocks/framerMotion");

  return {
    motion: createMotionProxy(),
  };
});

vi.mock("../../utility/pieceImages", () => ({
  preloadPieceImages: pieceImageMocks.preloadPieceImages,
}));

import { PuzzlePieceTransfer } from "./PuzzlePieceTransfer";

const createBounds = (width = 800, height = 600) =>
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

const setReducedMotionPreference = (matches: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
};

describe("PuzzlePieceTransfer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    $puzzlePieceSize.set(0);
    pieceImageMocks.preloadPieceImages.mockReset();
    pieceImageMocks.preloadPieceImages.mockResolvedValue(undefined);

    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        callback(0);

        return 1;
      })
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
      createBounds()
    );
  });

  afterEach(() => {
    $puzzlePieceSize.set(0);
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("completes immediately when reduced motion is preferred", async () => {
    setReducedMotionPreference(true);
    const onStart = vi.fn();
    const onComplete = vi.fn();
    const { container } = render(
      <PuzzlePieceTransfer
        pieceIds={[1, 2]}
        sourceRef={createRef<Element>()}
        triggerKey={1}
        onStart={onStart}
        onComplete={onComplete}
      />
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(pieceImageMocks.preloadPieceImages).not.toHaveBeenCalled();
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll("img")).toHaveLength(0);
  });

  it("preloads pieces, shows the burst, and completes after the transfer duration", async () => {
    setReducedMotionPreference(false);
    $puzzlePieceSize.set(96);
    const onStart = vi.fn();
    const onComplete = vi.fn();
    const { container } = render(
      <PuzzlePieceTransfer
        pieceIds={[1, 2]}
        sourcePoint={{ x: 240, y: 220 }}
        sourceRef={createRef<Element>()}
        triggerKey={1}
        onStart={onStart}
        onComplete={onComplete}
      />
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(pieceImageMocks.preloadPieceImages).toHaveBeenCalledTimes(1);
    expect(pieceImageMocks.preloadPieceImages).toHaveBeenCalledWith([
      "/PuzzlePieces/1.avif",
      "/PuzzlePieces/2.avif",
    ]);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();

    const pieces = container.querySelectorAll("img");

    expect(pieces).toHaveLength(2);
    expect(pieces[0]?.getAttribute("src")).toBe("/PuzzlePieces/1.avif");
    expect((pieces[0] as HTMLImageElement | undefined)?.style.width).toBe(
      "96px"
    );

    act(() => {
      vi.advanceTimersByTime(3179);
    });

    expect(onComplete).not.toHaveBeenCalled();
    expect(container.querySelectorAll("img")).toHaveLength(2);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll("img")).toHaveLength(0);
  });

  it("falls back to an immediate completion when no source point can be resolved", async () => {
    setReducedMotionPreference(false);
    const onStart = vi.fn();
    const onComplete = vi.fn();
    const { container } = render(
      <PuzzlePieceTransfer
        pieceIds={[1]}
        sourceRef={createRef<Element>()}
        triggerKey={1}
        onStart={onStart}
        onComplete={onComplete}
      />
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(pieceImageMocks.preloadPieceImages).toHaveBeenCalledWith([
      "/PuzzlePieces/1.avif",
    ]);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll("img")).toHaveLength(0);
  });
});
