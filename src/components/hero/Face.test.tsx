// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./HeroFace", () => ({
  HeroFace: () => <div data-testid="hero-face-reexport" />,
}));

import { Face } from "./Face";

describe("Face", () => {
  it("re-exports HeroFace", () => {
    render(<Face />);

    expect(screen.getByTestId("hero-face-reexport")).toBeTruthy();
  });
});
