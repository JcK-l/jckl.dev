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
          "absolute -top-36 h-64 w-full bg-white/95 shadow-md backdrop-blur-md transition-transition transform-gpu duration-300 translate-y-36 sm:translate-y-0 "
        );
    } else {
      document
        .getElementById("header")
        ?.setAttribute(
          "class",
          "absolute -top-36 h-64 w-full bg-white/95 shadow-md backdrop-blur-md transition-transition transform-gpu duration-300 sm:translate-y-0"
        );
    }
  }),
    [isOpen];

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="h-full w-full font-heading text-lg font-medium text-black sm:hidden "
    >
      <Navigation />
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};
