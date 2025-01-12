import { useRef, useEffect, useState  } from "react";
import { PuzzlePiece } from "./PuzzlePiece";
import { pieces as originalPieces } from "../data/PuzzleData"; 
import { usePuzzleContext } from "../hooks/useDataContext";
import { Button } from "./Button";

const originalCoords = "0,300,300,0"
const originalPieceSize = { width: 300, height: 300 };
const scale = 0.27;

export const Puzzle = () => {
  const puzzlebounds = useRef<HTMLObjectElement>(null);
  const [pieceSize, setPieceSize] = useState(originalPieceSize);
  const [reRender, setReRender] = useState(false);
  const pieces = useRef(originalPieces);
  const [box, setBox] = useState(originalCoords);
  const [dragConstraints, setDragConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });
  const { lastPiece, setLastPiece, totalPlacedPieces, setTotalPlacedPieces  } = usePuzzleContext();
  const hasMounted = useRef(false);

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

      setBox(box.split(',').map((coord, index) => {
        return Math.round(parseInt(coord) * scaleX);
      }).join(','));

      pieces.current = originalPieces.map((piece, index) => {
        const newPolygonCoords = piece.polygonCoords.split(',').map((coord, index) => {
          return Math.round(parseInt(coord) * scaleX);
        }).join(',');

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


  const unhidePieces = (selectedPieces : number[]): void => {
    selectedPieces.forEach(id => {
      pieces.current[id - 1].hidden = false;
    });
    setReRender(!reRender);
  }

  useEffect(() => {
    updatePieceSize();
    window.addEventListener('resize', updatePieceSize);
    return () => window.removeEventListener('resize', updatePieceSize);
  }, []);

  useEffect(() => {
    if (hasMounted.current) {
      pieces.current[lastPiece - 1].hidden = true;
      setReRender(!reRender);
    } else {
      hasMounted.current = true;
    }
  }, [lastPiece]);


  return (
    <div className="relative select-none w-full md:w-6/12 2xl:w-5/12 shrink-0" draggable={false}>
      {/* <div className="flex justify-center mb-12 gap-2 w-full">
        <Button text="Stars align" initial={false} onClick={() => {unhidePieces([1,12,13,5])}} />
        <Button text="Help me out" initial={false} onClick={() => {unhidePieces([15,11,3,8])}} />
        <Button text="something" initial={false} onClick={() => {unhidePieces([16,10,2,4])}} />
        <Button text="???" initial={false} onClick={() => {unhidePieces([9,7,6,14])}} />
      </div> */}
      <div className="relative flex justify-center mb-4 gap-2 w-full">
        <Button text="Stars align" initial={false} onClick={() => { unhidePieces([1, 12, 13, 5]); }} />
        <Button text="Lend a hand" initial={false} onClick={() => { unhidePieces([15, 11, 3, 8]); }} />
        <Button text="Infinity" initial={false} onClick={() => { unhidePieces([16, 10, 2, 4]); }} />
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
      <object 
        ref={puzzlebounds}
        data="/puzzle.svg" 
        type="image/svg+xml" 
        className="relative select-none pointer-events-none w-full" 
        draggable="false" 
      />
      <div className="relative flex justify-center mt-4">
        <Button text="???" initial={true} onClick={() => { unhidePieces([9, 7, 6, 14]); }} />
      </div>
    </div>
  );
};
