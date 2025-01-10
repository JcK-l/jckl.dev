import { useRef } from "react";
import { FlyingMan } from "../FlyingMan";
import { Puzzle } from "../Puzzle";
import { PuzzleProvider } from "../../context/PuzzleContext";



export const About = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* <FlyingMan ref={ref} /> */}
      <div 
        className="relative page-margins bg-white"
        ref={ref}
      >
        {/* <div className="h-auto bg-white w-full absolute inset-0"></div> */}
        <div className="z-10 w-full">
          <h1 className="inline-block mb-8 xl:mb-24 h2-text text-secondary">
            About Me!
          </h1>
        </div>

        <PuzzleProvider>
          <div className="flex items-center justify-between flex-col-reverse md:flex-row">
            <div className="w-1/2 2xl:w-2/3 h-36">

            </div>
            <Puzzle />
          </div>
        </PuzzleProvider>
      </div>
    </>
  );
};
