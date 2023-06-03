import { useRef } from "react";
import { SeparatorOut } from "../components/SeparatorOut";
import { useScroll, useTransform, motion } from "framer-motion";
import { SeparatorIn } from "../components/SeparatorIn";

export const BlueLayout = (content: any) => {
  let ref = useRef(null);
  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 100%", "100% 0%"],
  });

  let y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  let opacity = useTransform(scrollYProgress, [0.95, 1], ["100%", "0%"]);

  return (
    <div ref={ref}>
      <motion.div
        style={{ opacity }}
        className="sticky top-0 z-10 w-full flex-none select-none mix-blend-screen"
      >
        <a
          className="absolute left-6 top-5 cursor-pointer rounded-2xl bg-white p-2 font-heading text-2xl font-bold text-[#000]  hover:bg-[#d4eefd] xl:text-3xl xl:font-extrabold"
          href="#hero"
        >
          JckL
        </a>
      </motion.div>
      <SeparatorIn />
      <div className=" -my-1  bg-primary text-white2">
        {/* -my-1 because safari had white lines on smaller devices */}
        <motion.div className="" style={{ y }}>
          {content.children}
        </motion.div>
      </div>
      <SeparatorOut />
    </div>
  );
};
