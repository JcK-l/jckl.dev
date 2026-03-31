import { useEffect, useRef, useState } from "react";
import { getProjectPreviewFrames } from "../utility/projectPreviewImages";

const AUTOPLAY_INTERVAL_MS = 5000;
const INTERACTION_IDLE_MS = 180;
const TAP_DISTANCE_THRESHOLD_PX = 12;

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

export const Carousel = ({
  imageFolder,
  numberImages,
  className = "",
}: CarouselProps) => {
  const [position, setPosition] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const interactionIdleTimeoutRef = useRef<number | null>(null);
  const isPointerGestureActiveRef = useRef(false);
  const gestureStartRef = useRef({
    scrollLeft: 0,
    x: 0,
    y: 0,
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTouchInteracting, setIsTouchInteracting] = useState(false);
  const shouldSuppressClickRef = useRef(false);
  const images = getProjectPreviewFrames({
    imageFolder,
    numberImages,
  });

  const clearInteractionIdleTimeout = () => {
    if (interactionIdleTimeoutRef.current !== null) {
      window.clearTimeout(interactionIdleTimeoutRef.current);
      interactionIdleTimeoutRef.current = null;
    }
  };

  const syncPositionToScroll = () => {
    const viewport = viewportRef.current;

    if (viewport == null) {
      return;
    }

    const viewportWidth = getCarouselViewportWidth(viewport);

    if (viewportWidth <= 0) {
      return;
    }

    const nextPosition = Math.max(
      0,
      Math.min(
        images.length - 1,
        Math.round(viewport.scrollLeft / viewportWidth)
      )
    );

    positionRef.current = nextPosition;
    setPosition((currentPosition) => {
      return currentPosition === nextPosition ? currentPosition : nextPosition;
    });
  };

  const scheduleInteractionIdleReset = () => {
    clearInteractionIdleTimeout();
    interactionIdleTimeoutRef.current = window.setTimeout(() => {
      isPointerGestureActiveRef.current = false;
      syncPositionToScroll();
      setIsTouchInteracting(false);
    }, INTERACTION_IDLE_MS);
  };

  const scrollToImage = (
    nextPosition: number,
    behavior: ScrollBehavior = "smooth"
  ) => {
    const viewport = viewportRef.current;
    const clampedPosition = Math.max(
      0,
      Math.min(nextPosition, images.length - 1)
    );

    positionRef.current = clampedPosition;
    setPosition(clampedPosition);

    if (viewport == null) {
      return;
    }

    viewport.scrollTo({
      behavior,
      left: clampedPosition * getCarouselViewportWidth(viewport),
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

  useEffect(() => {
    const viewport = viewportRef.current;

    if (viewport == null) {
      return;
    }

    isPointerGestureActiveRef.current = false;
    shouldSuppressClickRef.current = false;
    setIsTouchInteracting(false);
    viewport.scrollTo({ behavior: "auto", left: 0 });
    positionRef.current = 0;
    setPosition(0);
  }, [imageFolder, numberImages]);

  useEffect(() => {
    const handleResize = () => {
      const viewport = viewportRef.current;

      if (viewport == null) {
        return;
      }

      viewport.scrollTo({
        behavior: "auto",
        left: positionRef.current * getCarouselViewportWidth(viewport),
      });
      syncPositionToScroll();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [images.length]);

  useEffect(() => {
    if (isModalOpen || isTouchInteracting || images.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      scrollToImage((positionRef.current + 1) % images.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [images.length, isModalOpen, isTouchInteracting]);

  useEffect(() => {
    return () => {
      clearInteractionIdleTimeout();
    };
  }, []);

  return (
    <div className={`relative w-full select-none ${className}`}>
      <div
        ref={viewportRef}
        data-testid="carousel-viewport"
        className="carousel-scroll relative z-10 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth"
        onPointerCancel={() => {
          scheduleInteractionIdleReset();
        }}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) {
            return;
          }

          const viewport = viewportRef.current;

          gestureStartRef.current = {
            scrollLeft: viewport?.scrollLeft ?? 0,
            x: event.clientX,
            y: event.clientY,
          };
          isPointerGestureActiveRef.current = true;
          shouldSuppressClickRef.current = false;
          setIsTouchInteracting(true);
          clearInteractionIdleTimeout();
        }}
        onPointerUp={() => {
          scheduleInteractionIdleReset();
        }}
        onScroll={() => {
          const viewport = viewportRef.current;

          if (viewport == null) {
            return;
          }

          if (isPointerGestureActiveRef.current) {
            shouldSuppressClickRef.current =
              shouldSuppressClickRef.current ||
              Math.abs(
                viewport.scrollLeft - gestureStartRef.current.scrollLeft
              ) > TAP_DISTANCE_THRESHOLD_PX;
          }

          setIsTouchInteracting(true);
          syncPositionToScroll();
          scheduleInteractionIdleReset();
        }}
        style={{
          WebkitOverflowScrolling: "touch",
        }}
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
      </div>
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
      className="relative aspect-[16/10] w-full shrink-0 cursor-pointer snap-start overflow-hidden rounded-[1rem]"
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
