import { motion, useDragControls } from "framer-motion";

interface PuzzlePieceProps {
  path: string;
  puzzlebounds: React.RefObject<HTMLElement>;
  pieceSize: {width:number, height:number};
  pieceBox: string;
  pieceCoords: string;
  snapPosition: { x: number; y: number };
  hidden: boolean;
}

export const PuzzlePiece = ({ path, puzzlebounds, pieceSize, pieceBox, pieceCoords, snapPosition, hidden } : PuzzlePieceProps) => {
  if (hidden) return null;
    const dragControls = useDragControls();


        {/* <motion.img drag dragTransition={{power:0}}  ref={refff} src="/PuzzlePieces/1.avif" useMap="#image-map" className="w-1/2"/>
          

        <map name="image-map" >
            <area className="cursor-grab active:cursor-grabbing" onPointerDown={event => {dragControls.start(event); console.log("something")}} coords={coords.polygon}  shape="poly" />
             <area coords={coords.rect} shape="rect"/>
       </map> */}

  return (
    <>
      <motion.img
        className="absolute cursor-grab active:cursor-grabbing z-10 select-none"
        src={path}
        drag
        dragTransition={{ power: 0 }}
        dragControls={dragControls}
        dragConstraints={ puzzlebounds } 
        style={{
            width: `${pieceSize.width}px`,
            height: `${pieceSize.height}px`,
            filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
          }}
        useMap={`#image-map${path}`}
        draggable="false" 
      /> 

      <map className="select-none" name={`image-map${path}`} draggable="false"  >
          <area className="cursor-grab active:cursor-grabbing touch-none" onPointerDown={event => {dragControls.start(event); console.log("something")}} coords={pieceCoords} shape="poly" />
          <area coords={pieceBox}  shape="rect"/>
      </map> 
    </>
  );
};