import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { BetweenLands } from "../BetweenLands";
import { PuzzlePieceTransfer } from "../PuzzlePieceTransfer";
import { Phonewave } from "../phone/Phonewave";
import { puzzleGroups } from "../../data/puzzleGroups";
import { $phoneResultMode } from "../../stores/phoneStore";
import {
  $dispensedGroups,
  markPuzzleGroupDispensed,
} from "../../stores/puzzleDispenseStore";
import { $gameState, GameStateFlags } from "../../stores/gameStateStore";
import { $endingState, isEndingActive } from "../../stores/endingStore";

const BREAKPOINTS = {
  sm: 640,
  tablet: 768,
  lg: 1024,
  xl: 1280,
  desk: 1900,
} as const;

const CONNECTION_TRANSFER_DELAY_MS = 220;

const connectionPieceIds =
  puzzleGroups.find((group) => group.key === "connection")?.pieces ?? [];

const Connection = () => {
  const endingState = useStore($endingState);
  const binaryState = useStore($gameState);
  const dispensedGroups = useStore($dispensedGroups);
  const mode = useStore($phoneResultMode);
  const phonewaveRef = useRef<HTMLDivElement>(null);
  const [reservedHeight, setReservedHeight] = useState(420);
  const [transferKey, setTransferKey] = useState(0);
  const [pendingConnectionTransfer, setPendingConnectionTransfer] =
    useState(false);
  const [isPhonewaveSequenceComplete, setIsPhonewaveSequenceComplete] =
    useState(false);
  const hasConnectionUnlocked =
    (binaryState & (1 << GameStateFlags.FLAG_CONNECTION)) !== 0;
  const hasTriggeredTransferRef = useRef(hasConnectionUnlocked);

  useEffect(() => {
    const element = phonewaveRef.current;

    if (!element) {
      return;
    }

    const updateReservedHeight = () => {
      const nextHeight = element.getBoundingClientRect().height;
      const overlapAllowance =
        window.innerWidth < BREAKPOINTS.sm
          ? 24
          : window.innerWidth < BREAKPOINTS.tablet
          ? 40
          : window.innerWidth < BREAKPOINTS.lg
          ? 88
          : window.innerWidth < BREAKPOINTS.xl
          ? 128
          : window.innerWidth < BREAKPOINTS.desk
          ? 156
          : 196;

      // Small screens keep the card mostly above the separator to avoid
      // colliding with the section above; larger screens can sink deeper.
      setReservedHeight(
        Math.max(Math.round(nextHeight - overlapAllowance), 360)
      );
    };

    updateReservedHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateReservedHeight();
    });

    resizeObserver.observe(element);
    window.addEventListener("resize", updateReservedHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateReservedHeight);
    };
  }, []);

  useEffect(() => {
    const hasJustUnlocked =
      hasConnectionUnlocked && !hasTriggeredTransferRef.current;

    hasTriggeredTransferRef.current = hasConnectionUnlocked;

    if (!hasJustUnlocked || dispensedGroups.connection) {
      return;
    }

    setPendingConnectionTransfer(true);
    setIsPhonewaveSequenceComplete(false);
  }, [dispensedGroups.connection, hasConnectionUnlocked]);

  useEffect(() => {
    if (mode !== "connection") {
      setIsPhonewaveSequenceComplete(false);
    }
  }, [mode]);

  useEffect(() => {
    if (
      !pendingConnectionTransfer ||
      !isPhonewaveSequenceComplete ||
      dispensedGroups.connection
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setTransferKey((currentKey) => currentKey + 1);
      setPendingConnectionTransfer(false);
    }, CONNECTION_TRANSFER_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    dispensedGroups.connection,
    isPhonewaveSequenceComplete,
    pendingConnectionTransfer,
  ]);

  if (isEndingActive("negative", endingState)) {
    return <div></div>;
  }

  return (
    <BetweenLands
      isBackground={false}
      isCrt={false}
      renderItem={() => (
        <div
          className="min-h-[22rem] tablet:min-h-[20rem]"
          style={{ height: `${reservedHeight}px` }}
        />
      )}
      separatorInMiddleLayer={
        <PuzzlePieceTransfer
          direction="up"
          onComplete={() => {
            markPuzzleGroupDispensed("connection");
          }}
          pieceIds={connectionPieceIds}
          sourceRef={phonewaveRef}
          triggerKey={transferKey}
        />
      }
      separatorOutMiddleLayer={
        <div
          ref={phonewaveRef}
          className="pointer-events-auto absolute bottom-[50%] left-1/2 w-[94%] max-w-[52rem] -translate-x-1/2 sm:bottom-[50%] sm:w-[88%] tablet:bottom-[50%] tablet:w-[82%] lg:bottom-[41%] lg:left-[63%] lg:w-[72%] xl:bottom-[47%] xl:left-[68%] xl:w-[65%] desk:bottom-[50%] desk:left-[69%] desk:w-[60%] desk-l:bottom-[53%] desk-l:left-[72%] desk-l:w-[56%] desk-xl:bottom-[8%] desk-xl:left-[62%] desk-xl:w-[52%]"
          style={{ maxWidth: "min(52rem, calc(100vw - 1rem))" }}
        >
          <Phonewave
            className="w-full"
            onSequenceComplete={() => {
              setIsPhonewaveSequenceComplete(true);
            }}
            variant={mode === "connection" ? "result" : "idle"}
          />
        </div>
      }
    />
  );
};

export default Connection;
