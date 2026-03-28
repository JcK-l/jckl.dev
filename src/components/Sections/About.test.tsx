// @vitest-environment jsdom

import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { $endingMailBySentiment } from "../../stores/endingMailStore";
import { $endingState } from "../../stores/endingStore";
import {
  createDefaultEndingMailState,
  createDefaultEndingState,
} from "../../test/factories";

vi.mock("../puzzle/PuzzleGame", () => ({
  PuzzleGame: () => <div data-testid="puzzle-game" />,
}));

vi.mock("../../context/PuzzleContext", () => ({
  PuzzleProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("../AboutProfileDeck", () => ({
  AboutProfileDeck: () => <div data-testid="profile-deck" />,
}));

vi.mock("../appliance/Email", () => ({
  Email: ({
    date,
    email,
    isMail,
    message,
    name,
  }: {
    date: string;
    email: string;
    isMail: boolean;
    message: string;
    name: string;
  }) => (
    <div data-testid="email-view">
      <span data-testid="email-mode">{isMail ? "mail" : "empty"}</span>
      <span>{name}</span>
      <span>{email}</span>
      <span>{message}</span>
      <span>{date}</span>
    </div>
  ),
}));

import About from "./About";

describe("About", () => {
  beforeEach(() => {
    $endingState.set(createDefaultEndingState());
    $endingMailBySentiment.set(createDefaultEndingMailState());
  });

  it("shows the profile deck when there is no ending mail to display", () => {
    render(<About />);

    expect(screen.getByTestId("profile-deck")).toBeTruthy();
    expect(screen.getByTestId("email-mode").textContent).toBe("empty");
  });

  it("shows saved mail for the active ending and hides the profile deck", () => {
    $endingState.set({
      ...createDefaultEndingState(),
      isActive: true,
      selectedSentiment: "positive",
    });
    $endingMailBySentiment.set({
      ...createDefaultEndingMailState(),
      positive: {
        date: "MAY 2023",
        email: "okabe@lab.invalid",
        message: "El Psy Kongroo",
        name: "Okabe",
      },
    });

    render(<About />);

    expect(screen.queryByTestId("profile-deck")).toBeNull();
    expect(screen.getByText(/About Me!/i)).toBeTruthy();
    expect(screen.getByTestId("email-mode").textContent).toBe("mail");
    expect(screen.getByText("Okabe")).toBeTruthy();
    expect(screen.getByText("okabe@lab.invalid")).toBeTruthy();
    expect(screen.getByText("El Psy Kongroo")).toBeTruthy();
  });
});
