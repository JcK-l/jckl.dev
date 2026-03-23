import { useStore } from "@nanostores/react";
import {
  heroPortraitSizes,
  heroPortraitSrc,
  heroPortraitSrcSet,
} from "../data/heroImage";
import { $endingState, isEndingActive } from "../stores/endingStore";
import { HeroFaceFrame, type HeroFaceImageLayout } from "./HeroFaceFrame";

const heroImageLayouts = {
  default: {
    x: 13.26,
    y: 95.32,
    width: 898.72,
    assetWidth: 2000,
    assetHeight: 1428,
    src: heroPortraitSrc,
    srcSet: heroPortraitSrcSet,
    sizes: heroPortraitSizes,
    alt: "Portrait of Joshua",
  },
  neutral: {
    x: 154.03,
    y: 97,
    width: 630,
    assetWidth: 1044,
    assetHeight: 1044,
    src: "/jTransparent.avif",
    alt: "Joshua silhouette",
  },
  positive: {
    x: 1.5,
    y: 97,
    width: 943.11,
    assetWidth: 1500,
    assetHeight: 1002,
    src: "/classicPhone.avif",
    alt: "Classic phone",
  },
} satisfies Record<"default" | "neutral" | "positive", HeroFaceImageLayout>;

export const HeroFace = () => {
  const endingState = useStore($endingState);
  const isNegativeEndingActive = isEndingActive("negative", endingState);

  const heroImageLayout =
    endingState.selectedSentiment === "neutral"
      ? heroImageLayouts.neutral
      : endingState.selectedSentiment === "positive"
        ? heroImageLayouts.positive
        : heroImageLayouts.default;

  return (
    <HeroFaceFrame
      imageLayout={heroImageLayout}
      hideImage={isNegativeEndingActive}
    />
  );
};
