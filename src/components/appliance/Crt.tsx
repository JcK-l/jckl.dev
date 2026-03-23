import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface CrtProps {
  isCrt: boolean;
  snapPoint: { x: number; y: number };
  callBack: () => void;
  dragConstraints: { top: number; left: number; right: number; bottom: number };
  crtWidth: number;
  bounds: React.RefObject<HTMLElement>;
}

const CRT_ASSET_WIDTH = 500;
const CRT_ASSET_HEIGHT = 375;
const SNAP_HINT_DISTANCE_MULTIPLIER = 1.18;
// Main feel-tuning values live here and in the animation objects below.
const IDLE_TRANSITION = {
  duration: 3.6,
  ease: "easeInOut" as const,
  repeat: Infinity,
  times: [0, 0.3, 0.62, 1],
};
const SNAP_WIGGLE_TRANSITION = {
  duration: 0.42,
  ease: "easeInOut" as const,
  repeat: Infinity,
};

type CrtMetrics = {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  relativeLeft: number;
  relativeTop: number;
  boundsWidth: number;
  boundsHeight: number;
};

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

const getRestY = (boundsHeight: number, crtHeight: number) => {
  return boundsHeight - 2 * crtHeight;
};

const getEstimatedHeight = (crtWidth: number) => {
  return (crtWidth * CRT_ASSET_HEIGHT) / CRT_ASSET_WIDTH;
};

export const Crt = ({
  isCrt,
  snapPoint,
  callBack,
  dragConstraints,
  crtWidth,
  bounds,
}: CrtProps) => {
  const controls = useAnimation();
  const crtRef = useRef<HTMLDivElement>(null);
  const hasInitializedPositionRef = useRef(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isNearSnap, setIsNearSnap] = useState(false);
  const [isPositionReady, setIsPositionReady] = useState(false);

  const getRelativeMetrics = (): CrtMetrics | null => {
    if (!crtRef.current || !bounds.current) {
      return null;
    }

    const crtRect = crtRef.current.getBoundingClientRect();
    const boundsRect = bounds.current.getBoundingClientRect();

    if (
      crtRect.width === 0 ||
      crtRect.height === 0 ||
      boundsRect.width === 0 ||
      boundsRect.height === 0
    ) {
      return null;
    }

    return {
      width: crtRect.width,
      height: crtRect.height,
      centerX: crtRect.left + crtRect.width / 2 - boundsRect.left,
      centerY: crtRect.top + crtRect.height / 2 - boundsRect.top,
      relativeLeft: crtRect.left - boundsRect.left,
      relativeTop: crtRect.top - boundsRect.top,
      boundsWidth: boundsRect.width,
      boundsHeight: boundsRect.height,
    };
  };

  const getDistanceToSnap = () => {
    const metrics = getRelativeMetrics();

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

  const moveToStartPosition = () => {
    const metrics = getRelativeMetrics();
    const boundsHeight =
      metrics?.boundsHeight ?? bounds.current?.getBoundingClientRect().height ?? 0;
    const crtHeight = metrics?.height ?? getEstimatedHeight(crtWidth);

    if (boundsHeight === 0 || crtHeight === 0) {
      return false;
    }

    controls.set({
      x: 0,
      y: getRestY(boundsHeight, crtHeight),
    });

    return true;
  };

  const syncPositionToLayout = () => {
    const metrics = getRelativeMetrics();

    if (!metrics) {
      return false;
    }

    const restY = getRestY(metrics.boundsHeight, metrics.height);
    const nextX = Math.max(
      0,
      Math.min(metrics.relativeLeft, metrics.boundsWidth - metrics.width)
    );
    const nextY = isDragging
      ? Math.max(0, Math.min(metrics.relativeTop, restY))
      : restY;

    controls.set({
      x: nextX,
      y: nextY,
    });

    return true;
  };

  const handleDrag = () => {
    const snapMetrics = getDistanceToSnap();

    if (!snapMetrics) {
      return;
    }

    const nextIsNearSnap =
      snapMetrics.distance < crtWidth * SNAP_HINT_DISTANCE_MULTIPLIER;

    setIsNearSnap((current) => {
      return current === nextIsNearSnap ? current : nextIsNearSnap;
    });
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setIsHovering(false);
  };

  const handleDragEnd = () => {
    const snapMetrics = getDistanceToSnap();

    setIsDragging(false);

    if (!snapMetrics) {
      setIsNearSnap(false);
      return;
    }

    if (snapMetrics.distance < crtWidth) {
      setIsNearSnap(false);

      void controls
        .start({
          x: snapPoint.x - snapMetrics.width / 2,
          y: snapPoint.y - snapMetrics.height / 2,
          transition: {
            type: "spring",
            stiffness: 820,
            damping: 46,
          },
        })
        .then(() => {
          callBack();
          setIsHidden(true);
        });

      return;
    }

    setIsNearSnap(false);

    const restY = getRestY(snapMetrics.boundsHeight, snapMetrics.height);

    void controls.start({
      y: restY,
      transition: {
        type: "inertia",
        velocity: 1250,
        power: 0.32,
        timeConstant: 250,
        min: restY,
        max: restY,
        bounceStiffness: 240,
        bounceDamping: 20,
      },
    });
  };

  useEffect(() => {
    if (!isCrt || isHidden || !isPositionReady) {
      return;
    }

    const element = crtRef.current;
    const boundsElement = bounds.current;

    if (!element || !boundsElement) {
      return;
    }

    let frameId = 0;
    const scheduleSync = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        syncPositionToLayout();
      });
    };

    const resizeObserver = new ResizeObserver(scheduleSync);
    resizeObserver.observe(element);
    resizeObserver.observe(boundsElement);
    window.addEventListener("resize", scheduleSync);

    scheduleSync();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleSync);
      window.cancelAnimationFrame(frameId);
    };
  }, [bounds, controls, isCrt, isDragging, isHidden, isPositionReady]);

  useEffect(() => {
    if (!isCrt || isHidden) {
      hasInitializedPositionRef.current = false;
      setIsPositionReady(false);
      return;
    }

    if (crtWidth === 0) {
      return;
    }

    const element = crtRef.current;

    if (!element) {
      return;
    }

    const initializePosition = () => {
      if (hasInitializedPositionRef.current || isDragging) {
        return;
      }

      if (moveToStartPosition()) {
        hasInitializedPositionRef.current = true;
        setIsPositionReady(true);
      }
    };

    let frameId = 0;
    const resizeObserver = new ResizeObserver(() => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(initializePosition);
    });

    frameId = window.requestAnimationFrame(initializePosition);
    resizeObserver.observe(element);
    if (bounds.current) {
      resizeObserver.observe(bounds.current);
    }

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [crtWidth, isCrt, isHidden, isDragging]);

  if (!isCrt || isHidden) {
    return null;
  }

  const shellAnimation =
    isDragging && isNearSnap
      ? {
          rotate: [0, -2.2, 2.4, -1.6, 0],
          scale: [1, 1.025, 1],
          y: [0, -2, 0],
        }
      : isDragging
      ? {
          rotate: 0.8,
          scale: 1.015,
          y: -4,
        }
      : isHovering
      ? {
          rotate: [0, -0.8, 0.55, 0],
          scale: [1, 1.015, 1],
          y: [0, -5, 0],
        }
      : {
          rotate: [0, -0.6, 0.45, 0],
          scale: [1, 1.012, 1.004, 1],
          y: [0, -4, -1.5, 0],
        };

  const shellTransition =
    isDragging && isNearSnap
      ? SNAP_WIGGLE_TRANSITION
      : isDragging
      ? {
          duration: 0.2,
          ease: "easeOut" as const,
        }
      : isHovering
      ? {
          duration: 1.5,
          ease: "easeInOut" as const,
          repeat: Infinity,
        }
      : IDLE_TRANSITION;

  const imageAnimation =
    isDragging && isNearSnap
      ? {
          filter: [
            "drop-shadow(0 14px 18px rgba(16, 12, 32, 0.18)) brightness(1.02)",
            "drop-shadow(0 20px 26px rgba(16, 12, 32, 0.32)) brightness(1.07)",
            "drop-shadow(0 14px 18px rgba(16, 12, 32, 0.18)) brightness(1.02)",
          ],
        }
      : isDragging
      ? {
          filter: "drop-shadow(0 22px 26px rgba(16, 12, 32, 0.28)) brightness(1.03)",
        }
      : isHovering
      ? {
          filter: [
            "drop-shadow(0 16px 20px rgba(16, 12, 32, 0.2)) brightness(1.02)",
            "drop-shadow(0 20px 24px rgba(16, 12, 32, 0.26)) brightness(1.05)",
            "drop-shadow(0 16px 20px rgba(16, 12, 32, 0.2)) brightness(1.02)",
          ],
        }
      : {
          filter: [
            "drop-shadow(0 14px 18px rgba(16, 12, 32, 0.16)) brightness(1.005)",
            "drop-shadow(0 18px 22px rgba(16, 12, 32, 0.22)) brightness(1.025)",
            "drop-shadow(0 14px 18px rgba(16, 12, 32, 0.16)) brightness(1.005)",
          ],
        };

  const imageTransition =
    isDragging && isNearSnap
      ? SNAP_WIGGLE_TRANSITION
      : isDragging
      ? {
          duration: 0.2,
          ease: "easeOut" as const,
        }
      : isHovering
      ? {
          duration: 1.5,
          ease: "easeInOut" as const,
          repeat: Infinity,
        }
      : IDLE_TRANSITION;

  return (
    <motion.div
      drag
      ref={crtRef}
      dragConstraints={dragConstraints}
      dragElastic={0}
      dragMomentum={false}
      draggable={false}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onHoverEnd={() => {
        setIsHovering(false);
      }}
      onHoverStart={() => {
        if (!isDragging) {
          setIsHovering(true);
        }
      }}
      animate={controls}
      style={{
        width: crtWidth,
        touchAction: "none",
        aspectRatio: `${CRT_ASSET_WIDTH} / ${CRT_ASSET_HEIGHT}`,
        opacity: isPositionReady ? 1 : 0,
      }}
      className={`absolute z-40 select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <motion.div
        animate={shellAnimation}
        transition={shellTransition}
        className="relative w-full"
        style={{ transformOrigin: "50% 78%" }}
      >
        <motion.img
          src="/tv.avif"
          alt="crt"
          width={CRT_ASSET_WIDTH}
          height={CRT_ASSET_HEIGHT}
          draggable={false}
          animate={imageAnimation}
          transition={imageTransition}
          className="block w-full select-none"
          style={{ pointerEvents: "none" }}
        />
      </motion.div>
    </motion.div>
  );
};
