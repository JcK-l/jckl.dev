import { motion } from "framer-motion";

const variants = {
  open: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
  closed: {
    opacity: 0,
  },
};

export const MenuItem = ({ name }: any) => (
  <motion.li
    variants={variants}
    whileTap={{ scale: 0.95 }}
    className=" cursor-pointer rounded-lg p-5 hover:text-primary"
  >
    {name}
  </motion.li>
);
