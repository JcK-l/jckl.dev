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
  <motion.ul className="absolute -bottom-28 left-6" variants={variants}>
    {names.map((name) => (
      <MenuItem name={name} key={name} />
    ))}
  </motion.ul>
);
