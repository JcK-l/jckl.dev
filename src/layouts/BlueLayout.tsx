import { useRef } from "react";
import { Separator } from "../components/Separator";
import { useScroll, useTransform, motion } from "framer-motion";

export const BlueLayout = (content: any) => {
  let ref = useRef(null);
  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 100%", "100% 0%"],
  });

  let y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={ref}>
      <Separator isUp={true} />

      {/* -my-1 because safari had white lines on smaller devices */}
      <div className=" -my-1  bg-primary text-white2">
        <motion.div className="" style={{ y }}>
          {content.children}
        </motion.div>
      </div>

      <Separator isUp={false} />
    </div>
  );
};
