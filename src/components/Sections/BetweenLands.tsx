import { SeparatorIn } from "../SeparatorIn";
import { SeparatorOut } from "../SeparatorOut";
import type { ReactNode } from 'react';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform} from 'framer-motion';

interface BetweenLandsProps {
  children: ReactNode;
  isStars: boolean;
  isBackground: boolean;
  isScreenBlend?: boolean;
}

export const BetweenLands = ({children, isStars, isBackground, isScreenBlend}: BetweenLandsProps) => {
  let ref = useRef(null);
  let separatorInRef = useRef<HTMLDivElement>(null);
  let separatorOutRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<{ top: number, left: number }[]>([]);
  const [separatorHeight, setSeparatorHeight] = useState(0);

  const updateSeparatorHeights = () => {
    if (!separatorInRef.current || !separatorOutRef.current) return;
    const inHeight = separatorInRef.current.offsetHeight || 0;
    setSeparatorHeight(inHeight);
  };

  useEffect(() => {
    updateSeparatorHeights();
    window.addEventListener('resize', updateSeparatorHeights);
    return () => window.removeEventListener('resize', updateSeparatorHeights);
  }, [separatorInRef, separatorOutRef]);

  useEffect(() => {
    const calculatePosition = (radius: number, angle: number) => {
      const top = 50 + radius * Math.sin(angle); // Offset from center vertically
      const left = 50 + radius * Math.cos(angle); // Offset from center horizontally
      const starSize = 5; // Size of the star in percentage

      return { top: Math.max(0, Math.min(100 - starSize, top)), left: Math.max(0, Math.min(100 - starSize, left)) };
    }
    const generateRandomPositions = () => {
      const newPositions = [];
      const numStars = 14; // Number of stars
      const { minRadius, maxRadius } = { minRadius: 20, maxRadius: 70 };

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

  let layer = useTransform(scrollYProgress, [0, 1], [`-${separatorHeight/2}px`, `${separatorHeight/2}px`]);

  return (
    <div 
      className="relative bg-primary -z-20"
      ref={ref}
    >
      <SeparatorIn ref={separatorInRef} />

      {isStars && positions.map((pos, index) => (
        <motion.img
          className={`w-4 h-4 lg:w-8 lg:h-8 absolute -z-20`}
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
            y: layer,
            top: `${pos.top}%`,
            left: `${pos.left}%`,
          }}
        />
      ))}
      
      {isBackground ? (
        <motion.div className={`relative -z-10 w-full ${isScreenBlend ? 'mix-blend-screen' : ''}`} style={{ y: layer }}>
          {children}
        </motion.div>
      ) : 
        <div className={`relative -z-10 w-full ${isScreenBlend ? 'mix-blend-screen' : ''}`}>
          {children}
        </div>
      }
      <SeparatorOut ref={separatorOutRef} />
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