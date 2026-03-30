// @vitest-environment jsdom

import { fireEvent, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { $endingState } from "../stores/endingStore";
import { $gameState, GameStateFlags, hasBit } from "../stores/gameStateStore";
import { createDefaultEndingState } from "../test/factories";

const audioMocks = vi.hoisted(() => ({
  preloadAudioBuffers: vi.fn(),
  resumeAudioContext: vi.fn(),
  startCachedAudio: vi.fn(),
}));

vi.mock("../utility/audioContext", () => ({
  preloadAudioBuffers: audioMocks.preloadAudioBuffers,
  resumeAudioContext: audioMocks.resumeAudioContext,
  startCachedAudio: audioMocks.startCachedAudio,
}));

import { SeparatorOut } from "./SeparatorOut";

describe("SeparatorOut", () => {
  beforeEach(() => {
    $endingState.set(createDefaultEndingState());
    $gameState.set(0);
    audioMocks.preloadAudioBuffers.mockReset();
    audioMocks.resumeAudioContext.mockReset();
    audioMocks.startCachedAudio.mockReset();
    audioMocks.preloadAudioBuffers.mockResolvedValue(undefined);
    audioMocks.resumeAudioContext.mockResolvedValue(undefined);
    audioMocks.startCachedAudio.mockResolvedValue({
      ended: Promise.resolve(),
    });
  });

  it("powers the CRT once all prerequisite flags are unlocked", async () => {
    $gameState.set(
      (1 << GameStateFlags.FLAG_STARS_ALIGN) |
        (1 << GameStateFlags.FLAG_LEND_A_HAND) |
        (1 << GameStateFlags.FLAG_CONNECTION)
    );

    const { getByRole } = render(<SeparatorOut isCrt />);
    const crtTrigger = getByRole("button", { name: /crt cache relay/i });

    fireEvent.click(crtTrigger);

    await waitFor(() => {
      expect(audioMocks.resumeAudioContext).toHaveBeenCalledTimes(1);
      expect(audioMocks.startCachedAudio).toHaveBeenCalledWith(
        "/tvSounds/on.mp3",
        { gain: 0.25 }
      );
      expect(hasBit($gameState.get(), GameStateFlags.FLAG_CRT)).toBe(true);
    });
  });

  it("plays the failure sound without powering the CRT when prerequisites are missing", async () => {
    $gameState.set(
      (1 << GameStateFlags.FLAG_STARS_ALIGN) |
        (1 << GameStateFlags.FLAG_LEND_A_HAND)
    );

    const { getByRole } = render(<SeparatorOut isCrt />);
    const crtTrigger = getByRole("button", { name: /crt cache relay/i });

    fireEvent.click(crtTrigger);

    await waitFor(() => {
      expect(audioMocks.startCachedAudio).toHaveBeenCalledWith(
        "/tvSounds/onAndOff.mp3",
        { gain: 0.25 }
      );
    });

    expect(hasBit($gameState.get(), GameStateFlags.FLAG_CRT)).toBe(false);
  });

  it("ignores CRT clicks while an ending is active", async () => {
    $gameState.set(
      (1 << GameStateFlags.FLAG_STARS_ALIGN) |
        (1 << GameStateFlags.FLAG_LEND_A_HAND) |
        (1 << GameStateFlags.FLAG_CONNECTION)
    );
    $endingState.set(
      createDefaultEndingState({
        isActive: true,
        selectedSentiment: "positive",
      })
    );

    const { getByRole } = render(<SeparatorOut isCrt />);
    const crtTrigger = getByRole("button", { name: /crt cache relay/i });

    fireEvent.click(crtTrigger);
    await Promise.resolve();

    expect(audioMocks.resumeAudioContext).not.toHaveBeenCalled();
    expect(audioMocks.startCachedAudio).not.toHaveBeenCalled();
    expect(hasBit($gameState.get(), GameStateFlags.FLAG_CRT)).toBe(false);
  });

  it("supports keyboard activation for the CRT trigger", async () => {
    $gameState.set(
      (1 << GameStateFlags.FLAG_STARS_ALIGN) |
        (1 << GameStateFlags.FLAG_LEND_A_HAND) |
        (1 << GameStateFlags.FLAG_CONNECTION)
    );

    const { getByRole } = render(<SeparatorOut isCrt />);
    const crtTrigger = getByRole("button", { name: /crt cache relay/i });

    fireEvent.keyDown(crtTrigger, { key: "Enter" });

    await waitFor(() => {
      expect(audioMocks.resumeAudioContext).toHaveBeenCalledTimes(1);
      expect(hasBit($gameState.get(), GameStateFlags.FLAG_CRT)).toBe(true);
    });
  });

  it("keeps the decorative separator clouds click-through", () => {
    const { container } = render(<SeparatorOut />);
    const decorativeClouds = container.querySelector("svg");

    expect(decorativeClouds?.getAttribute("class")).toContain(
      "pointer-events-none"
    );
  });

  it("keeps middle and under layer wrappers click-through", () => {
    const { container } = render(
      <SeparatorOut
        middleLayer={<button type="button">Middle layer</button>}
        underLayer={<div>Under layer</div>}
      />
    );

    const fullInsetWrappers = Array.from(
      container.querySelectorAll(".absolute.inset-0")
    ).map((element) => element.getAttribute("class") ?? "");

    expect(
      fullInsetWrappers.some((className) =>
        className.includes("pointer-events-auto absolute inset-0")
      )
    ).toBe(false);
  });
});
