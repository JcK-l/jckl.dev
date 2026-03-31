import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useAnimation } from "framer-motion";
import { getHorizontalSwipeDirection } from "../utility/horizontalSwipe";
import { getProjectPreviewFrames } from "../utility/projectPreviewImages";

const AUTOPLAY_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_RATIO = 0.1;
const MAX_SWIPE_THRESHOLD_PX = 72;
const TAP_DISTANCE_THRESHOLD_PX = 12;
const SWIPE_VELOCITY_THRESHOLD = 380;
const EDGE_RESISTANCE_RATIO = 0.18;
const SPRING_OPTIONS = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.6,
};

type PointerGestureState = {
  lastTime: number;
  lastX: number;
  lastY: number;
  startX: number;
  startY: number;
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

const getDragTravel = ({
  offsetX,
  offsetY,
}: {
  offsetX: number;
  offsetY: number;
}) => {
  return Math.max(Math.abs(offsetX), Math.abs(offsetY));
};

export const getCarouselSwipeDirection = ({
  offsetX,
  offsetY,
  viewportWidth,
  velocityX,
}: {
  offsetX: number;
  offsetY: number;
  viewportWidth: number;
  velocityX: number;
}) => {
  return getHorizontalSwipeDirection({
    offsetX,
    offsetY,
    surfaceWidth: viewportWidth,
    velocityX,
    distanceRatio: SWIPE_THRESHOLD_RATIO,
    maxDistanceThreshold: MAX_SWIPE_THRESHOLD_PX,
    velocityThreshold: SWIPE_VELOCITY_THRESHOLD,
  });
};

export const Carousel = ({
  imageFolder,
  numberImages,
  className = "",
}: CarouselProps) => {
  const [position, setPosition] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const viewportWidthRef = useRef(0);
  const positionRef = useRef(0);
  const activePointerIdRef = useRef<number | null>(null);
  const pointerGestureRef = useRef<PointerGestureState | null>(null);
  const controls = useAnimation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTouchInteracting, setIsTouchInteracting] = useState(false);
  const shouldSuppressClickRef = useRef(false);
  const images = getProjectPreviewFrames({
    imageFolder,
    numberImages,
  });
  const isCarouselDraggable = images.length > 1;

  const measureViewportWidth = () => {
    const nextViewportWidth = getCarouselViewportWidth(viewportRef.current);

    viewportWidthRef.current = nextViewportWidth;
    return nextViewportWidth;
  };

  const getTrackBoundsLeft = (nextViewportWidth: number) => {
    return -Math.max(images.length - 1, 0) * nextViewportWidth;
  };

  const getTrackPositionWithEdgeResistance = ({
    baseX,
    offsetX,
    viewportWidth,
  }: {
    baseX: number;
    offsetX: number;
    viewportWidth: number;
  }) => {
    const rawTrackX = baseX + offsetX;
    const minTrackX = getTrackBoundsLeft(viewportWidth);

    if (rawTrackX < minTrackX) {
      return minTrackX + (rawTrackX - minTrackX) * EDGE_RESISTANCE_RATIO;
    }

    if (rawTrackX > 0) {
      return rawTrackX * EDGE_RESISTANCE_RATIO;
    }

    return rawTrackX;
  };

  const showImageAt = (nextPosition: number) => {
    const clampedPosition = Math.max(
      0,
      Math.min(nextPosition, images.length - 1)
    );
    const nextViewportWidth = measureViewportWidth();

    positionRef.current = clampedPosition;
    setPosition(clampedPosition);
    controls.start({
      x: -clampedPosition * nextViewportWidth,
      transition: SPRING_OPTIONS,
    });
  };

  const snapTrackToActiveImage = () => {
    const nextViewportWidth = measureViewportWidth();

    controls.start({
      x: -positionRef.current * nextViewportWidth,
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

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isCarouselDraggable) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const eventTime = performance.now();

    controls.stop();
    activePointerIdRef.current = event.pointerId;
    pointerGestureRef.current = {
      lastTime: eventTime,
      lastX: event.clientX,
      lastY: event.clientY,
      startX: event.clientX,
      startY: event.clientY,
    };
    shouldSuppressClickRef.current = false;
    setIsTouchInteracting(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointerGesture = pointerGestureRef.current;

    if (
      activePointerIdRef.current !== event.pointerId ||
      pointerGesture == null
    ) {
      return;
    }

    const offsetX = event.clientX - pointerGesture.startX;
    const offsetY = event.clientY - pointerGesture.startY;
    const nextViewportWidth = measureViewportWidth();

    shouldSuppressClickRef.current =
      getDragTravel({ offsetX, offsetY }) > TAP_DISTANCE_THRESHOLD_PX;

    controls.set({
      x: getTrackPositionWithEdgeResistance({
        baseX: -positionRef.current * nextViewportWidth,
        offsetX,
        viewportWidth: nextViewportWidth,
      }),
    });

    pointerGestureRef.current = {
      ...pointerGesture,
      lastTime: performance.now(),
      lastX: event.clientX,
      lastY: event.clientY,
    };
  };

  const completePointerGesture = ({
    clientX,
    clientY,
    currentTarget,
    pointerId,
    velocityXOverride,
  }: {
    clientX: number;
    clientY: number;
    currentTarget: HTMLDivElement;
    pointerId: number;
    velocityXOverride?: number;
  }) => {
    const pointerGesture = pointerGestureRef.current;

    if (activePointerIdRef.current !== pointerId || pointerGesture == null) {
      return;
    }

    const nextViewportWidth = measureViewportWidth();
    const offsetX = clientX - pointerGesture.startX;
    const offsetY = clientY - pointerGesture.startY;
    const elapsedSinceLastMove = Math.max(
      performance.now() - pointerGesture.lastTime,
      16
    );
    const velocityX =
      velocityXOverride ??
      ((clientX - pointerGesture.lastX) / elapsedSinceLastMove) * 1000;
    const swipeDirection = getCarouselSwipeDirection({
      offsetX,
      offsetY,
      viewportWidth: nextViewportWidth,
      velocityX,
    });

    shouldSuppressClickRef.current =
      getDragTravel({ offsetX, offsetY }) > TAP_DISTANCE_THRESHOLD_PX;
    activePointerIdRef.current = null;
    pointerGestureRef.current = null;
    setIsTouchInteracting(false);

    if (swipeDirection !== 0) {
      showImageAt(positionRef.current + swipeDirection);
      return;
    }

    snapTrackToActiveImage();
  };

  useEffect(() => {
    const handleResize = () => {
      const nextViewportWidth = measureViewportWidth();

      controls.set({
        x: -positionRef.current * nextViewportWidth,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [controls]);

  useEffect(() => {
    activePointerIdRef.current = null;
    pointerGestureRef.current = null;
    shouldSuppressClickRef.current = false;
    setIsTouchInteracting(false);
    positionRef.current = 0;
    setPosition(0);
    controls.set({ x: 0 });
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
      onPointerCancel={(event) => {
        const pointerGesture = pointerGestureRef.current;

        completePointerGesture({
          clientX: pointerGesture?.lastX ?? event.clientX,
          clientY: pointerGesture?.lastY ?? event.clientY,
          currentTarget: event.currentTarget,
          pointerId: event.pointerId,
          velocityXOverride: 0,
        });
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => {
        completePointerGesture({
          clientX: event.clientX,
          clientY: event.clientY,
          currentTarget: event.currentTarget,
          pointerId: event.pointerId,
        });
      }}
      style={{ touchAction: "pan-y pinch-zoom" }}
    >
      <motion.div
        data-testid="carousel-track"
        className="relative z-10 flex items-start justify-start"
        animate={controls}
      >
        {images.map((image, index) => (
          <ProjectCards
            key={index}
            isPriorityImage={index === 0}
            sizes={image.sizes}
            src={image.src}
            srcSet={image.srcSet}
            onClick={() => handleImageClick(image.fullSizeSrc)}
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
  sizes,
  src,
  srcSet,
  onClick,
}: {
  isPriorityImage: boolean;
  sizes?: string;
  src: string;
  srcSet?: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="relative aspect-[16/10] w-full shrink-0 cursor-pointer overflow-hidden rounded-[1rem]"
      onClick={onClick}
    >
      <img
        className="pointer-events-none block h-full w-full object-cover object-top"
        alt="Get a better browser!"
        decoding="async"
        loading={isPriorityImage ? "eager" : "lazy"}
        sizes={sizes}
        src={src}
        srcSet={srcSet}
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
