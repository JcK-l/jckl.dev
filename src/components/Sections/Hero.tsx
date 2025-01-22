import { ArrowDown } from "../../utility/icons";
import { Face } from "../Face";
import {
  $sentimentState,
  isBitSet,
  SentimentStateFlags,
} from "../../stores/sentimentStateStore";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";

const Hero = () => {
  const sentimentState = useStore($sentimentState);

  useEffect(() => {
    const existingFlags = JSON.parse(
      sessionStorage.getItem("flags") || "[true, false, false, false]"
    );

    sessionStorage.setItem("flags", JSON.stringify(existingFlags));
  }, []);


  const scrollToSection = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    const section = document.getElementById("starConstellation");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
    <div className="relative mb-1 flex flex-col items-center justify-between">
      <Face />

      {isBitSet(SentimentStateFlags.FLAG_NEGATIVE) ? (
        <div></div>
      ) : (
        <div className="relative z-10 w-full px-8 text-center">
          <h1 className="h1-text mb-8 inline-block w-auto text-titleColor">
            I'm Joshua{isBitSet(SentimentStateFlags.FLAG_POSITIVE) ? '!' : ''}
          </h1>
          <p className="p-text mb-10 xl:mb-16">
            Welcome to my corner of the web—stick around, uncover the hidden, and see where curiosity takes you.
            <br />
            Ready to explore?
            {/* Welcome to my website! Cool that you found it something something{" "}
            <br />
            somethings. cool cool something something. Everthings nice thanks to
            you &lt;3 */}
          </p>

          <a
            onClick={scrollToSection}
            className="relative inline-block h-10 w-10 cursor-pointer xl:h-16 xl:w-16"
          >
            <ArrowDown className="animate-bounce" />
          </a>
        </div>
      )}
    </div>
  );
};

export default Hero;
