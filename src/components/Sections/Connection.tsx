import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { BetweenLands } from "../BetweenLands";
import { ApplianceShell } from "../appliance/ApplianceShell";
import { ApplianceTerminal } from "../appliance/ApplianceTerminal";
import { PuzzlePieceTransfer } from "../puzzle/PuzzlePieceTransfer";
import { Phonewave } from "../phone/Phonewave";
import { puzzleGroups } from "../../data/puzzleGroups";
import { $phoneResultMode } from "../../stores/phoneStore";
import {
  $dispensedGroups,
  markPuzzleGroupDispensed,
} from "../../stores/puzzleDispenseStore";
import {
  $gameState,
  GameStateFlags,
  hasBit as gameStateHasBit,
} from "../../stores/gameStateStore";
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

const ConnectionStatusPanel = ({
  headerMeta,
  lines,
}: {
  headerMeta: string;
  lines: Array<{ tone?: "default" | "muted" | "warning"; value: string }>;
}) => (
  <ApplianceShell
    className="mx-auto w-full px-5 py-5 md:px-7"
    radius="2rem"
    showHighlight
  >
    <div
      className="flex items-start gap-4 border-b pb-4"
      style={{ borderColor: "var(--color-appliance-shell-border)" }}
    >
      <div className="space-y-1.5">
        <p
          className="text-[0.56rem] uppercase tracking-[0.3em]"
          style={{ color: "var(--color-appliance-label)" }}
        >
          future gadget no. 8
        </p>
        <p className="text-[0.86rem] tracking-[0.08em] text-[var(--color-primary)] sm:text-[0.98rem]">
          PhoneWave (name subject to change)
        </p>
      </div>
    </div>
    <div className="mt-5">
      <ApplianceTerminal
        bodyClassName="flex flex-col space-y-2.5"
        className="min-h-[16rem]"
        headerLabel="system status"
        headerMeta={headerMeta}
      >
        {lines.map((line, index) => (
          <p
            key={`${headerMeta}-${index}`}
            className={`text-[0.72rem] uppercase tracking-[0.18em] sm:text-[0.82rem] ${
              line.tone === "muted"
                ? "text-[var(--color-appliance-screen-muted)]"
                : line.tone === "warning"
                ? "text-[var(--color-baloon1)]"
                : "text-[var(--color-appliance-screen-text)]"
            }`}
          >
            {line.value}
          </p>
        ))}
      </ApplianceTerminal>
    </div>
  </ApplianceShell>
);

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
  const isNegativeEndingActive = isEndingActive("negative", endingState);
  const isNeutralEndingActive = isEndingActive("neutral", endingState);
  const isPositiveEndingActive = isEndingActive("positive", endingState);
  const hasConnectionUnlocked = gameStateHasBit(
    binaryState,
    GameStateFlags.FLAG_CONNECTION
  );
  const hasTriggeredTransferRef = useRef(hasConnectionUnlocked);

  useEffect(() => {
    const element = phonewaveRef.current;

    if (!element) {
      return;
    }
    const updateReservedHeight = (nextHeight: number) => {
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
      const computedHeight = Math.max(
        Math.round(nextHeight - overlapAllowance),
        360
      );

      setReservedHeight((currentHeight) =>
        currentHeight === computedHeight ? currentHeight : computedHeight
      );
    };

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      updateReservedHeight(entry.contentRect.height);
    });
    const handleResize = () => {
      updateReservedHeight(element.clientHeight);
    };

    resizeObserver.observe(element);
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
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

  const connectionPanelVariant = isPositiveEndingActive
    ? "hidden"
    : isNegativeEndingActive
    ? "negative"
    : isNeutralEndingActive
    ? "neutral"
    : "phonewave";
  const reservedPanelHeight =
    connectionPanelVariant === "hidden" ? 176 : reservedHeight;
  const middleLayerContent =
    connectionPanelVariant === "phonewave" ? (
      <Phonewave
        className="w-full"
        onSequenceComplete={() => {
          setIsPhonewaveSequenceComplete(true);
        }}
        variant={mode === "connection" ? "result" : "idle"}
      />
    ) : connectionPanelVariant === "neutral" ? (
      <ConnectionStatusPanel
        headerMeta="relay cold start"
        lines={[
          {
            tone: "muted",
            value: "[boot] temporal relay not yet initialized",
          },
          {
            tone: "default",
            value: "[status] first stable offset has not been registered",
          },
          {
            tone: "muted",
            value: "[action] await initialization before arming the relay",
          },
        ]}
      />
    ) : connectionPanelVariant === "negative" ? (
      <ConnectionStatusPanel
        headerMeta="retry saturation"
        lines={[
          {
            tone: "warning",
            value: "[warning] repeated rollback signatures detected",
          },
          {
            tone: "default",
            value: "[status] state index cannot advance beyond the current checkpoint",
          },
          {
            tone: "muted",
            value: "[action] clear the loop condition before requesting another pass",
          },
        ]}
      />
    ) : null;

  return (
    <BetweenLands
      isBackground={false}
      isCrt={false}
      renderItem={() => (
        <div
          className="min-h-[22rem] tablet:min-h-[20rem]"
          style={{ height: `${reservedPanelHeight}px` }}
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
        middleLayerContent === null ? null : (
          <div
            ref={phonewaveRef}
            className="pointer-events-auto absolute bottom-[50%] left-1/2 w-[94%] max-w-[52rem] -translate-x-1/2 sm:bottom-[50%] sm:w-[88%] tablet:bottom-[50%] tablet:w-[82%] lg:bottom-[41%] lg:left-[63%] lg:w-[72%] xl:bottom-[47%] xl:left-[68%] xl:w-[65%] desk:bottom-[50%] desk:left-[69%] desk:w-[60%] desk-l:bottom-[53%] desk-l:left-[72%] desk-l:w-[56%] desk-xl:bottom-[8%] desk-xl:left-[62%] desk-xl:w-[52%]"
            style={{ maxWidth: "min(52rem, calc(100vw - 1rem))" }}
          >
            {middleLayerContent}
          </div>
        )
      }
    />
  );
};

export default Connection;
