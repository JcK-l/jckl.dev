import { puzzleImages } from "../data/PuzzleImage";
import {
  motion,
  useScroll,
  useTransform,
  animate,
  stagger,
} from "framer-motion";
import { useRef, useState, forwardRef, useEffect } from "react";
import { usePuzzleContext } from "../hooks/useDataContext";
import { isBitSet, SentimentStateFlags } from "../stores/sentimentStateStore";

interface PuzzleProps {}

export const Puzzle = forwardRef<SVGSVGElement, PuzzleProps>((props, ref) => {
  const prallaxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoHeight, setVideoHeight] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const { lastPiece, setLastPiece, totalPlacedPieces, setTotalPlacedPieces } =
    usePuzzleContext();

  useEffect(() => {
    const updateSizes = () => {
      if (videoRef.current) {
        setVideoHeight(videoRef.current.getBoundingClientRect().height);
      }
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, [videoRef]);

  const { scrollYProgress } = useScroll({
    target: prallaxRef,
    offset: ["0% 100%", "100% 0%"],
  });

  useEffect(() => {
    if (totalPlacedPieces === 16) {
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 30;
        }
        setIsCompleted(true);
      }, 2000); 
    }
  }, [totalPlacedPieces]);

  let layer = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${videoHeight / 8}px`, `${videoHeight / 8}px`]
  );

  return (
    <div className="relative" ref={prallaxRef}>
      <svg
        className="pointer-events-none absolute"
        version="1.0"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          style={{
            fill: `${
              isCompleted ? "var(--color-primary)" : "var(--color-transition2)"
            }`,
            fillOpacity: 1,
            fillRule: "evenodd",
            strokeWidth: 0.0047,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: "none",
          }}
          width="228.38867"
          height="214.72734"
          x="35.291168"
          y="47.329716"
          ry="0.93354601"
        />
      </svg>
      {isCompleted &&
        (isBitSet(SentimentStateFlags.FLAG_POSITIVE) ? (
          <motion.video
            className="pointer-events-none absolute top-[30%] w-full select-none mix-blend-screen"
            style={{ y: layer }}
            ref={videoRef}
            // autoPlay
            // loop
            muted
            playsInline
            preload="auto"
            src="/secret.mp4"
          />
        ) : (
          <></>
        ))}
      <svg
        className="absolute"
        version="1.0"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.image
          width="63.5"
          height="65.087502"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p12}
          style={{ opacity: 0 }}
          animate={
            isCompleted
              ? {
                  translateY: 50,
                  scale: 0,
                  rotate: 10,
                  transition: {
                    type: "tween",
                    // velocity: 100,
                    duration: 2,
                  },
                }
              : {}
          }
          id="p12"
          x="198.33246"
          y="136.54008"
        />
        <motion.image
          width="75.935417"
          height="65.881248"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p11}
          style={{ opacity: 0 }}
          animate={
            isCompleted
              ? {
                  translateY: 50,
                  scale: 0,
                  rotate: 8,
                  transition: {
                    type: "tween",
                    // velocity: 100,
                    duration: 2,
                  },
                }
              : {}
          }
          id="p11"
          x="137.08644"
          y="148.04945"
        />
        <motion.image
          width="64.293747"
          height="63.5"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p10}
          style={{ opacity: 0 }}
          animate={
            isCompleted
              ? {
                  translateY: 50,
                  scale: 0,
                  rotate: -10,
                  transition: {
                    type: "tween",
                    // velocity: 100,
                    duration: 2,
                  },
                }
              : {}
          }
          id="p10"
          x="86.596535"
          y="138.16992"
        />
        <motion.image
          width="65.616669"
          height="62.706249"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p8}
          style={{ opacity: 0 }}
          animate={
            isCompleted
              ? {
                  translateY: 100,
                  scale: 0,
                  rotate: -6,
                  transition: {
                    type: "tween",
                    // velocity: 100,
                    duration: 2,
                  },
                }
              : {}
          }
          id="p8"
          x="186.27618"
          y="88.590172"
        />
        <motion.image
          width="51.858334"
          height="73.818748"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p7}
          style={{ opacity: 0 }}
          animate={
            isCompleted
              ? {
                  translateY: 105,
                  scale: 0,
                  rotate: 12,
                  transition: {
                    type: "tween",
                    // velocity: 100,
                    duration: 2,
                  },
                }
              : {}
          }
          id="p7"
          x="149.41418"
          y="87.379967"
        />
        <motion.image
          width="76.993752"
          height="62.177082"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p6}
          style={{ opacity: 0 }}
          animate={
            isCompleted
              ? {
                  translateY: 110,
                  scale: 0,
                  rotate: 4,
                  transition: {
                    type: "tween",
                    // velocity: 100,
                    duration: 2,
                  },
                }
              : {}
          }
          id="p6"
          x="86.756081"
          y="89.440018"
        />
        <motion.image
          width="53.710415"
          height="62.706249"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p9}
          style={{ opacity: 0 }}
          animate={
            isCompleted
              ? {
                  translateY: 50,
                  scale: 0,
                  rotate: -2,
                  transition: {
                    type: "tween",
                    // velocity: 100,
                    duration: 2,
                  },
                }
              : {}
          }
          id="p9"
          x="47.782429"
          y="148.21642"
        />
        <motion.image
          width="64.293747"
          height="73.554169"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p5}
          style={{ opacity: 0 }}
          animate={
            isCompleted
              ? {
                  translateY: 110,
                  scale: 0,
                  rotate: 5,
                  transition: {
                    type: "tween",
                    // velocity: 100,
                    duration: 2,
                  },
                }
              : {}
          }
          id="p5"
          x="37.216557"
          y="89.109818"
        />
      </svg>
      <svg
        className="absolute"
        version="1.0"
        viewBox="0 0 300 300"
        id="svg1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <image
          width="300.03751"
          height="300.03751"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.background}
          id="background"
          x="-0.018753052"
          y="-0.018753052"
        />
        <image
          width="72.231247"
          height="74.083336"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p16}
          style={{ opacity: 0 }}
          id="p16"
          x="188.47647"
          y="187.19006"
        />
        <image
          width="54.768749"
          height="53.445835"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p15}
          style={{ opacity: 0 }}
          id="p15"
          x="147.14511"
          y="198.93782"
        />
        <image
          width="61.912498"
          height="63.5"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p14}
          style={{ opacity: 0 }}
          id="p14"
          x="98.992531"
          y="187.77029"
        />
        <image
          width="76.729164"
          height="52.916668"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p13}
          style={{ opacity: 0 }}
          id="p13"
          x="36.396084"
          y="197.7144"
        />
        <image
          width="75.935417"
          height="53.445835"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p4}
          style={{ opacity: 0 }}
          id="p4"
          x="187.36655"
          y="48.765617"
        />
        <image
          width="62.970833"
          height="52.652084"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p3}
          style={{ opacity: 0 }}
          id="p3"
          x="138.07652"
          y="48.82859"
        />
        <image
          width="52.916668"
          height="53.445835"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p2}
          style={{ opacity: 0 }}
          id="p2"
          x="98.858124"
          y="49.246632"
        />
        <image
          width="78.316666"
          height="54.768749"
          preserveAspectRatio="none"
          xlinkHref={puzzleImages.p1}
          style={{ opacity: 0 }}
          id="p1"
          x="35.706577"
          y="48.006794"
        />
      </svg>
      <svg
        className="pointer-events-none absolute"
        version="1.0"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isCompleted ? (
          <path
            fill="none"
            strokeWidth="0.1"
            d="m 6.7235505e-4,49.999728 c 9.99999964495,-1.96 28.74999964495,-3.36 21.88999964495,6.64 -6.85,10 13.15,10 10,0 -3.14,-10 8.10999,-5.71 18.10999,-6.64 10,-0.93 26,-5.8 21.06,4.2 -4.93,10 15.07,10 10,0 -5.06,-10 8.94,-5.1 18.939998,-4.2 10,0.9 24.72,-4.7 18.24,5.3 -6.49,10 13.51001,10 10,0 -3.52,-10 11.76002,-3.87 21.76002,-5.3 10,-1.43 26.02,-3.41 19.45,6.59 -6.57,10 13.43,10 10,0 -3.43,-10 10.55,-5.74 20.55,-6.59 10,-0.85 23.83,-4.25 18.27,5.75 -5.56,10 14.44,10 10,0 -4.44,-10 11.73,-5.73 21.73,-5.75 10,-0.02 23.8,6.91 19.81,-3.09 -3.98,-10 16.02,-10 10,0 -6.01,10 10.19,4.63 20.19,3.09 m -300.00000764495,50 C 10.000672,100.47972 25.420672,96.009728 19.390672,106.00972 c -6.03,10 13.97,10 10,0 -3.97,-9.999992 10.60999,-7.589992 20.60999,-6.009992 10,1.579992 25.58,6.599992 19.09,-3.4 -6.48,-10 13.52,-10 10,0 -3.51,9.999992 10.91,4.659992 20.909998,3.4 10,-1.26 21.58,6.929992 18.1,-3.07 -3.47,-10 16.53001,-10 10,0 -6.52,9.999992 11.90002,4.109992 21.90002,3.07 10,-1.04 27.65,4.869992 21.32,-5.13 -6.34,-10 13.66,-10 10,0 -3.67,9.999992 8.68,5.549992 18.68,5.13 10,-0.42 28.55,6.079992 21.63,-3.92 -6.91,-10 13.09,-10 10,0 -3.08,9.999992 8.37,5.029992 18.37,3.92 10,-1.11 24.97,5.099992 18.61,-4.9 -6.37,-10 13.63,-10 10,0 -3.64,9.999992 11.39,4.89 21.39,4.9 M 6.7235505e-4,149.9997 C 10.000672,150.0697 25.790672,153.5597 18.890672,143.55973 c -6.91,-10 13.09,-10 10,0 -3.1,9.99997 11.10999,7.99997 21.10999,6.43997 m 200.000018,0 c 10,-1.16 27.42,-3.65999 21.22,6.34 -6.21,10 13.79,10 10,0 -3.8,-9.99999 8.78,-8.11 18.78,-6.34 m -300.00000764495,50 C 10.000672,200.1297 23.710672,205.9897 18.080672,195.9897 c -5.62,-10 14.38,-10 10,0 -4.37,10 11.91999,4.68 21.91999,4.01 10,-0.67 24.67,-6.47 20.73,3.53 -3.93,10 16.07,10 10,0 -6.06,-10 9.27,-4.25 19.269998,-3.53 10,0.72 22.3,5.26 19.15,-4.74 -3.14,-10 16.86,-10 10,0 -6.85,10 10.85002,5.77 20.85002,4.74 10,-1.03 23.12,-3.6 18.59,6.4 -4.53,10 15.47,10 10,0 -5.47,-10 11.41,-6.47 21.41,-6.4 10,0.07 24.49,4.68 21.22,-5.32 -3.27,-10 16.73,-10 10,0 -6.73,10 8.78,6.8 18.78,5.32 10,-1.48 23.1,3.27 18.67,-6.73 -4.43,-10 15.57,-10 10,0 -5.57,10 11.33,5.17 21.33,6.73 m -300.00000764495,50 C 10.000672,250.5597 23.530672,243.3597 19.490672,253.3597 c -4.03,10 15.97,10 10,0 -5.96,-10 10.50999,-1.83 20.50999,-3.36 10,-1.53 26.92,4.01 21.09,-5.99 -5.83,-10 14.17,-10 10,0 -4.17,10 8.91,5.55 18.909998,5.99 10,0.44 26.22,4.79 21.7,-5.21 -4.52,-10 15.48001,-10 10.00001,0 -5.48001,10 8.30001,3.32 18.30001,5.21 10,1.89 23.45,5.58 20.44,-4.42 -3,-10 17,-10 10,0 -6.99,10 9.56,4.98 19.56,4.42 10,-0.56 28.47,-6.12 21.91,3.88 -6.56,10 13.44,10 10,0 -3.44,-10 8.09,-1.95 18.09,-3.88 10,-1.93 26.83,4.73 21.19,-5.27 -5.65,-10 14.35,-10 10,0 -4.36,10 8.81,3.82 18.81,5.27 M 50.000662,-2.6967941e-4 c -0.72,9.99999997941 -3,23.52999767941 7,20.36999767941 10,-3.16 10,16.84 0,10 -10,-6.84 -8.49,9.63 -7,19.63 1.49,10 3.2,27.9 -6.8,21.48 -9.99999,-6.42 -9.99999,13.58 0,10 10,-3.58 5.16,8.52 6.8,18.52 1.64,9.999992 4.71,24.910002 -5.29,20.139992 -9.99999,-4.77 -9.99999,15.23001 0,10.00001 10,-5.23 6.6,9.86 5.29,19.85997 -1.31,10 -5.96,26.28 4.04,21.81 10,-4.47 10,15.53 0,10 -10,-5.53 -4.82,8.19 -4.04,18.19 0.78,10 3.89,27.5 -6.11,21.57 -9.99999,-5.92 -9.99999,14.08 0,10 10,-4.07 4.7,8.43 6.11,18.43 1.41,10 -6.07,25.08 3.93,21.91 10,-3.17 10,16.83 0,10 -10,-6.83 -2.49,8.09 -3.93,18.09 M 100.00066,-2.6967941e-4 C 98.730662,9.9997303 106.68066,26.299728 96.680662,20.209728 c -10,-6.09 -10,13.91 0,10 9.999998,-3.91 1.56,9.79 3.319998,19.79 1.76,10 -3.429998,27.85 6.57,21.91 10,-5.94 10,14.06 0,10 -9.999998,-4.06 -7.909998,8.09 -6.57,18.09 m 0,99.999972 c 0.15,10 -4.359998,24.74 5.64,20.21 10,-4.53 10,15.47 0,10 -9.999998,-5.47 -5.809998,9.79 -5.64,19.79 0.17,10 3.99,23.49 -6.009998,18.01 -10,-5.48 -10,14.52 0,10 9.999998,-4.52 4.15,11.99 6.009998,21.99 M 150.00068,-2.6967941e-4 c -1.78,9.99999997941 -4.52,24.80999767941 5.48,20.82999767941 10,-3.97 10,16.03 0,10 -10,-6.02 -6.13,9.17 -5.48,19.17 0.65,10 5.57,24.14 -4.43,18.4 -10.00001,-5.74 -10.00001,14.26 0,10 10,-4.26 3.15,11.6 4.43,21.6 m 0,99.999972 c 0.14,10 -6.7,24 3.3,19.99 10,-4 10,16 0,10 -10,-5.99 -5.29,10.01 -3.3,20.01 1.99,10 6.07,22.87 -3.93,18.3 -10.00002,-4.57 -10.00002,15.43 0,10 10,-5.43 5.59,11.7 3.93,21.7 m 50,-299.99996967941 c 1.09,9.99999997941 -6.49,26.98999767941 3.51,20.58999767941 10,-6.4 10,13.6 0,10 -10,-3.6 -2.53,9.41 -3.51,19.41 -0.98,10 4.86,26.24 -5.14,20.75 -10,-5.48 -10,14.52 0,10 10,-4.51 4.99,9.25 5.14,19.25 m 0,99.999972 c 0.76,10 5.97,24.23 -4.03,19.16 -10,-5.07 -10,14.93 0,10 10,-4.93 2.97,10.84 4.03,20.84 1.06,10 4.53,22.02 -5.47,18.75 -10,-3.27 -10,16.73 0,10 10,-6.73 3.66,11.25 5.47,21.25 m 50,-299.99996967941 c -0.37,9.99999997941 -3.12,24.29999767941 6.88,18.04999767941 10,-6.249999 10,13.75 0,10 -10,-3.75 -7.28,11.95 -6.88,21.95 0.4,10 -4.26,22.57 5.74,18.64 10,-3.92 10,16.08 0,10 -10,-6.07 -3.79,11.36 -5.74,21.36 -1.95,9.999992 5.78,24.870002 -4.22,18.439992 -10,-6.44 -10,13.56001 0,10.00001 10,-3.57 4.61,11.56 4.22,21.55997 -0.39,10 -5.55,26.51 4.45,20.63 10,-5.88 10,14.12 0,10 -10,-4.12 -5.82,9.37 -4.45,19.37 1.37,10 -6.7,23.99 3.3,18.94 10,-5.04 10,14.96 0,10 -10,-4.95 -4.34,11.06 -3.3,21.06 1.04,10 6.78,24.52 -3.22,18.58 -10,-5.95 -10,14.05 0,10 10,-4.06 1.79,11.42 3.22,21.42"
            id="16"
            style={{
              stroke: "var(--color-primary)",
              strokeWidth: 0.15,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
          />
        ) : (
          <path
            fill="none"
            strokeWidth="0.1"
            d="m 4.5e-4,49.999819 c 10,-1.96 28.75,-3.36 21.89,6.64 -6.85,10 13.15,10 10,0 -3.14,-10 8.10999,-5.71 18.10999,-6.64 10,-0.93 26,-5.8 21.06,4.2 -4.93,10 15.07,10 10,0 -5.06,-10 8.94,-5.1 18.93999,-4.2 10,0.9 24.72,-4.7 18.24,5.3 -6.49,10 13.51001,10 10,0 -3.52,-10 11.76002,-3.87 21.76002,-5.3 10,-1.43 26.02,-3.41 19.45,6.59 -6.57,10 13.43,10 10,0 -3.43,-10 10.55,-5.74 20.55,-6.59 10,-0.85 23.83,-4.25 18.27,5.75 -5.56,10 14.44,10 10,0 -4.44,-10 11.73,-5.73 21.73,-5.75 10,-0.02 23.8,6.91 19.81,-3.09 -3.98,-10 16.02,-10 10,0 -6.01,10 10.19,4.63 20.19,3.09 m -300,50 c 10,0.480001 25.42,-3.99 19.39,6.010001 -6.03,10 13.97,10 10,0 -3.97,-10.000001 10.60999,-7.590001 20.60999,-6.010001 10,1.580001 25.58,6.600001 19.09,-3.4 -6.48,-10 13.52,-10 10,0 -3.51,10.000001 10.91,4.660001 20.90999,3.4 10,-1.26 21.58,6.930001 18.1,-3.07 -3.47,-10 16.53001,-10 10,0 -6.52,10.000001 11.90002,4.110001 21.90002,3.07 10,-1.04 27.65,4.870001 21.32,-5.13 -6.34,-10 13.66,-10 10,0 -3.67,10.000001 8.68,5.550001 18.68,5.13 10,-0.42 28.55,6.080001 21.63,-3.92 -6.91,-10 13.09,-10 10,0 -3.08,10.000001 8.37,5.030001 18.37,3.92 10,-1.11 24.97,5.100001 18.61,-4.9 -6.37,-10 13.63,-10 10,0 -3.64,10.000001 11.39,4.89 21.39,4.9 m -300,49.999981 c 10,0.07 25.79,3.56 18.89,-6.43997 -6.91,-10 13.09,-10 10,0 -3.1,9.99997 11.10999,7.99997 21.10999,6.43997 10,-1.56 26.47,-4.85998 21.17,5.14 -5.3,10 14.7,10 10,0 -4.7,-9.99998 8.83,-3.17 18.82999,-5.14 10,-1.97 26.3,5.66 21.56,-4.33998 -4.75,-9.99999 15.25001,-9.99999 10.00001,0 -5.26001,9.99998 8.44001,4.30998 18.44001,4.33998 10,0.03 25.13,-6.31997 18.33,3.68 -6.81,10 13.19,10 10,0 -3.2,-9.99997 11.67,-2.89 21.67,-3.68 10,-0.79 21.66,4.03 18.26,-5.96997 -3.4,-10 16.6,-10 10,0 -6.6,9.99997 11.74,7.12997 21.74,5.96997 10,-1.16 27.42,-3.65999 21.22,6.34 -6.21,10 13.79,10 10,0 -3.8,-9.99999 8.78,-8.11 18.78,-6.34 m -300,50 c 10,0.13 23.71,5.99 18.08,-4.01 -5.62,-10 14.38,-10 10,0 -4.37,10 11.91999,4.68 21.91999,4.01 10,-0.67 24.67,-6.47 20.73,3.53 -3.93,10 16.07,10 10,0 -6.06,-10 9.27,-4.25 19.26999,-3.53 10,0.72 22.3,5.26 19.15,-4.74 -3.14,-10 16.86,-10 10,0 -6.85,10 10.85002,5.77 20.85002,4.74 10,-1.03 23.12,-3.6 18.59,6.4 -4.53,10 15.47,10 10,0 -5.47,-10 11.41,-6.47 21.41,-6.4 10,0.07 24.49,4.68 21.22,-5.32 -3.27,-10 16.73,-10 10,0 -6.73,10 8.78,6.8 18.78,5.32 10,-1.48 23.1,3.27 18.67,-6.73 -4.43,-10 15.57,-10 10,0 -5.57,10 11.33,5.17 21.33,6.73 m -300,50 c 10,0.56 23.53,-6.64 19.49,3.36 -4.03,10 15.97,10 10,0 -5.96,-10 10.50999,-1.83 20.50999,-3.36 10,-1.53 26.92,4.01 21.09,-5.99 -5.83,-10 14.17,-10 10,0 -4.17,10 8.91,5.55 18.90999,5.99 10,0.44 26.22,4.79 21.7,-5.21 -4.52,-10 15.48001,-10 10.00001,0 -5.48001,10 8.30001,3.32 18.30001,5.21 10,1.89 23.45,5.58 20.44,-4.42 -3,-10 17,-10 10,0 -6.99,10 9.56,4.98 19.56,4.42 10,-0.56 28.47,-6.12 21.91,3.88 -6.56,10 13.44,10 10,0 -3.44,-10 8.09,-1.95 18.09,-3.88 10,-1.93 26.83,4.73 21.19,-5.27 -5.65,-10 14.35,-10 10,0 -4.36,10 8.81,3.82 18.81,5.27 M 50.00044,-1.8e-4 c -0.72,10 -3,23.529999 7,20.369999 10,-3.16 10,16.84 0,10 -10,-6.84 -8.49,9.63 -7,19.63 1.49,10 3.2,27.9 -6.8,21.48 -9.99999,-6.42 -9.99999,13.58 0,10 10,-3.58 5.16,8.52 6.8,18.52 1.64,10.000001 4.71,24.910011 -5.29,20.140001 -9.99999,-4.77 -9.99999,15.23001 0,10.00001 10,-5.23 6.6,9.86 5.29,19.85997 -1.31,10 -5.96,26.28 4.04,21.81 10,-4.47 10,15.53 0,10 -10,-5.53 -4.82,8.19 -4.04,18.19 0.78,10 3.89,27.5 -6.11,21.57 -9.99999,-5.92 -9.99999,14.08 0,10 10,-4.07 4.7,8.43 6.11,18.43 1.41,10 -6.07,25.08 3.93,21.91 10,-3.17 10,16.83 0,10 -10,-6.83 -2.49,8.09 -3.93,18.09 M 100.00043,-1.8e-4 c -1.26999,10 6.68,26.299999 -3.31999,20.209999 -10,-6.09 -10,13.91 0,10 9.99999,-3.91 1.56,9.79 3.31999,19.79 1.76,10 -3.42999,27.85 6.57,21.91 10,-5.94 10,14.06 0,10 -9.99999,-4.06 -7.90999,8.09 -6.57,18.09 1.34,10.000001 4.25,24.340011 -5.74999,20.770001 -10,-3.58 -10,16.42001 0,10.00001 9.99999,-6.43 4.32,9.23 5.74999,19.22997 1.43,10 4.09,25.41 -5.90999,18.6 -10,-6.81 -10,13.19 0,10 9.99999,-3.19 5.76,11.4 5.90999,21.4 0.15,10 -4.35999,24.74 5.64,20.21 10,-4.53 10,15.47 0,10 -9.99999,-5.47 -5.80999,9.79 -5.64,19.79 0.17,10 3.99,23.49 -6.00999,18.01 -10,-5.48 -10,14.52 0,10 9.99999,-4.52 4.15,11.99 6.00999,21.99 M 150.00045,-1.8e-4 c -1.78,10 -4.52,24.809999 5.48,20.829999 10,-3.97 10,16.03 0,10 -10,-6.02 -6.13,9.17 -5.48,19.17 0.65,10 5.57,24.14 -4.43,18.4 -10.00001,-5.74 -10.00001,14.26 0,10 10,-4.26 3.15,11.6 4.43,21.6 1.28,10.000001 -3.76,26.260011 6.24,20.220001 10,-6.04 10,13.96001 0,10.00001 -10,-3.96 -6,9.78 -6.24,19.77997 -0.24,10 4.58,26.83 -5.42,20.27 -10.00001,-6.56 -10.00001,13.44 0,10 10,-3.44 5.28,9.73 5.42,19.73 0.14,10 -6.7,24 3.3,19.99 10,-4 10,16 0,10 -10,-5.99 -5.29,10.01 -3.3,20.01 1.99,10 6.07,22.87 -3.93,18.3 -10.00002,-4.57 -10.00002,15.43 0,10 10,-5.43 5.59,11.7 3.93,21.7 m 50,-299.99998 c 1.09,10 -6.49,26.989999 3.51,20.589999 10,-6.4 10,13.6 0,10 -10,-3.6 -2.53,9.41 -3.51,19.41 -0.98,10 4.86,26.24 -5.14,20.75 -10,-5.48 -10,14.52 0,10 10,-4.51 4.99,9.25 5.14,19.25 0.15,10.000001 3.77,28.310011 -6.23,21.630011 -10,-6.67001 -10,13.33 0,10 10,-3.32 7.82,8.37 6.23,18.36997 -1.59,10 -4.55,24.99 5.45,20.13 10,-4.86 10,15.14 0,10 -10,-5.14 -6.21,9.87 -5.45,19.87 0.76,10 5.97,24.23 -4.03,19.16 -10,-5.07 -10,14.93 0,10 10,-4.93 2.97,10.84 4.03,20.84 1.06,10 4.53,22.02 -5.47,18.75 -10,-3.27 -10,16.73 0,10 10,-6.73 3.66,11.25 5.47,21.25 m 50,-299.99998 c -0.37,10 -3.12,24.299999 6.88,18.049999 10,-6.25 10,13.75 0,10 -10,-3.75 -7.28,11.95 -6.88,21.95 0.4,10 -4.26,22.57 5.74,18.64 10,-3.92 10,16.08 0,10 -10,-6.07 -3.79,11.36 -5.74,21.36 -1.95,10.000001 5.78,24.870011 -4.22,18.440001 -10,-6.44 -10,13.56001 0,10.00001 10,-3.57 4.61,11.56 4.22,21.55997 -0.39,10 -5.55,26.51 4.45,20.63 10,-5.88 10,14.12 0,10 -10,-4.12 -5.82,9.37 -4.45,19.37 1.37,10 -6.7,23.99 3.3,18.94 10,-5.04 10,14.96 0,10 -10,-4.95 -4.34,11.06 -3.3,21.06 1.04,10 6.78,24.52 -3.22,18.58 -10,-5.95 -10,14.05 0,10 10,-4.06 1.79,11.42 3.22,21.42"
            id="16"
            style={{
              stroke: "var(--color-primary)",
              strokeWidth: 0.15,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
          />
        )}
      </svg>
      <svg
        ref={ref}
        className="pointer-events-none relative"
        version="1.0"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
      ></svg>
    </div>
  );
});
