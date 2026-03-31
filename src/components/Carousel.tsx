import {
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, useAnimation, type PanInfo } from "framer-motion";

const AUTOPLAY_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_RATIO = 0.1;
const MAX_SWIPE_THRESHOLD_PX = 60;
const HORIZONTAL_DOMINANCE_RATIO = 0.85;
const TAP_DISTANCE_THRESHOLD_PX = 12;
const SWIPE_VELOCITY_THRESHOLD = 360;
const CAROUSEL_DRAG_ELASTIC = 0.08;
const SPRING_OPTIONS = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.6,
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
  if (
    viewportWidth <= 0 ||
    (Math.abs(offsetX) <= Math.abs(offsetY) &&
      Math.abs(velocityX) < SWIPE_VELOCITY_THRESHOLD)
  ) {
    return 0;
  }

  const swipeThreshold = Math.min(
    viewportWidth * SWIPE_THRESHOLD_RATIO,
    MAX_SWIPE_THRESHOLD_PX,
  );

  if (
    (Math.abs(offsetX) < swipeThreshold ||
      Math.abs(offsetX) < Math.abs(offsetY) * HORIZONTAL_DOMINANCE_RATIO) &&
    Math.abs(velocityX) < SWIPE_VELOCITY_THRESHOLD
  ) {
    return 0;
  }

  return offsetX < 0 || velocityX < 0 ? 1 : -1;
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
  const shouldSuppressClickRef = useRef(false);
  const images = Array.from(
    { length: numberImages },
    (_, index) => `${imageFolder}/${index + 1}.avif`,
  );
  const isCarouselDraggable = images.length > 1;

  const showImageAt = (nextPosition: number) => {
    const clampedPosition = Math.max(0, Math.min(nextPosition, images.length - 1));
    const viewportWidth = getCarouselViewportWidth(viewportRef.current);

    positionRef.current = clampedPosition;
    setPosition(clampedPosition);
    controls.start({
      x: -clampedPosition * viewportWidth,
      transition: SPRING_OPTIONS,
    });
  };

  const snapTrackToActiveImage = () => {
    controls.start({
      x: -positionRef.current * getCarouselViewportWidth(viewportRef.current),
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

  const handleDragStart = () => {
    if (!isCarouselDraggable) {
      return;
    }

    controls.stop();
    shouldSuppressClickRef.current = false;
    setIsTouchInteracting(true);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeDirection = getCarouselSwipeDirection({
      offsetX: info.offset.x,
      offsetY: info.offset.y,
      viewportWidth: getCarouselViewportWidth(viewportRef.current),
      velocityX: info.velocity.x,
    });

    shouldSuppressClickRef.current =
      getDragTravel({
        offsetX: info.offset.x,
        offsetY: info.offset.y,
      }) > TAP_DISTANCE_THRESHOLD_PX;
    setIsTouchInteracting(false);

    if (swipeDirection !== 0) {
      showImageAt(positionRef.current + swipeDirection);
      return;
    }

    snapTrackToActiveImage();
  };

  useEffect(() => {
    const handleResize = () => {
      controls.set({
        x: -positionRef.current * getCarouselViewportWidth(viewportRef.current),
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
      style={{ touchAction: "pan-y pinch-zoom" }}
    >
      <motion.div
        className="relative z-10 flex items-start justify-start"
        animate={controls}
        drag={isCarouselDraggable ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={CAROUSEL_DRAG_ELASTIC}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
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
