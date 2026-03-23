import { ArrowDown } from "../../utility/icons";
import { HeroFace } from "../hero/HeroFace";
import { useStore } from "@nanostores/react";
import { $endingState, isEndingActive } from "../../stores/endingStore";

const Hero = () => {
  const endingState = useStore($endingState);
  const isNegativeEndingActive = isEndingActive("negative", endingState);

  return (
    <div className="relative mb-1 flex flex-col items-center justify-between">
      <HeroFace />

      <div
        className={`relative z-10 w-full px-8 text-center ${
          isNegativeEndingActive ? "pointer-events-none invisible" : ""
        }`}
      >
        <h1 className="h1-text mb-8 inline-block w-auto text-titleColor">
          I'm Joshua
          {endingState.selectedSentiment === "positive" ? "!" : ""}
        </h1>
        <p className="p-text mb-10 xl:mb-16">
          Welcome to my corner of the web - stick around, uncover the hidden,
          and see where curiosity takes you.
          <br />
          Ready to explore?
          {/* Welcome to my website! Cool that you found it something something{" "}
          <br />
          somethings. cool cool something something. Everthings nice thanks to
          you &lt;3 */}
        </p>

        <a
          href="#starConstellation"
          aria-label="Scroll to the next section"
          className="relative inline-block h-10 w-10 cursor-pointer xl:h-16 xl:w-16"
        >
          <ArrowDown className="animate-bounce" />
        </a>
      </div>
    </div>
  );
};

export default Hero;
