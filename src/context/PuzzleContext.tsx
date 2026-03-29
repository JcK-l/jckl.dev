import { createContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  DEBUG_PUZZLE_STATE_EVENT,
  getDebugPuzzleState,
  syncDebugPuzzleState,
} from "../utility/debugState";

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
    return getDebugPuzzleState();
  }

  const params = new URLSearchParams(window.location.search);
  const isEndingReturnReadySeed =
    params.get("e2e-seed") === "ending-return-ready";

  const debugPuzzleState = getDebugPuzzleState();

  return {
    lastPiece: debugPuzzleState.lastPiece,
    totalPlacedPieces:
      debugPuzzleState.totalPlacedPieces ?? (isEndingReturnReadySeed ? 16 : 0),
  };
};

export const PuzzleProvider = ({ children }: PuzzleProviderProps) => {
  const initialStateRef = useRef(getInitialPuzzleState());
  const [lastPiece, setLastPiece] = useState(initialStateRef.current.lastPiece);
  const [totalPlacedPieces, setTotalPlacedPieces] = useState(
    initialStateRef.current.totalPlacedPieces
  );

  useEffect(() => {
    const syncFromDebugState = (event: Event) => {
      const nextPuzzleState =
        event instanceof CustomEvent
          ? (event.detail as ReturnType<typeof getDebugPuzzleState>)
          : getDebugPuzzleState();

      setLastPiece(nextPuzzleState.lastPiece);
      setTotalPlacedPieces(nextPuzzleState.totalPlacedPieces);
    };

    window.addEventListener(DEBUG_PUZZLE_STATE_EVENT, syncFromDebugState);

    return () => {
      window.removeEventListener(DEBUG_PUZZLE_STATE_EVENT, syncFromDebugState);
    };
  }, []);

  useEffect(() => {
    syncDebugPuzzleState({
      lastPiece,
      totalPlacedPieces,
    });
  }, [lastPiece, totalPlacedPieces]);

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
