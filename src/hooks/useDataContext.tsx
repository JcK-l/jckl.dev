import { useContext } from 'react';
import { PuzzleContext } from '../context/PuzzleContext'; 

export const usePuzzleContext = () => {
  const context = useContext(PuzzleContext);
  if (!context) {
    throw new Error('usePuzzleContext must be used within a PuzzleProvider');
  }
  return context;
};
