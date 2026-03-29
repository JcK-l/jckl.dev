import {
  createDispensedGroups,
  type DispensedGroups,
  type PuzzleGroupKey,
} from "../data/puzzleGroups";
import {
  $endingMailBySentiment,
  type EndingMail,
} from "../stores/endingMailStore";
import {
  $endingState,
  type EndingState,
  type SentimentLabel,
} from "../stores/endingStore";
import {
  $gameState,
  GameStateFlags,
  clearBit,
  setBit,
} from "../stores/gameStateStore";
import { resetPhoneResult } from "../stores/phoneStore";
import { $dispensedGroups } from "../stores/puzzleDispenseStore";
import { $currentDate, $pastDate } from "../stores/stringStore";
import { applyThemeForSentiment } from "./toggleTheme";

declare global {
  interface Window {
    __jcklE2EReady__?: boolean;
    __jcklE2EPuzzleState__?: DebugPuzzleState;
  }
}

export const DEBUG_PUZZLE_STATE_EVENT = "jckl:puzzle-state";

const DEBUG_CURRENT_DATE = "Mar 29, 2026";
const DEBUG_PAST_DATE = "May 14, 2023";

export type DebugPuzzleState = {
  lastPiece: number;
  totalPlacedPieces: number;
};

export type DebugSeedId =
  | "reset"
  | "contact-ready"
  | "crt-ready"
  | "crt-incomplete"
  | "ending-return-ready"
  | "final-unlocked";

export const debugSeedDefinitions: Array<{
  id: DebugSeedId;
  label: string;
}> = [
  { id: "reset", label: "Reset" },
  { id: "contact-ready", label: "Contact ready" },
  { id: "crt-ready", label: "CRT ready" },
  { id: "crt-incomplete", label: "CRT blocked" },
  { id: "ending-return-ready", label: "Ending return" },
  { id: "final-unlocked", label: "Final unlocked" },
];

export const previewEndingMail: Record<SentimentLabel, EndingMail> = {
  negative: {
    date: DEBUG_PAST_DATE,
    email: "loop@example.com",
    message: "Restless hello from the loop.",
    name: "Loop Witness",
  },
  neutral: {
    date: DEBUG_PAST_DATE,
    email: "river@example.com",
    message: "Keep the line steady.",
    name: "River Song",
  },
  positive: {
    date: DEBUG_PAST_DATE,
    email: "ada@example.com",
    message: "Playwright says hi",
    name: "Ada Lovelace",
  },
};

export const createDefaultEndingState = (): EndingState => ({
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
});

export const createDefaultEndingMailState = () => ({
  negative: null,
  neutral: null,
  positive: null,
});

export const createDefaultDebugPuzzleState = (): DebugPuzzleState => ({
  lastPiece: 0,
  totalPlacedPieces: 0,
});

const setSharedDates = () => {
  $currentDate.set(DEBUG_CURRENT_DATE);
  $pastDate.set(DEBUG_PAST_DATE);
};

const emitPuzzleStateChange = (puzzleState: DebugPuzzleState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<DebugPuzzleState>(DEBUG_PUZZLE_STATE_EVENT, {
      detail: puzzleState,
    })
  );
};

export const getDebugPuzzleState = (): DebugPuzzleState => {
  if (typeof window === "undefined") {
    return createDefaultDebugPuzzleState();
  }

  return {
    ...createDefaultDebugPuzzleState(),
    ...window.__jcklE2EPuzzleState__,
  };
};

export const syncDebugPuzzleState = (puzzleState: DebugPuzzleState) => {
  if (typeof window === "undefined") {
    return puzzleState;
  }

  window.__jcklE2EPuzzleState__ = puzzleState;
  emitPuzzleStateChange(puzzleState);

  return puzzleState;
};

export const setDebugPuzzleState = (
  nextPuzzleState: Partial<DebugPuzzleState>
) => {
  return syncDebugPuzzleState({
    ...getDebugPuzzleState(),
    ...nextPuzzleState,
  });
};

export const resetDebugState = () => {
  $gameState.set(0);
  $dispensedGroups.set(createDispensedGroups());
  $endingState.set(createDefaultEndingState());
  $endingMailBySentiment.set(createDefaultEndingMailState());
  $currentDate.set("");
  $pastDate.set("");
  applyThemeForSentiment(null);
  resetPhoneResult();
  syncDebugPuzzleState(createDefaultDebugPuzzleState());
};

export const setDebugFlag = (
  flag: GameStateFlags,
  isEnabled: boolean
) => {
  if (isEnabled) {
    setBit(flag);
    return;
  }

  clearBit(flag);
};

export const setDebugDispensedGroup = (
  groupKey: PuzzleGroupKey,
  isDispensed: boolean
) => {
  const currentGroups = $dispensedGroups.get();

  $dispensedGroups.set({
    ...currentGroups,
    [groupKey]: isDispensed,
  });
};

export const setDebugDiscoveredEnding = (
  sentiment: SentimentLabel,
  isDiscovered: boolean
) => {
  const currentEndingState = $endingState.get();

  $endingState.set({
    ...currentEndingState,
    discoveredSentiments: {
      ...currentEndingState.discoveredSentiments,
      [sentiment]: isDiscovered,
    },
  });
};

export const setDebugSettledEndingVideo = (
  sentiment: SentimentLabel,
  isSettled: boolean
) => {
  const currentEndingState = $endingState.get();

  $endingState.set({
    ...currentEndingState,
    settledVideos: {
      ...currentEndingState.settledVideos,
      [sentiment]: isSettled,
    },
  });
};

export const clearDebugEnding = () => {
  const currentEndingState = $endingState.get();

  $endingState.set({
    ...currentEndingState,
    isActive: false,
    pendingDiscovery: null,
    selectedSentiment: null,
  });
  applyThemeForSentiment(null);
};

export const openDebugEnding = (sentiment: SentimentLabel) => {
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
    ...createDefaultEndingMailState(),
    [sentiment]: previewEndingMail[sentiment],
  });
  $endingState.set({
    ...createDefaultEndingState(),
    isActive: true,
    selectedSentiment: sentiment,
  });
  setSharedDates();
  resetPhoneResult();
  applyThemeForSentiment(sentiment);
  syncDebugPuzzleState({
    lastPiece: 0,
    totalPlacedPieces: 16,
  });
};

const applyContactReadySeed = () => {
  $gameState.set(
    (1 << GameStateFlags.FLAG_LEND_A_HAND) | (1 << GameStateFlags.FLAG_CRT)
  );
  setSharedDates();
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
  setSharedDates();
};

const applyCrtIncompleteSeed = () => {
  $gameState.set(1 << GameStateFlags.FLAG_LEND_A_HAND);
  $dispensedGroups.set({
    stars: false,
    hand: true,
    connection: false,
    crt: false,
  });
  setSharedDates();
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
    ...createDefaultEndingMailState(),
    negative: previewEndingMail.negative,
  });
  $endingState.set({
    ...createDefaultEndingState(),
    isActive: true,
    pendingDiscovery: "negative",
    selectedSentiment: "negative",
  });
  setSharedDates();
  applyThemeForSentiment("negative");
  syncDebugPuzzleState({
    lastPiece: 0,
    totalPlacedPieces: 16,
  });
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
    ...createDefaultEndingState(),
    discoveredSentiments: {
      negative: true,
      neutral: true,
      positive: true,
    },
    settledVideos: {
      negative: true,
      neutral: true,
      positive: true,
    },
  });
  setSharedDates();
};

export const applyDebugSeed = (seed: DebugSeedId) => {
  resetDebugState();

  if (seed === "reset") {
    return;
  }

  if (seed === "contact-ready") {
    applyContactReadySeed();
    return;
  }

  if (seed === "crt-ready") {
    applyCrtReadySeed();
    return;
  }

  if (seed === "crt-incomplete") {
    applyCrtIncompleteSeed();
    return;
  }

  if (seed === "ending-return-ready") {
    applyEndingReturnReadySeed();
    return;
  }

  if (seed === "final-unlocked") {
    applyFinalUnlockedSeed();
  }
};

export const getSolvedGroupCount = (groups: DispensedGroups) => {
  return Object.values(groups).filter(Boolean).length;
};
