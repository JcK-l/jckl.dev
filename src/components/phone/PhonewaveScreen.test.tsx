// @vitest-environment jsdom

import { fireEvent, render, screen, within } from "@testing-library/react";
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

    const liveLayer = screen.getByTestId("phonewave-screen-live");

    expect(within(liveLayer).getByText("[boot] signal online")).toBeTruthy();
    expect(within(liveLayer).getByText("[scan] window verified")).toBeTruthy();
    expect(within(liveLayer).getByText("[result] line rejected")).toBeTruthy();
    expect(screen.queryByTestId("typing-text")).toBeNull();
    expect(screen.queryByTestId("phonewave-screen-reserve")).toBeNull();
    expect(screen.getByText("event log")).toBeTruthy();
  });

  it("animates the boot line with the longer settle delay and reserves space for the full log", () => {
    const onStepComplete = vi.fn();

    render(
      <PhonewaveScreen
        animate={true}
        currentStep={0}
        lines={lines}
        onStepComplete={onStepComplete}
      />
    );

    const liveLayer = screen.getByTestId("phonewave-screen-live");
    const reserveLayer = screen.getByTestId("phonewave-screen-reserve");
    const typingLine = within(liveLayer).getByTestId("typing-text");

    expect(typingLine.textContent).toBe("[boot] signal online");
    expect(typingLine.getAttribute("data-on-complete-delay")).toBe("520");
    expect(typingLine.getAttribute("data-typing-delay")).toBe("16");
    expect(typingLine.getAttribute("data-typing-delay-jitter")).toBe("3");
    expect(within(liveLayer).queryByText("[scan] window verified")).toBeNull();
    expect(within(reserveLayer).getByText("[scan] window verified")).toBeTruthy();
    expect(within(reserveLayer).getByText("[result] line rejected")).toBeTruthy();

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

    const liveLayer = screen.getByTestId("phonewave-screen-live");

    expect(within(liveLayer).getByText("[boot] signal online")).toBeTruthy();
    expect(within(liveLayer).getByText("[scan] window verified")).toBeTruthy();

    const typingLine = within(liveLayer).getByTestId("typing-text");
    expect(typingLine.textContent).toBe("[result] line rejected");
    expect(typingLine.getAttribute("data-on-complete-delay")).toBe("180");
    expect(typingLine.getAttribute("data-class-name")).toContain(
      "text-[var(--color-appliance-screen-failure)]"
    );

    fireEvent.click(typingLine);

    expect(onStepComplete).toHaveBeenCalledWith(lines.length);
  });
});
