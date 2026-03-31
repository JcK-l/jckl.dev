// @vitest-environment jsdom

import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const carouselDragMock = vi.hoisted(() => ({
  info: {
    offset: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
  },
}));

vi.mock("framer-motion", async () => {
  const { createAnimationControls } = await import(
    "../test/mocks/framerMotion"
  );
  const controls = createAnimationControls();

  return {
    motion: {
      div: ({
        children,
        onDrag,
        onDragEnd,
        onDragStart,
        ...props
      }: {
        children?: ReactNode;
        onDrag?: (
          event: MouseEvent | TouchEvent | PointerEvent,
          info: {
            offset: { x: number; y: number };
            velocity: { x: number; y: number };
          }
        ) => void;
        onDragEnd?: (
          event: MouseEvent | TouchEvent | PointerEvent,
          info: {
            offset: { x: number; y: number };
            velocity: { x: number; y: number };
          }
        ) => void;
        onDragStart?: (
          event: MouseEvent | TouchEvent | PointerEvent,
          info: {
            offset: { x: number; y: number };
            velocity: { x: number; y: number };
          }
        ) => void;
        [key: string]: unknown;
      }) => (
        <div {...props}>
          {onDragStart ? (
            <button
              type="button"
              data-testid="carousel-drag-start"
              onClick={() =>
                onDragStart({} as MouseEvent, carouselDragMock.info)
              }
            >
              drag-start
            </button>
          ) : null}
          {onDrag ? (
            <button
              type="button"
              data-testid="carousel-drag"
              onClick={() => onDrag({} as MouseEvent, carouselDragMock.info)}
            >
              drag
            </button>
          ) : null}
          {onDragEnd ? (
            <button
              type="button"
              data-testid="carousel-drag-end"
              onClick={() => onDragEnd({} as MouseEvent, carouselDragMock.info)}
            >
              drag-end
            </button>
          ) : null}
          {children}
        </div>
      ),
    },
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
    carouselDragMock.info = {
      offset: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
    };

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
    carouselDragMock.info = {
      offset: { x: -96, y: 4 },
      velocity: { x: -140, y: 0 },
    };

    render(<Carousel imageFolder="/projects/tornado-vis" numberImages={4} />);

    expect(screen.getByText("01 / 04")).toBeTruthy();

    fireEvent.click(screen.getByTestId("carousel-drag-start"));
    fireEvent.click(screen.getByTestId("carousel-drag-end"));

    expect(screen.getByText("02 / 04")).toBeTruthy();
    expect(screen.queryByAltText("Preview")).toBeNull();
  });

  it("suppresses the preview modal once a drag becomes intentional", () => {
    carouselDragMock.info = {
      offset: { x: -20, y: 2 },
      velocity: { x: -40, y: 0 },
    };

    render(<Carousel imageFolder="/projects/tornado-vis" numberImages={4} />);

    const firstImage = screen.getAllByAltText("Get a better browser!")[0]
      ?.parentElement as HTMLElement;

    fireEvent.click(screen.getByTestId("carousel-drag-start"));
    fireEvent.click(screen.getByTestId("carousel-drag"));
    fireEvent.click(firstImage);

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
