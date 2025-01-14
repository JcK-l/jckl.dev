import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface CrtProps {
  isCrt: boolean;
  snapPoint: { x: number, y: number };
  callBack: () => void;
  dragConstraints: { top: number; left: number; right: number; bottom: number };
  crtWidth: number;
  bounds: React.RefObject<HTMLElement>;
}

const threshold = 100;

export const Crt = ({isCrt, snapPoint, callBack, dragConstraints, crtWidth, bounds} : CrtProps) => {

  if (!isCrt) return null;

  const controls = useAnimation();
  const imgRef = useRef<HTMLImageElement>(null);
  const [isHidden, setIsHidden] = useState(false);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  const handleDragEnd = () => {
    if (imgRef.current && bounds.current) {
      const imgRect = imgRef.current.getBoundingClientRect();
      const boundsRect = bounds.current.getBoundingClientRect(); 

      const centerX = imgRect.left + imgRect.width / 2  - boundsRect.left;
      const centerY = imgRect.top + imgRect.height / 2  - boundsRect.top;

      const distance = calculateDistance(centerX, centerY, snapPoint.x, snapPoint.y);

      if (distance < threshold) {
        controls.start({
          x: snapPoint.x - imgRect.width / 2,
          y: snapPoint.y - imgRect.height / 2,
          transition: {
            type: "spring",
            stiffness: 800,
            damping: 50,
          },
        }).then(() => {
          callBack();
          setIsHidden(true)
        });
      } else {
        // play sound
        controls.start({
          y: 0,
          transition: {
            type: "inertia",
            velocity: 1000,
            power: 1.5,
            min: boundsRect.height - 2* imgRect.height,
            max: boundsRect.height - 2* imgRect.height,
            // bounceStiffness: 0,
            bounceDamping: 30,
          },
        });
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (imgRef.current && bounds.current) {
        const imgRect = imgRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const boundsRect = bounds.current.getBoundingClientRect(); 

        const top = imgRect.top - boundsRect.top;
        

        const newX = Math.max(0, Math.min(imgRect.left, viewportWidth - imgRect.width));
        const newY = Math.max(boundsRect.height - 2 * imgRect.height, Math.min(top, boundsRect.height - 2 * imgRect.height));

        controls.start({ x: newX, y: newY });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const moveToStartPosition = () => {
    if (imgRef.current && bounds.current) {
      const imgRect = imgRef.current.getBoundingClientRect();
      const boundsRect = bounds.current.getBoundingClientRect();

      console.log(dragConstraints);
      console.log(boundsRect.height - imgRect.width);
      controls.start({
        x: 0,
        y: boundsRect.height - 2 * imgRect.height,
        transition: {
          duration: 0
        },
      })
    }
  }

  useEffect(() => {
    moveToStartPosition();
  }, [imgRef.current]);


  return (
    <>
      { 
        (<motion.img 
          drag 
          ref={imgRef}
          dragConstraints={dragConstraints} 
          onDragEnd={handleDragEnd}
          dragElastic={0} 
          dragMomentum={false} 
          draggable={false} 
          src="/tv.avif" 
          alt="crt" 
          hidden={isHidden}
          animate={controls}
          style={{ width : crtWidth  }}
          className="absolute z-40 cursor-grab active:cursor-grabbing select-none" />)
      }
    </>
  );
};