import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export const SeparatorOut = () => {
  let ref = useRef(null);

  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 100%", "100% 0%"],
  });

  let layer1 = useTransform(scrollYProgress, [0, 1], ["0%", "00%"]);
  let layer2 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  let layer3 = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  let layer4 = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

  return (
    <div ref={ref}>
      <svg
        viewBox="0 0 900 675"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="0" width="900" height="675" fill="#20537F" />
        <motion.path
          style={{ y: layer4 }}
          d="M 0,176 30,149.3 C 60,122.7 120,69.3 180,61 240,52.7 300,89.3 360,122.7 420,156 480,186 540,179.5 600,173 660,130 720,94.2 780,58.3 840,29.7 870,15.3 L 900,1 v 619 h -30 c -30,0 -90,0 -150,0 -60,0 -120,0 -180,0 -60,0 -120,0 -180,0 -60,0 -120,0 -180,0 -60,0 -120,0 -150,0 H 0 Z"
          fill="#8cc9ff"
        />
        <motion.path
          style={{ y: layer3 }}
          d="m 0,137 30,28.7 c 30,28.6 90,86 150,106 60,20 120,2.6 180,-23.2 60,-25.8 120,-60.2 180,-60 60,0.2 120,34.8 180,30 60,-4.8 120,-49.2 150,-71.3 L 900,125 v 437 h -30 c -30,0 -90,0 -150,0 -60,0 -120,0 -180,0 -60,0 -120,0 -180,0 -60,0 -120,0 -180,0 -60,0 -120,0 -150,0 H 0 Z"
          fill="#afdcfe"
        />
        <motion.path
          style={{ y: layer2 }}
          d="m 0,256 30,11.3 c 30,11.4 90,34 150,48.2 60,14.2 120,19.8 180,38.3 60,18.5 120,49.9 180,54.2 60,4.3 120,-18.3 180,-29.3 60,-11 120,-10.4 150,-10 l 30,0.3 v 287 h -30 c -30,0 -90,0 -150,0 -60,0 -120,0 -180,0 -60,0 -120,0 -180,0 -60,0 -120,0 -180,0 -60,0 -120,0 -150,0 H 0 Z"
          fill="#d4eefd"
        />
        <motion.path
          style={{ y: layer1 }}
          d="M0 528L30 509.3C60 490.7 120 453.3 180 477.7C240 502 300 588 360 592.3C420 596.7 480 519.3 540 503C600 486.7 660 531.3 720 526.3C780 521.3 840 466.7 870 439.3L900 412L900 676L870 676C840 676 780 676 720 676C660 676 600 676 540 676C480 676 420 676 360 676C300 676 240 676 180 676C120 676 60 676 30 676L0 676Z"
          fill="#fcfeff"
        />
      </svg>
    </div>
  );
};
