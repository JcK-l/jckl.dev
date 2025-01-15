import { createContext, useState} from 'react';
import type { ReactNode } from 'react';

interface PhoneContextType {
  number: number;
  setNumber: React.Dispatch<React.SetStateAction<number>>;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
}

interface PhoneProviderProps {
  children: ReactNode;
}

export const PhoneContext = createContext<PhoneContextType | undefined>(undefined);

export const PhoneProvider = ({ children }: PhoneProviderProps) => {
  const [number, setNumber] = useState(0);
  const [timer, setTimer] = useState(0);

  return (
    <PhoneContext.Provider value={{ number, setNumber, timer, setTimer }}>
      {children}
    </PhoneContext.Provider>
  );
};