// @vitest-environment jsdom

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const puzzlePieceMocks = vi.hoisted(() => ({
  controls: {
    set: vi.fn(),
    start: vi.fn(() => Promise.resolve()),
    stop: vi.fn(),
  },
  dragControls: {
    start: vi.fn(),
  },
  setLastPiece: vi.fn(),
  setTotalPlacedPieces: vi.fn(),
}));

vi.mock("framer-motion", async () => {
  const { createFramerMotionMock } = await import("../../test/mocks/framerMotion");

  return createFramerMotionMock({
    controls: puzzlePieceMocks.controls,
    dragControls: puzzlePieceMocks.dragControls,
    motion: {
      exposeDragControls: true,
    },
  });
});

vi.mock("../../hooks/useDataContext", () => ({
  usePuzzleContext: () => ({
    lastPiece: 0,
    setLastPiece: puzzlePieceMocks.setLastPiece,
    totalPlacedPieces: 0,
    setTotalPlacedPieces: puzzlePieceMocks.setTotalPlacedPieces,
  }),
}));

vi.mock("../../utility/audioContext", () => ({
  playCachedAudio: vi.fn(() => Promise.resolve()),
  preloadAudioBuffers: vi.fn(() => Promise.resolve()),
  resumeAudioContext: vi.fn(() => Promise.resolve()),
}));

import {
  playCachedAudio,
  preloadAudioBuffers,
  resumeAudioContext,
} from "../../utility/audioContext";
import { PuzzlePiece } from "./PuzzlePiece";

const boundsRect = {
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  right: 300,
  bottom: 200,
  width: 300,
  height: 200,
  toJSON: () => ({}),
} as DOMRect;

let currentPieceRect = {
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  right: 80,
  bottom: 60,
  width: 80,
  height: 60,
  toJSON: () => ({}),
} as DOMRect;

const renderPuzzlePiece = () => {
  const Harness = () => {
    const boundsRef = useRef<SVGSVGElement>(null);

    return (
      <div>
        <svg ref={boundsRef} data-testid="bounds" />
        <div id="p1" style={{ opacity: 0 }} />
        <PuzzlePiece
          id={1}
          path="/PuzzlePieces/test-piece.avif"
          puzzlebounds={boundsRef}
          pieceSize={{ width: 80, height: 60 }}
          pieceCoords="0,0,80,0,80,60,0,60"
          snapPoint={{ x: 130, y: 100 }}
          startPoint={{ x: 200, y: 150 }}
          dragConstraints={{ top: 0, left: 0, right: 220, bottom: 140 }}
        />
      </div>
    );
  };

  return render(<Harness />);
};

describe("PuzzlePiece", () => {
  beforeEach(() => {
    puzzlePieceMocks.controls.set.mockReset();
    puzzlePieceMocks.controls.start.mockReset();
    puzzlePieceMocks.controls.start.mockResolvedValue(undefined);
    puzzlePieceMocks.dragControls.start.mockReset();
    puzzlePieceMocks.setLastPiece.mockReset();
    puzzlePieceMocks.setTotalPlacedPieces.mockReset();
    vi.mocked(playCachedAudio).mockClear();
    vi.mocked(preloadAudioBuffers).mockClear();
    vi.mocked(resumeAudioContext).mockClear();
    vi.spyOn(Math, "random").mockReturnValue(0);
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      })
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      function () {
        const element = this as Element;

        if ((element as HTMLElement).dataset.testid === "bounds") {
          return boundsRect;
        }

        if (
          element instanceof HTMLDivElement &&
          element.className.includes("pointer-events-none absolute select-none")
        ) {
          return currentPieceRect;
        }

        return {
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 0,
          toJSON: () => ({}),
        } as DOMRect;
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("preloads sounds, animates into the start position, and clamps back into bounds on resize", async () => {
    currentPieceRect = {
      ...currentPieceRect,
      left: 120,
      top: 80,
      right: 200,
      bottom: 140,
    };

    renderPuzzlePiece();

    expect(preloadAudioBuffers).toHaveBeenCalledWith([
      "/PuzzlePieces/sounds/1.mp3",
      "/PuzzlePieces/sounds/2.mp3",
      "/PuzzlePieces/sounds/3.mp3",
      "/PuzzlePieces/sounds/4.mp3",
      "/PuzzlePieces/sounds/5.mp3",
    ]);

    await waitFor(() => {
      expect(puzzlePieceMocks.controls.set).toHaveBeenCalledWith({
        x: 0,
        y: 0,
      });
      expect(puzzlePieceMocks.controls.start).toHaveBeenCalledWith(
        expect.objectContaining({
          x: 160,
          y: 120,
          transition: expect.objectContaining({
            delay: 0.25,
            type: "spring",
          }),
        })
      );
    });

    puzzlePieceMocks.controls.start.mockClear();
    currentPieceRect = {
      ...currentPieceRect,
      left: 260,
      top: 170,
      right: 340,
      bottom: 230,
    };

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    await waitFor(() => {
      expect(puzzlePieceMocks.controls.start).toHaveBeenCalledWith({
        x: 220,
        y: 140,
        transition: {
          duration: 0.2,
        },
      });
    });
  });

  it("starts dragging on pointer down and snaps into place when released near the snap point", async () => {
    currentPieceRect = {
      ...currentPieceRect,
      left: 90,
      top: 70,
      right: 170,
      bottom: 130,
    };

    const { container } = renderPuzzlePiece();

    await waitFor(() => {
      expect(puzzlePieceMocks.controls.start).toHaveBeenCalled();
    });

    puzzlePieceMocks.controls.start.mockClear();

    const interactivePiece = container.querySelector(
      ".pointer-events-auto.relative"
    ) as HTMLElement | null;

    expect(interactivePiece).toBeTruthy();

    fireEvent.pointerDown(interactivePiece as HTMLElement);
    expect(puzzlePieceMocks.dragControls.start).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("motion-drag-start"));
    expect(resumeAudioContext).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("motion-drag"));
    fireEvent.click(screen.getByTestId("motion-drag-end"));

    await waitFor(() => {
      expect(puzzlePieceMocks.controls.start).toHaveBeenCalledWith(
        expect.objectContaining({
          x: 90,
          y: 70,
          transition: expect.objectContaining({
            type: "spring",
          }),
        })
      );
    });

    await waitFor(() => {
      expect(puzzlePieceMocks.setLastPiece).toHaveBeenCalledWith(1);
      expect(puzzlePieceMocks.setTotalPlacedPieces).toHaveBeenCalledWith(
        expect.any(Function)
      );
      expect(document.getElementById("p1")?.style.opacity).toBe("1");
      expect(container.querySelector('img[src="/PuzzlePieces/test-piece.avif"]')).toBeNull();
    });

    const updateCount = puzzlePieceMocks.setTotalPlacedPieces.mock.calls[0]?.[0] as
      | ((value: number) => number)
      | undefined;

    expect(updateCount?.(0)).toBe(1);
    expect(playCachedAudio).toHaveBeenCalledWith("/PuzzlePieces/sounds/1.mp3");
  });

  it("stays draggable when released outside the snap threshold", async () => {
    currentPieceRect = {
      ...currentPieceRect,
      left: 0,
      top: 0,
      right: 80,
      bottom: 60,
    };

    const { container } = renderPuzzlePiece();

    await waitFor(() => {
      expect(puzzlePieceMocks.controls.start).toHaveBeenCalled();
    });

    puzzlePieceMocks.controls.start.mockClear();

    fireEvent.click(screen.getByTestId("motion-drag-start"));
    fireEvent.click(screen.getByTestId("motion-drag-end"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(resumeAudioContext).toHaveBeenCalledTimes(1);
    expect(puzzlePieceMocks.controls.start).not.toHaveBeenCalled();
    expect(puzzlePieceMocks.setLastPiece).not.toHaveBeenCalled();
    expect(puzzlePieceMocks.setTotalPlacedPieces).not.toHaveBeenCalled();
    expect(document.getElementById("p1")?.style.opacity).toBe("0");
    expect(
      container.querySelector('img[src="/PuzzlePieces/test-piece.avif"]')
    ).toBeTruthy();
  });

  it("scales the shadow down for smaller puzzle pieces", () => {
    const { container } = renderPuzzlePiece();
    const shadowPolygons = container.querySelectorAll("polygon");

    expect(shadowPolygons[0]?.getAttribute("transform")).toBe("translate(0 7.2)");
    expect(shadowPolygons[1]?.getAttribute("transform")).toBe("translate(0 2.88)");
    expect(shadowPolygons[0]?.getAttribute("style")).toContain("blur(5.04px)");
    expect(shadowPolygons[1]?.getAttribute("style")).toContain("blur(1.73px)");
  });
});
