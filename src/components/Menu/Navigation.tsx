import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";

const variants = {
  open: {
    opacity: 1,
    transition: { duration: 0.2 },
    // transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const names = ["about", "projects", "contact"];

export const Navigation = ({ isOpen }: any) => (
  <motion.ul
    className="absolute inset-x-32 top-6 flex-col text-lg font-medium"
    variants={variants}
  >
    {isOpen &&
      names.map((name) => (
        <a href={`#${name}`}>
          <MenuItem name={name} key={name} />
        </a>
      ))}
    {!isOpen && names.map((name) => <MenuItem name={name} key={name} />)}
  </motion.ul>
);
