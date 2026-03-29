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
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIndex(text.length);

      const completeTimeout = setTimeout(onComplete, 0);
      return () => clearTimeout(completeTimeout);
    }

    setDisplayedText("");
    setIndex(0);
  }, [onComplete, prefersReducedMotion, text]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

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
    prefersReducedMotion,
    text,
    typingDelay,
    typingDelayJitter,
  ]);

  return <p className={className}>{displayedText}</p>;
};
