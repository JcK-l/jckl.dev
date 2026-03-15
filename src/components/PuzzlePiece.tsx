import { motion, useAnimation, useDragControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePuzzleContext } from "../hooks/useDataContext";
import {
  playCachedAudio,
  preloadAudioBuffers,
  resumeAudioContext,
} from "../utility/audioContext";

interface PuzzlePieceProps {
  id: number;
  path: string;
  puzzlebounds: React.RefObject<SVGSVGElement>;
  pieceSize: { width: number; height: number };
  pieceCoords: string;
  snapPoint: { x: number; y: number };
  startPoint: { x: number; y: number };
  dragConstraints: { top: number; left: number; right: number; bottom: number };
}

const snapThreshold = 50;
const snapHintThreshold = 58;
const soundFiles = [
  "/PuzzlePieces/sounds/1.mp3",
  "/PuzzlePieces/sounds/2.mp3",
  "/PuzzlePieces/sounds/3.mp3",
  "/PuzzlePieces/sounds/4.mp3",
  "/PuzzlePieces/sounds/5.mp3",
];
let nextPieceZIndex = 30;

const toPolygonClipPath = (coords: string) =>
  `polygon(${coords
    .split(",")
    .reduce<string[]>((points, value, index, values) => {
      if (index % 2 === 0) {
        points.push(`${value}px ${values[index + 1]}px`);
      }

      return points;
    }, [])
    .join(", ")})`;

export const PuzzlePiece = ({
  id,
  path,
  puzzlebounds,
  pieceSize,
  pieceCoords,
  snapPoint,
  startPoint,
  dragConstraints,
}: PuzzlePieceProps) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isNearSnap, setIsNearSnap] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);
  const [zIndex, setZIndex] = useState(() => {
    nextPieceZIndex += 1;
    return nextPieceZIndex;
  });
  const controls = useAnimation();
  const dragControls = useDragControls();
  const pieceRef = useRef<HTMLDivElement>(null);
  const hasAnimatedInRef = useRef(false);
  const isMountedRef = useRef(true);

  const { setLastPiece, setTotalPlacedPieces } = usePuzzleContext();

  const calculateDistance = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  const clipPath = toPolygonClipPath(pieceCoords);

  const getRelativePieceMetrics = () => {
    if (!pieceRef.current || !puzzlebounds.current) {
      return null;
    }

    const pieceRect = pieceRef.current.getBoundingClientRect();
    const boundsRect = puzzlebounds.current.getBoundingClientRect();

    return {
      width: pieceRect.width,
      height: pieceRect.height,
      centerX: pieceRect.left + pieceRect.width / 2 - boundsRect.left,
      centerY: pieceRect.top + pieceRect.height / 2 - boundsRect.top,
      relativeLeft: pieceRect.left - boundsRect.left,
      relativeTop: pieceRect.top - boundsRect.top,
      boundsWidth: boundsRect.width,
      boundsHeight: boundsRect.height,
    };
  };

  const getDistanceToSnap = () => {
    const metrics = getRelativePieceMetrics();

    if (!metrics) {
      return null;
    }

    return {
      ...metrics,
      distance: calculateDistance(
        metrics.centerX,
        metrics.centerY,
        snapPoint.x,
        snapPoint.y
      ),
    };
  };

  const playRandomSound = async () => {
    const randomIndex = Math.floor(Math.random() * soundFiles.length);

    try {
      await playCachedAudio(soundFiles[randomIndex]);
    } catch (error) {
      console.error("Failed to play puzzle sound", error);
    }
  };

  const moveToStartPosition = async () => {
    const metrics = getRelativePieceMetrics();

    if (!metrics) {
      return;
    }

    controls.set({ x: 0, y: 0 });

    await controls.start({
      x: startPoint.x - metrics.width / 2,
      y: startPoint.y - metrics.height / 2,
      transition: {
        delay: 0.25,
        type: "spring",
        stiffness: 800,
        damping: 50,
      },
    });
  };

  const handleDrag = () => {
    if (isPlaced) {
      return;
    }

    const snapMetrics = getDistanceToSnap();

    if (!snapMetrics) {
      return;
    }

    const nextIsNearSnap = snapMetrics.distance < snapHintThreshold;

    setIsNearSnap((current) => {
      return current === nextIsNearSnap ? current : nextIsNearSnap;
    });
  };

  const handleDragStart = () => {
    void resumeAudioContext();
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isPlaced) {
      return;
    }

    nextPieceZIndex += 1;
    setZIndex(nextPieceZIndex);
    dragControls.start(event);
  };

  const handleDragEnd = async () => {
    if (isPlaced) {
      return;
    }

    const snapMetrics = getDistanceToSnap();

    if (!snapMetrics) {
      return;
    }

    if (snapMetrics.distance >= snapThreshold) {
      setIsNearSnap(false);
      return;
    }

    setIsNearSnap(false);
    setIsPlaced(true);

    await controls.start({
      x: snapPoint.x - snapMetrics.width / 2,
      y: snapPoint.y - snapMetrics.height / 2,
      transition: {
        type: "spring",
        stiffness: 900,
        damping: 55,
      },
    });

    if (!isMountedRef.current) {
      return;
    }

    const svgImage = document.getElementById(`p${id}`);

    if (svgImage) {
      svgImage.style.opacity = "1";
    }

    void playRandomSound();
    setLastPiece(id);
    setTotalPlacedPieces((prev) => prev + 1);
    setIsHidden(true);
  };

  useEffect(() => {
    isMountedRef.current = true;
    void preloadAudioBuffers(soundFiles);

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      hasAnimatedInRef.current ||
      pieceSize.width === 0 ||
      pieceSize.height === 0
    ) {
      return;
    }

    let frameOne = 0;
    let frameTwo = 0;

    frameOne = requestAnimationFrame(() => {
      frameTwo = requestAnimationFrame(() => {
        hasAnimatedInRef.current = true;
        void moveToStartPosition();
      });
    });

    return () => {
      cancelAnimationFrame(frameOne);
      cancelAnimationFrame(frameTwo);
    };
  }, [pieceSize.height, pieceSize.width, startPoint.x, startPoint.y]);

  useEffect(() => {
    const handleResize = () => {
      const metrics = getRelativePieceMetrics();

      if (!metrics || isPlaced) {
        return;
      }

      const newX = Math.max(
        0,
        Math.min(metrics.relativeLeft, metrics.boundsWidth - metrics.width)
      );
      const newY = Math.max(
        0,
        Math.min(metrics.relativeTop, metrics.boundsHeight - metrics.height)
      );

      controls.start({
        x: newX,
        y: newY,
        transition: {
          duration: 0.2,
        },
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [controls, isPlaced, puzzlebounds]);

  if (isHidden) {
    return null;
  }

  return (
    <motion.div
      ref={pieceRef}
      className="pointer-events-none absolute select-none"
      drag={!isPlaced}
      dragControls={dragControls}
      dragListener={false}
      dragTransition={{ power: 0 }}
      dragConstraints={dragConstraints}
      dragElastic={0}
      dragMomentum={false}
      onDrag={handleDrag}
      onDragEnd={() => {
        void handleDragEnd();
      }}
      onDragStart={handleDragStart}
      style={{
        width: `${pieceSize.width}px`,
        height: `${pieceSize.height}px`,
        zIndex,
        touchAction: "none",
      }}
      animate={controls}
    >
      <motion.div
        className={`pointer-events-auto relative h-full w-full ${
          isPlaced ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
        animate={
          isNearSnap && !isPlaced
            ? {
                rotate: [0, -2, 2, -2, 0],
                scale: [1, 1.02, 1],
              }
            : {
                rotate: 0,
                scale: 1,
              }
        }
        transition={
          isNearSnap && !isPlaced
            ? {
                duration: 0.38,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {
                duration: 0.18,
                ease: "easeOut",
              }
        }
        style={{
          clipPath,
          WebkitClipPath: clipPath,
          filter: "drop-shadow(0px 4px 4px rgba(35, 25, 66, 0.20))",
          touchAction: "none",
          transformOrigin: "50% 50%",
        }}
        onPointerDown={handlePointerDown}
      >
        <motion.img
          className="h-full w-full select-none"
          src={path}
          draggable={false}
          animate={
            isNearSnap && !isPlaced
              ? {
                  filter: [
                    "brightness(1) saturate(1)",
                    "brightness(1.12) saturate(1.18)",
                    "brightness(1) saturate(1)",
                  ],
                }
              : {
                  filter: "brightness(1) saturate(1)",
                }
          }
          transition={
            isNearSnap && !isPlaced
              ? {
                  duration: 0.38,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : {
                  duration: 0.18,
                  ease: "easeOut",
                }
          }
          style={{
            pointerEvents: "none",
          }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={
            isNearSnap && !isPlaced
              ? {
                  opacity: [0.16, 0.36, 0.16],
                }
              : {
                  opacity: 0,
                }
          }
          transition={
            isNearSnap && !isPlaced
              ? {
                  duration: 0.38,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : {
                  duration: 0.18,
                  ease: "easeOut",
                }
          }
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(255, 235, 244, 0.72) 0%, rgba(224, 177, 203, 0.42) 38%, rgba(224, 177, 203, 0.08) 68%, rgba(224, 177, 203, 0) 82%)",
            boxShadow:
              "inset 0 0 22px rgba(224, 177, 203, 0.42), inset 0 0 0 1px rgba(255, 230, 241, 0.22)",
            mixBlendMode: "screen",
          }}
        />
      </motion.div>
    </motion.div>
  );
};
