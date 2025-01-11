import { SeparatorIn } from "../SeparatorIn";
import { SeparatorOut } from "../SeparatorOut";
import type { ReactNode } from 'react';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useViewportScroll } from 'framer-motion';

interface BetweenLandsProps {
  children: ReactNode;
  isStars: boolean;
}
// {children}: BetweenLandsProps
export const BetweenLands = ({children, isStars}: BetweenLandsProps) => {
  let ref = useRef(null);
  const [positions, setPositions] = useState<{ top: number, left: number }[]>([]);

  const [radius, setRadius] = useState({ minRadius: 0, maxRadius: 100 });

  // useEffect(() => {
  //   const updateRadius = () => {
  //     if (window.innerWidth < 768) {
  //       setRadius({ minRadius: 35, maxRadius: 45 });
  //     } else if (window.innerWidth < 1024) {
  //       setRadius({ minRadius: 35, maxRadius: 40 });
  //     } else {
  //       setRadius({ minRadius: 35, maxRadius: 40 });
  //     }
  //   };

  //   updateRadius();
  //   window.addEventListener('resize', updateRadius);
  //   return () => window.removeEventListener('resize', updateRadius);
  // }, []);

  useEffect(() => {
    const calculatePosition = (radius: number, angle: number) => {
      const top = 50 + radius * Math.sin(angle); // Offset from center vertically
      const left = 50 + radius * Math.cos(angle); // Offset from center horizontally
      const starSize = 5; // Size of the star in percentage

      return { top: Math.max(0, Math.min(100 - starSize, top)), left: Math.max(0, Math.min(100 - starSize, left)) };
    }
    const generateRandomPositions = () => {
      const newPositions = [];
      const numStars = 8; // Number of stars
      const { minRadius, maxRadius } = radius;

      const angleRanges = [
        { start: 0, end: 2 * Math.PI },
        // { start: 19 * Math.PI / 18, end: 5 * Math.PI / 4 },
      ];

      for (let j = 0; j < angleRanges.length; j++) {
        const angleStep = (angleRanges[j].end - angleRanges[j].start) / (numStars / angleRanges.length);
        for (let i = 0; i < numStars / angleRanges.length; i++) {
          const baseAngle = angleRanges[j].start + i * angleStep;
          const randomOffset = (Math.random() - 0.20) * angleStep; // Small random offset
          const angle = baseAngle + randomOffset;

          const radius = minRadius + Math.random() * (maxRadius - minRadius);

          newPositions.push(calculatePosition(radius, angle));
        }
      }


      return newPositions;
    };

    setPositions(generateRandomPositions());
}, []);

  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 100%", "100% 0%"],
  });

  let layer5 = useTransform(scrollYProgress, [0, 1], ["-50vh", "50vh"]);

  return (
    <div 
      className="relative"
      ref={ref}
    >
      <SeparatorIn />
        {isStars && positions.map((pos, index) => (
          <motion.img
            className={`w-4 h-4 lg:w-8 lg:h-8 absolute -z-20`}
            key={index}
            // animate={{
            //   rotate: [0, -3, 3, 0, 3, -3, 0], // Define the keyframes for the wiggle animation
            //   transition: {
            //     duration: 3, // Duration of one wiggle cycle
            //     repeat: Infinity, // Repeat indefinitely
            //     ease: "easeInOut", // Easing function
            //   },
            // }}
            src={"/star-svgrepo-com.svg"}
            alt="Icon"
            style={{
              y: layer5,
              top: `${pos.top}%`,
              left: `${pos.left}%`,
            }}
          />
        ))}
      <div 
        className="absolute inset-0 bg-primary -z-30"
      >
      </div>
      {children}
      <SeparatorOut />
    </div>
  );
};

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