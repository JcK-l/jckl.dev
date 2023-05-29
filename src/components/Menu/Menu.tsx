import { motion, useCycle } from "framer-motion";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";
import { useEffect, useRef } from "react";

export const Menu = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);

  useEffect(() => {
    if (isOpen) {
      document
        .getElementById("header")
        ?.setAttribute(
          "class",
          "sticky top-0 mx-auto h-64 sm:h-28 w-full flex-none select-none bg-white/90 shadow-md backdrop-blur-md transition-all ease-in delay-75"
        );
      document
        .getElementById("top-nav-menu")
        ?.setAttribute(
          "class",
          "absolute inset-0 flex flex-col items-center justify-center"
        );
    } else {
      document
        .getElementById("header")
        ?.setAttribute(
          "class",
          "sticky top-0 mx-auto h-28 w-full flex-none select-none bg-white/90 shadow-md backdrop-blur-md transition-all ease-in delay-300"
        );
      setTimeout(() => {
        document
          .getElementById("top-nav-menu")
          ?.setAttribute(
            "class",
            "absolute inset-0 hidden transition-all ease-in delay-75"
          );
      }, 200);
      /*TODO: #1 Menu fix wenn zu schnell click*/
    }
  }),
    [isOpen];

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="h-full w-full font-heading text-lg font-medium text-black sm:hidden "
    >
      {/* <motion.div
        className="h-60 w-screen overflow-hidden bg-white/90 backdrop-blur-md"
        custom={height}
        variants={sidebar}
      /> */}
      <Navigation />
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};
