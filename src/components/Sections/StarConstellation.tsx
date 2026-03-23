import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { BetweenLands } from "../BetweenLands";
import { PuzzlePieceTransfer } from "../puzzle/PuzzlePieceTransfer";
import { puzzleGroups } from "../../data/puzzleGroups";
import {
  $gameState,
  setBit as gameStateSetBit,
  GameStateFlags,
} from "../../stores/gameStateStore";
import {
  $dispensedGroups,
  markPuzzleGroupDispensed,
} from "../../stores/puzzleDispenseStore";
import { Stars } from "../Stars";
import { useStore } from "@nanostores/react";
import { $endingState } from "../../stores/endingStore";

const constellationStars = [
  {
    id: "lib1",
    delay: 0,
    strokeWidth: 0.0758774,
    d: "m 24.728322,33.074457 c 0.09611,-0.172413 0.144162,-0.258619 0.216011,-0.258619 0.07185,0 0.119901,0.0862 0.216008,0.258618 l 0.02486,0.04461 c 0.02732,0.04899 0.04097,0.07349 0.06227,0.08966 0.02129,0.01617 0.0478,0.02216 0.100841,0.03416 l 0.04829,0.01093 c 0.186628,0.04223 0.27995,0.06334 0.302151,0.134736 0.0222,0.07139 -0.04141,0.145788 -0.168652,0.294568 l -0.03291,0.03849 c -0.03616,0.04228 -0.05424,0.06341 -0.06237,0.08957 -0.0081,0.02616 -0.0054,0.05436 6.8e-5,0.110774 l 0.005,0.05136 c 0.01923,0.19851 0.02886,0.297766 -0.02927,0.341888 -0.05813,0.04412 -0.145503,0.0039 -0.320248,-0.07656 l -0.04521,-0.02082 c -0.04965,-0.02286 -0.07448,-0.03429 -0.100804,-0.03429 -0.02632,0 -0.05115,0.01143 -0.100803,0.03429 l -0.04521,0.02082 c -0.174747,0.08045 -0.26212,0.120683 -0.320244,0.07656 -0.05813,-0.04412 -0.04851,-0.143378 -0.02927,-0.341888 l 0.005,-0.05136 c 0.0055,-0.05642 0.0082,-0.08462 6.6e-5,-0.110774 -0.0081,-0.02615 -0.02621,-0.0473 -0.06237,-0.08957 l -0.03292,-0.03849 c -0.127235,-0.14878 -0.190853,-0.223177 -0.168651,-0.294568 0.0222,-0.07139 0.115519,-0.09251 0.302153,-0.134736 l 0.04828,-0.01093 c 0.05304,-0.012 0.07955,-0.018 0.100845,-0.03416 0.02129,-0.01617 0.03495,-0.04066 0.06226,-0.08966 z",
  },
  {
    id: "lib2",
    delay: 0.28,
    strokeWidth: 0.0758774,
    d: "m 25.245793,30.556096 c 0.09611,-0.172413 0.144163,-0.258619 0.216011,-0.258619 0.07185,0 0.119902,0.0862 0.216008,0.258618 l 0.02486,0.04461 c 0.02732,0.04899 0.04097,0.07349 0.06227,0.08966 0.02129,0.01617 0.0478,0.02216 0.100841,0.03416 l 0.04829,0.01093 c 0.186628,0.04223 0.27995,0.06334 0.302152,0.134736 0.0222,0.07139 -0.04141,0.145788 -0.168653,0.294568 l -0.03291,0.03849 c -0.03616,0.04228 -0.05424,0.06341 -0.06237,0.08957 -0.0081,0.02616 -0.0054,0.05436 6.8e-5,0.110774 l 0.005,0.05136 c 0.01923,0.19851 0.02886,0.297766 -0.02927,0.341888 -0.05813,0.04412 -0.145502,0.0039 -0.320248,-0.07656 l -0.04521,-0.02082 c -0.04965,-0.02286 -0.07448,-0.03429 -0.100803,-0.03429 -0.02632,0 -0.05115,0.01143 -0.100803,0.03429 l -0.04521,0.02082 c -0.174748,0.08045 -0.262121,0.120683 -0.320245,0.07656 -0.05812,-0.04412 -0.04851,-0.143378 -0.02927,-0.341888 l 0.005,-0.05136 c 0.0055,-0.05642 0.0082,-0.08462 6.7e-5,-0.110774 -0.0081,-0.02615 -0.02621,-0.0473 -0.06237,-0.08957 l -0.03292,-0.03849 c -0.127235,-0.14878 -0.190853,-0.223177 -0.168651,-0.294568 0.0222,-0.07139 0.115518,-0.09251 0.302153,-0.134736 l 0.04828,-0.01093 c 0.05304,-0.012 0.07955,-0.018 0.100845,-0.03416 0.02129,-0.01617 0.03495,-0.04066 0.06226,-0.08966 z",
  },
  {
    id: "lib3",
    delay: 0.64,
    strokeWidth: 0.0931264,
    d: "m 36.632936,25.967086 c 0.117958,-0.211607 0.176935,-0.317411 0.265116,-0.317411 0.08818,0 0.147159,0.105803 0.265113,0.31741 l 0.03052,0.05475 c 0.03353,0.06013 0.05028,0.0902 0.07642,0.110036 0.02613,0.01984 0.05867,0.0272 0.123765,0.04193 l 0.05927,0.01341 c 0.229053,0.05183 0.343589,0.07774 0.370838,0.165365 0.02725,0.08762 -0.05083,0.17893 -0.206992,0.361532 l -0.0404,0.04724 c -0.04438,0.05189 -0.06657,0.07784 -0.07655,0.109936 -0.01,0.0321 -0.0066,0.06672 8.4e-5,0.135955 l 0.0061,0.06303 c 0.02361,0.243638 0.03542,0.365456 -0.03592,0.419609 -0.07134,0.05415 -0.178579,0.0048 -0.393049,-0.09396 l -0.05548,-0.02555 c -0.06094,-0.02806 -0.09141,-0.04209 -0.123719,-0.04209 -0.03231,0 -0.06278,0.01403 -0.123718,0.04209 l -0.05549,0.02555 c -0.214472,0.09874 -0.321707,0.148117 -0.393045,0.09396 -0.07134,-0.05415 -0.05953,-0.175971 -0.03592,-0.419609 l 0.0061,-0.06303 c 0.0067,-0.06924 0.01006,-0.103854 8.2e-5,-0.135955 -0.01,-0.0321 -0.03217,-0.05805 -0.07654,-0.109936 l -0.0404,-0.04724 c -0.156159,-0.182602 -0.234239,-0.273913 -0.206991,-0.361532 0.02725,-0.08762 0.14178,-0.113537 0.370841,-0.165365 l 0.05926,-0.01341 c 0.06509,-0.01473 0.09764,-0.02209 0.12377,-0.04193 0.02613,-0.01984 0.04289,-0.0499 0.07641,-0.110036 z",
  },
  {
    id: "lib4",
    delay: 0.92,
    strokeWidth: 0.0965762,
    d: "m 41.691246,12.172711 c 0.122327,-0.219446 0.183489,-0.329169 0.274937,-0.329169 0.09145,0 0.15261,0.109722 0.274934,0.329168 l 0.03165,0.05678 c 0.03477,0.06236 0.05214,0.09354 0.07925,0.114112 0.0271,0.02057 0.06084,0.02821 0.12835,0.04348 l 0.06145,0.01391 c 0.237539,0.05375 0.356318,0.08062 0.384577,0.17149 0.02826,0.09087 -0.05271,0.18556 -0.21466,0.374926 l -0.0419,0.04899 c -0.04601,0.05381 -0.06904,0.08072 -0.07938,0.114008 -0.01037,0.03329 -0.0068,0.06919 8.7e-5,0.140992 l 0.0063,0.06536 c 0.02448,0.252662 0.03673,0.378994 -0.03725,0.435153 -0.07398,0.05616 -0.185194,0.005 -0.407609,-0.09744 l -0.05755,-0.0265 c -0.0632,-0.0291 -0.0948,-0.04365 -0.128302,-0.04365 -0.03351,0 -0.0651,0.01455 -0.128301,0.04365 l -0.05755,0.0265 c -0.222417,0.102398 -0.333625,0.153604 -0.407606,0.09744 -0.07398,-0.05616 -0.06174,-0.182491 -0.03725,-0.435153 l 0.0063,-0.06536 c 0.0069,-0.0718 0.01043,-0.107701 8.5e-5,-0.140992 -0.01037,-0.03329 -0.03336,-0.0602 -0.07938,-0.114008 l -0.0419,-0.04899 c -0.161944,-0.189366 -0.242916,-0.28406 -0.214658,-0.374926 0.02826,-0.09087 0.147032,-0.117742 0.384579,-0.17149 l 0.06146,-0.01391 c 0.0675,-0.01528 0.101257,-0.02291 0.128355,-0.04348 0.0271,-0.02058 0.04448,-0.05175 0.07924,-0.114112 z",
  },
  {
    id: "lib5",
    delay: 1.22,
    strokeWidth: 0.101751,
    d: "m 32.137797,2.0134106 c 0.128881,-0.231204 0.19332,-0.346806 0.289668,-0.346806 0.09635,0 0.160787,0.115601 0.289665,0.346805 l 0.03335,0.05982 c 0.03663,0.0657 0.05493,0.09855 0.0835,0.120227 0.02855,0.02167 0.0641,0.02972 0.135227,0.04581 l 0.06474,0.01466 c 0.250267,0.05663 0.37541,0.08494 0.405184,0.180678 0.02977,0.09574 -0.05553,0.195503 -0.226162,0.395015 l -0.04415,0.05161 c -0.04848,0.05669 -0.07274,0.08504 -0.08363,0.1201166 -0.01093,0.03507 -0.0072,0.0729 9.2e-5,0.148547 l 0.0066,0.06886 c 0.02579,0.2662 0.0387,0.399301 -0.03925,0.458469 -0.07794,0.05917 -0.195117,0.0053 -0.42945,-0.102661 l -0.06063,-0.02792 c -0.06659,-0.03066 -0.09988,-0.04599 -0.135177,-0.04599 -0.03531,0 -0.06859,0.01533 -0.135175,0.04599 l -0.06063,0.02792 c -0.234334,0.107884 -0.351501,0.161834 -0.429446,0.102661 -0.07794,-0.05917 -0.06505,-0.192269 -0.03925,-0.458469 l 0.0066,-0.06886 c 0.0073,-0.07565 0.01099,-0.113472 8.9e-5,-0.148547 -0.01092,-0.03507 -0.03515,-0.06343 -0.08363,-0.1201166 l -0.04415,-0.05161 c -0.170621,-0.199512 -0.255932,-0.29928 -0.22616,-0.395015 0.02977,-0.09574 0.15491,-0.12405 0.405185,-0.180678 l 0.06475,-0.01466 c 0.07112,-0.0161 0.106682,-0.02414 0.135232,-0.04581 0.02855,-0.02168 0.04686,-0.05452 0.08349,-0.120227 z",
  },
  {
    id: "lib6",
    delay: 1.48,
    strokeWidth: 0.0758774,
    d: "m 25.383786,10.305715 c 0.09611,-0.172413 0.144162,-0.258619 0.21601,-0.258619 0.07185,0 0.119902,0.0862 0.216008,0.258618 l 0.02487,0.04461 c 0.02732,0.04899 0.04097,0.07349 0.06227,0.08966 0.02129,0.01617 0.0478,0.02216 0.100842,0.03416 l 0.04829,0.01093 c 0.186628,0.04223 0.279949,0.06334 0.302151,0.134736 0.0222,0.07139 -0.04141,0.145788 -0.168653,0.294568 l -0.03292,0.03849 c -0.03616,0.04228 -0.05424,0.06341 -0.06237,0.08957 -0.0081,0.02616 -0.0054,0.05436 6.9e-5,0.110774 l 0.005,0.05136 c 0.01924,0.19851 0.02886,0.297766 -0.02927,0.341888 -0.05813,0.04412 -0.145503,0.0039 -0.320249,-0.07656 l -0.04521,-0.02082 c -0.04965,-0.02286 -0.07448,-0.03429 -0.100803,-0.03429 -0.02632,0 -0.05115,0.01143 -0.100803,0.03429 l -0.04521,0.02082 c -0.174748,0.08045 -0.262121,0.120683 -0.320245,0.07656 -0.05813,-0.04412 -0.04851,-0.143378 -0.02927,-0.341888 l 0.005,-0.05136 c 0.0055,-0.05642 0.0082,-0.08462 6.7e-5,-0.110774 -0.0081,-0.02615 -0.02621,-0.0473 -0.06237,-0.08957 l -0.03292,-0.03849 c -0.127258,-0.14878 -0.190876,-0.223177 -0.168674,-0.294568 0.0222,-0.07139 0.115519,-0.09251 0.302153,-0.134736 l 0.04828,-0.01093 c 0.05304,-0.012 0.07955,-0.018 0.100845,-0.03416 0.02129,-0.01617 0.03495,-0.04066 0.06226,-0.08966 z",
  },
  {
    id: "lib7",
    delay: 1.76,
    strokeWidth: 0.0758774,
    d: "m 18.829148,13.341547 c 0.09611,-0.172413 0.144162,-0.258619 0.21601,-0.258619 0.07185,0 0.119902,0.0862 0.216008,0.258618 l 0.02487,0.04461 c 0.02732,0.04899 0.04097,0.07349 0.06227,0.08966 0.02129,0.01617 0.0478,0.02216 0.100842,0.03416 l 0.04829,0.01093 c 0.186628,0.04223 0.279949,0.06334 0.302151,0.134736 0.0222,0.07139 -0.04141,0.145788 -0.168653,0.294568 l -0.03292,0.03849 c -0.03616,0.04228 -0.05424,0.06341 -0.06237,0.08957 -0.0081,0.02616 -0.0054,0.05436 6.9e-5,0.110774 l 0.005,0.05136 c 0.01924,0.19851 0.02886,0.297766 -0.02927,0.341888 -0.05813,0.04412 -0.145503,0.0039 -0.320249,-0.07656 l -0.04521,-0.02082 c -0.04965,-0.02286 -0.07448,-0.03429 -0.100803,-0.03429 -0.02632,0 -0.05115,0.01143 -0.100803,0.03429 l -0.04521,0.02082 c -0.174748,0.08045 -0.262121,0.120683 -0.320245,0.07656 -0.05813,-0.04412 -0.04851,-0.143378 -0.02927,-0.341888 l 0.005,-0.05136 c 0.0055,-0.05642 0.0082,-0.08462 6.7e-5,-0.110774 -0.0081,-0.02615 -0.02621,-0.0473 -0.06237,-0.08957 l -0.03292,-0.03849 c -0.127258,-0.14878 -0.190876,-0.223177 -0.168674,-0.294568 0.0222,-0.07139 0.115519,-0.09251 0.302153,-0.134736 l 0.04828,-0.01093 c 0.05304,-0.012 0.07955,-0.018 0.100845,-0.03416 0.02129,-0.01617 0.03495,-0.04066 0.06226,-0.08966 z",
  },
] as const;

const getPulseTransition = (delay: number) => ({
  duration: 3,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay,
});

const settleTransition = {
  duration: 0.35,
  ease: "easeOut" as const,
};

const getStarStyle = (strokeWidth: number) => ({
  strokeWidth,
  fill: "var(--color-yellow)",
});

const constellationPrimaryConnectionPath =
  "M 24.934566,33.675624 25.51444,31.076931 36.918621,26.674187 42.008623,12.929034 32.42997,2.7919841 l -6.8511,8.1182309 -6.593378,3.071183";

const constellationSecondaryConnectionPath =
  "M 36.902931,26.674897 32.432655,2.8376223";

const constellationHitAreaPath = `${constellationPrimaryConnectionPath} ${constellationSecondaryConnectionPath}`;

const connectionPathVariants = {
  hidden: {
    strokeDashoffset: 0,
    opacity: 0,
  },
  hint: {
    strokeDashoffset: 1,
    opacity: 0.18,
    transition: {
      strokeDashoffset: { duration: 0.65, ease: "easeInOut" },
      opacity: { duration: 0.2 },
    },
  },
  visible: {
    strokeDashoffset: 1,
    opacity: 0.5,
    transition: {
      strokeDashoffset: { type: "spring", duration: 1.5, bounce: 0 },
      opacity: { duration: 0.2 },
    },
  },
};

const connectionPathStyle = {
  fill: "none",
  fillRule: "evenodd" as const,
  stroke: "var(--color-yellow)",
  strokeWidth: 0.21,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeDasharray: "0,1,0",
};

const starsPieceIds =
  puzzleGroups.find((group) => group.key === "stars")?.pieces ?? [];

const StarConstellation = () => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [transferKey, setTransferKey] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const constellationRef = useRef<SVGSVGElement>(null);
  const constellationControls = useAnimation();
  const endingState = useStore($endingState);
  const binaryState = useStore($gameState);
  const dispensedGroups = useStore($dispensedGroups);
  const hasStarsUnlocked =
    (binaryState & (1 << GameStateFlags.FLAG_STARS_ALIGN)) !== 0;
  const hasTriggeredTransferRef = useRef(hasStarsUnlocked);

  useEffect(() => {
    if (hasStarsUnlocked) {
      setIsPressed(true);
    }
  }, [hasStarsUnlocked]);

  useEffect(() => {
    const hasJustUnlocked =
      hasStarsUnlocked && !hasTriggeredTransferRef.current;

    hasTriggeredTransferRef.current = hasStarsUnlocked;

    if (!hasJustUnlocked || dispensedGroups.stars) {
      return;
    }

    setTransferKey((currentKey) => currentKey + 1);
  }, [dispensedGroups.stars, hasStarsUnlocked]);

  useEffect(() => {
    if (isPressed) {
      constellationControls.stop();
      constellationControls.set("rest");
      return;
    }

    const element = sectionRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void constellationControls.start("twinkle");
          return;
        }

        constellationControls.stop();
        void constellationControls.start("rest");
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      constellationControls.stop();
    };
  }, [constellationControls, isPressed]);

  const handleActivate = () => {
    gameStateSetBit(GameStateFlags.FLAG_STARS_ALIGN);
    setIsPressed(true);
  };
  return (
    <BetweenLands
      isBackground={true}
      isCrt={false}
      separatorOutUnderLayer={
        <PuzzlePieceTransfer
          direction="down"
          onComplete={() => {
            markPuzzleGroupDispensed("stars");
          }}
          pieceIds={starsPieceIds}
          sourceRef={constellationRef}
          triggerKey={transferKey}
        />
      }
      renderItem={(shift) => (
        <motion.div
          ref={sectionRef}
          className="relative select-none mix-blend-screen"
          style={{ y: shift }}
        >
          {endingState.selectedSentiment === "negative" ? (
            <div></div>
          ) : (
            <motion.svg
              ref={constellationRef}
              className="absolute z-10 mx-auto h-auto w-full lg:w-9/12"
              style={{ left: "50%", top: "50%", y: "-50%", x: "-50%" }}
              viewBox="0 0 59.26923 36"
              fill="none"
              version="1.1"
              id="svg1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter
                  id="starGlowSoft"
                  x="-200%"
                  y="-200%"
                  width="500%"
                  height="500%"
                  colorInterpolationFilters="sRGB"
                >
                  <feGaussianBlur stdDeviation="0.3" />
                </filter>
                <filter
                  id="starGlowStrong"
                  x="-250%"
                  y="-250%"
                  width="600%"
                  height="600%"
                  colorInterpolationFilters="sRGB"
                >
                  <feGaussianBlur stdDeviation="0.7" />
                </filter>
              </defs>
              {constellationStars.map((star) => (
                <g key={star.id}>
                  <motion.path
                    d={star.d}
                    animate={constellationControls}
                    custom={star.delay}
                    filter="url(#starGlowStrong)"
                    initial="rest"
                    pointerEvents="none"
                    style={getStarStyle(star.strokeWidth)}
                    variants={{
                      rest: {
                        opacity: 0.12,
                        transition: settleTransition,
                      },
                      twinkle: (delay: number) => ({
                        opacity: [0.1, 0.28, 0.1],
                        transition: getPulseTransition(delay),
                      }),
                    }}
                  />
                  <motion.path
                    d={star.d}
                    animate={constellationControls}
                    custom={star.delay}
                    filter="url(#starGlowSoft)"
                    initial="rest"
                    pointerEvents="none"
                    style={getStarStyle(star.strokeWidth)}
                    variants={{
                      rest: {
                        opacity: 0.34,
                        transition: settleTransition,
                      },
                      twinkle: (delay: number) => ({
                        opacity: [0.28, 0.68, 0.28],
                        transition: getPulseTransition(delay),
                      }),
                    }}
                  />
                  <motion.path
                    d={star.d}
                    id={star.id}
                    animate={constellationControls}
                    custom={star.delay}
                    initial="rest"
                    style={getStarStyle(star.strokeWidth)}
                    variants={{
                      rest: {
                        opacity: 1,
                        transition: settleTransition,
                      },
                      twinkle: (delay: number) => ({
                        opacity: [0.9, 1, 0.9],
                        transition: getPulseTransition(delay),
                      }),
                    }}
                  />
                </g>
              ))}

              <motion.g
                initial="hidden"
                animate={isPressed ? "visible" : "hidden"}
                whileHover={!isPressed ? "hint" : undefined}
              >
                <motion.path
                  style={{
                    ...connectionPathStyle,
                    pointerEvents: "none",
                  }}
                  d={constellationPrimaryConnectionPath}
                  pathLength={1}
                  variants={connectionPathVariants}
                />
                <motion.path
                  style={{
                    ...connectionPathStyle,
                    pointerEvents: "none",
                  }}
                  d={constellationSecondaryConnectionPath}
                  pathLength={1}
                  variants={connectionPathVariants}
                />
                <path
                  className={`${
                    !isPressed ? "cursor-pointer" : "cursor-default"
                  }`}
                  style={{
                    fill: "none",
                    stroke: "transparent",
                    strokeWidth: 1.2,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    pointerEvents: isPressed ? "none" : "stroke",
                  }}
                  d={constellationHitAreaPath}
                  onClick={handleActivate}
                />
              </motion.g>
            </motion.svg>
          )}
          <Stars turnOff={endingState.selectedSentiment === "negative"} />
        </motion.div>
      )}
    />
  );
};

export default StarConstellation;
