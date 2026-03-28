// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { $endingState } from "../../stores/endingStore";
import { createDefaultEndingState } from "../../test/factories";

vi.mock("../hero/HeroFace", () => ({
  HeroFace: () => <div data-testid="hero-face" />,
}));

import Hero from "./Hero";

describe("Hero", () => {
  beforeEach(() => {
    $endingState.set(createDefaultEndingState());
  });

  it("renders the default hero copy and scroll link", () => {
    render(<Hero />);

    expect(screen.getByTestId("hero-face")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "I'm Joshua" })).toBeTruthy();
    expect(screen.getByText(/Welcome to my corner of the web/i)).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Scroll to the next section" }).getAttribute(
        "href"
      )
    ).toBe("#starConstellation");
  });

  it("adds the positive-ending flourish to the heading", () => {
    $endingState.set(
      createDefaultEndingState({
        isActive: true,
        selectedSentiment: "positive",
      })
    );

    render(<Hero />);

    expect(screen.getByRole("heading", { name: "I'm Joshua!" })).toBeTruthy();
  });

  it("hides the hero copy panel during the negative ending", () => {
    $endingState.set(
      createDefaultEndingState({
        isActive: true,
        selectedSentiment: "negative",
      })
    );

    const { container } = render(<Hero />);
    const heading = screen.getByRole("heading", { name: "I'm Joshua" });
    const contentPanel = heading.parentElement as HTMLElement | null;

    expect(container.firstElementChild).toBeTruthy();
    expect(contentPanel).toBeTruthy();
    expect(contentPanel?.className).toContain("pointer-events-none");
    expect(contentPanel?.className).toContain("invisible");
  });
});
