// @vitest-environment jsdom

import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TypingText } from "./TypingText";

describe("TypingText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("types characters over time and calls onComplete after the final delay", () => {
    const onComplete = vi.fn();

    const { container } = render(
      <TypingText
        text="Hi"
        className="terminal-copy"
        onComplete={onComplete}
        typingDelay={10}
        onCompleteDelay={20}
      />
    );

    expect(container.querySelector("p")?.textContent).toBe("");

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(screen.getByText("H")).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(screen.getByText("Hi")).toBeTruthy();
    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("resets when the text changes and supports jittered delays", () => {
    const onComplete = vi.fn();
    vi.spyOn(Math, "random").mockReturnValue(1);

    const { container, rerender } = render(
      <TypingText
        text="AB"
        onComplete={onComplete}
        typingDelay={10}
        typingDelayJitter={5}
        onCompleteDelay={0}
      />
    );

    act(() => {
      vi.advanceTimersByTime(15);
    });
    expect(screen.getByText("A")).toBeTruthy();

    rerender(
      <TypingText
        text="Z"
        onComplete={onComplete}
        typingDelay={10}
        typingDelayJitter={5}
        onCompleteDelay={0}
      />
    );

    expect(container.querySelector("p")?.textContent).toBe("");

    act(() => {
      vi.advanceTimersByTime(15);
    });
    expect(screen.getByText("Z")).toBeTruthy();
  });

  it("renders immediately when reduced motion is preferred", () => {
    const onComplete = vi.fn();

    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      }))
    );

    render(
      <TypingText
        text="Reduced motion"
        onComplete={onComplete}
        typingDelay={10}
        onCompleteDelay={20}
      />
    );

    expect(screen.getByText("Reduced motion")).toBeTruthy();

    act(() => {
      vi.runAllTimers();
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
