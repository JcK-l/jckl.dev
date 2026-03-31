// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("framer-motion", async () => {
  const { createAnimationControls, createMotionProxy } = await import(
    "../test/mocks/framerMotion"
  );
  const controls = createAnimationControls();

  return {
    motion: createMotionProxy(),
    useAnimation: () => controls,
  };
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
  } as DOMRect);

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
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const swipeViewport = ({
    endX,
    startX,
  }: {
    endX: number;
    startX: number;
  }) => {
    const viewport = screen.getByTestId("carousel-viewport");

    fireEvent.pointerDown(viewport, {
      button: 0,
      clientX: startX,
      clientY: 100,
      pointerId: 1,
      pointerType: "touch",
    });
    fireEvent.pointerMove(viewport, {
      clientX: endX,
      clientY: 104,
      pointerId: 1,
      pointerType: "touch",
    });
    fireEvent.pointerUp(viewport, {
      clientX: endX,
      clientY: 104,
      pointerId: 1,
      pointerType: "touch",
    });
  };

  it("loads the first reel frame eagerly and the rest lazily", () => {
    render(<Carousel imageFolder="/projects/tornado-vis" numberImages={4} />);

    const images = screen.getAllByAltText("Get a better browser!");

    expect(images[0]?.getAttribute("loading")).toBe("eager");
    expect(images[1]?.getAttribute("loading")).toBe("lazy");
  });

  it("serves responsive preview variants for known project folders", () => {
    render(<Carousel imageFolder="/tornado-vis" numberImages={4} />);

    const firstImage = screen.getAllByAltText("Get a better browser!")[0];

    expect(firstImage?.getAttribute("src")).toBe(
      "/generated/project-previews/tornado-vis/1-960.avif"
    );
    expect(firstImage?.getAttribute("srcset")).toContain(
      "/generated/project-previews/tornado-vis/1-640.avif 640w"
    );
    expect(firstImage?.getAttribute("srcset")).toContain(
      "/tornado-vis/1.avif 1500w"
    );
    expect(firstImage?.getAttribute("sizes")).toBe(
      "(min-width: 1280px) 56vw, (min-width: 768px) calc(100vw - 8rem), calc(100vw - 4.5rem)"
    );
  });

  it("swipes to the next frame without opening the modal", () => {
    render(<Carousel imageFolder="/projects/tornado-vis" numberImages={4} />);

    expect(screen.getByText("01 / 04")).toBeTruthy();

    swipeViewport({
      startX: 260,
      endX: 164,
    });

    expect(screen.getByText("02 / 04")).toBeTruthy();
    expect(screen.queryByAltText("Preview")).toBeNull();
  });

  it("suppresses the preview modal once a drag becomes intentional", () => {
    render(<Carousel imageFolder="/projects/tornado-vis" numberImages={4} />);

    const firstImage = screen.getAllByAltText("Get a better browser!")[0]
      ?.parentElement as HTMLElement;

    swipeViewport({
      startX: 220,
      endX: 200,
    });
    fireEvent.click(firstImage);

    expect(screen.queryByAltText("Preview")).toBeNull();
  });

  it("allows repeated swipes without remounting the reel", () => {
    render(<Carousel imageFolder="/projects/tornado-vis" numberImages={4} />);

    swipeViewport({
      startX: 260,
      endX: 164,
    });
    expect(screen.getByText("02 / 04")).toBeTruthy();

    swipeViewport({
      startX: 260,
      endX: 164,
    });
    expect(screen.getByText("03 / 04")).toBeTruthy();
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
        offsetX: -72,
        offsetY: 4,
        viewportWidth: 320,
        velocityX: -120,
      })
    ).toBe(1);
    expect(
      getCarouselSwipeDirection({
        offsetX: -24,
        offsetY: -88,
        viewportWidth: 320,
        velocityX: -90,
      })
    ).toBe(0);
  });
});
