import { SeparatorIn } from "./SeparatorIn";
import { SeparatorOut } from "./SeparatorOut";
import type { ReactNode } from 'react';
import { useEffect, useState, useRef } from 'react';
import { MotionValue, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { Crt } from './Crt';

interface BetweenLandsProps {
  isBackground: boolean;
  isCrt: boolean;
  crtCallback?: () => void;
  renderItem: (shift: MotionValue<string>) => ReactNode;
}


const originalImgWidth = 500;

export const BetweenLands = ({isBackground, isCrt, crtCallback, renderItem}: BetweenLandsProps) => {
  let ref = useRef<HTMLDivElement>(null);
  let separatorInRef = useRef<HTMLDivElement>(null);
  let separatorOutRef = useRef<HTMLDivElement>(null);
  const [separatorHeight, setSeparatorHeight] = useState(0);
  const [dragConstraints, setDragConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });
  const [crtWidth, setCrtWidth] = useState(0);
  const [snapPoint, setSnapPoint] = useState({ x: 1600, y: 1600 });

  const updateSeparatorHeights = () => {
    if (!separatorInRef.current || !separatorOutRef.current) return;
    const inHeight = separatorInRef.current.offsetHeight || 0;
    setSeparatorHeight(inHeight);

    if(ref.current) {
      const bounds = ref.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const width = viewportWidth * 0.2; 

      const scale = width / originalImgWidth;

      setSnapPoint( prev => ({
        x: Math.round(prev.x * scale),
        y: Math.round(prev.y * scale),
      }));

      setCrtWidth(width);
      setDragConstraints({
        top: 0,
        left: 0,
        right: viewportWidth - width,
        bottom: bounds.height - width,
      });
    }
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

  const crtProp = {
    isCrt: isCrt,
    snapPoint: snapPoint,
    callBack: crtCallback ? crtCallback : () => {},
    dragConstraints: dragConstraints,
    crtWidth: crtWidth,
    bounds: ref,
  }

  return (
    <div 
      className="relative bg-primary"
      ref={ref}
    >
      <Crt {...crtProp} />
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