import React, { createContext, useState} from 'react';
import type { ReactNode } from 'react';
import { projects } from '../data/ProjectData';

interface CarouselContextType {
  isAnimating: boolean;
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
  position: number;
  setPosition: React.Dispatch<React.SetStateAction<number>>;
}

interface CarouselProviderProps {
  children: ReactNode;
}

export const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

export const CarouselProvider = ({ children }: CarouselProviderProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [position, setPosition] = useState(projects.length);

  return (
    <CarouselContext.Provider value={{ isAnimating, setIsAnimating, position, setPosition }}>
      {children}
    </CarouselContext.Provider>
  );
};