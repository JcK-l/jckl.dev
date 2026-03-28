// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDispensedGroups } from "../../data/puzzleGroups";
import { $endingMailBySentiment } from "../../stores/endingMailStore";
import { $endingState } from "../../stores/endingStore";
import { $gameState, GameStateFlags, hasBit } from "../../stores/gameStateStore";
import { $dispensedGroups } from "../../stores/puzzleDispenseStore";
import { $pastDate } from "../../stores/stringStore";
import {
  createDefaultEndingMailState,
  createDefaultEndingState,
} from "../../test/factories";

vi.mock("framer-motion", async () => {
  const React = await import("react");

  return {
    motion: {
      button: React.forwardRef<HTMLButtonElement, Record<string, unknown>>(
        function MockMotionButton(props, ref) {
          return <button ref={ref} {...props} />;
        }
      ),
    },
  };
});

vi.mock("../BetweenLands", async () => {
  const { MockBetweenLands } = await import("../../test/mocks/layout");

  return {
    BetweenLands: MockBetweenLands,
  };
});

vi.mock("../puzzle/PuzzlePieceTransfer", async () => {
  const { MockPuzzlePieceTransfer } = await import("../../test/mocks/layout");

  return {
    PuzzlePieceTransfer: MockPuzzlePieceTransfer,
  };
});

vi.mock("../../utility/audioContext", () => ({
  preloadAudioBuffers: vi.fn(() => Promise.resolve()),
  startCachedAudio: vi.fn(() =>
    Promise.resolve({
      context: { currentTime: 0 },
      ended: Promise.resolve(),
      gainNode: {
        gain: {
          value: 0,
          cancelScheduledValues: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          setValueAtTime: vi.fn(),
        },
      },
      stop: vi.fn(),
    })
  ),
}));

vi.mock("../../utility/icons", () => ({
  Email: () => <span data-testid="email-icon" />,
  Send: () => <span data-testid="send-icon" />,
}));

vi.mock("../../utility/toggleTheme", async () => {
  const endingStore = await import("../../stores/endingStore");

  return {
    applyThemeForSentiment: vi.fn(),
    toggleThemes: (sentiment: "negative" | "neutral" | "positive") => {
      endingStore.setSelectedEnding(sentiment, true);
    },
  };
});

import Contact from "./Contact";

describe("Contact", () => {
  beforeEach(() => {
    $endingState.set(createDefaultEndingState());
    $endingMailBySentiment.set(createDefaultEndingMailState());
    $dispensedGroups.set(createDispensedGroups());
    $gameState.set(
      (1 << GameStateFlags.FLAG_CRT) | (1 << GameStateFlags.FLAG_LEND_A_HAND)
    );
    $pastDate.set("MAY 2023");

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        text: async () => JSON.stringify({ sentiment: "positive" }),
      }))
    );
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
        unobserve() {}
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("saves the D-Mail, prepares the final cache, and enters ending mode", async () => {
    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: "Okabe" },
    });
    fireEvent.change(screen.getByLabelText(/your email/i), {
      target: { value: "okabe@lab.invalid" },
    });
    fireEvent.change(screen.getByLabelText(/your message/i), {
      target: { value: "El Psy Kongroo" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send d-mail/i }));

    await waitFor(() => {
      expect($endingMailBySentiment.get().positive).toEqual({
        date: "MAY 2023",
        email: "okabe@lab.invalid",
        message: "El Psy Kongroo",
        name: "Okabe",
      });
      expect(hasBit($gameState.get(), GameStateFlags.FLAG_SECRET)).toBe(true);
      expect($endingState.get().pendingDiscovery).toBe("positive");
      expect($endingState.get().selectedSentiment).toBe("positive");
      expect($endingState.get().isActive).toBe(true);
    });

    await waitFor(() => {
      expect(screen.getByText("Another Timeline Is Open")).toBeTruthy();
      expect(screen.getByText("trigger:1")).toBeTruthy();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /complete-transfer/i })
    );

    expect($dispensedGroups.get().crt).toBe(true);
  });
});
