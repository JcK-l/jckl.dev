import { Carousel, CarouselText } from "../Carousel";
import { CarouselProvider } from "../../context/CarouselContext";
import { SeparatorIn } from "../test";
import { SeparatorOut } from "../test2";

export const Projects = () => {
  return (
    <>
    {/* <h1 className="text-4xl font-bold mx-12 xl:mx-48 mb-8">Projects</h1> */}
    {/* <div className="h-auto bg-white w-full absolute inset-0"></div> */}
    <div className="z-10 w-full px-8 text-center text-secondary">
      <h1 className="inline-block w-auto p-4 mb-8 xl:mb-24 font-heading font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl 2xl:text-8xl">
        My Projects!
      </h1>
    </div>
    <CarouselProvider>
      <Carousel />
      <CarouselText />
    </CarouselProvider>
    </>
  );
};
