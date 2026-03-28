// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const themeMocks = vi.hoisted(() => ({
  cycleDebugTheme: vi.fn(),
  currentLabel: "Original",
  getCurrentThemeLabel: vi.fn(() => themeMocks.currentLabel),
}));

vi.mock("../utility/toggleTheme", () => ({
  cycleDebugTheme: themeMocks.cycleDebugTheme,
  getCurrentThemeLabel: themeMocks.getCurrentThemeLabel,
}));

import { ThemeDebugToggle } from "./ThemeDebugToggle";

describe("ThemeDebugToggle", () => {
  beforeEach(() => {
    themeMocks.currentLabel = "Original";
    themeMocks.cycleDebugTheme.mockReset();
  });

  it("syncs the current theme label and cycles themes on click", () => {
    render(<ThemeDebugToggle />);

    const button = screen.getByRole("button", { name: /Theme: Original/i });
    expect(button).toBeTruthy();

    fireEvent.click(button);
    expect(themeMocks.cycleDebugTheme).toHaveBeenCalledTimes(1);

    themeMocks.currentLabel = "Wireframe";
    fireEvent(window, new Event("themechange"));

    expect(
      screen.getByRole("button", { name: /Theme: Wireframe/i })
    ).toBeTruthy();
  });
});
