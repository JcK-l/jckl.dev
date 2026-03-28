// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  $phoneCurrentTimestamp,
  $phoneNumber,
  $phonePastTimestamp,
  $phoneResultMode,
  resetPhoneResult,
  setPhoneNumberResult,
} from "../../stores/phoneStore";

vi.mock("./PhonePad", () => ({
  PhonePad: ({
    display,
    onBottomLeft,
    onBottomRight,
    onCall,
    onCancel,
    onDigit,
    showCallButton,
    showCancelButton,
  }: {
    display: string;
    onBottomLeft: () => void;
    onBottomRight: () => void;
    onCall?: () => void;
    onCancel?: () => void;
    onDigit: (digit: string) => void;
    showCallButton?: boolean;
    showCancelButton?: boolean;
  }) => (
    <div>
      <div data-testid="display">{display}</div>
      <div data-testid="show-call">{String(showCallButton)}</div>
      <div data-testid="show-cancel">{String(showCancelButton)}</div>
      <button onClick={() => onDigit("1")}>digit-1</button>
      <button onClick={() => onDigit("2")}>digit-2</button>
      <button onClick={() => onDigit("3")}>digit-3</button>
      <button onClick={() => onDigit("4")}>digit-4</button>
      <button onClick={onBottomLeft}>bottom-left</button>
      <button onClick={onBottomRight}>bottom-right</button>
      <button onClick={onCancel}>cancel</button>
      <button onClick={onCall}>call</button>
    </div>
  ),
}));

import { Phone } from "./Phone";

describe("Phone", () => {
  beforeEach(() => {
    resetPhoneResult();
  });

  it("formats digit input and lets cancel remove the last character", () => {
    render(<Phone />);

    fireEvent.click(screen.getByRole("button", { name: "digit-1" }));
    fireEvent.click(screen.getByRole("button", { name: "digit-2" }));
    fireEvent.click(screen.getByRole("button", { name: "digit-3" }));
    fireEvent.click(screen.getByRole("button", { name: "digit-4" }));

    expect(screen.getByTestId("display").textContent).toBe("1 234");
    expect(screen.getByTestId("show-call").textContent).toBe("true");
    expect(screen.getByTestId("show-cancel").textContent).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "cancel" }));

    expect(screen.getByTestId("display").textContent).toBe("123");
  });

  it("strips non-digits when calling and stores the resulting number", () => {
    render(<Phone />);

    fireEvent.click(screen.getByRole("button", { name: "digit-1" }));
    fireEvent.click(screen.getByRole("button", { name: "digit-2" }));
    fireEvent.click(screen.getByRole("button", { name: "bottom-left" }));
    fireEvent.click(screen.getByRole("button", { name: "bottom-right" }));
    fireEvent.click(screen.getByRole("button", { name: "digit-3" }));
    fireEvent.click(screen.getByRole("button", { name: "digit-4" }));

    fireEvent.click(screen.getByRole("button", { name: "call" }));

    expect($phoneResultMode.get()).toBe("number");
    expect($phoneNumber.get()).toBe(1234);
    expect(screen.getByTestId("display").textContent).toBe("");
    expect(screen.getByTestId("show-cancel").textContent).toBe("false");
  });

  it("resets the phone result when call is pressed with no input", () => {
    setPhoneNumberResult(5551234);
    $phoneCurrentTimestamp.set(123);
    $phonePastTimestamp.set(456);

    render(<Phone />);

    fireEvent.click(screen.getByRole("button", { name: "call" }));

    expect($phoneResultMode.get()).toBe("idle");
    expect($phoneNumber.get()).toBeNull();
    expect($phoneCurrentTimestamp.get()).toBeNull();
    expect($phonePastTimestamp.get()).toBeNull();
  });
});
