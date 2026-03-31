import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { motion, useAnimation } from "framer-motion";

const AUTOPLAY_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_RATIO = 0.1;
const MAX_SWIPE_THRESHOLD_PX = 60;
const HORIZONTAL_DOMINANCE_RATIO = 0.85;
const TAP_DISTANCE_THRESHOLD_PX = 12;
const SPRING_OPTIONS = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.6,
};

type TouchPoint = {
  x: number;
  y: number;
};

const browserSupportsPointerEvents = () => {
  return typeof window !== "undefined" && window.PointerEvent != null;
};

interface CarouselProps {
  imageFolder: string;
  numberImages: number;
  className?: string;
}

const getCarouselViewportWidth = (viewport: HTMLDivElement | null) => {
  if (viewport == null) {
    return 0;
  }

  if (viewport.clientWidth > 0) {
    return viewport.clientWidth;
  }

  return viewport.getBoundingClientRect().width;
};

const getTouchTravel = ({
  touchEnd,
  touchStart,
}: {
  touchEnd: TouchPoint | null;
  touchStart: TouchPoint | null;
}) => {
  if (touchStart == null || touchEnd == null) {
    return 0;
  }

  return Math.max(
    Math.abs(touchStart.x - touchEnd.x),
    Math.abs(touchStart.y - touchEnd.y),
  );
};

export const getCarouselSwipeDirection = ({
  touchEnd,
  touchStart,
  viewportWidth,
}: {
  touchEnd: TouchPoint | null;
  touchStart: TouchPoint | null;
  viewportWidth: number;
}) => {
  if (touchStart == null || touchEnd == null || viewportWidth <= 0) {
    return 0;
  }

  const deltaX = touchStart.x - touchEnd.x;
  const deltaY = Math.abs(touchStart.y - touchEnd.y);
  const swipeThreshold = Math.min(
    viewportWidth * SWIPE_THRESHOLD_RATIO,
    MAX_SWIPE_THRESHOLD_PX,
  );

  if (
    Math.abs(deltaX) < swipeThreshold ||
    Math.abs(deltaX) < deltaY * HORIZONTAL_DOMINANCE_RATIO
  ) {
    return 0;
  }

  return deltaX > 0 ? 1 : -1;
};

export const Carousel = ({
  imageFolder,
  numberImages,
  className = "",
}: CarouselProps) => {
  const [position, setPosition] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const controls = useAnimation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTouchInteracting, setIsTouchInteracting] = useState(false);
  const activePointerIdRef = useRef<number | null>(null);
  const touchStartRef = useRef<TouchPoint | null>(null);
  const latestTouchRef = useRef<TouchPoint | null>(null);
  const shouldSuppressClickRef = useRef(false);
  const images = Array.from(
    { length: numberImages },
    (_, index) => `${imageFolder}/${index + 1}.avif`,
  );

  const showImageAt = (nextPosition: number) => {
    const clampedPosition = Math.max(0, Math.min(nextPosition, images.length - 1));
    const viewportWidth = getCarouselViewportWidth(viewportRef.current);

    positionRef.current = clampedPosition;
    setPosition(clampedPosition);
    controls.start({
      translateX: `${-clampedPosition * viewportWidth}px`,
      transition: SPRING_OPTIONS,
    });
  };

  const handleImageClick = (src: string) => {
    if (shouldSuppressClickRef.current) {
      shouldSuppressClickRef.current = false;
      return;
    }

    setSelectedImage(src);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const beginGesture = (point: TouchPoint) => {
    touchStartRef.current = point;
    latestTouchRef.current = point;
    shouldSuppressClickRef.current = false;
    setIsTouchInteracting(true);
  };

  const updateGesture = (point: TouchPoint) => {
    latestTouchRef.current = point;
  };

  const completeTouchGesture = (touchEnd: TouchPoint | null) => {
    const touchStart = touchStartRef.current;
    const resolvedTouchEnd = touchEnd ?? latestTouchRef.current;
    const swipeDirection = getCarouselSwipeDirection({
      touchEnd: resolvedTouchEnd,
      touchStart,
      viewportWidth: getCarouselViewportWidth(viewportRef.current),
    });

    shouldSuppressClickRef.current =
      getTouchTravel({
        touchEnd: resolvedTouchEnd,
        touchStart,
      }) > TAP_DISTANCE_THRESHOLD_PX;

    if (swipeDirection !== 0) {
      showImageAt(positionRef.current + swipeDirection);
    }
  };

  const resetTouchGesture = () => {
    setIsTouchInteracting(false);
    activePointerIdRef.current = null;
    touchStartRef.current = null;
    latestTouchRef.current = null;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      return;
    }

    activePointerIdRef.current = event.pointerId;

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some mobile browsers reject capture while deciding scroll behavior.
    }

    beginGesture({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    updateGesture({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    completeTouchGesture({
      x: event.clientX,
      y: event.clientY,
    });
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore capture release issues on browsers without full support.
    }
    resetTouchGesture();
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    completeTouchGesture(null);
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore capture release issues on browsers without full support.
    }
    shouldSuppressClickRef.current = true;
    resetTouchGesture();
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (browserSupportsPointerEvents()) {
      return;
    }

    beginGesture({
      x: event.touches[0]?.clientX ?? 0,
      y: event.touches[0]?.clientY ?? 0,
    });
  };

  const handleTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (browserSupportsPointerEvents()) {
      return;
    }

    updateGesture({
      x: event.touches[0]?.clientX ?? 0,
      y: event.touches[0]?.clientY ?? 0,
    });
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (browserSupportsPointerEvents()) {
      return;
    }

    completeTouchGesture({
      x: event.changedTouches[0]?.clientX ?? 0,
      y: event.changedTouches[0]?.clientY ?? 0,
    });
    resetTouchGesture();
  };

  const handleTouchCancel = () => {
    if (browserSupportsPointerEvents()) {
      return;
    }

    completeTouchGesture(null);
    shouldSuppressClickRef.current = true;
    resetTouchGesture();
  };

  useEffect(() => {
    const handleResize = () => {
      controls.set({
        translateX: `${-positionRef.current * getCarouselViewportWidth(viewportRef.current)}px`,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [controls]);

  useEffect(() => {
    positionRef.current = 0;
    setPosition(0);
    controls.set({ translateX: "0px" });
  }, [controls, imageFolder, numberImages]);

  useEffect(() => {
    if (isModalOpen || isTouchInteracting || images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      showImageAt((positionRef.current + 1) % images.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [imageFolder, images.length, isModalOpen, isTouchInteracting]);

  return (
    <div
      ref={viewportRef}
      data-testid="carousel-viewport"
      className={`relative w-full touch-pan-y select-none overflow-hidden ${className}`}
      style={{ touchAction: "pan-y pinch-zoom" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerCancel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <motion.div
        className="relative z-10 flex items-start justify-start"
        animate={controls}
      >
        {images.map((src, index) => (
          <ProjectCards
            key={index}
            isPriorityImage={index === 0}
            src={src}
            onClick={() => handleImageClick(src)}
          />
        ))}
      </motion.div>
      <div
        className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-full border px-2.5 py-1 font-appliance text-[0.55rem] uppercase tracking-[0.18em]"
        style={{
          backgroundColor: "var(--color-appliance-control-surface)",
          borderColor: "var(--color-appliance-panel-border)",
          color: "var(--color-appliance-label)",
        }}
      >
        {`${(position + 1).toString().padStart(2, "0")} / ${images.length
          .toString()
          .padStart(2, "0")}`}
      </div>
      {selectedImage && <Modal src={selectedImage} onClose={closeModal} />}
    </div>
  );
};

const ProjectCards = ({
  isPriorityImage,
  src,
  onClick,
}: {
  isPriorityImage: boolean;
  src: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="relative aspect-[16/10] w-full shrink-0 cursor-pointer overflow-hidden rounded-[1rem]"
      onClick={onClick}
    >
      <img
        className="pointer-events-none block h-full w-full object-cover object-top"
        src={src}
        loading={isPriorityImage ? "eager" : "lazy"}
        alt="Get a better browser!"
      />
    </div>
  );
};

const Modal = ({ src, onClose }: { src: string; onClose: () => void }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <img
          src={src}
          className="max-h-full max-w-full"
          alt="Preview"
          onClick={(event) => event.stopPropagation()}
        />
      </div>
    </div>
  );
};
