import { motion, useAnimation } from "framer-motion";
import {
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useStore } from "@nanostores/react";
import { BetweenLands } from "../BetweenLands";
import { PuzzlePieceTransfer } from "../puzzle/PuzzlePieceTransfer";
import { Stars } from "../Stars";
import { meImage, meDown } from "../../data/meImage";
import { crtImage } from "../../data/crtImage";
import { puzzleGroups } from "../../data/puzzleGroups";
import {
  setBit as gameStateSetBit,
  isBitSet as gameStateIsBitSet,
  GameStateFlags,
} from "../../stores/gameStateStore";
import {
  $dispensedGroups,
  markPuzzleGroupDispensed,
} from "../../stores/puzzleDispenseStore";
import {
  $endingState,
  hasVisibleEndingBalloons,
  type SentimentLabel,
} from "../../stores/endingStore";
import { activateDiscoveredEnding } from "../../utility/endingMode";

const handPieceIds =
  puzzleGroups.find((group) => group.key === "hand")?.pieces ?? [];

const CRT_SEQUENCE_DELAY_MS = 550;
const CRT_DROP_DELAY_S = 0.6;
const CRT_TRANSFER_AFTER_DROP_START_MS = 500;
const CRT_HIDE_AFTER_TRANSFER_MS = 650;
const CRT_TRANSFER_SOURCE_ANCHOR = { x: 0.56, y: -0.5 };
const MISSION_FLOAT_TRANSITION = {
  duration: 12.5,
  ease: "easeInOut" as const,
  repeat: Infinity,
  times: [0, 0.24, 0.54, 0.79, 1],
};

const balloonHitAreas = {
  negative: { cx: 180.40199, cy: 195.16299, rx: 77.780998, ry: 98.792 },
  neutral: { cx: 331.595, cy: 241.422, rx: 77.780998, ry: 98.792 },
  positive: { cx: 268.68399, cy: 98.792, rx: 77.780998, ry: 98.792 },
} as const;

const discoveredBalloonOutline = {
  fill: "none",
  stroke: "var(--color-white)",
  strokeOpacity: 0.22,
  strokeWidth: 6,
  pointerEvents: "none" as const,
};

const getMissionDropOffsets = (sceneHeight: number) => {
  const safeHeight = Math.max(sceneHeight, 250);

  return {
    endY: safeHeight * 1.2,
    startY: 0,
  };
};

const CrtMission = () => {
  const [opactiy, setOpacity] = useState(0);
  const [opacitySwitch, setOpacitySwitch] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [transferKey, setTransferKey] = useState(0);
  const controls = useAnimation();
  const floatControls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const endingState = useStore($endingState);
  const dispensedGroups = useStore($dispensedGroups);
  const missionRef = useRef<HTMLDivElement>(null);
  const sequenceTimeoutRef = useRef<number | null>(null);
  const transferTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const visibleBalloons = hasVisibleEndingBalloons(endingState);
  const shouldRenderMissionScene =
    !endingState.isActive && (!isHidden || visibleBalloons);

  useEffect(() => {
    if (endingState.isActive) {
      setOpacity(0);
      setOpacitySwitch(0);
    }
  }, [endingState.isActive]);

  useEffect(() => {
    return () => {
      if (sequenceTimeoutRef.current !== null) {
        window.clearTimeout(sequenceTimeoutRef.current);
      }

      if (transferTimeoutRef.current !== null) {
        window.clearTimeout(transferTimeoutRef.current);
      }

      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!shouldRenderMissionScene) {
      floatControls.set({ x: 0, y: 0, rotate: 0 });
      return;
    }

    const element = sectionRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void floatControls.start({
            x: [0, 2.5, -1.5, 1.25, 0],
            y: [0, -6, -14, -9, 0],
            rotate: [0, 0.8, -0.55, 0.35, 0],
            transition: MISSION_FLOAT_TRANSITION,
          });
          return;
        }

        floatControls.stop();
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      floatControls.stop();
    };
  }, [floatControls, shouldRenderMissionScene]);

  const handleBalloonKeyDown = (
    event: KeyboardEvent<SVGGElement>,
    sentiment: SentimentLabel
  ) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    activateDiscoveredEnding(sentiment);
  };

  const getBalloonInteractionProps = (sentiment: SentimentLabel) => {
    const isDiscovered = endingState.discoveredSentiments[sentiment];

    return {
      "aria-label": isDiscovered
        ? `Switch to the ${sentiment} timeline`
        : undefined,
      className: isDiscovered
        ? "cursor-pointer outline-none transition-[filter] duration-200 ease-out drop-shadow-[0_0_0.9rem_rgba(255,255,255,0.24)] hover:drop-shadow-[0_0_1.25rem_rgba(255,255,255,0.42)] focus-visible:drop-shadow-[0_0_1.25rem_rgba(255,255,255,0.42)] active:drop-shadow-[0_0_0.72rem_rgba(255,255,255,0.3)]"
        : "cursor-default",
      filter: isDiscovered ? "url(#missionBalloonGlow)" : undefined,
      focusable: isDiscovered ? true : undefined,
      onClick: isDiscovered
        ? () => {
            activateDiscoveredEnding(sentiment);
          }
        : undefined,
      onMouseDown: isDiscovered
        ? (event: MouseEvent<SVGGElement>) => {
            event.preventDefault();
          }
        : undefined,
      onKeyDown: isDiscovered
        ? (event: KeyboardEvent<SVGGElement>) => {
            handleBalloonKeyDown(event, sentiment);
          }
        : undefined,
      role: isDiscovered ? ("button" as const) : undefined,
      style: {
        outline: "none",
        transformBox: "fill-box" as const,
        transformOrigin: "center",
      },
      tabIndex: isDiscovered ? 0 : -1,
    };
  };

  return (
    <BetweenLands
      isBackground={true}
      isCrt={!gameStateIsBitSet(GameStateFlags.FLAG_LEND_A_HAND)}
      separatorInMiddleLayer={
        <PuzzlePieceTransfer
          direction="up"
          onComplete={() => {
            markPuzzleGroupDispensed("hand");
          }}
          pieceIds={handPieceIds}
          sourceAnchor={CRT_TRANSFER_SOURCE_ANCHOR}
          sourceRef={missionRef}
          triggerKey={transferKey}
        />
      }
      crtCallback={() => {
        setOpacity(1);
        sequenceTimeoutRef.current = window.setTimeout(() => {
          const shouldTransfer = !dispensedGroups.hand;
          const sceneHeight =
            missionRef.current?.getBoundingClientRect().height ?? 0;
          const { startY, endY } = getMissionDropOffsets(sceneHeight);

          setOpacitySwitch(1);
          gameStateSetBit(GameStateFlags.FLAG_LEND_A_HAND);
          floatControls.stop();
          floatControls.set({ x: 0, y: 0, rotate: 0 });
          controls.set({ y: startY });

          if (shouldTransfer) {
            transferTimeoutRef.current = window.setTimeout(() => {
              setTransferKey((currentKey) => currentKey + 1);
            }, CRT_DROP_DELAY_S * 1000 + CRT_TRANSFER_AFTER_DROP_START_MS);

            hideTimeoutRef.current = window.setTimeout(() => {
              setIsHidden(true);
            }, CRT_DROP_DELAY_S * 1000 + CRT_TRANSFER_AFTER_DROP_START_MS + CRT_HIDE_AFTER_TRANSFER_MS);
          }

          controls
            .start({
              y: endY,
              transition: {
                delay: CRT_DROP_DELAY_S,
                type: "inertia",
                velocity: 700,
                power: 0.18,
                min: endY,
                max: endY,
                bounceStiffness: 260,
                bounceDamping: 26,
              },
            })
            .then(() => {
              if (shouldTransfer) {
                return;
              }

              setIsHidden(true);
            });
        }, CRT_SEQUENCE_DELAY_MS);
      }}
      renderItem={(shift) => (
        <motion.div
          ref={sectionRef}
          className="relative select-none mix-blend-screen"
          style={{ y: shift }}
        >
          {shouldRenderMissionScene ? (
            <div
              className="absolute left-[50%] top-[50%] z-10 w-7/12 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                ref={missionRef}
                animate={controls}
                initial={false}
              >
                <motion.div
                  animate={floatControls}
                  initial={false}
                  style={{ transformOrigin: "50% 0%" }}
                >
                  <svg
                    viewBox="0 0 49.26923 39"
                    fill="none"
                    className="h-auto w-full"
                    version="1.1"
                    id="svg1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs id="defs1">
                      <filter
                        id="missionBalloonGlow"
                        x="-32%"
                        y="-32%"
                        width="164%"
                        height="164%"
                        colorInterpolationFilters="sRGB"
                      >
                        <feGaussianBlur
                          in="SourceAlpha"
                          stdDeviation="11"
                          result="glow-alpha"
                        />
                        <feColorMatrix
                          in="glow-alpha"
                          type="matrix"
                          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.28 0"
                          result="glow-color"
                        />
                        <feMerge>
                          <feMergeNode in="glow-color" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <g
                      id="g13"
                      transform="matrix(0.02182348,0,0,0.02182348,25.113447,1.8637982)"
                    >
                      <path
                        style={{ fill: "#303e48" }}
                        d="m 333.338,357.309 c -0.039,0 -0.077,0 -0.116,0 -4.559,0.063 -8.203,3.809 -8.14,8.368 0.134,9.766 -2.447,17.54 -8.629,25.993 -6.827,9.335 -14.109,13.803 -22.541,18.976 -7.256,4.451 -15.48,9.496 -23.573,18.12 -2.319,2.471 -5.514,5.88 -8.798,10.347 -0.146,-1.282 -0.295,-2.583 -0.447,-3.908 -2.176,-19 -4.883,-42.646 -6.237,-66.046 -2.778,-48.034 0.139,-97.258 8.671,-146.304 0.781,-4.492 -2.225,-8.765 -6.718,-9.547 -4.488,-0.785 -8.766,2.227 -9.547,6.718 -8.749,50.293 -11.739,100.79 -8.888,150.087 1.308,22.605 3.831,45.242 5.964,63.89 -10.114,-16.523 -20.134,-25.279 -28.981,-33.013 -7.493,-6.55 -13.965,-12.206 -19.364,-21.755 -11.037,-19.519 -9.302,-44.688 -7.227,-58.178 0.686,-4.455 -2.121,-8.87 -6.549,-9.715 -4.612,-0.88 -8.991,2.235 -9.711,6.83 -5.374,34.357 1.992,56.589 9.116,69.189 6.784,11.999 14.962,19.146 22.87,26.058 8.403,7.346 16.457,16.032 25.959,29.522 13.597,19.302 16.479,40.49 16.534,47.189 0.054,6.521 0.252,12.721 0.291,13.888 0.15,4.463 3.814,7.98 8.245,7.98 0.094,0 0.187,-10e-4 0.281,-0.004 4.557,-0.152 8.127,-3.968 7.975,-8.525 -0.181,-5.399 -1.443,-43.364 18.599,-63.406 6.794,-6.794 13.178,-11.056 20.167,-15.344 9.088,-5.576 18.486,-11.341 27.234,-23.302 8.354,-11.422 11.996,-22.516 11.81,-35.967 -0.061,-4.52 -3.744,-8.141 -8.25,-8.141 z"
                        id="path1"
                      />

                  <motion.g {...getBalloonInteractionProps("positive")}>
                    {endingState.discoveredSentiments.positive ? (
                      <ellipse
                        {...balloonHitAreas.positive}
                        style={discoveredBalloonOutline}
                      />
                    ) : null}
                    <ellipse
                      style={{
                        fill: endingState.discoveredSentiments.positive
                          ? "var(--color-baloon3)"
                          : "var(--color-white)",
                      }}
                      cx="268.68399"
                      cy="98.792"
                      rx="77.780998"
                      ry="98.792"
                      id="ellipse3"
                    />
                    <g id="g5">
                      <path
                        style={{
                          fill: endingState.discoveredSentiments.positive
                            ? "var(--color-baloon3-shade)"
                            : "var(--color-white-shade)",
                        }}
                        d="m 268.687,0 c -4.524,0 -8.955,0.496 -13.266,1.437 36.634,7.998 64.51,48.541 64.51,97.359 0,48.818 -27.876,89.361 -64.51,97.359 4.311,0.941 8.743,1.437 13.266,1.437 42.954,0 77.777,-44.233 77.777,-98.797 C 346.464,44.231 311.641,0 268.687,0 Z"
                        id="path4-2"
                      />
                      <path
                        style={{
                          fill: endingState.discoveredSentiments.positive
                            ? "var(--color-baloon3-shade)"
                            : "var(--color-white-shade)",
                        }}
                        d="m 195.973,81.912 c -1.322,0 -2.637,0.043 -3.942,0.125 -0.733,5.448 -1.119,11.046 -1.119,16.759 0,54.564 34.822,98.797 77.777,98.797 1.322,0 2.637,-0.043 3.942,-0.125 0.733,-5.448 1.119,-11.046 1.119,-16.759 0,-54.564 -34.822,-98.797 -77.777,-98.797 z"
                        id="path5"
                      />
                    </g>
                    <path
                      style={{
                        fill: endingState.discoveredSentiments.positive
                          ? "var(--color-baloon3-shade)"
                          : "var(--color-white-shade)",
                      }}
                      d="m 245.933,193.293 c 7.198,2.793 14.838,4.3 22.755,4.3 35.482,0 65.411,-30.182 74.752,-71.436 -7.198,-2.793 -14.838,-4.3 -22.755,-4.3 -35.482,0 -65.411,30.181 -74.752,71.436 z"
                      id="path6"
                    />
                    {endingState.discoveredSentiments.positive ? (
                      <ellipse
                        {...balloonHitAreas.positive}
                        className="cursor-pointer"
                        style={{ fill: "transparent", pointerEvents: "all" }}
                      />
                    ) : null}
                  </motion.g>

                  <motion.g {...getBalloonInteractionProps("negative")}>
                    {endingState.discoveredSentiments.negative ? (
                      <ellipse
                        {...balloonHitAreas.negative}
                        style={discoveredBalloonOutline}
                      />
                    ) : null}
                    <path
                      style={{
                        fill: endingState.discoveredSentiments.negative
                          ? "var(--color-baloon1-shade)"
                          : "var(--color-white-shade)",
                      }}
                      d="m 175.95,319.45 h 9.031 c 9.361,0 14.947,-10.684 9.366,-18.2 -3.052,-4.111 -7.642,-7.288 -14.537,-7.288 -8.337,0 -12.554,4.645 -14.648,9.968 -2.937,7.466 2.767,15.52 10.788,15.52 z"
                      id="path2"
                    />
                    <ellipse
                      style={{
                        fill: endingState.discoveredSentiments.negative
                          ? "var(--color-baloon1)"
                          : "var(--color-white)",
                      }}
                      cx="180.40199"
                      cy="195.16299"
                      rx="77.780998"
                      ry="98.792"
                      id="ellipse5"
                    />
                    <path
                      style={{
                        fill: endingState.discoveredSentiments.negative
                          ? "var(--color-baloon1-shade)"
                          : "var(--color-white-shade)",
                      }}
                      d="m 210.975,104.3 c 14.219,17.903 23.028,42.727 23.028,70.168 0,54.564 -34.822,98.797 -77.776,98.797 -10.854,0 -21.188,-2.829 -30.574,-7.931 14.055,17.696 33.395,28.628 54.747,28.628 42.955,0 77.776,-44.233 77.776,-98.797 0.001,-40.775 -19.447,-75.777 -47.201,-90.865 z"
                      id="path7"
                    />
                    {endingState.discoveredSentiments.negative ? (
                      <ellipse
                        {...balloonHitAreas.negative}
                        className="cursor-pointer"
                        style={{ fill: "transparent", pointerEvents: "all" }}
                      />
                    ) : null}
                  </motion.g>

                  <motion.g {...getBalloonInteractionProps("neutral")}>
                    {endingState.discoveredSentiments.neutral ? (
                      <ellipse
                        {...balloonHitAreas.neutral}
                        style={discoveredBalloonOutline}
                      />
                    ) : null}
                    <path
                      style={{
                        fill: endingState.discoveredSentiments.neutral
                          ? "var(--color-baloon2-shade)"
                          : "var(--color-white-shade)",
                      }}
                      d="m 325.77,365.702 h 9.031 c 9.361,0 14.946,-10.684 9.366,-18.2 -3.052,-4.111 -7.642,-7.288 -14.537,-7.288 -8.337,0 -12.554,4.645 -14.648,9.968 -2.937,7.465 2.766,15.52 10.788,15.52 z"
                      id="path3"
                    />
                    <ellipse
                      style={{
                        fill: endingState.discoveredSentiments.neutral
                          ? "var(--color-baloon2)"
                          : "var(--color-white)",
                      }}
                      cx="331.595"
                      cy="241.422"
                      rx="77.780998"
                      ry="98.792"
                      id="ellipse6"
                    />
                    <path
                      style={{
                        fill: endingState.discoveredSentiments.neutral
                          ? "var(--color-baloon2-shade)"
                          : "var(--color-white-shade)",
                      }}
                      d="m 362.172,150.551 c 14.219,17.903 23.028,42.727 23.028,70.168 0,54.564 -34.822,98.797 -77.776,98.797 -10.854,0 -21.188,-2.829 -30.574,-7.931 14.055,17.696 33.395,28.628 54.747,28.628 42.955,0 77.776,-44.233 77.776,-98.797 0,-40.774 -19.447,-75.776 -47.201,-90.865 z"
                      id="path8"
                    />
                    {endingState.discoveredSentiments.neutral ? (
                      <ellipse
                        {...balloonHitAreas.neutral}
                        className="cursor-pointer"
                        style={{ fill: "transparent", pointerEvents: "all" }}
                      />
                    ) : null}
                  </motion.g>
                </g>

                    {endingState.selectedSentiment !== "negative" && (
                      <>
                        <image
                          width="10.697615"
                          height="22.317436"
                          preserveAspectRatio="none"
                          opacity={opacitySwitch ^ 1}
                          xlinkHref={`${meImage}`}
                          id="image1"
                          x="28.49054"
                          y="11.719395"
                        />
                        <image
                          width="10.437182"
                          height="27.279438"
                          preserveAspectRatio="none"
                          opacity={opacitySwitch}
                          xlinkHref={`${meDown}`}
                          id="image1-2"
                          x="28.29455"
                          y="11.51998"
                        />
                        <image
                          width="8.0540342"
                          height="6.0324798"
                          preserveAspectRatio="none"
                          opacity={opactiy}
                          xlinkHref={`${crtImage}`}
                          id="image1-0"
                          x="31.965414"
                          y="26.777388"
                        />
                      </>
                    )}
                  </svg>
                </motion.div>
              </motion.div>
            </div>
          ) : null}

          <div className="pointer-events-none">
            <Stars turnOff={endingState.selectedSentiment === "negative"} />
          </div>
        </motion.div>
      )}
    />
  );
};

export default CrtMission;
