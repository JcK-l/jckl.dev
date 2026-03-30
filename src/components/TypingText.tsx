import { useEffect, useRef, useState } from "react";

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
  const onCompleteRef = useRef(onComplete);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIndex(text.length);

      const completeTimeout = setTimeout(() => {
        onCompleteRef.current();
      }, 0);
      return () => clearTimeout(completeTimeout);
    }

    setDisplayedText("");
    setIndex(0);
  }, [prefersReducedMotion, text]);

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
      const completeTimeout = setTimeout(() => {
        onCompleteRef.current();
      }, onCompleteDelay);
      return () => clearTimeout(completeTimeout);
    }
  }, [
    index,
    onCompleteDelay,
    prefersReducedMotion,
    text,
    typingDelay,
    typingDelayJitter,
  ]);

  return <p className={className}>{displayedText}</p>;
};
