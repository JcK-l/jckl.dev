// @vitest-environment jsdom

import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SeparatorIn } from "./SeparatorIn";

describe("SeparatorIn", () => {
  it("renders the separator without the middle layer by default", () => {
    const { container } = render(<SeparatorIn />);

    const root = container.firstElementChild as HTMLElement | null;

    expect(root).toBeTruthy();
    expect(root?.className).toContain("overflow-hidden");
    expect(screen.queryByText("Middle layer")).toBeNull();
    expect(container.querySelectorAll("path").length).toBe(4);
  });

  it("shows the middle layer wrapper and forwards its ref when provided", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <SeparatorIn
        ref={ref}
        middleLayer={<button type="button">Middle layer</button>}
      />
    );

    const root = container.firstElementChild as HTMLElement | null;

    expect(ref.current).toBe(root);
    expect(root?.className).toContain("overflow-visible");
    expect(screen.getByRole("button", { name: "Middle layer" })).toBeTruthy();
    expect(container.querySelector(".pointer-events-none")).toBeTruthy();
    expect(container.querySelector(".pointer-events-auto")).toBeTruthy();
  });
});
