import { useStore } from "@nanostores/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTime,
  useTransform,
} from "framer-motion";
import { useId, useRef } from "react";
import { $endingState, isEndingActive } from "../stores/endingStore";
import {
  heroPortraitSizes,
  heroPortraitSrc,
  heroPortraitSrcSet,
} from "../data/heroImage";

const HERO_VIEWBOX_WIDTH = 900;
const HERO_VIEWBOX_HEIGHT = 743;

const heroImageLayouts = {
  default: {
    x: 23.26,
    y: 85.32,
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
} as const;

const getHeroImageStyle = (layout: (typeof heroImageLayouts)[keyof typeof heroImageLayouts]) => {
  return {
    aspectRatio: `${layout.assetWidth} / ${layout.assetHeight}`,
    left: `${(layout.x / HERO_VIEWBOX_WIDTH) * 100}%`,
    top: `${(layout.y / HERO_VIEWBOX_HEIGHT) * 100}%`,
    width: `${(layout.width / HERO_VIEWBOX_WIDTH) * 100}%`,
  } as const;
};

const heroLayerDefs = [
  {
    key: "secondary",
    className: "z-10",
    fill: "var(--color-secondary)",
    path: "M 331.7852,104.4824 c 28.5059,0.2033 57.1359,2.3928 83.2265,3.9746 69.6046,4.1394 125.97,2.5086 152.1582,31.9532 26.1095,29.4146 38.007,76.3095 81.59381,118.7324 43.5083,42.3932 113.8793,81.7606 114.6797,104.8281 0.8004,23.0677 -83.8557,43.4598 -130.7676,83.457 -46.88201,39.9184 -56.02091,99.4419 -98.24801,155.3399 -42.2761,55.7896 -117.7485,108.0035 -152.5899,80.5 C 346.9176,655.7346 352.6284,548.4838 312.793,476.4394 272.8492,404.4439 187.3595,367.6553 156,308.6289 c -31.3594,-59.0264 -8.5888,-140.2897 46.6426,-176.5957 34.4705,-22.71 81.6327,-27.8896 129.1426,-27.5508 z",
    amplitudeX: 18,
    amplitudeY: 12,
    cycleDuration: 23,
    phase: 0.4,
    baseX: 0,
    baseY: 0,
    shouldAnimate: true,
  },
  {
    key: "transition-1",
    className: "z-20",
    fill: "var(--color-transition1)",
    path: "M 279.77149,100 h 127.62305 c 17.4936,0.033 83.92346,0.6663 97.38086,1.1543 85.5714,2.9171 110.04147,-5.8019 144.92187,31.8809 34.9198,37.8274 29.4379,123.3959 55.9043,191.5742 26.4664,68.1784 84.73711,119.0047 108.66211,190.9824 23.9778,71.8858 13.64862,165.068 -42.63868,172.6817 -56.32669,7.469 -158.66496,-70.5375 -226.41796,-103.9434 -67.845,-33.4585 -101.14355,-22.4621 -145.46875,-23.1523 -44.4172,-0.7429 -99.94018,-13.4622 -145.17188,-51.2051 -45.0871,-37.7823 -80.0677,-100.6919 -91.2168,-178.5528 -11.2413,-77.9136 1.25817,-170.8322 55.38477,-209.2519 16.8436,-11.9728 37.71471,-18.6813 61.03711,-22.168 z",
    amplitudeX: 12,
    amplitudeY: 9,
    cycleDuration: 19,
    phase: 0,
    baseX: 0,
    baseY: 0,
    shouldAnimate: true,
  },
  {
    key: "transition-2",
    className: "z-30",
    fill: "var(--color-transition2)",
    path: "M 419.3047,131.9531 c 47.8941,0.7276 86.1607,13.5353 121.6015,18.0215 40.50371,5.0245 77.21281,-0.7179 134.12311,3.2812 56.9104,3.8966 133.9187,17.5344 149.1972,53.834 15.1761,36.197 -31.2738,95.0562 -54.7558,159.5547 -23.3793,64.4984 -23.7904,134.7395 -57.4239,169.8086 -33.6335,35.0691 -100.5919,34.8638 -186.72651,61.4219 C 439.0832,624.4332 333.6694,677.6508 260.455,655.5019 187.3431,633.2505 146.5323,535.6327 141.3027,444.166 c -5.3321,-91.4668 24.9169,-176.6785 75.9824,-230.8203 50.9629,-54.2442 122.8445,-77.3173 180.8828,-80.9063 7.2548,-0.4486 14.2948,-0.5903 21.1368,-0.4863 z",
    amplitudeX: 8,
    amplitudeY: 6,
    cycleDuration: 15,
    phase: 0.8,
    baseX: 0,
    baseY: 0,
    shouldAnimate: true,
  },
  {
    key: "foreground",
    className: "z-40 h-[101%] w-[101%]",
    fill: "var(--color-fg-color)",
    path: "M 373.04887,107.92578 c 11.3543,-0.1479 22.7659,-0.013 34.1445,0.35156 91.1203,3.007 179.9623,20.59437 266.709,62.50977 86.6554,41.8242 171.0338,107.88654 180.3281,186.52344 9.2943,78.6368 -56.5867,169.84691 -115.0859,236.82031 -58.4082,67.0646 -109.4363,109.80104 -163.1973,115.08594 -53.761,5.285 -110.1641,-26.78939 -170.9414,-20.77539 -60.7773,6.0139 -125.9284,50.20709 -188.89259,47.83789 -62.9641,-2.278 -123.83212,-51.02809 -140.41602,-111.89649 -16.675,-60.8684 10.7519,-133.76326 27.0625,-218.41406 16.4017,-84.5597 21.68632,-180.87506 70.98242,-234.81836 43.1341,-47.28 119.82549,-62.18941 199.30669,-63.22461 z",
    amplitudeX: 0,
    amplitudeY: 0,
    cycleDuration: 13,
    phase: 0.2,
    baseX: 0,
    baseY: -10,
    shouldAnimate: false,
  },
] as const;

type HeroMaskLayerProps = {
  id: string;
  className: string;
  fill: string;
  path: string;
  amplitudeX: number;
  amplitudeY: number;
  cycleDuration: number;
  phase: number;
  baseX: number;
  baseY: number;
  shouldAnimate: boolean;
  reduceMotion: boolean;
};

const HeroMaskLayer = ({
  id,
  className,
  fill,
  path,
  amplitudeX,
  amplitudeY,
  cycleDuration,
  phase,
  baseX,
  baseY,
  shouldAnimate,
  reduceMotion,
}: HeroMaskLayerProps) => {
  const time = useTime();
  const isAnimated = !reduceMotion && shouldAnimate;
  const animatedX = useTransform(time, (value) => {
    const seconds = value / 1000;
    const angle = (seconds / cycleDuration) * Math.PI * 2 + phase;

    return (
      baseX +
      Math.sin(angle) * amplitudeX +
      Math.sin(angle * 0.47 + phase * 1.3) * amplitudeX * 0.18
    );
  });
  const animatedY = useTransform(time, (value) => {
    const seconds = value / 1000;
    const angle = (seconds / cycleDuration) * Math.PI * 2 + phase;

    return (
      baseY +
      Math.cos(angle * 0.9 + phase * 0.6) * amplitudeY +
      Math.sin(angle * 0.42 + phase) * amplitudeY * 0.14
    );
  });

  return (
    <svg
      className={`pointer-events-none absolute inset-0 ${className}`}
      viewBox={`0 0 ${HERO_VIEWBOX_WIDTH} ${HERO_VIEWBOX_HEIGHT}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <mask
          id={id}
          x="0"
          y="0"
          width={HERO_VIEWBOX_WIDTH}
          height={HERO_VIEWBOX_HEIGHT}
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width={HERO_VIEWBOX_WIDTH}
            height={HERO_VIEWBOX_HEIGHT}
            fill="white"
          />
          {isAnimated ? (
            <motion.g style={{ x: animatedX, y: animatedY }}>
              <path d={path} fill="black" />
            </motion.g>
          ) : (
            <g
              transform={
                baseX !== 0 || baseY !== 0
                  ? `translate(${baseX} ${baseY})`
                  : undefined
              }
            >
              <path d={path} fill="black" />
            </g>
          )}
        </mask>
      </defs>
      <rect
        x="0"
        y="0"
        width={HERO_VIEWBOX_WIDTH}
        height={HERO_VIEWBOX_HEIGHT}
        mask={`url(#${id})`}
        style={{
          filter: "var(--hero-face-shadow-filter)",
          fill,
        }}
      />
    </svg>
  );
};

export const Face = () => {
  const endingState = useStore($endingState);
  const isNegativeEndingActive = isEndingActive("negative", endingState);
  const reduceMotion = useReducedMotion();
  const maskPrefix = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 0%", "100% 0%"],
  });
  const layer = useTransform(scrollYProgress, [0, 1], ["0vh", "10vh"]);

  const heroImageLayout =
    endingState.selectedSentiment === "neutral"
      ? heroImageLayouts.neutral
      : endingState.selectedSentiment === "positive"
        ? heroImageLayouts.positive
        : heroImageLayouts.default;

  return (
    <div
      ref={ref}
      className="relative z-30 mb-8 h-auto w-10/12 select-none overflow-hidden bg-bgColor sm:w-9/12 md:mb-10 md:w-8/12 lg:w-6/12 2xl:w-5/12 desk:w-4/12 desk-l:w-4/12"
    >
      <svg
        viewBox={`0 0 ${HERO_VIEWBOX_WIDTH} ${HERO_VIEWBOX_HEIGHT}`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        className="relative -z-30"
        aria-hidden="true"
      >
        <path style={{ fill: "none" }} d="M 0,0 V 743 H 900 V 0 Z" />
      </svg>

      <motion.div
        style={{ y: layer }}
        className={`absolute inset-0 mix-blend-screen ${
          isNegativeEndingActive ? "pointer-events-none invisible" : ""
        }`}
      >
        <img
          src={heroImageLayout.src}
          srcSet={"srcSet" in heroImageLayout ? heroImageLayout.srcSet : undefined}
          sizes={"sizes" in heroImageLayout ? heroImageLayout.sizes : undefined}
          alt={heroImageLayout.alt}
          className="absolute block h-auto max-w-none"
          decoding="async"
          fetchpriority="high"
          loading="eager"
          style={getHeroImageStyle(heroImageLayout)}
        />
      </motion.div>

      {heroLayerDefs.map((layerDef) => {
        return (
          <HeroMaskLayer
            key={layerDef.key}
            id={`${maskPrefix}-${layerDef.key}`}
            className={layerDef.className}
            fill={layerDef.fill}
            path={layerDef.path}
            amplitudeX={layerDef.amplitudeX}
            amplitudeY={layerDef.amplitudeY}
            cycleDuration={layerDef.cycleDuration}
            phase={layerDef.phase}
            baseX={layerDef.baseX}
            baseY={layerDef.baseY}
            shouldAnimate={layerDef.shouldAnimate}
            reduceMotion={reduceMotion}
          />
        );
      })}
    </div>
  );
};
