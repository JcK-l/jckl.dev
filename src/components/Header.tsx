import { motion, useCycle, useAnimate } from "framer-motion";
import { MenuToggle } from "./Menu/MenuToggle";
import { Navigation } from "./Menu/Navigation";
import { useEffect, useState } from "react";

export const Header = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const [isScroll, setScroll] = useState(false);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    window.addEventListener(
      "scroll",
      (event) => {
        let scrollY = window.scrollY;
        setScroll(scrollY != 0);
      },
      { passive: true }
    );
  }),
    [];

  useEffect(() => {
    animate(scope.current, isOpen ? { y: 144 } : { y: 0 });

    if (isScroll) {
      animate([
        [
          scope.current,
          { scaleY: [1, 0.9] },
          { type: "spring", bounce: 0, duration: 0.05 },
        ],
        [
          scope.current,
          { scaleY: [0.9, 1] },
          { type: "spring", damping: 4, mass: 0.3, stiffness: 50 },
        ],
      ]);
    }
  }),
    [isOpen, isScroll];

  return (
    <motion.div>
      <div
        ref={scope}
        className="sm absolute -top-44 h-72 w-full bg-white/90 shadow-md backdrop-blur-md "
        id="header-background"
      ></div>
      <div className="absolute inset-x-0 mx-6 flex h-full flex-row items-center font-heading font-medium sm:mx-12 xl:mx-24">
        <a
          className="z-10 mr-10 mt-10 cursor-pointer self-start text-xl sm:mt-0 sm:self-center"
          href="https://jckl.dev/"
        >
          JckL
        </a>
        <nav className="w-full">
          <ul className="hidden flex-1 flex-row items-center justify-between sm:flex">
            <li className="mr-4 cursor-pointer transition-colors delay-100 ease-in-out hover:text-secondary">
              about
            </li>
            <li className="cursor-pointer transition-colors delay-100 ease-in-out hover:text-secondary">
              projects
            </li>
            <li className="grow"></li>
            <li className="hover:black-bgblack cursor-pointer rounded-xl border-2 border-black px-4 py-2 font-sans transition-colors delay-100 ease-in-out hover:bg-black hover:text-white">
              contact me
            </li>
          </ul>
        </nav>
      </div>
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className="h-full w-full font-heading text-lg font-medium text-black sm:hidden "
      >
        <Navigation />
        <MenuToggle toggle={() => toggleOpen()} />
      </motion.nav>
    </motion.div>
  );
};
