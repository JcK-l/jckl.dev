import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export const SeparatorIn = () => {
  let ref = useRef(null);

  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 100%", "100% 0%"],
  });

  let layer1 = useTransform(scrollYProgress, [0, 1], ["-00%", "0%"]);
  let layer2 = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"]);
  let layer3 = useTransform(scrollYProgress, [0, 1], ["-40%", "0%"]);
  let layer4 = useTransform(scrollYProgress, [0, 1], ["-60%", "0%"]);

  return (
    <div ref={ref}>
      <svg
        viewBox="0 0 900 675"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="-900"
          y="-676"
          width="900"
          height="676.00006"
          fill="#20537f"
          transform="scale(-1)"
        />
        <motion.path
          style={{ y: layer4 }}
          d="M 0 392.1543 L 0 675 L 30 660.69922 C 60 646.29922 120 617.70078 180 581.80078 C 240 546.00078 300 503 360 496.5 C 420 490 480 520.00078 540 553.30078 C 600 586.70078 660 623.3 720 615 C 780 606.7 840 553.29922 870 526.69922 L 900 500 L 900 392.1543 L 0 392.1543 z "
          fill="#8cc9ff"
        />
        <motion.path
          style={{ y: layer3 }}
          d="M 0 266.25781 L 0 551 L 30 528.80078 C 60 506.70078 120 462.3 180 457.5 C 240 452.7 300 487.3 360 487.5 C 420 487.7 480 453.3 540 427.5 C 600 401.7 660 384.30078 720 404.30078 C 780 424.30078 840 481.70078 870 510.30078 L 900 539 L 900 266.25781 L 0 266.25781 z "
          fill="#afdcfe"
        />
        <motion.path
          style={{ y: layer2 }}
          d="M 0 81.664062 L 0 307 L 30 307.30078 C 60 307.70078 120 308.30078 180 297.30078 C 240 286.30078 300 263.7 360 268 C 420 272.3 480 303.69922 540 322.19922 C 600 340.69922 660 346.3 720 360.5 C 780 374.7 840 397.29922 870 408.69922 L 900 420 L 900 81.664062 L 0 81.664062 z "
          fill="#d4eefd"
        />
        <motion.path
          style={{ y: layer1 }}
          d="m 900,148 -30,18.7 c -30,18.6 -90,56 -150,31.6 C 660,174 600,88 540,83.7 480,79.3 420,156.7 360,173 300,189.3 240,144.7 180,149.7 c -60,5 -120,59.6 -150,87 L 0,264 V 0 h 30 c 30,0 90,0 150,0 60,0 120,0 180,0 60,0 120,0 180,0 60,0 120,0 180,0 60,0 120,0 150,0 h 30 z"
          fill="#fcfeff"
        />
      </svg>
    </div>
  );
};
