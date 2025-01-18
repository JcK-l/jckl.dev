import { useRef, useEffect, useState } from "react";
import { PuzzlePiece } from "./PuzzlePiece";
import { pieces as originalPieces } from "../data/PuzzleData";
import { usePuzzleContext } from "../hooks/useDataContext";
import { Button } from "./Button";
import {
  $binaryState,
  BitPosition,
  isBitSet,
} from "../stores/binaryStateStore";
import { useStore } from "@nanostores/react";
import { Puzzle } from "./Puzzle";

const originalCoords = "0,300,300,0";
const originalPieceSize = { width: 300, height: 300 };
const scale = 0.27;

export const PuzzleGame = () => {
  const puzzlebounds = useRef<SVGSVGElement>(null);
  const [pieceSize, setPieceSize] = useState(originalPieceSize);
  const [reRender, setReRender] = useState(false);
  const pieces = useRef(originalPieces);
  const [box, setBox] = useState(originalCoords);
  const [dragConstraints, setDragConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const { lastPiece, setLastPiece, totalPlacedPieces, setTotalPlacedPieces } =
    usePuzzleContext();
  const hasMounted = useRef(false);
  const binaryState = useStore($binaryState);

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

      pieces.current = originalPieces.map((piece, index) => {
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
          hidden: pieces.current[index].hidden,
          polygonCoords: newPolygonCoords,
          snapPoint: newSnapPoint,
          startPoint: newStartPoint,
        };
      });
    }
  };

  useEffect(() => {
    updatePieceSize();
    window.addEventListener("resize", updatePieceSize);
    return () => window.removeEventListener("resize", updatePieceSize);
  }, []);

  const unhidePieces = (selectedPieces: number[]): void => {
    selectedPieces.forEach((id) => {
      pieces.current[id - 1].hidden = false;
    });
    setReRender(!reRender);
  };

  useEffect(() => {
    if (hasMounted.current) {
      pieces.current[lastPiece - 1].hidden = true;
      setReRender(!reRender);
    } else {
      hasMounted.current = true;
    }
  }, [lastPiece]);

  return (
    <div
      className="relative w-full shrink-0 select-none md:w-6/12 2xl:w-5/12"
      draggable={false}
    >
      <div className="relative mb-4 flex w-full justify-center gap-2">
        <Button
          text="Stars align"
          initial={!isBitSet(BitPosition.FLAG_STARS_ALIGN)}
          onClick={() => {
            unhidePieces([1, 12, 13, 5]);
          }}
        />
        <Button
          text="Lend a hand"
          initial={!isBitSet(BitPosition.FLAG_LEND_A_HAND)}
          onClick={() => {
            unhidePieces([15, 11, 3, 8]);
          }}
        />
        <Button
          text="____#"
          initial={!isBitSet(BitPosition.FLAG_CONNECTION)}
          onClick={() => {
            unhidePieces([16, 10, 2, 4]);
          }}
        />
      </div>
      {pieces.current.map((piece, index) => (
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
          hidden={piece.hidden}
        />
      ))}
      <Puzzle ref={puzzlebounds} />
      <div className="relative mt-4 flex justify-center">
        <Button
          text={`${totalPlacedPieces < 12 ? "???" : "Turn on the crt..."}`}
          initial={!isBitSet(BitPosition.FLAG_SECRET)}
          onClick={() => {
            unhidePieces([9, 7, 6, 14]);
          }}
        />
      </div>
    </div>
  );
};
