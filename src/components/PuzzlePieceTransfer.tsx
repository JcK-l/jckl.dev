import { motion } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import { pieces as puzzlePieces } from "../data/PuzzleData";
import { $puzzlePieceSize } from "../stores/puzzleLayoutStore";
import { preloadPieceImages } from "../utility/pieceImages";

type TransferDirection = "up" | "down";

type TransferBurst = {
  id: number;
  pieceSize: number;
  sourcePoint: { x: number; y: number };
  targetPoint: { x: number; y: number };
};

type PuzzlePieceTransferProps = {
  direction?: TransferDirection;
  onStart?: () => void;
  onComplete?: () => void;
  pieceIds: number[];
  sourceAnchor?: { x: number; y: number };
  sourcePoint?: { x: number; y: number };
  sourceRef: RefObject<Element | null>;
  triggerKey: number;
};

const LAUNCH_DURATION_MS = 2900;
const PIECE_STAGGER_MS = 140;
const SETTLE_BUFFER_MS = 140;
const TRANSFER_PIECE_BASE_SIZE_PX = 100;
const pieceOffsets = [
  { startX: -34, startY: 12, spreadX: -82, spreadY: -34, rotate: -18 },
  { startX: 28, startY: -10, spreadX: 64, spreadY: -56, rotate: 16 },
  { startX: -18, startY: -30, spreadX: -46, spreadY: -88, rotate: -10 },
  { startX: 36, startY: 18, spreadX: 88, spreadY: -14, rotate: 22 },
];
const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const getTransferPieceSize = (
  viewportWidth: number,
  viewportHeight: number
) => {
  const viewportBasis = Math.min(viewportWidth, viewportHeight);

  return clamp(viewportBasis * 0.11, 82, 124);
};

export const PuzzlePieceTransfer = ({
  direction = "up",
  onStart,
  onComplete,
  pieceIds,
  sourceAnchor = { x: 0.5, y: 0.38 },
  sourcePoint,
  sourceRef,
  triggerKey,
}: PuzzlePieceTransferProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const completionTimeoutRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const onStartRef = useRef(onStart);
  const onCompleteRef = useRef(onComplete);
  const handledTriggerKeyRef = useRef(0);
  const [burst, setBurst] = useState<TransferBurst | null>(null);

  useEffect(() => {
    onStartRef.current = onStart;
  }, [onStart]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (triggerKey === 0 || triggerKey === handledTriggerKeyRef.current) {
      return;
    }

    handledTriggerKeyRef.current = triggerKey;

    let isCancelled = false;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const startTransfer = async () => {
      if (prefersReducedMotion) {
        onStartRef.current?.();
        onCompleteRef.current?.();
        return;
      }

      await preloadPieceImages(
        pieceIds.map((pieceId) => puzzlePieces[pieceId - 1].path)
      );

      if (isCancelled) {
        return;
      }

      const overlay = overlayRef.current;
      const sourceElement = sourceRef.current;

      if (!overlay) {
        onStartRef.current?.();
        onCompleteRef.current?.();
        return;
      }

      const overlayBounds = overlay.getBoundingClientRect();
      const resolvedSourcePoint =
        sourcePoint != null
          ? {
              x: sourcePoint.x - overlayBounds.left,
              y: sourcePoint.y - overlayBounds.top,
            }
          : sourceElement != null
          ? (() => {
              const sourceBounds = sourceElement.getBoundingClientRect();

              return {
                x:
                  sourceBounds.left +
                  sourceBounds.width * sourceAnchor.x -
                  overlayBounds.left,
                y:
                  sourceBounds.top +
                  sourceBounds.height * sourceAnchor.y -
                  overlayBounds.top,
              };
            })()
          : null;

      if (resolvedSourcePoint === null) {
        onStartRef.current?.();
        onCompleteRef.current?.();
        return;
      }

      const targetPoint = {
        x: clamp(resolvedSourcePoint.x, 108, overlayBounds.width - 108),
        y: direction === "up" ? 56 : overlayBounds.height - 56,
      };
      const currentPuzzlePieceSize = $puzzlePieceSize.get();
      const pieceSize =
        currentPuzzlePieceSize > 0
          ? currentPuzzlePieceSize
          : getTransferPieceSize(window.innerWidth, window.innerHeight);
      const totalDuration =
        LAUNCH_DURATION_MS +
        Math.max(pieceIds.length - 1, 0) * PIECE_STAGGER_MS +
        SETTLE_BUFFER_MS;

      setBurst({
        id: triggerKey,
        pieceSize,
        sourcePoint: resolvedSourcePoint,
        targetPoint,
      });
      onStartRef.current?.();

      completionTimeoutRef.current = window.setTimeout(() => {
        setBurst((currentBurst) => {
          return currentBurst?.id === triggerKey ? null : currentBurst;
        });
        completionTimeoutRef.current = null;
        onCompleteRef.current?.();
      }, totalDuration);
    };

    frameRef.current = window.requestAnimationFrame(startTransfer);

    return () => {
      isCancelled = true;

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      if (completionTimeoutRef.current !== null) {
        window.clearTimeout(completionTimeoutRef.current);
      }
    };
  }, [
    direction,
    pieceIds.length,
    sourceAnchor.x,
    sourceAnchor.y,
    sourcePoint,
    sourceRef,
    triggerKey,
  ]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      {burst == null
        ? null
        : pieceIds.map((pieceId, index) => {
            const piece = puzzlePieces[pieceId - 1];
            const offset = pieceOffsets[index % pieceOffsets.length];
            const offsetScale = burst.pieceSize / TRANSFER_PIECE_BASE_SIZE_PX;
            const sourceLeft = burst.sourcePoint.x - burst.pieceSize / 2;
            const sourceTop = burst.sourcePoint.y - burst.pieceSize / 2;
            const targetLeft =
              burst.targetPoint.x -
              burst.pieceSize / 2 +
              offset.spreadX * 0.18 * offsetScale;
            const targetTop =
              burst.targetPoint.y -
              burst.pieceSize / 2 +
              (direction === "up" ? -18 : 18) +
              offset.spreadY * 0.08 * offsetScale;

            return (
              <motion.img
                key={`${burst.id}-${pieceId}`}
                src={piece.path}
                alt=""
                aria-hidden="true"
                className="absolute left-0 top-0 select-none"
                style={{
                  filter: "drop-shadow(0 14px 18px rgba(16, 12, 32, 0.3))",
                  height: burst.pieceSize,
                  width: burst.pieceSize,
                  willChange: "transform, opacity, filter",
                }}
                initial={{
                  opacity: 0,
                  rotate: offset.rotate * 0.45,
                  scale: 0.78,
                  x: sourceLeft + offset.startX * offsetScale,
                  y: sourceTop + offset.startY * offsetScale,
                }}
                animate={{
                  filter: [
                    "blur(2px) brightness(1.02) saturate(1.02)",
                    "blur(0px) brightness(1) saturate(1)",
                    "blur(0px) brightness(1.04) saturate(1.06)",
                    "blur(6px) brightness(1.16) saturate(1.1)",
                  ],
                  opacity: [0, 1, 1, 0],
                  rotate: [
                    offset.rotate * 0.45,
                    offset.rotate,
                    offset.rotate * 0.3,
                    0,
                  ],
                  scale: [0.78, 1, 0.92, 0.3],
                  x: [
                    sourceLeft + offset.startX * offsetScale,
                    sourceLeft + offset.spreadX * offsetScale,
                    sourceLeft + offset.spreadX * 0.45 * offsetScale,
                    targetLeft,
                  ],
                  y: [
                    sourceTop + offset.startY * offsetScale,
                    sourceTop + offset.spreadY * offsetScale,
                    sourceTop + offset.spreadY * 0.7 * offsetScale,
                    targetTop,
                  ],
                }}
                transition={{
                  delay: (index * PIECE_STAGGER_MS) / 1000,
                  duration: LAUNCH_DURATION_MS / 1000,
                  ease: "easeInOut",
                  times: [0, 0.18, 0.4, 1],
                }}
              />
            );
          })}
    </div>
  );
};
