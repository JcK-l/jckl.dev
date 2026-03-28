// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../TypingText", () => ({
  TypingText: ({
    className,
    onComplete,
    onCompleteDelay,
    text,
    typingDelay,
    typingDelayJitter,
  }: {
    className?: string;
    onComplete: () => void;
    onCompleteDelay?: number;
    text: string;
    typingDelay?: number;
    typingDelayJitter?: number;
  }) => (
    <button
      type="button"
      data-testid="typing-text"
      data-class-name={className}
      data-on-complete-delay={String(onCompleteDelay)}
      data-typing-delay={String(typingDelay)}
      data-typing-delay-jitter={String(typingDelayJitter)}
      onClick={onComplete}
    >
      {text}
    </button>
  ),
}));

import { PhonewaveScreen, type PhonewaveLine } from "./PhonewaveScreen";

const lines: PhonewaveLine[] = [
  { label: "boot", value: "signal online" },
  { label: "scan", tone: "success", value: "window verified" },
  { label: "result", tone: "failure", value: "line rejected" },
];

describe("PhonewaveScreen", () => {
  it("renders all lines statically when animation is disabled", () => {
    render(
      <PhonewaveScreen
        animate={false}
        currentStep={0}
        lines={lines}
        onStepComplete={vi.fn()}
      />
    );

    expect(screen.getByText("[boot] signal online")).toBeTruthy();
    expect(screen.getByText("[scan] window verified")).toBeTruthy();
    expect(screen.getByText("[result] line rejected")).toBeTruthy();
    expect(screen.queryByTestId("typing-text")).toBeNull();
    expect(screen.getByText("event log")).toBeTruthy();
  });

  it("animates the boot line with the longer settle delay and advances to the next step", () => {
    const onStepComplete = vi.fn();

    render(
      <PhonewaveScreen
        animate={true}
        currentStep={0}
        lines={lines}
        onStepComplete={onStepComplete}
      />
    );

    const typingLine = screen.getByTestId("typing-text");

    expect(typingLine.textContent).toBe("[boot] signal online");
    expect(typingLine.getAttribute("data-on-complete-delay")).toBe("520");
    expect(typingLine.getAttribute("data-typing-delay")).toBe("16");
    expect(typingLine.getAttribute("data-typing-delay-jitter")).toBe("3");
    expect(screen.queryByText("[scan] window verified")).toBeNull();

    fireEvent.click(typingLine);

    expect(onStepComplete).toHaveBeenCalledWith(1);
  });

  it("renders earlier lines as static and completes the sequence on the last animated step", () => {
    const onStepComplete = vi.fn();

    render(
      <PhonewaveScreen
        animate={true}
        currentStep={2}
        lines={lines}
        onStepComplete={onStepComplete}
      />
    );

    expect(screen.getByText("[boot] signal online")).toBeTruthy();
    expect(screen.getByText("[scan] window verified")).toBeTruthy();

    const typingLine = screen.getByTestId("typing-text");
    expect(typingLine.textContent).toBe("[result] line rejected");
    expect(typingLine.getAttribute("data-on-complete-delay")).toBe("180");
    expect(typingLine.getAttribute("data-class-name")).toContain(
      "text-[var(--color-baloon1)]"
    );

    fireEvent.click(typingLine);

    expect(onStepComplete).toHaveBeenCalledWith(lines.length);
  });
});
