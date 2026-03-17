import { useStore } from "@nanostores/react";
import { BetweenLands } from "../BetweenLands";
import {
  $sentimentState,
  isBitSet,
  SentimentStateFlags,
} from "../../stores/sentimentStateStore";

const TransitionSection = () => {
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
      renderItem={() => <div className="h-20 md:h-28" />}
    />
  );
};

export default TransitionSection;
