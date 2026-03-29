import { createContext, useRef, useState } from "react";
import type { ReactNode } from "react";

declare global {
  interface Window {
    __jcklE2EPuzzleState__?: {
      lastPiece?: number;
      totalPlacedPieces?: number;
    };
  }
}

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

const getInitialPuzzleState = () => {
  if (typeof window === "undefined") {
    return {
      lastPiece: 0,
      totalPlacedPieces: 0,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const isEndingReturnReadySeed =
    params.get("e2e-seed") === "ending-return-ready";

  return {
    lastPiece: window.__jcklE2EPuzzleState__?.lastPiece ?? 0,
    totalPlacedPieces:
      window.__jcklE2EPuzzleState__?.totalPlacedPieces ??
      (isEndingReturnReadySeed ? 16 : 0),
  };
};

export const PuzzleProvider = ({ children }: PuzzleProviderProps) => {
  const initialStateRef = useRef(getInitialPuzzleState());
  const [lastPiece, setLastPiece] = useState(initialStateRef.current.lastPiece);
  const [totalPlacedPieces, setTotalPlacedPieces] = useState(
    initialStateRef.current.totalPlacedPieces
  );

  return (
    <PuzzleContext.Provider
      value={{
        lastPiece,
        setLastPiece,
        totalPlacedPieces,
        setTotalPlacedPieces,
      }}
    >
      {children}
    </PuzzleContext.Provider>
  );
};
