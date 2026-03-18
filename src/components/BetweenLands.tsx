import { SeparatorIn } from "./SeparatorIn";
import { SeparatorOut } from "./SeparatorOut";
import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import {
  MotionValue,
  useScroll,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { Crt } from "./Crt";
import { GameStateFlags, isBitSet } from "../stores/gameStateStore";

interface BetweenLandsProps {
  isBackground: boolean;
  isCrt: boolean;
  crtCallback?: () => void;
  renderItem: (shift: MotionValue<string>) => ReactNode;
  separatorInMiddleLayer?: ReactNode;
  separatorOutUnderLayer?: ReactNode;
  separatorOutMiddleLayer?: ReactNode;
}

const originalImgWidth = 500;
const originalSnapPoint = { x: 1600, y: 1750 };
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export const BetweenLands = ({
  isBackground,
  isCrt,
  crtCallback,
  renderItem,
  separatorInMiddleLayer,
  separatorOutUnderLayer,
  separatorOutMiddleLayer,
}: BetweenLandsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const separatorInRef = useRef<HTMLDivElement>(null);
  const separatorOutRef = useRef<HTMLDivElement>(null);
  const [separatorHeight, setSeparatorHeight] = useState(0);
  const [dragConstraints, setDragConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const [crtWidth, setCrtWidth] = useState(0);
  const [snapPoint, setSnapPoint] = useState(originalSnapPoint);

  const updateSizes = () => {
    if (!ref.current || !separatorInRef.current || !separatorOutRef.current) {
      return;
    }

    const inHeight = separatorInRef.current.getBoundingClientRect().height;
    setSeparatorHeight((currentHeight) =>
      currentHeight !== inHeight ? inHeight : currentHeight
    );

    const bounds = ref.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const width = viewportWidth * 0.2;
    const scale = width / originalImgWidth;

    setSnapPoint({
      x: Math.round(originalSnapPoint.x * scale),
      y: Math.round(originalSnapPoint.y * scale),
    });

    setCrtWidth(width);
    setDragConstraints({
      top: 0,
      left: 0,
      right: viewportWidth - width,
      bottom: bounds.height - width,
    });
  };

  useIsomorphicLayoutEffect(() => {
    updateSizes();

    const resizeObserver = new ResizeObserver(() => {
      updateSizes();
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    if (separatorInRef.current) {
      resizeObserver.observe(separatorInRef.current);
    }

    if (separatorOutRef.current) {
      resizeObserver.observe(separatorOutRef.current);
    }

    window.addEventListener("resize", updateSizes);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateSizes);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 100%", "100% 0%"],
  });

  const layer = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${separatorHeight / 2}px`, `${separatorHeight / 2}px`]
  );

  const zeroPx = useMotionValue("0px");

  const crtProp = {
    isCrt: isCrt && !isBitSet(GameStateFlags.FLAG_LEND_A_HAND),
    snapPoint: snapPoint,
    callBack: crtCallback ? crtCallback : () => {},
    dragConstraints: dragConstraints,
    crtWidth: crtWidth,
    bounds: ref,
  };

  return (
    <div className="relative bg-bgColor" ref={ref}>
      <Crt {...crtProp} />
      <SeparatorIn ref={separatorInRef} middleLayer={separatorInMiddleLayer} />

      {isBackground ? renderItem(layer) : renderItem(zeroPx)}
      <SeparatorOut
        ref={separatorOutRef}
        isCrt={isCrt}
        underLayer={separatorOutUnderLayer}
        middleLayer={separatorOutMiddleLayer}
      />
    </div>
  );
};
