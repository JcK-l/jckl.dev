import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import FlyingMan from "../FlyingMan";


export const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const puzzlebounds = useRef<HTMLImageElement>(null);
  const [pieceSize, setPieceSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (puzzlebounds.current) {
      const bounds = puzzlebounds.current.getBoundingClientRect();
      const pieceWidth = bounds.width * 0.34; // Adjust the multiplier as needed
      const pieceHeight = bounds.height * 0.34; // Adjust the multiplier as needed
      setPieceSize({ width: pieceWidth, height: pieceHeight });
    }
  }, [puzzlebounds]);


  return (
    <>
      <FlyingMan ref={ref} />
      <div 
        className="relative"
        ref={ref}
      >
        {/* <div className="h-auto bg-white w-full absolute inset-0"></div> */}
        <div className="z-10 w-full px-8 text-center text-secondary">
          <h1 className="inline-block w-auto p-4 mb-8 xl:mb-24 font-heading font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl 2xl:text-8xl">
            About Me!
          </h1>
        </div>

        <motion.img
          className="absolute w-full sm:w-1/12 cursor-grab active:cursor-grabbing"
          src="/newpuzzlepiece.svg"
          drag
          dragTransition={{ power: 0.01 }}
          dragConstraints={puzzlebounds}
           style={{
              width: `${pieceSize.width}px`,
              height: `${pieceSize.height}px`,
           }}
        >
        </motion.img>
        <img
          ref={puzzlebounds}
          className="w-full sm:w-1/3"
          src="/newjigsaw.svg"
        >
        </img>
      </div>
    </>
  );
};
