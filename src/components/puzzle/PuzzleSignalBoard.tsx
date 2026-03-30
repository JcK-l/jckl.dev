import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  puzzleGroups,
  getNextPuzzleHint,
  type DispensedGroups,
} from "../../data/puzzleGroups";
import { hasBit } from "../../stores/gameStateStore";
import { $endingState, isEndingActive } from "../../stores/endingStore";
import { exitEndingToOriginal } from "../../utility/endingMode";
import { ApplianceShell } from "../appliance/ApplianceShell";
import { ApplianceTerminal } from "../appliance/ApplianceTerminal";

interface PuzzleSignalBoardProps {
  binaryState: number;
  dispensedGroups: DispensedGroups;
  totalPlacedPieces: number;
}

const totalPuzzlePieces = puzzleGroups.reduce((count, group) => {
  return count + group.pieces.length;
}, 0);

export const PuzzleSignalBoard = ({
  binaryState,
  dispensedGroups,
  totalPlacedPieces,
}: PuzzleSignalBoardProps) => {
  const endingState = useStore($endingState);
  const nextHint = getNextPuzzleHint(binaryState, totalPlacedPieces);
  const isPuzzleComplete = totalPlacedPieces >= totalPuzzlePieces;
  const showReturnToOriginal =
    isPuzzleComplete && isEndingActive(undefined, endingState);
  const [isHintVisible, setIsHintVisible] = useState(false);

  useEffect(() => {
    setIsHintVisible(false);
  }, [nextHint, showReturnToOriginal]);

  return (
    <ApplianceShell className="mb-4 p-3">
      <div className="relative p-3">
        <div
          className="appliance-panel-header"
          style={{ borderColor: "var(--color-appliance-shell-border)" }}
        >
          <div className="appliance-panel-heading">
            <p className="appliance-panel-eyebrow">Signal Board</p>
            <p className="appliance-header-subtitle mt-1">
              piece routing
            </p>
          </div>
          <div className="grid grid-cols-4 gap-x-2 gap-y-2 sm:min-w-[18rem] sm:gap-x-3">
            {puzzleGroups.map((group) => {
              const isOn =
                dispensedGroups[group.key] || hasBit(binaryState, group.flag);

              return (
                <div
                  key={group.key}
                  className="flex min-w-0 flex-col items-center gap-1 text-center"
                >
                  <span className="relative flex h-3 w-3">
                    <span
                      className={`relative inline-flex h-3 w-3 rounded-full transition-all duration-300 ${
                        isOn ? "bg-extra2" : "bg-primary opacity-40"
                      }`}
                      style={
                        isOn
                          ? { boxShadow: "0 0 10px var(--color-extra2)" }
                          : undefined
                      }
                    ></span>
                  </span>
                  <span
                    className="max-w-full text-[9px] uppercase leading-[1.25] tracking-[0.14em] sm:text-[10px] sm:tracking-[0.18em]"
                    style={{ color: "var(--color-appliance-label)" }}
                  >
                    {group.lightLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <ApplianceTerminal
          className="mt-4 rounded-[0.95rem] px-3 py-3"
          bodyClassName="flex min-h-[4.5rem] flex-col justify-center sm:min-h-[4rem]"
        >
          {showReturnToOriginal ? (
            <p className="text-[0.72rem] leading-6 tracking-[0.08em]">
              Transmission complete. The original timeline awaits, should you wish to {" "}
              <button
                type="button"
                className="focus:ring-white/60 inline cursor-pointer rounded-sm font-semibold underline underline-offset-4 transition-colors hover:text-extra2 focus:outline-none focus:ring-2"
                onClick={() => {
                  exitEndingToOriginal();
                }}
              >
                return
              </button>{" "}
            </p>
          ) : isHintVisible ? (
            <p
              aria-live="polite"
              className="text-[0.72rem] leading-6 tracking-[0.08em] text-center"
            >
              {nextHint}
            </p>
          ) : (
            <div className="flex items-center justify-center">
              <button
                type="button"
                className="focus:ring-white/60 inline-flex cursor-pointer items-center rounded-full border px-2.5 py-1 font-appliance text-[0.55rem] uppercase tracking-[0.2em] transition-[transform,opacity] duration-200 motion-safe:animate-pulse hover:motion-safe:animate-none focus:outline-none focus:ring-2 active:scale-[0.98]"
                style={{
                  backgroundColor: "var(--color-appliance-screen-bg)",
                  borderColor: "var(--color-appliance-screen-accent-bg)",
                  color: "var(--color-appliance-screen-accent-bg)",
                }}
                onClick={() => {
                  setIsHintVisible(true);
                }}
              >
                Next hint
              </button>
            </div>
          )}
        </ApplianceTerminal>
      </div>
    </ApplianceShell>
  );
};
