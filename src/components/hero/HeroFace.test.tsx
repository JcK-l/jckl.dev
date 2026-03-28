// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { $endingState } from "../../stores/endingStore";
import { createDefaultEndingState } from "../../test/factories";

vi.mock("./HeroFaceFrame", () => ({
  HeroFaceFrame: ({
    hideImage,
    imageLayout,
  }: {
    hideImage: boolean;
    imageLayout: { alt: string; src: string };
  }) => (
    <div
      data-testid="hero-face-frame"
      data-alt={imageLayout.alt}
      data-hide-image={String(hideImage)}
      data-src={imageLayout.src}
    />
  ),
}));

import { HeroFace } from "./HeroFace";

describe("HeroFace", () => {
  beforeEach(() => {
    $endingState.set(createDefaultEndingState());
  });

  it("uses the default portrait layout when no ending is selected", () => {
    render(<HeroFace />);

    const frame = screen.getByTestId("hero-face-frame");

    expect(frame.getAttribute("data-src")).toBe("/MeTransparent-720.avif");
    expect(frame.getAttribute("data-alt")).toBe("Portrait of Joshua");
    expect(frame.getAttribute("data-hide-image")).toBe("false");
  });

  it("switches to the neutral silhouette and positive phone layouts when those endings are selected", () => {
    $endingState.set(
      createDefaultEndingState({
        isActive: true,
        selectedSentiment: "neutral",
      })
    );
    const { rerender } = render(<HeroFace />);

    expect(screen.getByTestId("hero-face-frame").getAttribute("data-src")).toBe(
      "/jTransparent.avif"
    );
    expect(screen.getByTestId("hero-face-frame").getAttribute("data-alt")).toBe(
      "Joshua silhouette"
    );

    $endingState.set(
      createDefaultEndingState({
        isActive: true,
        selectedSentiment: "positive",
      })
    );
    rerender(<HeroFace />);

    expect(screen.getByTestId("hero-face-frame").getAttribute("data-src")).toBe(
      "/classicPhone.avif"
    );
    expect(screen.getByTestId("hero-face-frame").getAttribute("data-alt")).toBe(
      "Classic phone"
    );
  });

  it("keeps the default layout but hides the image for the negative ending", () => {
    $endingState.set(
      createDefaultEndingState({
        isActive: true,
        selectedSentiment: "negative",
      })
    );

    render(<HeroFace />);

    const frame = screen.getByTestId("hero-face-frame");

    expect(frame.getAttribute("data-src")).toBe("/MeTransparent-720.avif");
    expect(frame.getAttribute("data-hide-image")).toBe("true");
  });
});
