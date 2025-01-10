import { useState } from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  initial: boolean;
}

export const Button = ({ text, onClick, initial }: ButtonProps) => {
  const [pressed, setPressed] = useState(false);

  const handleButtonClick = () => {
    setPressed(true);
    onClick();
  };

  return (
    <span className="relative small-text 2xl:p-text">
      <button onClick={handleButtonClick} 
        className={`p-2 button-on ${pressed ? 'disabled:button-pressed' : 'disabled:button-initial'}`} 
        disabled={initial || pressed}
      >
        {text}
      </button>
      {(!pressed && !initial) && (
        <span className="absolute flex h-3 w-3 top-0 right-0 -mt-1 -mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-extra1 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-extra2"></span>
        </span>
      )}
    </span>
  );
};