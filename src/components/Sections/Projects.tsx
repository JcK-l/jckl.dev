import { Carousel, CarouselText } from "../Carousel";
import { CarouselProvider } from "../../context/CarouselContext";

export const Projects = () => {
  return (
    <div className="relative page-margins bg-white">
    <div className="z-10 w-full text-secondary">
      <h1 className="inline-block w-auto mb-8 xl:mb-24 subtitle-text">
        My Projects!
      </h1>
    </div>
    <CarouselProvider>
      <Carousel />
      <CarouselText />
    </CarouselProvider>
    </div>
  );
};
