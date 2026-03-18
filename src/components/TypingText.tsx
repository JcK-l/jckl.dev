import { useState, useEffect } from "react";

export const TypingText = ({
  className,
  text,
  onComplete,
  typingDelay = 25,
  typingDelayJitter = 0,
  onCompleteDelay = 600,
}: {
  className?: string;
  text: string;
  onComplete: () => void;
  typingDelay?: number;
  typingDelayJitter?: number;
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
      const nextDelay =
        typingDelayJitter <= 0
          ? typingDelay
          : Math.max(
              0,
              typingDelay +
                Math.round((Math.random() * 2 - 1) * typingDelayJitter)
            );
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, nextDelay);
      return () => clearTimeout(timeout);
    } else {
      const completeTimeout = setTimeout(onComplete, onCompleteDelay); // Small delay before triggering onComplete
      return () => clearTimeout(completeTimeout);
    }
  }, [
    index,
    onComplete,
    onCompleteDelay,
    text,
    typingDelay,
    typingDelayJitter,
  ]);

  return <p className={className}>{displayedText}</p>;
};
