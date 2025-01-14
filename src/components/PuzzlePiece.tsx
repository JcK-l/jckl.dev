import { motion, useDragControls, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePuzzleContext } from "../hooks/useDataContext";

interface PuzzlePieceProps {
  id: number;
  path: string;
  puzzlebounds: React.RefObject<HTMLElement>;
  pieceSize: {width:number, height:number};
  pieceBox: string;
  pieceCoords: string;
  snapPoint: { x: number; y: number };
  startPoint: { x: number; y: number };
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

export const PuzzlePiece = ({ id, path, puzzlebounds, pieceSize, pieceBox, pieceCoords, snapPoint, startPoint, dragConstraints, hidden } : PuzzlePieceProps) => {
  if (hidden) return null;
  const [isHidden, setIsHidden] = useState(false);
  const dragControls = useDragControls();
  const controls = useAnimation();

  const imgRef = useRef<HTMLImageElement>(null);

  const { lastPiece, setLastPiece, totalPlacedPieces, setTotalPlacedPieces  } = usePuzzleContext();

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
          const svgDoc = (puzzlebounds.current as HTMLObjectElement).contentDocument;
          if (svgDoc) {
            const pieceId = `p${id}`;
            const element = svgDoc.getElementById(pieceId);
            if (element) {
              element.style.opacity = "1"; // Change the opacity value as needed
            }
          }
          playRandomSound();
          setLastPiece(id);
          setTotalPlacedPieces((prev) => prev + 1);
          setIsHidden(true); // Hide the image after animation completes
        });
      }
    }
  };

  const moveToStartPosition = () => {
    if (imgRef.current) {
      const imgRect = imgRef.current.getBoundingClientRect();

      controls.start({
        x: startPoint.x - imgRect.width / 2,
        y: startPoint.y - imgRect.height / 2,
        transition: {
          delay: 0.5,
          type: "spring",
          stiffness: 800,
          damping: 50,
        },
      })
    }
  }

  useEffect(() => {
    moveToStartPosition();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (imgRef.current && puzzlebounds.current) {
        const imgRect = imgRef.current.getBoundingClientRect();
        const boundsRect = puzzlebounds.current.getBoundingClientRect(); 

        const top = imgRect.top - boundsRect.top;
        const left = imgRect.left - boundsRect.left;
        

        const newX = Math.max(0, Math.min(left, boundsRect.width - imgRect.width));
        const newY = Math.max(0, Math.min(top, boundsRect.height - imgRect.height));

        controls.start({ x: newX, y: newY });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <motion.img
        ref={imgRef}
        className={`absolute cursor-default z-10 select-none ${isHidden ? 'hidden' : ''}`}
        src={path}
        drag
        dragTransition={{ power: 0 }}
        dragControls={dragControls}
        dragConstraints={ dragConstraints } 
        onDragEnd={handleDragEnd}
        style={{
            width: `${pieceSize.width}px`,
            height: `${pieceSize.height}px`,
            filter: "drop-shadow(0px 4px 4px rgba(35, 25, 66, 0.20))",
          }}
        useMap={`#image-map${path}`}
        draggable={false} 
        animate={controls}
      /> 

      <map className="select-none" name={`image-map${path}`} draggable={false}  >
          <area className="cursor-grab active:cursor-grabbing touch-none" onPointerDown={event => {dragControls.start(event)}} coords={pieceCoords} shape="poly" />
          <area coords={pieceBox}  shape="rect"/>
      </map> 
    </>
  );
};