import { motion, useCycle } from "framer-motion";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";
import { useWindowSize, Size } from "../../Hook/UseWindowSize";
import { useRef } from "react";
import { useDimensions } from "../../Hook/use-dimensions";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 0%)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: () => ({
    clipPath: `circle(1px at 100% 0%)`,
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  }),
};

export const Menu = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const { height } = useWindowSize();
  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="h-full w-full font-heading font-medium text-black  sm:hidden"
    >
      <motion.div
        className="h-screen w-screen bg-white/80 drop-shadow-2xl backdrop-blur-md"
        custom={height}
        variants={sidebar}
      />
      <Navigation />
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};
