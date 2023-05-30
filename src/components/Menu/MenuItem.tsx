import { motion } from "framer-motion";

export const MenuItem = ({ name }: any) => (
  <motion.li
    whileTap={{ scale: 0.95, backgroundColor: "#1e20220d" }}
    className="w-full cursor-pointer rounded-xl p-5 text-center"
  >
    {name}
  </motion.li>
);
