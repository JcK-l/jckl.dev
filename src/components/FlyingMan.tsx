import { motion, useAnimation } from "framer-motion";
import { useEffect, forwardRef, useState } from "react";

interface FlyingManProps {
}

const FlyingMan = forwardRef<HTMLDivElement, FlyingManProps>((props, ref) => {
  const controls = useAnimation(); // Use controls for animation
  const [initialPosition, setInitialPosition] = useState<number>(0);



  useEffect(() => {
    // const wiggleAnimation = {
    //   y: [0, -50, 0, -50, 0, 0, 0], // Define the keyframes for the horizontal movement
    //   x: [0, -30, 0, 0, 30, 0, 0], // Define the keyframes for the horizontal movement
    //   rotate: [0, -3, 3, 0, 3, -3, 0], // Define the keyframes for the wiggle animation
    //   transition: {
    //     duration: 3, // Duration of one wiggle cycle
    //     repeat: Infinity, // Repeat indefinitely
    //     ease: "easeInOut", // Easing function
    //   },
    // };

    // controls.start(wiggleAnimation);

    const div1 = document.getElementById('hero');
    if (div1) {
      setInitialPosition(div1.getBoundingClientRect().top);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log("Element is in view");

          const div1 = document.getElementById('hero');
          const div2 = document.getElementById('projects');

          if (div1 && div2) {
            const rect1 = div1.getBoundingClientRect();
            const rect2 = div2.getBoundingClientRect();

            const rectthird = rect2.top + Math.abs(rect2.bottom - rect2.top) / 3;


            const distance =Math.abs(rectthird - rect1.top);
            console.log('Vertical distance between div1 and div2:', distance);

            // Use the calculated distance in the animation
            controls.start({ y: distance, transition: { type: "tween", ease: "linear", duration: 12 } });
          }

        } else {
          console.log("Element is out of view");
          const { top, bottom } = entry.boundingClientRect;
          // const { top: rootTop, bottom: rootBottom } = entry.rootBounds || { top: 0, bottom: window.innerHeight };

          // console.log(`Element top: ${top}, bottom: ${bottom}`);
          // console.log(`Root top: ${rootTop}, bottom: ${rootBottom}`);

          if (top < 0) {
            console.log("Element went out of view at the bottom");
          } else {
            controls.start({ y: initialPosition, transition: { type: "spring", duration: 1 } });
            console.log("Element went out of view at the top");
          }
        }
      },
      {
        threshold: 0.5, // Adjust this value as needed
        root: null, // Use the viewport as the root
      }
    );

    const element = ref as React.MutableRefObject<HTMLDivElement | null>;
    if (element.current) {
      observer.observe(element.current);
    }

    return () => {
      if (element.current) {
        observer.unobserve(element.current);
      }
    };
  }, [ref, controls]);


  return (
      <motion.video
        className="absolute mx-auto inset-x-0 w-1/2 xl:w-1/4 mix-blend-screen -z-10 select-none top-0"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        animate={controls}
        src="/mefly.mp4" 
      />
  );
});

export default FlyingMan;