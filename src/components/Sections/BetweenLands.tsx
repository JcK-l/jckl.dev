import { SeparatorIn } from "../SeparatorIn";
import { SeparatorOut } from "../SeparatorOut";
import type { ReactNode } from 'react';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface BetweenLandsProps {
  children: ReactNode;
}
// {children}: BetweenLandsProps
export const BetweenLands = () => {
  let ref = useRef(null);
  const [positions, setPositions] = useState<{ top: number, left: number }[]>([]);

  useEffect(() => {
    const generateRandomPositions = () => {
    const newPositions = Array.from({ length: 10 }, () => ({
      top: Math.random() * 90,
      left: Math.random() * 90,
    }));
    setPositions(newPositions);
    };

    generateRandomPositions();
  }, []);

  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 100%", "100% 0%"],
  });

  let layer5 = useTransform(scrollYProgress, [0, 1], ["0vh", "21vh"]);

  return (
    <div 
      className="relative"
      ref={ref}
    >
      <SeparatorIn />
        {positions.map((pos, index) => (
          <motion.img
            className={`w-4 h-4 -z-20`}
            key={index}
            animate={{
              rotate: [0, -3, 3, 0, 3, -3, 0], // Define the keyframes for the wiggle animation
              transition: {
                duration: 3, // Duration of one wiggle cycle
                repeat: Infinity, // Repeat indefinitely
                ease: "easeInOut", // Easing function
              },
            }}
            src={"/star-svgrepo-com.svg"}
            alt="Icon"
            style={{
              isolation: 'isolate',
              y: layer5,
              position: 'absolute',
              top: `${pos.top}%`,
              left: `${pos.left}%`,
            }}
          />
        ))}
      <div 
        className="relative bg-primary -z-30"
      >
      {/* <motion.video
        className="inset-x-0 w-full select-none mix-blend-screen"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src="/secret.mp4" 
      /> */}
        {/* <motion.img 
          className={`absolute w-4 h-4 top-[${Math.floor(Math.random() * 100)}px] left-[${Math.floor(Math.random() * 100)}px]`}
          animate={{
          rotate: [0, -3, 3, 0, 3, -3, 0], // Define the keyframes for the wiggle animation
          transition: {
            duration: 3, // Duration of one wiggle cycle
            repeat: Infinity, // Repeat indefinitely
            ease: "easeInOut", // Easing function
          },
          }}
          src={"/star-svgrepo-com.svg"} 
          alt="Icon"
        /> */}
      </div>
      <SeparatorOut />
    </div>
  );
};