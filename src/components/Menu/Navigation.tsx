import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";

const variants = {
  open: {
    opacity: 1,
    display: "flex",
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
  closed: {
    opacity: 0,
    transitionEnd: { display: "none" },
    transition: { duration: 0.1 },
  },
};

const names = ["about", "projects", "contact"];

export const Navigation = () => (
  <motion.ul
    className="absolute inset-32 flex-col items-center justify-center"
    style={{ display: "flex" }}
    variants={variants}
  >
    {names.map((name) => (
      <MenuItem name={name} key={name} />
    ))}
  </motion.ul>
);
