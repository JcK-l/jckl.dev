import { motion, useCycle, useAnimate } from "framer-motion";
import { MenuToggle } from "./Menu/MenuToggle";
import { Navigation } from "./Menu/Navigation";
import { ButtonSecondary } from "./ButtonSecondary";
import { useEffect } from "react";

export const Header = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(scope.current, isOpen ? { y: 144 } : { y: 0 });
  }),
    [isOpen];

  return (
    <header className="sticky top-0 h-28 flex-none select-none overflow-visible font-heading font-medium">
      <motion.div
        className="mx-8 flex h-full flex-row items-center justify-between"
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        <div className="mr-8 inline-block cursor-pointer text-xl">
          <a href="#hero">JckL</a>
        </div>

        <nav className="w-full">
          <ul className="hidden items-center sm:flex sm:flex-row ">
            <li className="mr-4 cursor-pointer transition-colors delay-100 ease-in-out hover:text-secondary">
              <a href="#about">about</a>
            </li>
            <li className="cursor-pointer transition-colors delay-100 ease-in-out hover:text-secondary">
              <a href="#projects">projects</a>
            </li>
            <li className="grow"></li>
            <li>
              <ButtonSecondary href="#contact" text="contact me" />
            </li>
          </ul>

          <div className="sm:hidden">
            <Navigation isOpen={isOpen} />
          </div>
        </nav>

        <div className="sm:hidden">
          <MenuToggle toggle={() => toggleOpen()} />
        </div>
      </motion.div>

      <div
        ref={scope}
        className="absolute -top-52 -z-10 h-80 w-full bg-white/90 shadow-md backdrop-blur-md "
      ></div>
    </header>
  );
};
