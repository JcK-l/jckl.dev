import {
  puzzleGroups,
  getNextPuzzleHint,
  type DispensedGroups,
  type PuzzleGroupKey,
} from "../data/puzzleGroups";
import { ApplianceShell } from "./ApplianceShell";

interface PuzzleSignalBoardProps {
  activeDispenseKey: PuzzleGroupKey | null;
  binaryState: number;
  dispensedGroups: DispensedGroups;
  totalPlacedPieces: number;
}

export const PuzzleSignalBoard = ({
  activeDispenseKey,
  binaryState,
  dispensedGroups,
  totalPlacedPieces,
}: PuzzleSignalBoardProps) => {
  const activeDispenseGroup = puzzleGroups.find((group) => {
    return group.key === activeDispenseKey;
  });
  const nextHint = getNextPuzzleHint(binaryState, totalPlacedPieces);

  return (
    <ApplianceShell className="mb-4 p-3" ventClassName="right-4 top-4 h-3 w-20">
      <div className="relative p-3">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.24em]"
              style={{ color: "var(--color-title-color)" }}
            >
              Signal Board
            </p>
            <p className="small-text mt-1 text-primary">piece routing</p>
          </div>
          <div className="flex gap-3">
            {puzzleGroups.map((group) => {
              const isActive = activeDispenseKey === group.key;
              const isOn = dispensedGroups[group.key] || isActive;

              return (
                <div key={group.key} className="flex flex-col items-center gap-1">
                  <span className="relative flex h-3 w-3">
                    {isActive && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-extra1 opacity-70"></span>
                    )}
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
                    style={{ color: "var(--color-title-color)" }}
                  >
                    {group.lightLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className="relative min-h-[3.3rem] overflow-hidden rounded-[0.95rem] px-3 py-3"
          style={{
            backgroundColor: "var(--color-appliance-screen-bg)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{ backgroundImage: "var(--color-appliance-screen-pattern)" }}
          />
          <p
            className={`small-text relative transition-all duration-500 ${
              activeDispenseGroup
                ? "translate-y-2 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
            style={{ color: "var(--color-appliance-screen-text)" }}
          >
            {nextHint}
          </p>
          <p
            className={`small-text absolute inset-0 px-3 py-3 transition-all duration-500 ${
              activeDispenseGroup
                ? "translate-y-0 opacity-100"
                : "-translate-y-2 opacity-0"
            }`}
            style={{ color: "var(--color-appliance-screen-muted)" }}
          >
            {activeDispenseGroup
              ? `Dispensing pieces from ${activeDispenseGroup.label}...`
              : ""}
          </p>
        </div>
      </div>
    </ApplianceShell>
  );
};
