// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PhonewaveTimerControls } from "./PhonewaveTimerControls";

describe("PhonewaveTimerControls", () => {
  it("renders the current status and formatted field values", () => {
    render(
      <PhonewaveTimerControls
        onBack={vi.fn()}
        onDigit={vi.fn()}
        onSelect={vi.fn()}
        onSubmit={vi.fn()}
        selectedField="years"
        shouldWiggle={true}
        statusColor="#00ff88"
        statusMode="just-right"
        values={{ years: "2", months: "" }}
      />
    );

    expect(screen.getByText("READY")).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: /years/i,
      }).textContent
    ).toContain("02");
    expect(
      screen.getByRole("button", {
        name: /months/i,
      }).textContent
    ).toContain("00");
  });

  it("routes keypad and control clicks to the provided handlers", () => {
    const onBack = vi.fn();
    const onDigit = vi.fn();
    const onSelect = vi.fn();
    const onSubmit = vi.fn();

    render(
      <PhonewaveTimerControls
        onBack={onBack}
        onDigit={onDigit}
        onSelect={onSelect}
        onSubmit={onSubmit}
        selectedField="years"
        shouldWiggle={false}
        statusColor="#00ff88"
        statusMode="not-enough"
        values={{ years: "", months: "" }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /months/i }));
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: /bksp/i }));
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    expect(onSelect).toHaveBeenCalledWith("months");
    expect(onDigit).toHaveBeenCalledWith("1");
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
