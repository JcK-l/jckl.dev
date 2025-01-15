import { useContext } from 'react';
import { PhoneContext } from '../context/PhoneContext'; 
import { PuzzleContext } from '../context/PuzzleContext'; 

export const usePhoneContext = () => {
  const context = useContext(PhoneContext);
  if (!context) {
    throw new Error('usePhoneContext must be used within a PhoneProvider');
  }
  return context;
};

export const usePuzzleContext = () => {
  const context = useContext(PuzzleContext);
  if (!context) {
    throw new Error('usePuzzleContext must be used within a PuzzleProvider');
  }
  return context;
};