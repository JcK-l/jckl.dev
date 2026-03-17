import { useState, useEffect } from "react";

export const TypingText = ({
  className,
  text,
  onComplete,
  onCompleteDelay = 600,
}: {
  className?: string;
  text: string;
  onComplete: () => void;
  onCompleteDelay?: number;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(timeout);
    } else {
      const completeTimeout = setTimeout(onComplete, onCompleteDelay); // Small delay before triggering onComplete
      return () => clearTimeout(completeTimeout);
    }
  }, [index, onComplete, onCompleteDelay, text]);

  return <p className={className}>{displayedText}</p>;
};
