import { motion } from "framer-motion";

const variants = {
  open: {
    cursor: "pointer",
    "z-index": 10,
  },
  closed: {
    cursor: "default",
    "z-index": -10,
  },
};

export const MenuItem = ({ name }: any) => (
  <motion.li
    whileTap={{ scale: 0.95, backgroundColor: "#1e20220d" }}
    variants={variants}
    className="w-full rounded-xl p-5 text-center"
  >
    {name}
  </motion.li>
);
