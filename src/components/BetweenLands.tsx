import { SeparatorIn } from "./SeparatorIn";
import { SeparatorOut } from "./SeparatorOut";
import type { ReactNode } from 'react';
import { useEffect, useState, useRef } from 'react';
import { MotionValue, useScroll, useTransform, useMotionValue } from 'framer-motion';

interface BetweenLandsProps {
  isBackground: boolean;
  renderItem: (shift: MotionValue<string>) => ReactNode;
}

export const BetweenLands = ({isBackground, renderItem}: BetweenLandsProps) => {
  let ref = useRef(null);
  let separatorInRef = useRef<HTMLDivElement>(null);
  let separatorOutRef = useRef<HTMLDivElement>(null);
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


  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 100%", "100% 0%"],
  });

  let layer = useTransform(scrollYProgress, [0, 1], [`-${separatorHeight/2}px`, `${separatorHeight/2}px`]);

  const zeroPx = useMotionValue('0px');

  return (
    <div 
      className="relative bg-primary"
      ref={ref}
    >
      <SeparatorIn ref={separatorInRef} />
      
      {isBackground ? (
        renderItem(layer)
      ) : 
        renderItem(zeroPx)
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