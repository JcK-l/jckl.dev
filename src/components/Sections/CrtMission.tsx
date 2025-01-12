import { BetweenLands } from "../BetweenLands";
import { motion } from "framer-motion";

const CrtMission = () => {
  return (
    <BetweenLands isBackground={true} renderItem={(shift) => (
      <motion.div className="relative bg-primary" style={{y:shift}}>
        <motion.img src="/stars.svg" alt="stars" className="absolute w-full lg:w-9/12" style={{left: '50%', top: '50%', y:"-50%", x:"-50%"}}  />
        <img src="/mefly.avif" alt="me" className="relative mx-auto w-1/3 desk:w-2/12 h-auto mix-blend-screen" />
      </motion.div>
    )}/> 
  );
}

export default CrtMission;

