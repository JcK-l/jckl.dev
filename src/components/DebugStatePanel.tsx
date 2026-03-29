import { useEffect, useMemo, useState } from "react";
import { useStore } from "@nanostores/react";
import { sentimentLabels } from "../stores/endingStore";
import { $endingState } from "../stores/endingStore";
import { $gameState, GameStateFlags, hasBit } from "../stores/gameStateStore";
import { $dispensedGroups } from "../stores/puzzleDispenseStore";
import {
  applyDebugSeed,
  clearDebugEnding,
  DEBUG_PUZZLE_STATE_EVENT,
  debugSeedDefinitions,
  getDebugPuzzleState,
  getSolvedGroupCount,
  openDebugEnding,
  setDebugDiscoveredEnding,
  setDebugDispensedGroup,
  setDebugFlag,
  setDebugPuzzleState,
  setDebugSettledEndingVideo,
} from "../utility/debugState";
import { cycleDebugTheme, getCurrentThemeLabel } from "../utility/toggleTheme";

const flagControls = [
  { flag: GameStateFlags.FLAG_STARS_ALIGN, label: "Stars" },
  { flag: GameStateFlags.FLAG_LEND_A_HAND, label: "Hand" },
  { flag: GameStateFlags.FLAG_CONNECTION, label: "Connection" },
  { flag: GameStateFlags.FLAG_CRT, label: "CRT" },
  { flag: GameStateFlags.FLAG_SECRET, label: "Secret" },
] as const;

const groupControls = [
  { key: "stars", label: "Stars" },
  { key: "hand", label: "Hand" },
  { key: "connection", label: "Connection" },
  { key: "crt", label: "CRT" },
] as const;

const puzzleStageControls = [
  { label: "0 pieces", totalPlacedPieces: 0 },
  { label: "12 pieces", totalPlacedPieces: 12 },
  { label: "16 pieces", totalPlacedPieces: 16 },
] as const;

const fieldsetStyle = {
  borderColor: "var(--color-appliance-panel-border)",
  backgroundColor: "var(--color-appliance-control-surface)",
};

const secondaryButtonStyle = {
  backgroundColor: "var(--color-appliance-button-surface)",
  borderColor: "var(--color-appliance-button-border)",
  color: "var(--color-primary)",
};

const checkboxStyle = {
  accentColor: "var(--color-primary)",
};

export const DebugStatePanel = () => {
  const gameState = useStore($gameState);
  const dispensedGroups = useStore($dispensedGroups);
  const endingState = useStore($endingState);
  const [isOpen, setIsOpen] = useState(false);
  const [themeLabel, setThemeLabel] = useState("Original");
  const [puzzleState, setPuzzleState] = useState(() => getDebugPuzzleState());

  useEffect(() => {
    const syncThemeLabel = () => {
      setThemeLabel(getCurrentThemeLabel());
    };

    const syncPuzzleState = (event?: Event) => {
      const nextPuzzleState =
        event instanceof CustomEvent
          ? event.detail
          : getDebugPuzzleState();

      setPuzzleState(nextPuzzleState);
    };

    syncThemeLabel();
    syncPuzzleState();

    window.addEventListener("themechange", syncThemeLabel);
    window.addEventListener(DEBUG_PUZZLE_STATE_EVENT, syncPuzzleState);

    return () => {
      window.removeEventListener("themechange", syncThemeLabel);
      window.removeEventListener(DEBUG_PUZZLE_STATE_EVENT, syncPuzzleState);
    };
  }, []);

  const activeFlagCount = useMemo(() => {
    return flagControls.filter(({ flag }) => {
      return hasBit(gameState, flag);
    }).length;
  }, [gameState]);

  const discoveredEndingCount = useMemo(() => {
    return sentimentLabels.filter((sentiment) => {
      return endingState.discoveredSentiments[sentiment];
    }).length;
  }, [endingState.discoveredSentiments]);

  const solvedGroupCount = useMemo(() => {
    return getSolvedGroupCount(dispensedGroups);
  }, [dispensedGroups]);

  const summaryText = `${activeFlagCount}/5 flags · ${solvedGroupCount}/4 groups · ${discoveredEndingCount}/3 endings · ${puzzleState.totalPlacedPieces}/16 pieces`;

  return (
    <div className="fixed right-4 top-4 z-[140] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2">
      <button
        type="button"
        className="rounded-full border px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] transition hover:translate-y-[-1px] active:translate-y-0"
        onClick={() => {
          setIsOpen((currentValue) => {
            return !currentValue;
          });
        }}
        style={secondaryButtonStyle}
      >
        {isOpen ? "Hide debug" : "Debug state"}
      </button>

      {isOpen ? (
        <div
          className="w-[22rem] max-w-full rounded-[1.4rem] border p-3 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur"
          style={{
            backgroundColor: "color-mix(in srgb, var(--color-appliance-shell-surface) 92%, transparent)",
            borderColor: "var(--color-appliance-shell-border)",
            color: "var(--color-primary)",
          }}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-titleColor/80">
                Dev toolbox
              </p>
              <p className="mt-1 font-sans text-[0.8rem] leading-5 text-titleColor/90">
                {summaryText}
              </p>
            </div>
            <button
              type="button"
              className="rounded-full border px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.18em]"
              onClick={() => {
                cycleDebugTheme();
              }}
              style={secondaryButtonStyle}
            >
              Theme: {themeLabel}
            </button>
          </div>

          <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
            <fieldset className="rounded-[1rem] border p-3" style={fieldsetStyle}>
              <legend className="px-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-titleColor/75">
                Presets
              </legend>
              <div className="mt-1 flex flex-wrap gap-2">
                {debugSeedDefinitions.map((seed) => {
                  return (
                    <button
                      key={seed.id}
                      type="button"
                      className="rounded-full border px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.18em]"
                      onClick={() => {
                        applyDebugSeed(seed.id);
                      }}
                      style={secondaryButtonStyle}
                    >
                      {seed.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="rounded-[1rem] border p-3" style={fieldsetStyle}>
              <legend className="px-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-titleColor/75">
                Flags
              </legend>
              <div className="mt-1 grid gap-2 sm:grid-cols-2">
                {flagControls.map(({ flag, label }) => {
                  return (
                    <label key={flag} className="flex items-center gap-2 text-[0.78rem]">
                      <input
                        type="checkbox"
                        checked={hasBit(gameState, flag)}
                        onChange={(event) => {
                          setDebugFlag(flag, event.currentTarget.checked);
                        }}
                        style={checkboxStyle}
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="rounded-[1rem] border p-3" style={fieldsetStyle}>
              <legend className="px-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-titleColor/75">
                Dispensed groups
              </legend>
              <div className="mt-1 grid gap-2 sm:grid-cols-2">
                {groupControls.map(({ key, label }) => {
                  return (
                    <label key={key} className="flex items-center gap-2 text-[0.78rem]">
                      <input
                        type="checkbox"
                        checked={dispensedGroups[key]}
                        onChange={(event) => {
                          setDebugDispensedGroup(key, event.currentTarget.checked);
                        }}
                        style={checkboxStyle}
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="rounded-[1rem] border p-3" style={fieldsetStyle}>
              <legend className="px-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-titleColor/75">
                Endings
              </legend>
              <div className="mt-1 flex flex-wrap gap-2">
                {sentimentLabels.map((sentiment) => {
                  return (
                    <button
                      key={sentiment}
                      type="button"
                      className="rounded-full border px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.18em]"
                      onClick={() => {
                        openDebugEnding(sentiment);
                      }}
                      style={secondaryButtonStyle}
                    >
                      Open {sentiment}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="rounded-full border px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.18em]"
                  onClick={() => {
                    clearDebugEnding();
                  }}
                  style={secondaryButtonStyle}
                >
                  Close ending
                </button>
              </div>

              <div className="mt-3 grid gap-2">
                {sentimentLabels.map((sentiment) => {
                  const isSelected = endingState.selectedSentiment === sentiment;

                  return (
                    <div
                      key={sentiment}
                      className="rounded-[0.9rem] border px-3 py-2"
                      style={{
                        borderColor: isSelected
                          ? "var(--color-primary)"
                          : "var(--color-appliance-panel-border)",
                        backgroundColor: "rgba(255,255,255,0.03)",
                      }}
                    >
                      <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-titleColor/80">
                        {sentiment}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3 text-[0.74rem]">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={endingState.discoveredSentiments[sentiment]}
                            onChange={(event) => {
                              setDebugDiscoveredEnding(
                                sentiment,
                                event.currentTarget.checked
                              );
                            }}
                            style={checkboxStyle}
                          />
                          <span>Discovered</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={endingState.settledVideos[sentiment]}
                            onChange={(event) => {
                              setDebugSettledEndingVideo(
                                sentiment,
                                event.currentTarget.checked
                              );
                            }}
                            style={checkboxStyle}
                          />
                          <span>Settled video</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="rounded-[1rem] border p-3" style={fieldsetStyle}>
              <legend className="px-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-titleColor/75">
                Puzzle
              </legend>
              <p className="mt-1 text-[0.78rem] leading-5 text-titleColor/85">
                Current: {puzzleState.totalPlacedPieces}/16 placed, last piece {puzzleState.lastPiece}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {puzzleStageControls.map((control) => {
                  return (
                    <button
                      key={control.label}
                      type="button"
                      className="rounded-full border px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.18em]"
                      onClick={() => {
                        setDebugPuzzleState({
                          lastPiece: 0,
                          totalPlacedPieces: control.totalPlacedPieces,
                        });
                      }}
                      style={secondaryButtonStyle}
                    >
                      {control.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </div>
      ) : null}
    </div>
  );
};
