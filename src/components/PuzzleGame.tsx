import { useRef, useEffect, useState } from "react";
import { PuzzlePiece } from "./PuzzlePiece";
import { pieces as originalPieces } from "../data/PuzzleData";
import { usePuzzleContext } from "../hooks/useDataContext";
import { $gameState, GameStateFlags } from "../stores/gameStateStore";
import { useStore } from "@nanostores/react";
import { Puzzle } from "./Puzzle";

const originalCoords = "0,300,300,0";
const originalPieceSize = { width: 300, height: 300 };
const scale = 0.27;
const AUTO_DISPENSE_DELAY_MS = 1100;
const AUTO_DISPENSE_STAGGER_MS = 850;
const AUTO_DISPENSE_ACTIVE_MS = 550;

type PuzzleGroupKey = "stars" | "hand" | "connection" | "crt";

type PuzzleGroup = {
  key: PuzzleGroupKey;
  label: string;
  lightLabel: string;
  hint: string;
  flag: GameStateFlags;
  pieces: number[];
};

const puzzleGroups: PuzzleGroup[] = [
  {
    key: "stars",
    label: "stars align",
    lightLabel: "Stars",
    hint: "Next lead: align the constellation.",
    flag: GameStateFlags.FLAG_STARS_ALIGN,
    pieces: [1, 12, 13, 5],
  },
  {
    key: "hand",
    label: "a helping hand",
    lightLabel: "Hand",
    hint: "Next lead: something in the CRT mission still needs a hand.",
    flag: GameStateFlags.FLAG_LEND_A_HAND,
    pieces: [15, 11, 3, 8],
  },
  {
    key: "connection",
    label: "the connection",
    lightLabel: "Line",
    hint: "Next lead: the phone line is hiding a code.",
    flag: GameStateFlags.FLAG_CONNECTION,
    pieces: [16, 10, 2, 4],
  },
  {
    key: "crt",
    label: "the CRT cache",
    lightLabel: "CRT",
    hint: "Next lead: wake the CRT to release the final cache.",
    flag: GameStateFlags.FLAG_SECRET,
    pieces: [9, 7, 6, 14],
  },
];

const createHiddenPieces = () => Array(16).fill(true);

const createDispensedGroups = (): Record<PuzzleGroupKey, boolean> => ({
  stars: false,
  hand: false,
  connection: false,
  crt: false,
});

const isFlagActive = (binaryState: number, flag: GameStateFlags) =>
  (binaryState & (1 << flag)) !== 0;

export const PuzzleGame = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const puzzlebounds = useRef<SVGSVGElement>(null);
  const [pieceSize, setPieceSize] = useState(originalPieceSize);
  const [pieces, setPieces] = useState(originalPieces);
  const [box, setBox] = useState(originalCoords);
  const [hiddenPieces, setHiddenPieces] = useState<boolean[]>(() =>
    createHiddenPieces()
  );
  const [dispensedGroups, setDispensedGroups] = useState<
    Record<PuzzleGroupKey, boolean>
  >(() => createDispensedGroups());
  const [activeDispenseKey, setActiveDispenseKey] =
    useState<PuzzleGroupKey | null>(null);
  const [isPuzzleInView, setIsPuzzleInView] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const { lastPiece, totalPlacedPieces } = usePuzzleContext();
  const hasMounted = useRef(false);
  const dispensedGroupsRef = useRef(createDispensedGroups());
  const isDispenseSequenceRunningRef = useRef(false);
  const binaryState = useStore($gameState);

  const updatePieceSize = () => {
    if (puzzlebounds.current) {
      const bounds = puzzlebounds.current.getBoundingClientRect();
      const newBoundsWidth = bounds.width;

      const pieceSize = newBoundsWidth * scale;
      setPieceSize({ width: pieceSize, height: pieceSize });

      const scaleX = pieceSize / originalPieceSize.width;

      setDragConstraints({
        top: 0,
        left: 0,
        right: bounds.width - pieceSize,
        bottom: bounds.height - pieceSize,
      });

      setBox(
        box
          .split(",")
          .map((coord, index) => {
            return Math.round(parseInt(coord) * scaleX);
          })
          .join(",")
      );

      setPieces(
        originalPieces.map((piece, index) => {
          const newPolygonCoords = piece.polygonCoords
            .split(",")
            .map((coord, index) => {
              return Math.round(parseInt(coord) * scaleX);
            })
            .join(",");

          const newSnapPoint = {
            x: Math.round(piece.snapPoint.x * scaleX),
            y: Math.round(piece.snapPoint.y * scaleX),
          };

          const newStartPoint = {
            x: Math.round(piece.startPoint.x * scaleX),
            y: Math.round(piece.startPoint.y * scaleX),
          };

          return {
            ...piece,
            polygonCoords: newPolygonCoords,
            snapPoint: newSnapPoint,
            startPoint: newStartPoint,
          };
        })
      );
    }
  };

  useEffect(() => {
    updatePieceSize();
    window.addEventListener("resize", updatePieceSize);
    return () => window.removeEventListener("resize", updatePieceSize);
  }, []);

  useEffect(() => {
    if (hasMounted.current) {
      setHiddenPieces((current) =>
        current.map((hidden, index) => {
          return index === lastPiece - 1 ? true : hidden;
        })
      );
    } else {
      hasMounted.current = true;
    }
  }, [lastPiece]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPuzzleInView(entry.isIntersecting);
      },
      {
        threshold: 0.45,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isPuzzleInView) return;

    setActiveDispenseKey(null);
    isDispenseSequenceRunningRef.current = false;
  }, [isPuzzleInView]);

  useEffect(() => {
    if (!isPuzzleInView || isDispenseSequenceRunningRef.current) {
      return;
    }

    const pendingGroups = puzzleGroups.filter((group) => {
      return (
        isFlagActive(binaryState, group.flag) &&
        !dispensedGroupsRef.current[group.key]
      );
    });

    if (pendingGroups.length === 0) {
      return;
    }

    isDispenseSequenceRunningRef.current = true;

    const timers: ReturnType<typeof setTimeout>[] = [];

    pendingGroups.forEach((group, index) => {
      const startDelay =
        AUTO_DISPENSE_DELAY_MS + index * AUTO_DISPENSE_STAGGER_MS;

      timers.push(
        setTimeout(() => {
          setActiveDispenseKey(group.key);
          setDispensedGroups((current) => {
            const next = {
              ...current,
              [group.key]: true,
            };
            dispensedGroupsRef.current = next;
            return next;
          });
          setHiddenPieces((current) =>
            current.map((hidden, pieceIndex) => {
              return group.pieces.includes(pieceIndex + 1) ? false : hidden;
            })
          );
        }, startDelay)
      );

      timers.push(
        setTimeout(() => {
          setActiveDispenseKey((current) => {
            return current === group.key ? null : current;
          });
        }, startDelay + AUTO_DISPENSE_ACTIVE_MS)
      );
    });

    timers.push(
      setTimeout(() => {
        isDispenseSequenceRunningRef.current = false;
      }, AUTO_DISPENSE_DELAY_MS + (pendingGroups.length - 1) * AUTO_DISPENSE_STAGGER_MS + AUTO_DISPENSE_ACTIVE_MS)
    );

    return () => {
      isDispenseSequenceRunningRef.current = false;
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [binaryState, isPuzzleInView]);

  const nextUnsolvedGroup = puzzleGroups.find((group) => {
    return !isFlagActive(binaryState, group.flag);
  });
  const activeDispenseGroup = puzzleGroups.find((group) => {
    return group.key === activeDispenseKey;
  });
  const nextHint =
    nextUnsolvedGroup == null
      ? "All signal caches unlocked. Finish the picture."
      : nextUnsolvedGroup.key === "crt" && totalPlacedPieces < 12
      ? "Next lead: keep assembling the picture. The CRT wakes once the board is nearly complete."
      : nextUnsolvedGroup.hint;

  return (
    <div
      ref={containerRef}
      className="relative my-auto w-full shrink-0 select-none lg:w-5/12"
      draggable={false}
    >
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
                <div
                  key={group.key}
                  className="flex flex-col items-center gap-1"
                >
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
      {pieces.map(
        (piece, index) =>
          !hiddenPieces[index] && (
            <PuzzlePiece
              key={index}
              id={index + 1}
              path={piece.path}
              puzzlebounds={puzzlebounds}
              pieceSize={pieceSize}
              pieceBox={box}
              pieceCoords={piece.polygonCoords}
              snapPoint={piece.snapPoint}
              startPoint={piece.startPoint}
              dragConstraints={dragConstraints}
            />
          )
      )}
      <Puzzle ref={puzzlebounds} />
    </div>
  );
};
