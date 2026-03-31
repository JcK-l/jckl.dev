import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { PuzzlePiece } from "./PuzzlePiece";
import { Puzzle } from "./Puzzle";
import { PuzzleSignalBoard } from "./PuzzleSignalBoard";
import { pieces as originalPieces } from "../../data/PuzzleData";
import { puzzleGroups, type DispensedGroups } from "../../data/puzzleGroups";
import { usePuzzleContext } from "../../hooks/useDataContext";
import { $gameState, hasBit } from "../../stores/gameStateStore";
import { $dispensedGroups } from "../../stores/puzzleDispenseStore";
import { setPuzzlePieceSize } from "../../stores/puzzleLayoutStore";
import { $puzzleResetRequest } from "../../stores/puzzleResetStore";
import { preloadImages } from "../../utility/preloadImages";

const originalPieceSize = { width: 300, height: 300 };
const scale = 0.27;
const createPlacedPieces = () => Array(originalPieces.length).fill(false);
const initialDragConstraints = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

const isPieceAvailable = (
  pieceIndex: number,
  dispensedGroups: DispensedGroups,
  binaryState: number
) => {
  const group = puzzleGroups.find((candidateGroup) => {
    return candidateGroup.pieces.includes(pieceIndex + 1);
  });

  return group == null
    ? false
    : dispensedGroups[group.key] || hasBit(binaryState, group.flag);
};

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

const isSamePieceSize = (
  current: { width: number; height: number },
  next: { width: number; height: number }
) => current.width === next.width && current.height === next.height;

const isSameDragConstraints = (
  current: { top: number; left: number; right: number; bottom: number },
  next: { top: number; left: number; right: number; bottom: number }
) =>
  current.top === next.top &&
  current.left === next.left &&
  current.right === next.right &&
  current.bottom === next.bottom;

const createScaledPieces = (factor: number) =>
  originalPieces.map((piece) => ({
    ...piece,
    polygonCoords: scaleCoordinateList(piece.polygonCoords, factor),
    snapPoint: scalePoint(piece.snapPoint, factor),
    startPoint: scalePoint(piece.startPoint, factor),
  }));

export const PuzzleGame = () => {
  const puzzlebounds = useRef<SVGSVGElement>(null);
  const [pieceSize, setPieceSize] = useState(originalPieceSize);
  const [pieces, setPieces] = useState(originalPieces);
  const [placedPieces, setPlacedPieces] = useState<boolean[]>(() =>
    createPlacedPieces()
  );
  const [dragConstraints, setDragConstraints] = useState(initialDragConstraints);
  const pieceSizeRef = useRef(pieceSize);
  const dragConstraintsRef = useRef(dragConstraints);
  const scaleFactorRef = useRef<number | null>(null);
  const { lastPiece, setLastPiece, totalPlacedPieces, setTotalPlacedPieces } =
    usePuzzleContext();
  const dispensedGroups = useStore($dispensedGroups);
  const binaryState = useStore($gameState);
  const puzzleResetRequest = useStore($puzzleResetRequest);
  const handledResetTokenRef = useRef(0);

  const updatePieceSize = () => {
    if (puzzlebounds.current) {
      const bounds = puzzlebounds.current.getBoundingClientRect();
      const newBoundsWidth = bounds.width;

      const scaledPieceSize = newBoundsWidth * scale;
      const scaleFactor = scaledPieceSize / originalPieceSize.width;
      const nextPieceSize = {
        width: scaledPieceSize,
        height: scaledPieceSize,
      };
      const nextDragConstraints = {
        top: 0,
        left: 0,
        right: bounds.width - scaledPieceSize,
        bottom: bounds.height - scaledPieceSize,
      };

      if (!isSamePieceSize(pieceSizeRef.current, nextPieceSize)) {
        pieceSizeRef.current = nextPieceSize;
        setPieceSize(nextPieceSize);
        setPuzzlePieceSize(scaledPieceSize);
      }

      if (
        !isSameDragConstraints(dragConstraintsRef.current, nextDragConstraints)
      ) {
        dragConstraintsRef.current = nextDragConstraints;
        setDragConstraints(nextDragConstraints);
      }

      if (scaleFactorRef.current !== scaleFactor) {
        scaleFactorRef.current = scaleFactor;
        setPieces(createScaledPieces(scaleFactor));
      }
    }
  };

  useEffect(() => {
    updatePieceSize();
    window.addEventListener("resize", updatePieceSize);

    return () => {
      window.removeEventListener("resize", updatePieceSize);
      setPuzzlePieceSize(0);
    };
  }, []);

  useEffect(() => {
    if (lastPiece <= 0) {
      return;
    }

    setPlacedPieces((currentPieces) =>
      currentPieces.map((isPlaced, index) => {
        return index === lastPiece - 1 ? true : isPlaced;
      })
    );
  }, [lastPiece]);

  useEffect(() => {
    const dispensedPiecePaths = puzzleGroups.flatMap((group) => {
      if (!dispensedGroups[group.key] && !hasBit(binaryState, group.flag)) {
        return [];
      }

      return group.pieces.map((pieceId) => originalPieces[pieceId - 1].path);
    });

    if (dispensedPiecePaths.length === 0) {
      return;
    }

    void preloadImages(dispensedPiecePaths);
  }, [binaryState, dispensedGroups]);

  useEffect(() => {
    if (
      puzzleResetRequest === null ||
      puzzleResetRequest.token === handledResetTokenRef.current
    ) {
      return;
    }

    handledResetTokenRef.current = puzzleResetRequest.token;

    const resetPieceIndexes = new Set(
      puzzleResetRequest.pieceIds.map((pieceId) => pieceId - 1)
    );
    const affectedPlacedCount = placedPieces.reduce(
      (count, isPlaced, index) => {
        return count + (isPlaced && resetPieceIndexes.has(index) ? 1 : 0);
      },
      0
    );
    const nextShouldBePlaced = puzzleResetRequest.action === "restore";
    const changedPieceCount = nextShouldBePlaced
      ? puzzleResetRequest.pieceIds.length - affectedPlacedCount
      : affectedPlacedCount;

    puzzleResetRequest.pieceIds.forEach((pieceId) => {
      const svgImage = document.getElementById(`p${pieceId}`);

      if (svgImage) {
        svgImage.style.opacity = nextShouldBePlaced ? "1" : "0";
      }
    });

    setPlacedPieces((currentPieces) => {
      return currentPieces.map((isPlaced, index) => {
        return resetPieceIndexes.has(index) ? nextShouldBePlaced : isPlaced;
      });
    });
    setLastPiece(0);

    if (changedPieceCount > 0) {
      setTotalPlacedPieces((currentCount) => {
        return nextShouldBePlaced
          ? Math.min(originalPieces.length, currentCount + changedPieceCount)
          : Math.max(0, currentCount - changedPieceCount);
      });
    }
  }, [placedPieces, puzzleResetRequest, setLastPiece, setTotalPlacedPieces]);

  return (
    <div
      className="relative w-full shrink-0 self-start select-none lg:w-5/12"
      draggable={false}
    >
      <PuzzleSignalBoard
        binaryState={binaryState}
        dispensedGroups={dispensedGroups}
        totalPlacedPieces={totalPlacedPieces}
      />
      {pieces.map((piece, index) => {
        if (
          placedPieces[index] ||
          !isPieceAvailable(index, dispensedGroups, binaryState)
        ) {
          return null;
        }

        return (
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
        );
      })}
      <Puzzle ref={puzzlebounds} />
    </div>
  );
};
