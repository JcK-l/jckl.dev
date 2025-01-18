import { SeparatorIn } from "./SeparatorIn";
import { SeparatorOut } from "./SeparatorOut";
import type { ReactNode } from 'react';
import { useEffect, useState, useRef } from 'react';
import { MotionValue, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { Crt } from './Crt';
import { BitPosition, isBitSet } from "../stores/binaryStateStore"

interface BetweenLandsProps {
  isBackground: boolean;
  isCrt: boolean;
  crtCallback?: () => void;
  renderItem: (shift: MotionValue<string>) => ReactNode;
}


const originalImgWidth = 500;
const originalSnapPoint = { x: 1600, y: 1750 };

export const BetweenLands = ({isBackground, isCrt, crtCallback, renderItem}: BetweenLandsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const separatorInRef = useRef<HTMLDivElement>(null);
  const separatorOutRef = useRef<HTMLDivElement>(null);
  const [separatorHeight, setSeparatorHeight] = useState(0);
  const [dragConstraints, setDragConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });
  const [crtWidth, setCrtWidth] = useState(0);
  const [snapPoint, setSnapPoint] = useState(originalSnapPoint);

  const updateSizes = () => {
    if (!separatorInRef.current || !separatorOutRef.current) return;
    const inHeight = separatorInRef.current.offsetHeight || 0;
    setSeparatorHeight(inHeight);

    if(ref.current) {
      const bounds = ref.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const width = viewportWidth * 0.2; 

      const scale = width / originalImgWidth;

      setSnapPoint({
        x: Math.round(originalSnapPoint.x * scale),
        y: Math.round(originalSnapPoint.y * scale),
      });

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
    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, [separatorInRef, separatorOutRef]);


  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 100%", "100% 0%"],
  });

  let layer = useTransform(scrollYProgress, [0, 1], [`-${separatorHeight/2}px`, `${separatorHeight/2}px`]);

  const zeroPx = useMotionValue('0px');

  const crtProp = {
    isCrt: isCrt && !isBitSet(BitPosition.FLAG_LEND_A_HAND),
    snapPoint: snapPoint,
    callBack: crtCallback ? crtCallback : () => {},
    dragConstraints: dragConstraints,
    crtWidth: crtWidth,
    bounds: ref,
  }

  return (
    <div 
      className="relative bg-bgColor"
      ref={ref}
    >
      <Crt {...crtProp} />
      <SeparatorIn ref={separatorInRef} />
      
      {isBackground ? (
        renderItem(layer)
      ) : 
        renderItem(zeroPx)
      }
      <SeparatorOut ref={separatorOutRef} isCrt={isCrt} />
    </div>
  );
};
