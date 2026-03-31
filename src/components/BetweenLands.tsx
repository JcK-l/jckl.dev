import { SeparatorIn } from "./SeparatorIn";
import { SeparatorOut } from "./SeparatorOut";
import type { ReactNode } from "react";
import type { MotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useScroll, useTransform, useMotionValue } from "framer-motion";
import { Crt } from "./appliance/Crt";
import { GameStateFlags, isBitSet } from "../stores/gameStateStore";

interface BetweenLandsProps {
  isBackground: boolean;
  isCrt: boolean;
  crtCallback?: () => void;
  renderItem: (shift: MotionValue<string>) => ReactNode;
  separatorOutCrtScreenOpacity?: number;
  separatorInMiddleLayer?: ReactNode;
  separatorOutUnderLayer?: ReactNode;
  separatorOutMiddleLayer?: ReactNode;
}

const originalImgWidth = 500;
const originalSnapPoint = { x: 1600, y: 1750 };
const MOBILE_BREAKPOINT_PX = 640;
const MOBILE_PARALLAX_FACTOR = 0.28;

export const getBetweenLandsParallaxDistance = (
  separatorHeight: number,
  viewportWidth: number
) => {
  const multiplier =
    viewportWidth < MOBILE_BREAKPOINT_PX ? MOBILE_PARALLAX_FACTOR : 0.5;

  return Number((separatorHeight * multiplier).toFixed(2));
};

export const BetweenLands = ({
  isBackground,
  isCrt,
  crtCallback,
  renderItem,
  separatorOutCrtScreenOpacity,
  separatorInMiddleLayer,
  separatorOutUnderLayer,
  separatorOutMiddleLayer,
}: BetweenLandsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const separatorInRef = useRef<HTMLDivElement>(null);
  const separatorOutRef = useRef<HTMLDivElement>(null);
  const [separatorHeight, setSeparatorHeight] = useState(0);
  const [parallaxDistance, setParallaxDistance] = useState(0);
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
    const nextParallaxDistance = getBetweenLandsParallaxDistance(
      inHeight,
      viewportWidth
    );
    const width = viewportWidth * 0.2;
    const scale = width / originalImgWidth;

    setParallaxDistance((currentDistance) =>
      currentDistance !== nextParallaxDistance
        ? nextParallaxDistance
        : currentDistance
    );

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

  useEffect(() => {
    let frameId = 0;
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateSizes);
    };

    scheduleUpdate();

    const resizeObserver = new ResizeObserver(scheduleUpdate);

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    if (separatorInRef.current) {
      resizeObserver.observe(separatorInRef.current);
    }

    if (separatorOutRef.current) {
      resizeObserver.observe(separatorOutRef.current);
    }

    window.addEventListener("resize", scheduleUpdate);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 100%", "100% 0%"],
  });

  const layer = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${parallaxDistance}px`, `${parallaxDistance}px`]
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
        crtScreenOpacity={separatorOutCrtScreenOpacity}
        underLayer={separatorOutUnderLayer}
        middleLayer={separatorOutMiddleLayer}
      />
    </div>
  );
};
