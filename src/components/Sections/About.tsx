import { motion, useDragControls } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FlyingMan } from "../FlyingMan";
import { Puzzle } from "../Puzzle";



export const About = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <FlyingMan ref={ref} />
      <div 
        className="relative page-margins bg-white"
        ref={ref}
      >
        {/* <div className="h-auto bg-white w-full absolute inset-0"></div> */}
        <div className="z-10 w-full">
          <h1 className="inline-block mb-8 xl:mb-24 subtitle-text">
            About Me!
          </h1>
        </div>
        {/* <motion.img drag dragTransition={{power:0}} dragControls={dragControls} ref={refff} src="/PuzzlePieces/1.avif" useMap="#image-map" className="w-1/2"/>
          

        <map name="image-map" >
            <area className="cursor-grab active:cursor-grabbing" onPointerDown={event => {dragControls.start(event); console.log("something")}} coords={coords.polygon}  shape="poly" />
             <area coords={coords.rect} shape="rect"/>
       </map> */}

        <Puzzle />
      </div>
    </>
  );
};
