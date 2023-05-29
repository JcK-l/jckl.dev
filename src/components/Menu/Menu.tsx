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
          "sticky top-0 mx-auto h-64 sm:h-28 w-full flex-none select-none bg-white/95 shadow-md backdrop-blur-md transition-all duration-300"
        );
    } else {
      document
        .getElementById("header")
        ?.setAttribute(
          "class",
          "sticky top-0 mx-auto h-28 w-full flex-none select-none bg-white/95 shadow-md backdrop-blur-md transition-all duration-300"
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
