import { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import type { DragHandlers } from "framer-motion";
import { useCarouselContext } from "../hooks/useCarouselContext";
import { projects } from '../data/ProjectData';


const THRESHOLD = 100;
const SPRING_OPTIONS = {
  type: "spring",
  bounce: 0.3,
  duration: 0.6
};

export const Carousel = () => {
  const { isAnimating, setIsAnimating, position, setPosition } = useCarouselContext();
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);
  const controls = useAnimation(); // Use controls for animation

  useEffect(() => {
    const updateItemWidth = () => {
      if (itemRef.current) {
        setItemWidth(itemRef.current.offsetWidth);
        // console.log(position);
        setIsAnimating(true); // Start animation
        // controls.start({ translateX: `-${position * itemRef.current.offsetWidth}px`, transition: { duration: 0}});
      }
    };

    updateItemWidth();
    window.addEventListener('resize', updateItemWidth); // Add event listener
    return () => {
      window.removeEventListener('resize', updateItemWidth); // Cleanup event listener
    };
  }, [itemRef.current]);

  useEffect(() => {
    if (isAnimating) {
      const animate = async () => {
        if (position < projects.length) {
          await controls.start({ translateX: `-${position * itemWidth}px`, transition: SPRING_OPTIONS});
          const newPosition = position + projects.length;
          setPosition(newPosition);
          controls.start({ translateX: `-${(newPosition) * itemWidth}px`, transition: { duration: 0 } });
        } else if (position >= projects.length * 2) {
          await controls.start({ translateX: `-${position * itemWidth}px`, transition: SPRING_OPTIONS});
          const newPosition = position - projects.length;
          setPosition(newPosition);
          controls.start({ translateX: `-${(newPosition) * itemWidth}px`, transition: { duration: 0 } });
        } else {
          await controls.start({ translateX: `-${position * itemWidth}px`, transition: SPRING_OPTIONS });
        }
        setIsAnimating(false);
      };
      animate();
    }
  }, [isAnimating, position, itemWidth, projects.length, controls]);

  const onDragEndHandler: DragHandlers["onDragEnd"]  = (event, info) => {
    if (isAnimating) return; // Prevent new position setting while animating

    const offset = info.offset.x
    const direction = -Math.sign(offset);

    // if ((offset <= -THRESHOLD && position < projects.length - 1) || (offset >= THRESHOLD && position > 0)) {
    //   setPosition((prev) => prev + direction);
    // }
    if (offset >= THRESHOLD || offset <= -THRESHOLD) {
      setIsAnimating(true); // Start animation
      const newPosition = position + direction;
      setPosition(newPosition);
      console.log(newPosition);
    }
  }

  return (
    <div className="relative overflow-hidden mx-12 xl:mx-48 select-none">
      <motion.div
        ref={carouselRef}
        className={`flex items-start ${isAnimating ? '' : 'cursor-grab active:cursor-grabbing'} justify-start`}
        drag={isAnimating ? false : "x"}
        onDragEnd={onDragEndHandler}
        animate={controls}
        dragConstraints={carouselRef}
      >
        <ProjectCards itemRef={itemRef} />
      </motion.div>
      <NavigationDots position={position} setPosition={setPosition} setIsAnimating={setIsAnimating} />
      <GradientEdge />
    </div>
  );
}

const ProjectCards = ({ itemRef }: { itemRef: React.RefObject<HTMLDivElement> }) => {
  const carouselItems = [...projects, ...projects, ...projects];
  return (
    <>
      {carouselItems.map((project, index) => (
        <motion.div
          key={project.id}
          className="w-full xl:w-1/3 bg-white text-center rounded-10 shrink-0"
          ref={index === 0 ? itemRef : null}
        >
        <img
          className={'relative pointer-events-none mix-blend-multiply'}
          src={project.imgsrc}
          loading="lazy"
          alt="AVIF example with WebP and JPEG fallback"
        />
        </motion.div>
      ))}
    </>
  );
}

const NavigationDots = ({ position, setPosition, setIsAnimating }: {position: number, setPosition: React.Dispatch<React.SetStateAction<number>>, setIsAnimating: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div className="flex justify-center gap-4 mt-4 mb-4">
      {projects.map((_, index) => (
        <motion.button 
          key={index} 
          onClick={() => {setPosition(index + projects.length); setIsAnimating(true);}}
          className={`relative w-4 h-4 bg-[#1E202070] rounded-full`}
          animate={{ 
            backgroundColor: index === (position % projects.length) ? '#5e548e' : '#1E202050',
            scale: index === (position % projects.length) ? 1.2 : 1,
          }}
          transition={{ type: 'spring' }}
        />
      ))}
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

export const CarouselText = () => {
  const { isAnimating, setIsAnimating, position, setPosition } = useCarouselContext();

  return (
    <motion.div 
      className="relative mx-12 xl:mx-48 text-secondary"
      animate={{ opacity: isAnimating ? 0 : 1 }}
    >
      <h2 className="text-2xl font-bold text-center">{!isAnimating ? projects.at(position % projects.length)?.title : ''}</h2>
      <p className="xl:mx-48">{!isAnimating ? projects.at(position % projects.length)?.description : ''}</p>
    </motion.div>
  );
};
