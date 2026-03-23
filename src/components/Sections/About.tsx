import { useRef } from "react";
import { PuzzleGame } from "../puzzle/PuzzleGame";
import { PuzzleProvider } from "../../context/PuzzleContext";
import { Email } from "../appliance/Email";
import { AboutProfileDeck } from "../AboutProfileDeck";
import { useStore } from "@nanostores/react";
import { $endingState, isEndingActive } from "../../stores/endingStore";
import { $endingMailBySentiment } from "../../stores/endingMailStore";

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const endingState = useStore($endingState);
  const endingMailBySentiment = useStore($endingMailBySentiment);
  const isEndingModeActive = isEndingActive(undefined, endingState);
  const activeEndingLabel = isEndingModeActive
    ? endingState.selectedSentiment
    : null;
  const endingMail =
    activeEndingLabel === null
      ? null
      : endingMailBySentiment[activeEndingLabel];
  const isMail = endingMail !== null;

  return (
    <>
      <div className="page-margins relative py-4" ref={ref}>
        <div className="z-10 mb-8 flex w-full items-start gap-4 xl:mb-24">
          {endingState.selectedSentiment === "negative" ? (
            <div className="flex-1" />
          ) : (
            <div className="flex-1">
              <h1 className="h2-text inline-block text-titleColor">
                About Me
                {endingState.selectedSentiment === "positive" ? "!" : ""}
              </h1>
            </div>
          )}
        </div>

        <PuzzleProvider>
          <div className="relative flex flex-col-reverse items-start gap-10 lg:flex-row lg:items-start lg:gap-20">
            <div className="relative flex w-full flex-col gap-4">
              {!isMail ? <AboutProfileDeck /> : null}
              <Email
                name={endingMail?.name ?? ""}
                email={endingMail?.email ?? ""}
                message={endingMail?.message ?? ""}
                date={endingMail?.date ?? ""}
                isMail={isMail}
              />
            </div>
            <PuzzleGame />
          </div>
        </PuzzleProvider>
      </div>
    </>
  );
};

export default About;
