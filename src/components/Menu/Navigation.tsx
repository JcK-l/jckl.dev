import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const names = ["about", "projects", "contact"];

export const Navigation = () => (
  <motion.ul
    className="absolute inset-0 flex flex-col items-center justify-center"
    variants={variants}
    id="top-nav-menu"
  >
    {names.map((name) => (
      <MenuItem name={name} key={name} />
    ))}
  </motion.ul>
);
