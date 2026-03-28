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

  return (
    <ApplianceShell className="mb-4 p-3">
      <div className="relative p-3">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.24em]"
              style={{ color: "var(--color-appliance-label)" }}
            >
              Signal Board
            </p>
            <p className="mt-1 text-[0.72rem] tracking-[0.08em] text-primary">
              piece routing
            </p>
          </div>
          <div className="flex gap-3">
            {puzzleGroups.map((group) => {
              const isOn =
                dispensedGroups[group.key] || hasBit(binaryState, group.flag);

              return (
                <div
                  key={group.key}
                  className="flex flex-col items-center gap-1"
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
                    className="text-[10px] uppercase tracking-[0.18em]"
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
          className="rounded-[0.95rem] px-3 py-3"
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
          ) : (
            <p className="text-[0.72rem] tracking-[0.08em]">
              {nextHint}
            </p>
          )}
        </ApplianceTerminal>
      </div>
    </ApplianceShell>
  );
};
