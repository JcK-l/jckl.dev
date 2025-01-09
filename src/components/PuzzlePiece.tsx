import { motion, useDragControls, animate, useAnimation } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface PuzzlePieceProps {
  id: number;
  path: string;
  puzzlebounds: React.RefObject<HTMLElement>;
  pieceSize: {width:number, height:number};
  pieceBox: string;
  pieceCoords: string;
  snapPosition: { x: number; y: number };
  dragConstraints: { top: number; left: number; right: number; bottom: number };
  hidden: boolean;
}

const threshold = 50;

const soundFiles = [
  '/PuzzlePieces/sounds/1.mp3',
  '/PuzzlePieces/sounds/2.mp3',
  '/PuzzlePieces/sounds/3.mp3',
  '/PuzzlePieces/sounds/4.mp3',
  '/PuzzlePieces/sounds/5.mp3',
  // '/PuzzlePieces/sounds/6.mp3'
];

export const PuzzlePiece = ({ id, path, puzzlebounds, pieceSize, pieceBox, pieceCoords, snapPosition, dragConstraints, hidden } : PuzzlePieceProps) => {
  if (hidden) return null;
  const [isHidden, setIsHidden] = useState(false);
  const dragControls = useDragControls();
  const controls = useAnimation();

  const imgRef = useRef<HTMLImageElement>(null);

  const playRandomSound = () => {
    const randomIndex = Math.floor(Math.random() * soundFiles.length);
    const audio = new Audio(soundFiles[randomIndex]);
    audio.play();
  };

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  const handleDragEnd = () => {
    if (imgRef.current && puzzlebounds.current) {
      const imgRect = imgRef.current.getBoundingClientRect();
      const boundsRect = puzzlebounds.current.getBoundingClientRect();

      const centerX = imgRect.left + imgRect.width / 2 - boundsRect.left;
      const centerY = imgRect.top + imgRect.height / 2 - boundsRect.top;

      const distance = calculateDistance(centerX, centerY, snapPosition.x, snapPosition.y);

      if (distance < threshold) {
        controls.start({
          x: snapPosition.x - imgRect.width / 2,
          y: snapPosition.y - imgRect.height / 2,
          transition: {
            type: "spring",
            stiffness: 800,
            damping: 50,
          },
        }).then(() => {
          const svgDoc = (puzzlebounds.current as HTMLObjectElement).contentDocument;
          if (svgDoc) {
            const pieceId = `p${id}`;
            const element = svgDoc.getElementById(pieceId);
            if (element) {
              element.style.opacity = "1"; // Change the opacity value as needed
            }
          }
          setIsHidden(true); // Hide the image after animation completes
          playRandomSound();
        });
      }
    }
  };

  return (
    <>
      <motion.img
        ref={imgRef}
        className={`absolute cursor-grab active:cursor-grabbing z-10 select-none ${isHidden ? 'hidden' : ''}`}
        src={path}
        drag
        dragTransition={{ power: 0 }}
        dragControls={dragControls}
        dragConstraints={ dragConstraints } 
        onDragEnd={handleDragEnd}
        style={{
            width: `${pieceSize.width}px`,
            height: `${pieceSize.height}px`,
            filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
          }}
        useMap={`#image-map${path}`}
        draggable="false" 
        animate={controls}
      /> 

      <map className="select-none" name={`image-map${path}`} draggable="false"  >
          <area className="cursor-grab active:cursor-grabbing touch-none" onPointerDown={event => {dragControls.start(event)}} coords={pieceCoords} shape="poly" />
          <area coords={pieceBox}  shape="rect"/>
      </map> 
    </>
  );
};