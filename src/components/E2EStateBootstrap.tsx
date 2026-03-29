import { useEffect } from "react";
import { createDispensedGroups } from "../data/puzzleGroups";
import { $endingMailBySentiment } from "../stores/endingMailStore";
import { $endingState, type EndingState } from "../stores/endingStore";
import { $gameState, GameStateFlags } from "../stores/gameStateStore";
import { resetPhoneResult } from "../stores/phoneStore";
import { $dispensedGroups } from "../stores/puzzleDispenseStore";
import { $currentDate, $pastDate } from "../stores/stringStore";
import { applyThemeForSentiment } from "../utility/toggleTheme";

declare global {
  interface Window {
    __jcklE2EReady__?: boolean;
    __jcklE2EPuzzleState__?: {
      lastPiece?: number;
      totalPlacedPieces?: number;
    };
  }
}

const defaultEndingState: EndingState = {
  discoveredSentiments: {
    negative: false,
    neutral: false,
    positive: false,
  },
  isActive: false,
  pendingDiscovery: null,
  selectedSentiment: null,
  settledVideos: {
    negative: false,
    neutral: false,
    positive: false,
  },
};

const resetE2EState = () => {
  $gameState.set(0);
  $dispensedGroups.set(createDispensedGroups());
  $endingState.set(defaultEndingState);
  $endingMailBySentiment.set({
    negative: null,
    neutral: null,
    positive: null,
  });
  $currentDate.set("");
  $pastDate.set("");
  applyThemeForSentiment(null);
  resetPhoneResult();
  delete window.__jcklE2EPuzzleState__;
};

const applyContactReadySeed = () => {
  $gameState.set(
    (1 << GameStateFlags.FLAG_LEND_A_HAND) | (1 << GameStateFlags.FLAG_CRT)
  );
  $currentDate.set("Mar 29, 2026");
  $pastDate.set("May 14, 2023");
};

const applyCrtReadySeed = () => {
  $gameState.set(
    (1 << GameStateFlags.FLAG_STARS_ALIGN) |
      (1 << GameStateFlags.FLAG_LEND_A_HAND) |
      (1 << GameStateFlags.FLAG_CONNECTION)
  );
  $dispensedGroups.set({
    stars: true,
    hand: true,
    connection: true,
    crt: false,
  });
  $currentDate.set("Mar 29, 2026");
  $pastDate.set("May 14, 2023");
};

const applyCrtIncompleteSeed = () => {
  $gameState.set(1 << GameStateFlags.FLAG_LEND_A_HAND);
  $dispensedGroups.set({
    stars: false,
    hand: true,
    connection: false,
    crt: false,
  });
  $currentDate.set("Mar 29, 2026");
  $pastDate.set("May 14, 2023");
};

const applyEndingReturnReadySeed = () => {
  $gameState.set(
    (1 << GameStateFlags.FLAG_STARS_ALIGN) |
      (1 << GameStateFlags.FLAG_LEND_A_HAND) |
      (1 << GameStateFlags.FLAG_CONNECTION) |
      (1 << GameStateFlags.FLAG_CRT) |
      (1 << GameStateFlags.FLAG_SECRET)
  );
  $dispensedGroups.set({
    stars: true,
    hand: true,
    connection: true,
    crt: true,
  });
  $endingMailBySentiment.set({
    negative: {
      date: "May 14, 2023",
      email: "loop@example.com",
      message: "Restless hello from the loop.",
      name: "Loop Witness",
    },
    neutral: null,
    positive: null,
  });
  $endingState.set({
    discoveredSentiments: {
      negative: false,
      neutral: false,
      positive: false,
    },
    isActive: true,
    pendingDiscovery: "negative",
    selectedSentiment: "negative",
    settledVideos: {
      negative: false,
      neutral: false,
      positive: false,
    },
  });
  $currentDate.set("Mar 29, 2026");
  $pastDate.set("May 14, 2023");
  applyThemeForSentiment("negative");
  window.__jcklE2EPuzzleState__ = {
    lastPiece: 0,
    totalPlacedPieces: 16,
  };
};

const applyFinalUnlockedSeed = () => {
  $gameState.set(
    (1 << GameStateFlags.FLAG_STARS_ALIGN) |
      (1 << GameStateFlags.FLAG_LEND_A_HAND) |
      (1 << GameStateFlags.FLAG_CONNECTION) |
      (1 << GameStateFlags.FLAG_CRT) |
      (1 << GameStateFlags.FLAG_SECRET)
  );
  $dispensedGroups.set({
    stars: true,
    hand: true,
    connection: true,
    crt: true,
  });
  $endingState.set({
    discoveredSentiments: {
      negative: true,
      neutral: true,
      positive: true,
    },
    isActive: false,
    pendingDiscovery: null,
    selectedSentiment: null,
    settledVideos: {
      negative: true,
      neutral: true,
      positive: true,
    },
  });
  $currentDate.set("Mar 29, 2026");
  $pastDate.set("May 14, 2023");
};

export const E2EStateBootstrap = () => {
  useEffect(() => {
    window.__jcklE2EReady__ = false;

    const params = new URLSearchParams(window.location.search);
    const seed = params.get("e2e-seed");

    resetE2EState();

    if (seed === "contact-ready") {
      applyContactReadySeed();
    }

    if (seed === "crt-ready") {
      applyCrtReadySeed();
    }

    if (seed === "crt-incomplete") {
      applyCrtIncompleteSeed();
    }

    if (seed === "ending-return-ready") {
      applyEndingReturnReadySeed();
    }

    if (seed === "final-unlocked") {
      applyFinalUnlockedSeed();
    }

    window.__jcklE2EReady__ = true;
  }, []);

  return null;
};
