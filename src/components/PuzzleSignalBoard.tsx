import {
  puzzleGroups,
  getNextPuzzleHint,
  type DispensedGroups,
  type PuzzleGroupKey,
} from "../data/puzzleGroups";

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
    <div className="relative mb-4 rounded-xl border border-primary bg-fgColorShade px-4 py-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="small-text uppercase tracking-[0.24em] text-titleColor opacity-70">
          Signal Board
        </span>
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
                <span className="text-[10px] uppercase tracking-[0.18em] text-titleColor opacity-70">
                  {group.lightLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative min-h-[3rem] overflow-hidden">
        <p
          className={`small-text transition-all duration-500 ${
            activeDispenseGroup
              ? "translate-y-2 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          {nextHint}
        </p>
        <p
          className={`small-text absolute inset-0 text-extra2 transition-all duration-500 ${
            activeDispenseGroup
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          }`}
        >
          {activeDispenseGroup
            ? `Dispensing pieces from ${activeDispenseGroup.label}...`
            : ""}
        </p>
      </div>
    </div>
  );
};
