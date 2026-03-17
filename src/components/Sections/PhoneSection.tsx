import { useStore } from "@nanostores/react";
import { BetweenLands } from "../BetweenLands";
import { Phone } from "../Phone";
import {
  $sentimentState,
  isBitSet,
  SentimentStateFlags,
} from "../../stores/sentimentStateStore";

const PhoneSection = () => {
  useStore($sentimentState);

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
          <div className="mx-auto flex max-w-5xl items-center justify-center">
            <div className="flex w-full justify-center">
              <Phone />
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default PhoneSection;
