// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const framerMotionMocks = vi.hoisted(() => ({
  controls: {
    set: vi.fn(),
    start: vi.fn(() => Promise.resolve()),
    stop: vi.fn(),
  },
}));

vi.mock("framer-motion", async () => {
  const { createFramerMotionMock } = await import("../../test/mocks/framerMotion");

  return createFramerMotionMock({
    controls: framerMotionMocks.controls,
    motion: {
      exposeDragControls: true,
    },
  });
});

import { Crt } from "./Crt";

const createBounds = ({
  height,
  left = 0,
  top = 0,
  width,
}: {
  height: number;
  left?: number;
  top?: number;
  width: number;
}) =>
  ({
    x: left,
    y: top,
    top,
    right: left + width,
    bottom: top + height,
    left,
    width,
    height,
    toJSON: () => ({}),
  }) as DOMRect;

const renderCrt = ({
  callBack = vi.fn(),
  isCrt = true,
}: {
  callBack?: () => void;
  isCrt?: boolean;
} = {}) => {
  const Harness = () => {
    const boundsRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={boundsRef} data-testid="bounds">
        <Crt
          isCrt={isCrt}
          snapPoint={{ x: 200, y: 180 }}
          callBack={callBack}
          dragConstraints={{ top: 0, left: 0, right: 400, bottom: 300 }}
          crtWidth={100}
          bounds={boundsRef}
        />
      </div>
    );
  };

  return {
    callBack,
    ...render(<Harness />),
  };
};

describe("Crt", () => {
  let currentCrtBounds: DOMRect;

  beforeEach(() => {
    currentCrtBounds = createBounds({
      width: 100,
      height: 75,
      left: 150,
      top: 142.5,
    });
    framerMotionMocks.controls.set.mockReset();
    framerMotionMocks.controls.start.mockReset();
    framerMotionMocks.controls.start.mockResolvedValue(undefined);
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
        unobserve() {}
      }
    );
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      })
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function () {
        const element = this as HTMLElement;

        if (element.dataset.testid === "bounds") {
          return createBounds({ width: 500, height: 400 });
        }

        if (element.className.includes("absolute z-40")) {
          return currentCrtBounds;
        }

        return createBounds({ width: 0, height: 0 });
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("does not render when the CRT is inactive", () => {
    renderCrt({ isCrt: false });

    expect(screen.queryByAltText("crt")).toBeNull();
  });

  it("initializes the CRT at its resting position when layout metrics are available", async () => {
    renderCrt();

    expect(screen.getByAltText("crt")).toBeTruthy();

    await waitFor(() => {
      expect(framerMotionMocks.controls.set).toHaveBeenCalledWith({
        x: 0,
        y: 250,
      });
    });
  });

  it("snaps into place, calls back, and hides after a successful drop", async () => {
    const { callBack } = renderCrt();

    fireEvent.click(screen.getByTestId("motion-drag-start"));
    fireEvent.click(screen.getByTestId("motion-drag"));
    fireEvent.click(screen.getByTestId("motion-drag-end"));

    await waitFor(() => {
      expect(framerMotionMocks.controls.start).toHaveBeenCalledWith(
        expect.objectContaining({
          x: 150,
          y: 142.5,
        })
      );
    });

    await waitFor(() => {
      expect(callBack).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByAltText("crt")).toBeNull();
  });

  it("returns to the resting height when released too far from the snap point", async () => {
    currentCrtBounds = createBounds({
      width: 100,
      height: 75,
      left: 0,
      top: 0,
    });
    const { callBack } = renderCrt();

    fireEvent.click(screen.getByTestId("motion-drag-start"));
    fireEvent.click(screen.getByTestId("motion-drag"));
    fireEvent.click(screen.getByTestId("motion-drag-end"));

    await waitFor(() => {
      expect(framerMotionMocks.controls.start).toHaveBeenCalledWith(
        expect.objectContaining({
          y: 250,
          transition: expect.objectContaining({
            type: "inertia",
          }),
        })
      );
    });

    expect(callBack).not.toHaveBeenCalled();
    expect(screen.getByAltText("crt")).toBeTruthy();
  });
});
