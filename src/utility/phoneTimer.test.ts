import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildPastDate,
  formatTimerSummary,
  getNextFieldValue,
  getTimerStatus,
} from "./phoneTimer";

describe("phoneTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps appending digits for years until two digits are entered", () => {
    expect(getNextFieldValue("years", "", "2")).toBe("2");
    expect(getNextFieldValue("years", "2", "5")).toBe("25");
    expect(getNextFieldValue("years", "25", "9")).toBe("25");
  });

  it("clamps months to 11 when the second digit would overshoot", () => {
    expect(getNextFieldValue("months", "1", "9")).toBe("11");
  });

  it("builds a past date by subtracting the entered offset", () => {
    const currentDate = new Date(2026, 5, 15, 12, 0, 0, 0);
    const pastDate = buildPastDate({ years: "02", months: "01" }, currentDate);

    expect(pastDate.getFullYear()).toBe(2024);
    expect(pastDate.getMonth()).toBe(4);
    expect(pastDate.getDate()).toBe(15);
  });

  it("formats the timer summary with two-digit fields", () => {
    expect(formatTimerSummary({ years: "2", months: "" })).toBe("02Y 00M");
  });

  it("marks offsets after the target window as not enough", () => {
    vi.setSystemTime(new Date(2026, 0, 15, 12, 0, 0, 0));

    expect(getTimerStatus({ years: "02", months: "07" }).mode).toBe(
      "not-enough"
    );
  });

  it("marks offsets before the target window as too much", () => {
    vi.setSystemTime(new Date(2026, 0, 15, 12, 0, 0, 0));

    expect(getTimerStatus({ years: "02", months: "09" }).mode).toBe(
      "too-much"
    );
  });

  it("marks offsets inside the target window as just right", () => {
    vi.setSystemTime(new Date(2026, 0, 15, 12, 0, 0, 0));

    expect(getTimerStatus({ years: "02", months: "08" }).mode).toBe(
      "just-right"
    );
  });
});
