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
  const images = Array.from(
    { length: numberImages },
    (_, index) => `${imageFolder}/${index + 1}.avif`
  );

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
  }, [carouselRef.current]);

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
          <ProjectCards key={index} src={src} />
        ))}
      </motion.div>
    </div>
  );
};

const ProjectCards = ({ src }: { src: string }) => {
  return (
    <div className="relative w-full shrink-0">
      <img
        className={"pointer-events-none relative w-full mix-blend-multiply"}
        src={src}
        loading="lazy"
        alt="Get a better browser!"
      />
    </div>
  );
};

const NavigationDots = ({
  position,
  setPosition,
  setIsAnimating,
}: {
  position: number;
  setPosition: React.Dispatch<React.SetStateAction<number>>;
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="mb-4 mt-4 flex justify-center gap-4">
      {/* {projects.map((_, index) => (
        <motion.button 
          key={index} 
          onClick={() => {setPosition(index + projects.length); setIsAnimating(true);}}
          className={`relative w-4 h-4 bg-[#1E202070] rounded-full`}
          animate={{ 
            backgroundColor: index === (position) ? '#5e548e' : '#1E202050',
            scale: index === (position) ? 1.2 : 1,
          }}
          transition={{ type: 'spring' }}
        />
      ))} */}
    </div>
  );
};

const GradientEdge = () => {
  return (
    <>
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[20vw] max-w-[200px] bg-gradient-to-r from-white to-transparent"></div>
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[20vw] max-w-[200px] bg-gradient-to-l from-white to-transparent"></div>
    </>
  );
};

// export const CarouselText = () => {
//   const { isAnimating, setIsAnimating, position, setPosition } = useCarouselContext();

//   return (
//     <motion.div
//       className="relative"
//       animate={{ opacity: isAnimating ? 0 : 1 }}
//     >
//       <h5 className="h5-text font-bold text-secondary">{projects.at(position)?.title}</h5>
//       <p className="p-text text-primary">{projects.at(position)?.description}</p>
//     </motion.div>
//   );
// };
