import { useStore } from "@nanostores/react";
import { BetweenLands } from "../BetweenLands";
import { Phone } from "../Phone";
import {
  $sentimentState,
  isBitSet,
  SentimentStateFlags,
} from "../../stores/sentimentStateStore";

const PhoneSection = () => {
  const sentimentState = useStore($sentimentState);

  if (
    isBitSet(SentimentStateFlags.FLAG_NEGATIVE) &&
    isBitSet(SentimentStateFlags.FLAG_ACTIVE)
  ) {
    return <div></div>;
  }

  return (
    <BetweenLands
      isBackground={false}
      isCrt={false}
      renderItem={() => (
        <div className="page-margins pointer-events-auto relative z-20 py-10 text-white">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
            <div className="w-full text-center md:w-5/12 md:pt-12 md:text-left">
              <h2 className="h2-text mb-4">Phone</h2>
              <p className="p-text text-white/90">
                Dial a number, try a code, or chase down the wrong timeline.
              </p>
            </div>
            <Phone />
          </div>
        </div>
      )}
    />
  );
};

export default PhoneSection;
