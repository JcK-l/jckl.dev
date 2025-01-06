import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export const SeparatorIn = () => {
  let ref = useRef(null);

  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 100%", "100% 0%"],
  });

  let layer1 = useTransform(scrollYProgress, [0, 1], ["-8vh", "0vh"]);
  let layer2 = useTransform(scrollYProgress, [0, 1], ["-12vh", "0vh"]);
  let layer3 = useTransform(scrollYProgress, [0, 1], ["-16vh", "0vh"]);

  // let layer1 = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"]);
  // let layer2 = useTransform(scrollYProgress, [0, 1], ["-40%", "0%"]);
  // let layer3 = useTransform(scrollYProgress, [0, 1], ["-60%", "0%"]);

  return (
    <div className="relative" ref={ref}>
      <svg
        className="relative -z-40"
        viewBox="0 0 960 400"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          // fill="#003153" 
          fill="#231942" 
          d="M 0,0 V 402 H 960 V 0 Z" 
        />
      </svg>

      <svg
        className="absolute top-0"
        version="1.1"
        viewBox="0 0 960 410"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          style={{ y: layer3, filter: "drop-shadow(0 10px 25px rgba(35, 25, 66, 0.0))" }}
          d="m 960.00001,390.52337 -26.7,-23.8 c -26.6,-23.9 -80,-71.5 -133.3,-85.9 -53.29999,-14.3 -106.69999,4.7 -160,33.7 -53.3,29 -106.69999,68 -160,82.2 -53.29999,14.1 -106.7,3.5 -160,-16.4 -53.29999,-19.8 -106.7,-48.8 -160,-49.5 -53.29999,-0.6 -106.7,27 -133.30001,40.9 l -26.7,13.8 v -213 h 26.7 c 26.60001,0 80.00001,0 133.30001,0 53.3,0 106.7,0 160,0 53.3,0 106.7,0 160,0 53.3,0 106.7,0 160,0 53.3,0 106.7,0 160,0 53.3,0 106.7,0 133.3,0 h 26.7 z"
          // fill="#759fbc"
          fill="#5e548e"
        />
        <motion.path
          style={{ y: layer2, filter: "drop-shadow(0 10px 25px rgba(35, 25, 66, 0.0)) "  }}
          d="m 960,248.01465 -26.7,13 c -26.6,13 -80,39 -133.3,59 -53.3,20 -106.7,34 -160,11.5 -53.3,-22.5 -106.7,-81.5 -160,-96.2 -53.3,-14.6 -106.7,15 -160,45.2 -53.3,30.2 -106.7,60.8 -160,59.7 -53.3,-1.2 -106.7,-34.2 -133.3,-50.7 l -26.7,-16.5 v -157 h 26.7 c 26.6,0 80,0 133.3,0 53.3,0 106.7,0 160,0 53.3,0 106.7,0 160,0 53.3,0 106.7,0 160,0 53.3,0 106.7,0 160,0 53.3,0 106.7,0 133.3,0 H 960 Z"
          // fill="#a2bad0"
          fill="#918ab2"
        />
        <motion.path
          style={{ y: layer1, filter: "drop-shadow(0 10px 25px rgba(35, 25, 66, 0.0))" }}
          d="m 1e-5,228.68305 20,-9.5 c 20,-9.5 60,-28.5 100,-37.5 40,-9 80,-8 120,3.5 40,11.5 80,33.5 120,46 40,12.5 80,15.5 120,-5.2 40,-20.6 80,-65 120,-80.6 40,-15.7 80,-2.7 120,12.3 40,15 80,32 120,43.8 40,11.9 80,18.5 100,21.9 l 20,3.3 v -182 h -20 c -20,0 -60,0 -100,0 -40,0 -80,0 -120,0 -40,0 -80,0 -120,0 -40,0 -80,0 -120,0 -40,0 -80,0 -120,0 -40,0 -80,0 -120,0 -40,0 -80,0 -120,0 -40,0 -80,0 -100,0 h -20 z"
          // fill="#cfd5e4"
          fill="#c4c0d6"
        />
        <path
          style={{ filter: "drop-shadow(0 10px 25px rgba(35, 25, 66, 0.0))" }}
          d="m 960.00001,117 -17.8,-7.5 c -17.9,-7.5 -53.5,-22.5 -89,-15.5 -35.5,7 -70.9,36 -106.4,49.8 -35.5,13.9 -71.1,12.5 -106.8,-0.8 -35.7,-13.3 -71.3,-38.7 -106.8,-54.8 -35.5,-16.2 -70.9,-23.2 -106.4,-16 -35.5,7.1 -71.1,28.5 -106.8,47.1 -35.7,18.7 -71.3,34.7 -106.8,42.2 -35.5,7.5 -70.9,6.5 -106.4,-7.7 -35.5,-14.1 -71.1,-41.5 -89,-55.1 L 10e-6,85 V 0 h 17.8 c 17.9,0 53.5,0 89,0 35.5,0 70.9,0 106.4,0 35.5,0 71.1,0 106.8,0 35.7,0 71.3,0 106.8,0 35.5,0 70.9,0 106.4,0 35.5,0 71.1,0 106.8,0 35.7,0 71.3,0 106.8,0 35.5,0 70.9,0 106.4,0 35.5,0 71.1,0 89,0 h 17.8 z"
          // fill="#fceff9"
          fill="#f7f5fb"
        />
      </svg>
    </div>
  );
};