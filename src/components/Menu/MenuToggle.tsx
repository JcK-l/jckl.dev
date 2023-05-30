import { motion } from "framer-motion";

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    strokeLinecap="round"
    {...props}
  />
);

export const MenuToggle = ({ toggle }: any) => (
  <button
    onClick={toggle}
    // className="absolute right-3 top-8 z-50 cursor-pointer rounded-xl p-3 active:bg-black/5"
    className="h-full cursor-pointer rounded-xl p-4 active:bg-black/5"
    aria-label="navbar-menu"
    id="menu-toggle"
  >
    <svg className="stroke-black" width="24" height="24" viewBox="0 0 24 24">
      <Path
        variants={{
          closed: { d: "M 4 6 L 20 6" },
          open: { d: "M 6 18 L 18 6" },
        }}
      />
      <Path
        d="M 4 12 L 20 12"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 4 18 L 20 18" },
          open: { d: "M 6 6 L 18 18" },
        }}
      />
    </svg>
  </button>
);
