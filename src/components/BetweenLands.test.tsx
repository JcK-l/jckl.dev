// @vitest-environment jsdom

import { act, render, screen, waitFor } from "@testing-library/react";
import { forwardRef, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { $gameState, GameStateFlags } from "../stores/gameStateStore";

vi.mock("framer-motion", async () => {
  const { createFramerMotionMock } = await import("../test/mocks/framerMotion");

  return createFramerMotionMock({
    hooks: {
      scrollYProgress: 0.5,
    },
  });
});

vi.mock("./appliance/Crt", () => ({
  Crt: ({
    bounds,
    callBack,
    crtWidth,
    dragConstraints,
    isCrt,
    snapPoint,
  }: {
    bounds: React.RefObject<HTMLElement>;
    callBack: () => void;
    crtWidth: number;
    dragConstraints: { top: number; left: number; right: number; bottom: number };
    isCrt: boolean;
    snapPoint: { x: number; y: number };
  }) => (
    <button
      type="button"
      data-testid="crt"
      data-bottom={String(dragConstraints.bottom)}
      data-has-bounds={String(Boolean(bounds.current))}
      data-is-crt={String(isCrt)}
      data-right={String(dragConstraints.right)}
      data-snap={`${snapPoint.x},${snapPoint.y}`}
      data-width={String(crtWidth)}
      onClick={callBack}
    >
      crt
    </button>
  ),
}));

vi.mock("./SeparatorIn", () => ({
  SeparatorIn: forwardRef(function MockSeparatorIn(
    { middleLayer }: { middleLayer?: ReactNode },
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    return (
      <div ref={ref} data-testid="separator-in">
        {middleLayer}
      </div>
    );
  }),
}));

vi.mock("./SeparatorOut", () => ({
  SeparatorOut: forwardRef(function MockSeparatorOut(
    {
      crtScreenOpacity,
      isCrt,
      middleLayer,
      underLayer,
    }: {
      crtScreenOpacity?: number;
      isCrt: boolean;
      middleLayer?: ReactNode;
      underLayer?: ReactNode;
    },
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    return (
      <div
        ref={ref}
        data-testid="separator-out"
        data-is-crt={String(isCrt)}
        data-opacity={String(crtScreenOpacity ?? "")}
      >
        {underLayer}
        {middleLayer}
      </div>
    );
  }),
}));

import { BetweenLands, getBetweenLandsParallaxDistance } from "./BetweenLands";

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

describe("BetweenLands", () => {
  beforeEach(() => {
    $gameState.set(0);
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1000,
    });
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

        if (element.dataset.testid === "separator-in") {
          return createBounds({ width: 1000, height: 120 });
        }

        if (element.dataset.testid === "separator-out") {
          return createBounds({ width: 1000, height: 80 });
        }

        if (element.className.includes("bg-bgColor")) {
          return createBounds({ width: 1000, height: 400 });
        }

        return createBounds({ width: 0, height: 0 });
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("uses a zero shift for foreground content and disables the CRT after the hand flag is set", async () => {
    $gameState.set(1 << GameStateFlags.FLAG_LEND_A_HAND);
    const renderItem = vi.fn((shift: { get: () => string }) => (
      <div data-testid="shift">{shift.get()}</div>
    ));

    render(
      <BetweenLands
        isBackground={false}
        isCrt
        renderItem={renderItem}
        separatorInMiddleLayer={<span>in-layer</span>}
        separatorOutMiddleLayer={<span>middle-layer</span>}
        separatorOutUnderLayer={<span>under-layer</span>}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("crt").dataset.width).toBe("200");
    });

    expect(screen.getByTestId("shift").textContent).toBe("0px");
    expect(screen.getByTestId("crt").dataset.isCrt).toBe("false");
    expect(screen.getByText("in-layer")).toBeTruthy();
    expect(screen.getByText("middle-layer")).toBeTruthy();
    expect(screen.getByText("under-layer")).toBeTruthy();
    expect(renderItem).toHaveBeenCalled();
  });

  it("derives CRT sizing and the parallax shift from the measured layout", async () => {
    const crtCallback = vi.fn();
    const renderItem = vi.fn((shift: { get: () => string }) => (
      <div data-testid="shift">{shift.get()}</div>
    ));

    render(
      <BetweenLands
        isBackground
        isCrt
        crtCallback={crtCallback}
        renderItem={renderItem}
        separatorOutCrtScreenOpacity={0.45}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("crt").dataset.snap).toBe("640,700");
    });

    expect(screen.getByTestId("crt").dataset.isCrt).toBe("true");
    expect(screen.getByTestId("crt").dataset.width).toBe("200");
    expect(screen.getByTestId("crt").dataset.right).toBe("800");
    expect(screen.getByTestId("crt").dataset.bottom).toBe("200");
    expect(screen.getByTestId("shift").textContent).toBe("-60px");
    expect(screen.getByTestId("separator-out").dataset.opacity).toBe("0.45");

    act(() => {
      screen.getByTestId("crt").click();
    });

    expect(crtCallback).toHaveBeenCalledTimes(1);
  });

  it("reduces the parallax range on mobile widths", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 390,
    });

    const renderItem = vi.fn((shift: { get: () => string }) => (
      <div data-testid="shift">{shift.get()}</div>
    ));

    render(<BetweenLands isBackground isCrt={false} renderItem={renderItem} />);

    await waitFor(() => {
      expect(screen.getByTestId("crt").dataset.width).toBe("78");
    });

    expect(screen.getByTestId("shift").textContent).toBe("-33.6px");
    expect(renderItem).toHaveBeenCalled();
  });

  it("keeps the stronger desktop parallax distance", () => {
    expect(getBetweenLandsParallaxDistance(120, 390)).toBe(33.6);
    expect(getBetweenLandsParallaxDistance(120, 1000)).toBe(60);
  });
});
