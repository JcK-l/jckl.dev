// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { $currentDate, $pastDate } from "../../stores/stringStore";
import {
  $phoneCurrentTimestamp,
  $phonePastTimestamp,
  $phoneResultMode,
  $phoneTimer,
  resetPhoneResult,
  setPhonewaveResult,
} from "../../stores/phoneStore";
import { $gameState, GameStateFlags, hasBit } from "../../stores/gameStateStore";

vi.mock("./PhonewaveScreen", () => ({
  PhonewaveScreen: ({
    lines,
  }: {
    lines: Array<{ label: string; value: string }>;
  }) => (
    <div data-testid="phonewave-screen">
      {lines.map((line) => (
        <div key={`${line.label}-${line.value}`}>{`[${line.label}] ${line.value}`}</div>
      ))}
    </div>
  ),
}));

import { Phonewave } from "./Phonewave";

describe("Phonewave", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 12, 0, 0, 0));
    $gameState.set(0);
    resetPhoneResult();
    $currentDate.set("");
    $pastDate.set("");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the idle guidance lines", () => {
    render(<Phonewave variant="idle" />);

    expect(
      screen.getByText("[boot] phone-linked microwave awaiting input")
    ).toBeTruthy();
    expect(screen.getByText("[window] MAY 2023")).toBeTruthy();
    expect(screen.getByText("[status] failed connection")).toBeTruthy();
  });

  it("submitting a successful offset stores the result and unlocks connection", () => {
    render(<Phonewave variant="idle" />);

    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: /months/i }));
    fireEvent.click(screen.getByRole("button", { name: "8" }));
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    expect($phoneResultMode.get()).toBe("connection");
    expect($phoneTimer.get()).toBe("02Y 08M");
    expect($phoneCurrentTimestamp.get()).toBe(
      new Date(2026, 0, 15, 12, 0, 0, 0).getTime()
    );
    expect($phonePastTimestamp.get()).toBe(
      new Date(2023, 4, 15, 12, 0, 0, 0).getTime()
    );
    expect(hasBit($gameState.get(), GameStateFlags.FLAG_CONNECTION)).toBe(true);
    expect($currentDate.get()).not.toBe("");
    expect($pastDate.get()).not.toBe("");
  });

  it("renders the correction branch for an out-of-window result", () => {
    setPhonewaveResult(
      "02Y 07M",
      new Date(2026, 0, 15, 12, 0, 0, 0).getTime(),
      new Date(2023, 5, 15, 12, 0, 0, 0).getTime()
    );

    render(<Phonewave variant="result" />);

    expect(screen.getByText("[status] outside target window")).toBeTruthy();
    expect(
      screen.getByText("[correction] offset not far enough")
    ).toBeTruthy();
  });
});
