// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createFramerMotionMock } from "../../test/mocks/framerMotion";

vi.mock("framer-motion", () =>
  createFramerMotionMock({
    hooks: {
      transformValue: (outputRange) => outputRange[1],
    },
  })
);

import { HeroFaceFrame } from "./HeroFaceFrame";

const imageLayout = {
  x: 90,
  y: 74.3,
  width: 180,
  assetWidth: 9,
  assetHeight: 6,
  src: "/portrait.avif",
  srcSet: "/portrait-1.avif 1w, /portrait-2.avif 2w",
  sizes: "100vw",
  alt: "Portrait",
};

describe("HeroFaceFrame", () => {
  it("renders the hero image with the derived layout styles and all mask layers", () => {
    const { container } = render(
      <HeroFaceFrame imageLayout={imageLayout} hideImage={false} />
    );

    const image = container.querySelector("img");

    expect(image).toBeTruthy();
    expect(image?.getAttribute("src")).toBe("/portrait.avif");
    expect(image?.getAttribute("srcset")).toBe(
      "/portrait-1.avif 1w, /portrait-2.avif 2w"
    );
    expect(image?.getAttribute("sizes")).toBe("100vw");
    expect(image?.getAttribute("alt")).toBe("Portrait");
    expect(image?.style.left).toBe("10%");
    expect(image?.style.top).toBe("10%");
    expect(image?.style.width).toBe("20%");
    expect(image?.style.aspectRatio).toBe("9 / 6");
    expect(container.querySelectorAll("mask").length).toBe(4);
    expect(container.querySelectorAll("g[transform]").length).toBe(1);
  });

  it("hides the hero image layer when requested", () => {
    const { container } = render(
      <HeroFaceFrame imageLayout={imageLayout} hideImage={true} />
    );

    const imageLayer = container.querySelector(".mix-blend-screen");

    expect(imageLayer).toBeTruthy();
    expect(imageLayer?.className).toContain("pointer-events-none");
    expect(imageLayer?.className).toContain("invisible");
  });
});
