import { motion } from "framer-motion";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export const MenuItem = ({ name }: any) => (
  <motion.li
    variants={variants}
    whileHover={{ color: "#20537F" }}
    whileTap={{ scale: 0.95 }}
    className="mb-2"
  >
    <span> {name} </span>
  </motion.li>
);
