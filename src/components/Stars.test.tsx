// @vitest-environment jsdom

import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const starsMocks = vi.hoisted(() => ({
  controls: {
    set: vi.fn(),
    start: vi.fn(() => Promise.resolve()),
    stop: vi.fn(),
  },
  intersectionCallback: null as IntersectionObserverCallback | null,
  disconnect: vi.fn(),
  observe: vi.fn(),
}));

vi.mock("framer-motion", async () => {
  const { createFramerMotionMock } = await import("../test/mocks/framerMotion");

  return createFramerMotionMock({
    controls: starsMocks.controls,
  });
});

import { Stars } from "./Stars";

describe("Stars", () => {
  beforeEach(() => {
    starsMocks.controls.set.mockReset();
    starsMocks.controls.start.mockReset();
    starsMocks.controls.start.mockResolvedValue(undefined);
    starsMocks.controls.stop.mockReset();
    starsMocks.disconnect.mockReset();
    starsMocks.observe.mockReset();
    starsMocks.intersectionCallback = null;

    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          starsMocks.intersectionCallback = callback;
        }

        observe = starsMocks.observe;
        disconnect = starsMocks.disconnect;
        unobserve() {}
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders the off state and settles immediately when turned off", () => {
    const { container } = render(<Stars turnOff />);

    expect(starsMocks.controls.stop).toHaveBeenCalledTimes(1);
    expect(starsMocks.controls.set).toHaveBeenCalledWith("rest");
    expect(container.querySelector("#backgroundStarGlowSoft")).toBeNull();
    expect(container.querySelector("#path11")?.getAttribute("style")).toContain(
      "fill: rgb(0, 0, 0)"
    );
  });

  it("observes visibility and switches between twinkle and rest states", async () => {
    const { container, unmount } = render(<Stars />);

    expect(starsMocks.observe).toHaveBeenCalledTimes(1);
    expect(container.querySelector("#backgroundStarGlowSoft")).toBeTruthy();
    expect(container.querySelector("#backgroundStarGlowStrong")).toBeTruthy();

    act(() => {
      starsMocks.intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(starsMocks.controls.start).toHaveBeenCalledWith("twinkle");

    act(() => {
      starsMocks.intersectionCallback?.(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(starsMocks.controls.stop).toHaveBeenCalled();
    expect(starsMocks.controls.start).toHaveBeenCalledWith("rest");

    unmount();

    expect(starsMocks.disconnect).toHaveBeenCalledTimes(1);
  });

  it("skips observation and settles immediately when animation is disabled", () => {
    render(<Stars animate={false} />);

    expect(starsMocks.observe).not.toHaveBeenCalled();
    expect(starsMocks.controls.stop).toHaveBeenCalledTimes(1);
    expect(starsMocks.controls.set).toHaveBeenCalledWith("rest");
  });
});
