// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("framer-motion", async () => {
  const {
    createAnimationControls,
    createFramerMotionMock,
  } = await import("../test/mocks/framerMotion");

  return createFramerMotionMock({
    controls: createAnimationControls(),
  });
});

import { Carousel, getCarouselSwipeDirection } from "./Carousel";

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

describe("Carousel", () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function () {
        if (
          this instanceof HTMLElement &&
          this.dataset.testid === "carousel-viewport"
        ) {
          return createBounds({ width: 320, height: 200 });
        }

        return createBounds({ width: 0, height: 0 });
      },
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads the first reel frame eagerly and the rest lazily", () => {
    render(<Carousel imageFolder="/projects/tornado-vis" numberImages={4} />);

    const images = screen.getAllByAltText("Get a better browser!");

    expect(images[0]?.getAttribute("loading")).toBe("eager");
    expect(images[1]?.getAttribute("loading")).toBe("lazy");
  });

  it("swipes to the next frame without opening the modal", () => {
    render(<Carousel imageFolder="/projects/tornado-vis" numberImages={4} />);

    const viewport = screen.getByTestId("carousel-viewport");

    expect(screen.getByText("01 / 04")).toBeTruthy();

    fireEvent.touchStart(viewport, {
      touches: [{ clientX: 278, clientY: 120 }],
    });
    fireEvent.touchMove(viewport, {
      touches: [{ clientX: 182, clientY: 124 }],
    });
    fireEvent.touchEnd(viewport, {
      changedTouches: [{ clientX: 164, clientY: 126 }],
    });

    expect(screen.getByText("02 / 04")).toBeTruthy();

    expect(screen.queryByAltText("Preview")).toBeNull();
  });

  it("opens the modal on a plain tap", () => {
    render(<Carousel imageFolder="/projects/tornado-vis" numberImages={4} />);

    const firstImage = screen.getAllByAltText("Get a better browser!")[0]
      ?.parentElement as HTMLElement;

    fireEvent.click(firstImage);

    expect(screen.getByAltText("Preview")).toBeTruthy();
  });

  it("ignores mostly vertical drags when deciding whether to change frames", () => {
    expect(
      getCarouselSwipeDirection({
        touchStart: { x: 260, y: 180 },
        touchEnd: { x: 188, y: 176 },
        viewportWidth: 320,
      }),
    ).toBe(1);
    expect(
      getCarouselSwipeDirection({
        touchStart: { x: 260, y: 180 },
        touchEnd: { x: 228, y: 92 },
        viewportWidth: 320,
      }),
    ).toBe(0);
  });
});
