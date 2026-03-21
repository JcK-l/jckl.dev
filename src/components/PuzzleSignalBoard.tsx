import {
  puzzleGroups,
  getNextPuzzleHint,
  type DispensedGroups,
} from "../data/puzzleGroups";
import { ApplianceShell } from "./ApplianceShell";
import { ApplianceTerminal } from "./ApplianceTerminal";

interface PuzzleSignalBoardProps {
  binaryState: number;
  dispensedGroups: DispensedGroups;
  totalPlacedPieces: number;
}

export const PuzzleSignalBoard = ({
  binaryState,
  dispensedGroups,
  totalPlacedPieces,
}: PuzzleSignalBoardProps) => {
  const nextHint = getNextPuzzleHint(binaryState, totalPlacedPieces);

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
              const isOn = dispensedGroups[group.key];

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
        <ApplianceTerminal className="min-h-[3.3rem] rounded-[0.95rem] px-3 py-3">
          <p className="text-[0.72rem] tracking-[0.08em]">
            {nextHint}
          </p>
        </ApplianceTerminal>
      </div>
    </ApplianceShell>
  );
};
