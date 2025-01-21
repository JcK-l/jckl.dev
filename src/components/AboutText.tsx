import { usePuzzleContext } from "../hooks/useDataContext";
import type { ReactNode } from 'react';

interface AboutTextProps {
  renderItem: () => ReactNode;
  showRange: {min: number, max: number}; // exclusive
  removeOnNext: boolean;
  isAboutText: boolean;
}

export const AboutText = ({renderItem, showRange, removeOnNext, isAboutText}: AboutTextProps) => {
  if (!isAboutText) return null;

  const { lastPiece, setLastPiece, totalPlacedPieces, setTotalPlacedPieces  } = usePuzzleContext();

  if (totalPlacedPieces < showRange.min || (totalPlacedPieces > showRange.max && removeOnNext)) return null;

  return (
    <div className="relative w-full">
      {renderItem()}
    </div>
  );
}