import { createContext, useState} from 'react';
import type { ReactNode } from 'react';

interface PuzzleContextType {
  lastPiece: number;
  setLastPiece: React.Dispatch<React.SetStateAction<number>>;
  totalPlacedPieces: number;
  setTotalPlacedPieces: React.Dispatch<React.SetStateAction<number>>;
}

interface PuzzleProviderProps {
  children: ReactNode;
}

export const PuzzleContext = createContext<PuzzleContextType | undefined>(undefined);

export const PuzzleProvider = ({ children }: PuzzleProviderProps) => {
  const [lastPiece, setLastPiece] = useState(0);
  const [totalPlacedPieces, setTotalPlacedPieces] = useState(0);

  return (
    <PuzzleContext.Provider value={{ lastPiece, setLastPiece, totalPlacedPieces, setTotalPlacedPieces }}>
      {children}
    </PuzzleContext.Provider>
  );
};