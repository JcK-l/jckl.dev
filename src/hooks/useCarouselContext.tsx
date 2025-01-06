import { useContext } from 'react';
import { CarouselContext } from '../context/CarouselContext'; // Adjust the path as needed

export const useCarouselContext = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarouselContext must be used within a CarouselProvider');
  }
  return context;
};