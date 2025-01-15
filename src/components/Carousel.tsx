import { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import type { DragHandlers } from "framer-motion";


const THRESHOLD = 100;
const SPRING_OPTIONS = {
  type: "spring",
  bounce: 0.3,
  duration: 0.6
};

interface CarouselProps {
  imageFolder: string;
  numberImages: number;
}

export const Carousel = ({imageFolder, numberImages} : CarouselProps) => {
  const [ position, setPosition ] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);
  const controls = useAnimation();
  const images = Array.from({length: numberImages}, (_, index) => `${imageFolder}/${index + 1}.avif`);

  useEffect(() => {
    const updateItemWidth = () => {
      if (carouselRef.current) {
        setItemWidth(carouselRef.current.offsetWidth);
        // console.log(itemRef.current.offsetWidth);
      }
    };

    updateItemWidth();
    window.addEventListener('resize', updateItemWidth); 
    return () => {
      window.removeEventListener('resize', updateItemWidth);
    };
  }, []);

  const onDragEndHandler: DragHandlers["onDragEnd"]  = (event, info) => {

    const offset = info.offset.x
    const direction = -Math.sign(offset);

    if (offset >= THRESHOLD || offset <= -THRESHOLD) {
      const newPosition = Math.max(0, Math.min(position + direction, images.length-1));
      setPosition(newPosition);
      controls.start({ translateX: `-${newPosition * itemWidth}px`, transition: SPRING_OPTIONS });
      console.log(newPosition);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        controls.start({ translateX: `-${position * carouselRef.current.offsetWidth}px`, transition: SPRING_OPTIONS });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => { 
      window.removeEventListener("resize", handleResize);
    }
  }, [carouselRef.current]);

  return (
    <div className="relative overflow-hidden w-full md:w-7/12 mx-auto mb-2 select-none">
      <motion.div
        ref={carouselRef}
        className={`relative flex items-start cursor-grab active:cursor-grabbing justify-start touch-pan-x`}
        drag={"x"}
        onDragEnd={onDragEndHandler}
        animate={controls}
        dragConstraints={carouselRef}
      >
        {images.map((src, index) => (
          <ProjectCards key={index} src={src} />
        ))}
      </motion.div>
    </div>
  );
}

const ProjectCards = ({ key, src }: { key: number, src: string }) => {
  return (
    <div className="relative w-full shrink-0 bg-white">
      <img
        key={key}
        className={'relative w-full pointer-events-none mix-blend-multiply'}
        src={src}
        loading="lazy"
        alt="Get a better browser!"
      />
    </div>
  );
}

const NavigationDots = ({ position, setPosition, setIsAnimating }: {position: number, setPosition: React.Dispatch<React.SetStateAction<number>>, setIsAnimating: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div className="flex justify-center gap-4 mt-4 mb-4">
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
}

const GradientEdge = () => {
  return (
    <>
      <div className="absolute top-0 bottom-0 left-0 pointer-events-none w-[20vw] max-w-[200px] bg-gradient-to-r from-white to-transparent"></div>
      <div className="absolute top-0 bottom-0 right-0 pointer-events-none w-[20vw] max-w-[200px] bg-gradient-to-l from-white to-transparent"></div>
    </>
  );
}

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
