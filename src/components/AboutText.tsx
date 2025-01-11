import { usePuzzleContext } from "../hooks/useDataContext";

interface AboutTextProps {
  text: string;
  showRange: {min: number, max: number}; // exclusive
  remove: boolean;
}

export const AboutText = ({text, showRange, remove}: AboutTextProps) => {
  const { lastPiece, setLastPiece, totalPlacedPieces, setTotalPlacedPieces  } = usePuzzleContext();

  if (totalPlacedPieces < showRange.min || (totalPlacedPieces > showRange.max && remove)) return null;

  return (
    <div className="relative w-full">
      {text}
    </div>
  );
}