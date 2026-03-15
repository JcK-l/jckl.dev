import { useRef, useEffect, useState } from "react";
import { PuzzlePiece } from "./PuzzlePiece";
import { pieces as originalPieces } from "../data/PuzzleData";
import { usePuzzleContext } from "../hooks/useDataContext";
import { $gameState } from "../stores/gameStateStore";
import { useStore } from "@nanostores/react";
import { Puzzle } from "./Puzzle";
import {
  createDispensedGroups,
  isFlagActive,
  puzzleGroups,
  type DispensedGroups,
  type PuzzleGroupKey,
} from "../data/puzzleGroups";
import { PuzzleSignalBoard } from "./PuzzleSignalBoard";

const originalPieceSize = { width: 300, height: 300 };
const scale = 0.27;
const AUTO_DISPENSE_DELAY_MS = 1100;
const AUTO_DISPENSE_STAGGER_MS = 850;
const AUTO_DISPENSE_ACTIVE_MS = 550;
const createHiddenPieces = () => Array(originalPieces.length).fill(true);

const scaleCoordinateList = (coordinateList: string, factor: number) =>
  coordinateList
    .split(",")
    .map((coordinate) => {
      return Math.round(Number.parseInt(coordinate, 10) * factor);
    })
    .join(",");

const scalePoint = (point: { x: number; y: number }, factor: number) => ({
  x: Math.round(point.x * factor),
  y: Math.round(point.y * factor),
});

const createScaledPieces = (factor: number) =>
  originalPieces.map((piece) => ({
    ...piece,
    polygonCoords: scaleCoordinateList(piece.polygonCoords, factor),
    snapPoint: scalePoint(piece.snapPoint, factor),
    startPoint: scalePoint(piece.startPoint, factor),
  }));

export const PuzzleGame = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const puzzlebounds = useRef<SVGSVGElement>(null);
  const [pieceSize, setPieceSize] = useState(originalPieceSize);
  const [pieces, setPieces] = useState(originalPieces);
  const [hiddenPieces, setHiddenPieces] = useState<boolean[]>(() =>
    createHiddenPieces()
  );
  const [dispensedGroups, setDispensedGroups] = useState<DispensedGroups>(() =>
    createDispensedGroups()
  );
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

      const scaledPieceSize = newBoundsWidth * scale;
      const scaleFactor = scaledPieceSize / originalPieceSize.width;

      setPieceSize({ width: scaledPieceSize, height: scaledPieceSize });

      setDragConstraints({
        top: 0,
        left: 0,
        right: bounds.width - scaledPieceSize,
        bottom: bounds.height - scaledPieceSize,
      });

      setPieces(createScaledPieces(scaleFactor));
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

  return (
    <div
      ref={containerRef}
      className="relative my-auto w-full shrink-0 select-none lg:w-5/12"
      draggable={false}
    >
      <PuzzleSignalBoard
        activeDispenseKey={activeDispenseKey}
        binaryState={binaryState}
        dispensedGroups={dispensedGroups}
        totalPlacedPieces={totalPlacedPieces}
      />
      {pieces.map(
        (piece, index) =>
          !hiddenPieces[index] && (
            <PuzzlePiece
              key={index}
              id={index + 1}
              path={piece.path}
              puzzlebounds={puzzlebounds}
              pieceSize={pieceSize}
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
