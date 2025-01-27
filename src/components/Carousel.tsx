import { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import type { DragHandlers } from "framer-motion";

const THRESHOLD = 100;
const SPRING_OPTIONS = {
  type: "spring",
  bounce: 0.3,
  duration: 0.6,
};

interface CarouselProps {
  imageFolder: string;
  numberImages: number;
}

export const Carousel = ({ imageFolder, numberImages }: CarouselProps) => {
  const [position, setPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const controls = useAnimation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const images = Array.from(
    { length: numberImages },
    (_, index) => `${imageFolder}/${index + 1}.avif`
  );


  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };


  const onDragEndHandler: DragHandlers["onDragEnd"] = (event, info) => {
    const offset = info.offset.x;
    const direction = -Math.sign(offset);

    if (offset >= THRESHOLD || offset <= -THRESHOLD) {
      if (carouselRef.current) {
        const newPosition = Math.max(
          0,
          Math.min(position + direction, images.length - 1)
        );
        setPosition(newPosition);
        controls.start({
          translateX: `-${newPosition * carouselRef.current.offsetWidth}px`,
          transition: SPRING_OPTIONS,
        });
        positionRef.current = newPosition;
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        controls.start({
          translateX: `-${
            positionRef.current * carouselRef.current.offsetWidth
          }px`,
          transition: SPRING_OPTIONS,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [carouselRef.current]);

  useEffect(() => {
    if (isModalOpen) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const newPosition = (positionRef.current + 1) % images.length;
        controls.start({
          translateX: `-${newPosition * carouselRef.current.offsetWidth}px`,
          transition: SPRING_OPTIONS,
        });
        setPosition(newPosition);
        positionRef.current = newPosition;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselRef.current, isModalOpen]);

  return (
    <div className="relative mx-auto mb-2 w-full select-none overflow-hidden md:w-7/12">
      <motion.div
        ref={carouselRef}
        className={`relative z-50 flex items-start justify-start`} // cursor-grab  active:cursor-grabbing`}
        // drag={"x"} // Not now I guess. Works everywhere except for safari on IOS
        // onDragEnd={onDragEndHandler}
        animate={controls}
        // dragConstraints={carouselRef}
      >
        {images.map((src, index) => (
          <ProjectCards key={index} src={src} onClick={() => handleImageClick(src)} />
        ))}
      </motion.div>
      {selectedImage && (
        <Modal src={selectedImage} onClose={closeModal} />
      )}
    </div>
  );
};

const ProjectCards = ({ src, onClick }: { src: string, onClick: () => void }) => {
  return (
    <div className="relative w-full shrink-0 cursor-pointer" onClick={onClick}>
      <img
        className={"pointer-events-none relative w-fullmix-blend-multiply"}
        src={src}
        loading="lazy"
        alt="Get a better browser!"
      />
    </div>
  );
};

const Modal = ({ src, onClose }: { src: string, onClose: () => void }) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div className="relative w-full h-full flex items-center justify-center">
        <img src={src} className="max-w-full max-h-full" alt="Preview" onClick={(e) => e.stopPropagation()} />
      </div>
    </div>
  );
};