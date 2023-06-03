import { useRef } from "react";
import { SeparatorOut } from "../components/SeparatorOut";
import { useScroll, useTransform, motion } from "framer-motion";

export const WhiteLayout = (content: any) => {
  let ref = useRef(null);
  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 0%", "100% 0%"],
  });

  let opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 0.95],
    ["0", "100%", "100%", "0%"]
  );

  return (
    <div ref={ref}>
      <motion.div
        className="sticky top-0 z-10 w-full flex-none select-none"
        style={{ opacity }}
      >
        <a
          className="absolute left-6 top-5 cursor-pointer rounded-2xl p-2 font-heading text-2xl font-bold text-black hover:bg-[#d4eefd] xl:text-3xl xl:font-extrabold"
          href="#hero"
        >
          JckL
        </a>
      </motion.div>
      {/* -my-1 because safari had white lines on smaller devices */}
      <div className=" -my-1  bg-white text-black">{content.children}</div>
    </div>
  );
};
