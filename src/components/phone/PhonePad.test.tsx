// @vitest-environment jsdom

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PhonePad } from "./PhonePad";

const clickPadButton = (container: HTMLElement, id: string) => {
  const button = container.querySelector(`[id="${id}"]`);

  expect(button).toBeTruthy();
  fireEvent.click(button as Element);
};

describe("PhonePad", () => {
  it("renders the full keypad and routes every button to the correct handler", () => {
    const onBottomLeft = vi.fn();
    const onBottomRight = vi.fn();
    const onCall = vi.fn();
    const onCancel = vi.fn();
    const onDigit = vi.fn();
    const { container, getByText } = render(
      <PhonePad
        display="dial now"
        bottomLeftDanger
        bottomRightHighlighted
        onBottomLeft={onBottomLeft}
        onBottomRight={onBottomRight}
        onCall={onCall}
        onCancel={onCancel}
        onDigit={onDigit}
        showCallButton
        showCancelButton
      />
    );

    expect(getByText("dial now")).toBeTruthy();
    expect(container.querySelector(".phone-pad-secondary-danger")).toBeTruthy();
    expect(container.querySelector(".phone-pad-call")).toBeTruthy();
    expect(container.querySelector(".phone-pad-cancel")).toBeTruthy();

    [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
    ].forEach((digit) => {
      clickPadButton(container, digit);
    });

    clickPadButton(container, "star");
    clickPadButton(container, "hashtag");
    clickPadButton(container, "call");
    clickPadButton(container, "cancel");

    expect(onDigit.mock.calls.map(([digit]) => digit)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
    ]);
    expect(onBottomLeft).toHaveBeenCalledTimes(1);
    expect(onBottomRight).toHaveBeenCalledTimes(1);
    expect(onCall).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("uses the compact layout and blank display fallback when optional controls are hidden", () => {
    const { container } = render(
      <PhonePad
        compactBottom
        display={null}
        onBottomLeft={() => undefined}
        onBottomRight={() => undefined}
        onDigit={() => undefined}
      />
    );

    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 74.424544 100");
    expect(container.querySelector(".phone-pad-call")).toBeNull();
    expect(container.querySelector(".phone-pad-cancel")).toBeNull();
  });
});
