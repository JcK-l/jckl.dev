// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { $endingState } from "../stores/endingStore";
import { createDefaultEndingState } from "../test/factories";
import { Footer } from "./Footer";

describe("Footer", () => {
  beforeEach(() => {
    $endingState.set(createDefaultEndingState());
  });

  it("shows the heart in the default footer copy", () => {
    const { container } = render(<Footer />);

    const githubLink = screen.getByRole("link", { name: "" });

    expect(githubLink.getAttribute("href")).toBe("https://github.com/JcK-l");
    expect(githubLink.parentElement?.className).toContain("hidden");
    expect(container.textContent).toContain("Coded");
    expect(container.textContent).toContain("with");
    expect(container.textContent).toContain("Joshua Lowe");
    expect(
      container.querySelectorAll('path[stroke="var(--color-red)"]').length
    ).toBe(1);
  });

  it("removes the heart when the negative ending is active", () => {
    $endingState.set(
      createDefaultEndingState({
        isActive: true,
        selectedSentiment: "negative",
      })
    );

    const { container } = render(<Footer />);

    expect(container.textContent).toContain("Coded");
    expect(container.textContent).not.toContain("with");
    expect(
      container.querySelectorAll('path[stroke="var(--color-red)"]').length
    ).toBe(0);
  });
});
