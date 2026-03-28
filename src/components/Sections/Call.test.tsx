// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { $offScriptCount } from "../../stores/offScriptCountStore";
import { $gameState, GameStateFlags } from "../../stores/gameStateStore";
import { $endingState } from "../../stores/endingStore";
import { $phoneNumber, $phoneResultMode, resetPhoneResult } from "../../stores/phoneStore";
import {
  createDefaultEndingState,
  createUnlockedEndingState,
} from "../../test/factories";

vi.mock("../phone/Phone", () => ({
  Phone: () => <div data-testid="phone" />,
}));

vi.mock("../ProjectText", () => ({
  ProjectText: ({ title }: { title: string }) => (
    <div data-testid="project-text">{title}</div>
  ),
}));

import Call from "./Call";

describe("Call", () => {
  beforeEach(() => {
    $endingState.set(createDefaultEndingState());
    $gameState.set(0);
    $offScriptCount.set(0);
    resetPhoneResult();
  });

  it("renders nothing when the phone is locked and no number result is active", () => {
    const { container } = render(<Call />);

    expect(container.innerHTML).toBe("");
  });

  it("shows the phone interface once all endings and the connection flag are unlocked", () => {
    $endingState.set(createUnlockedEndingState());
    $gameState.set(1 << GameStateFlags.FLAG_CONNECTION);

    render(<Call />);

    expect(
      screen.getByText("Dial a number on the phone to reveal a result.")
    ).toBeTruthy();
    expect(screen.getByTestId("phone")).toBeTruthy();
  });

  it("renders the selected project when number mode is active", () => {
    $phoneResultMode.set("number");
    $phoneNumber.set(1);

    render(<Call />);

    expect(screen.getByTestId("project-text").textContent).toBe(
      "vulkan-renderer"
    );
  });
});
