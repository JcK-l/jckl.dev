import { useRef, useEffect, useState, useCallback } from "react";
import { PuzzlePiece } from "./PuzzlePiece";
import { pieces as originalPieces } from "../data/PuzzleData"; 

const originalCoords = "0,300,300,0"
const originalPieceSize = { width: 300, height: 300 };
const scale = 0.27;

export const Puzzle = () => {
  const puzzlebounds = useRef<HTMLObjectElement>(null);
  const [pieceSize, setPieceSize] = useState(originalPieceSize);
  const [pieces, setPieces] = useState(originalPieces);
  const [box, setBox] = useState(originalCoords);

  const updatePieceSize = () => {
    if (puzzlebounds.current) {
      const bounds = puzzlebounds.current.getBoundingClientRect();
      const newBoundsWidth = bounds.width;

      const pieceSize = newBoundsWidth * scale; 
      setPieceSize({ width: pieceSize, height: pieceSize });


        const scaleX = pieceSize / originalPieceSize.width;

        setBox(box.split(',').map((coord, index) => {
          return Math.round(parseInt(coord) * scaleX);
        }).join(','));

      setPieces(pieces.map(piece => {
        const newPolygonCoords = piece.polygonCoords.split(',').map((coord, index) => {
          return Math.round(parseInt(coord) * scaleX);
        }).join(',');

        return {
          ...piece,
          polygonCoords: newPolygonCoords,
        };
      }));
    }
  };

  useEffect(() => {
    updatePieceSize();
    window.addEventListener('resize', updatePieceSize);
    return () => window.removeEventListener('resize', updatePieceSize);
  }, []);

  return (
    <div className="relative" draggable="false">
      {/* <button onClick={applySvgChanges}>Apply SVG Changes</button> */}
      {Object.entries(pieces).map(([key, piece]) => (
        <PuzzlePiece
          key={key}
          path={piece.path}
          puzzlebounds={puzzlebounds}
          pieceSize={pieceSize}
          pieceBox={box}
          pieceCoords={piece.polygonCoords}
          snapPosition={piece.snapPosition}
          hidden={false}
        />
      ))} 
      <object 
        ref={puzzlebounds}
        data="/puzzle.svg" 
        type="image/svg+xml" 
        className="relative select-none pointer-events-none w-full sm:w-6/12" 
        draggable="false" 
      />
    </div>
  );
};
