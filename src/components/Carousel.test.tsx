// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Carousel } from "./Carousel";

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

    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: function ({ left = 0 }: { left?: number }) {
        this.scrollLeft = left;
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const scrollViewportTo = (scrollLeft: number) => {
    const viewport = screen.getByTestId("carousel-viewport") as HTMLDivElement;

    fireEvent.pointerDown(viewport, {
      button: 0,
      clientX: 260,
      clientY: 100,
      pointerId: 1,
      pointerType: "touch",
    });
    viewport.scrollLeft = scrollLeft;
    fireEvent.scroll(viewport);
    fireEvent.pointerUp(viewport, {
      clientX: 164,
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

  it("tracks the active frame from the native scroll position", () => {
    render(<Carousel imageFolder="/projects/tornado-vis" numberImages={4} />);

    expect(screen.getByText("01 / 04")).toBeTruthy();

    scrollViewportTo(320);

    expect(screen.getByText("02 / 04")).toBeTruthy();
    expect(screen.queryByAltText("Preview")).toBeNull();
  });

  it("suppresses the preview modal once scrolling becomes intentional", () => {
    render(<Carousel imageFolder="/projects/tornado-vis" numberImages={4} />);

    const firstImage = screen.getAllByAltText("Get a better browser!")[0]
      ?.parentElement as HTMLElement;

    scrollViewportTo(20);
    fireEvent.click(firstImage);

    expect(screen.queryByAltText("Preview")).toBeNull();
  });

  it("allows repeated scroll gestures without remounting the reel", () => {
    render(<Carousel imageFolder="/projects/tornado-vis" numberImages={4} />);

    scrollViewportTo(320);
    expect(screen.getByText("02 / 04")).toBeTruthy();

    scrollViewportTo(640);
    expect(screen.getByText("03 / 04")).toBeTruthy();
  });

  it("opens the modal on a plain tap", () => {
    render(<Carousel imageFolder="/projects/tornado-vis" numberImages={4} />);

    const firstImage = screen.getAllByAltText("Get a better browser!")[0]
      ?.parentElement as HTMLElement;

    fireEvent.click(firstImage);

    expect(screen.getByAltText("Preview")).toBeTruthy();
  });
});
