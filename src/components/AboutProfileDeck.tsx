import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ApplianceShell } from "./appliance/ApplianceShell";
import { ApplianceInsetPanel } from "./appliance/ApplianceInsetPanel";
import { usePuzzleContext } from "../hooks/useDataContext";

type AboutModule = {
  id: string;
  code: string;
  title: string;
  range: { min: number; max: number };
  paragraphs: string[];
  tags: string[];
};

const ABOUT_MODULES: AboutModule[] = [
  {
    id: "pattern-matching",
    code: "Profile Module 01",
    title: "Pattern matching keeps me hooked.",
    range: { min: 4, max: 7 },
    paragraphs: [
      "Chess puzzles, Rubik's Cubes, logic games. If there is a system to read or a pattern to crack, I'm in.",
      "I used to play in chess tournaments, and I still like that feeling of slowly seeing the shape of a solution appear. The puzzle on this page scratches the same part of my brain.",
    ],
    tags: ["puzzles", "chess", "pattern scan"],
  },
  {
    id: "music-buffer",
    code: "Profile Module 02",
    title: "Music is how I clear the buffer.",
    range: { min: 8, max: 11 },
    paragraphs: [
      "My playlists jump all over the place: jazz fusion, indie, classical, city pop, hip-hop, electro. I like finding the sound that fits the moment.",
      "I also play piano. When everything feels noisy, sitting down for a few minutes usually resets the signal and gets my head back in order.",
    ],
    tags: ["piano", "reset", "wide-band listening"],
  },
  {
    id: "build-stack",
    code: "Profile Module 03",
    title: "Computers have always been the home base.",
    range: { min: 12, max: 16 },
    paragraphs: [
      "Building PCs, chasing difficult games, and learning how systems fit together all fed into the same thing: I like understanding how something works from the inside.",
      "Programming feels like the natural extension of that. It lets me experiment, build, and turn a loose idea into something real.",
    ],
    tags: ["pc builds", "competitive", "code"],
  },
];

const TOTAL_REVEAL_PIECES =
  ABOUT_MODULES[ABOUT_MODULES.length - 1]?.range.max ?? 16;
const DECK_SETTLE_SPRING = {
  type: "spring" as const,
  stiffness: 42,
  damping: 18,
  mass: 2.1,
  restSpeed: 0.35,
  restDelta: 0.35,
};
const DRAG_VELOCITY_THRESHOLD = 520;

const formatCounter = (value: number) => value.toString().padStart(2, "0");

const getRangeLabel = (range: AboutModule["range"]) => {
  return `${formatCounter(range.min)}-${formatCounter(range.max)}`;
};

const getStatusCopy = (unlockedCount: number, nextModule?: AboutModule) => {
  const nextUnlockMeta = nextModule
    ? `next unlock ${formatCounter(nextModule.range.min)}`
    : "next unlock complete";

  if (unlockedCount === 0) {
    return {
      message: "Place 04 pieces to bring the first profile module online.",
      meta: nextUnlockMeta,
    };
  }

  if (!nextModule) {
    return {
      message:
        "All profile modules are online. Swipe through the stack or finish the puzzle to close the loop.",
      meta: nextUnlockMeta,
    };
  }

  return {
    message: `Swipe through unlocked notes or keep assembling pieces to reach ${formatCounter(
      nextModule.range.min,
    )}.`,
    meta: nextUnlockMeta,
  };
};

const AboutModuleCard = ({
  module,
  isLive,
  isLocked,
}: {
  module?: AboutModule;
  isLive: boolean;
  isLocked?: boolean;
}) => {
  const code = module?.code ?? "Profile Module 01";
  const title = module?.title ?? "Profile archive is warming up.";
  const paragraphs = module?.paragraphs ?? [
    "The first note stays sealed until a few more pieces click into place.",
    "Once the puzzle reaches 04 placed pieces, the profile stack starts to come online.",
  ];
  const tags = module?.tags ?? ["awaiting input", "standby", "signal cold"];
  const rangeLabel = module ? getRangeLabel(module.range) : "00-03";
  const stateLabel = isLocked ? "Locked" : isLive ? "Live" : "Stored";

  return (
    <ApplianceShell className="w-full px-5 py-5 md:px-7" radius="1.75rem">
      <div
        className="appliance-panel-header"
        style={{ borderColor: "var(--color-appliance-shell-border)" }}
      >
        <div className="appliance-panel-heading">
          <p className="appliance-panel-eyebrow">{code}</p>
          <p className="appliance-header-subtitle">personal archive</p>
        </div>
        <div className="appliance-panel-chip-group">
          <span className="appliance-panel-chip">
            {rangeLabel}
          </span>
          <span className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={
                isLocked
                  ? {
                      backgroundColor: "var(--color-appliance-label)",
                      opacity: 0.38,
                    }
                  : isLive
                  ? {
                      boxShadow: "0 0 10px var(--color-extra2)",
                      backgroundColor: "var(--color-extra2)",
                      opacity: 1,
                    }
                  : {
                      backgroundColor: "var(--color-secondary)",
                      opacity: 1,
                    }
              }
            />
            <span
              className="font-appliance text-[0.55rem] uppercase tracking-[0.2em]"
              style={{ color: "var(--color-appliance-label)" }}
            >
              {stateLabel}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-5">
        <ApplianceInsetPanel className="px-4 py-4 sm:px-5 sm:py-5">
          <h3
            className="font-heading text-[1.55rem] font-extrabold leading-tight sm:text-[1.8rem]"
            style={{ color: "var(--color-appliance-label-soft)" }}
          >
            {title}
          </h3>

          <div
            className="mt-4 space-y-4 font-sans text-[1rem] leading-7"
            style={{ color: "var(--color-appliance-label-soft)" }}
          >
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </ApplianceInsetPanel>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <ApplianceInsetPanel
              key={tag}
              as="span"
              className="inline-flex px-3 py-1"
              patternOpacity={0.48}
            >
              <span
                className="font-appliance text-[0.6rem] uppercase tracking-[0.18em]"
                style={{ color: "var(--color-appliance-label)" }}
              >
                {tag}
              </span>
            </ApplianceInsetPanel>
          ))}
        </div>
      </div>
    </ApplianceShell>
  );
};

export const AboutProfileDeck = () => {
  const { totalPlacedPieces } = usePuzzleContext();
  const unlockedModules = ABOUT_MODULES.filter((module) => {
    return totalPlacedPieces >= module.range.min;
  });
  const nextModule = ABOUT_MODULES[unlockedModules.length];
  const latestUnlockedModule =
    unlockedModules[unlockedModules.length - 1] ?? undefined;
  const currentModule =
    ABOUT_MODULES.find((module) => {
      return (
        totalPlacedPieces >= module.range.min &&
        totalPlacedPieces <= module.range.max
      );
    }) ?? latestUnlockedModule;
  const statusCopy = getStatusCopy(unlockedModules.length, nextModule);
  const visibleModules =
    unlockedModules.length > 0 ? unlockedModules : [undefined];
  const newestCardKey = latestUnlockedModule?.id ?? "locked";
  const [activeIndex, setActiveIndex] = useState(
    Math.max(visibleModules.length - 1, 0),
  );
  const [isDraggingDeck, setIsDraggingDeck] = useState(false);
  const [deckWidth, setDeckWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const canDragDeck = visibleModules.length > 1;
  const clampIndex = (index: number) => {
    return Math.max(0, Math.min(index, visibleModules.length - 1));
  };
  const animateToIndex = (index: number) => {
    if (deckWidth === 0) {
      return;
    }

    animationRef.current?.stop();
    animationRef.current = animate(
      x,
      -clampIndex(index) * deckWidth,
      DECK_SETTLE_SPRING,
    );
  };
  const settleToIndex = (index: number) => {
    const nextIndex = clampIndex(index);

    if (nextIndex === activeIndex) {
      animateToIndex(nextIndex);
      return;
    }

    setActiveIndex(nextIndex);
  };
  const minimumDragX = -Math.max(visibleModules.length - 1, 0) * deckWidth;

  useEffect(() => {
    const element = viewportRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setDeckWidth(element.clientWidth);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    setActiveIndex(Math.max(visibleModules.length - 1, 0));
  }, [newestCardKey, visibleModules.length]);

  useEffect(() => {
    if (deckWidth === 0) {
      return;
    }

    animateToIndex(activeIndex);

    return () => {
      animationRef.current?.stop();
    };
  }, [activeIndex, deckWidth, x]);

  return (
    <div className="flex w-full flex-col gap-4">
      <ApplianceShell className="w-full px-5 py-5 md:px-7" radius="1.5rem">
        <div
          className="appliance-panel-header"
          style={{ borderColor: "var(--color-appliance-shell-border)" }}
        >
          <div className="appliance-panel-heading">
            <p className="appliance-panel-eyebrow">Profile Archive</p>
            <p className="appliance-header-subtitle">appliance notes</p>
          </div>
          <div className="appliance-panel-chip-group">
            {ABOUT_MODULES.map((module) => {
              const isUnlocked = unlockedModules.some(
                (unlockedModule) => unlockedModule.id === module.id,
              );

              return (
                <span
                  key={module.id}
                  className="h-3 w-3 rounded-full"
                  style={
                    isUnlocked
                      ? {
                          boxShadow: "0 0 10px var(--color-extra2)",
                          backgroundColor: "var(--color-extra2)",
                          opacity: 1,
                        }
                      : {
                          backgroundColor: "var(--color-appliance-label)",
                          opacity: 0.28,
                        }
                  }
                />
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <ApplianceInsetPanel className="px-4 py-4">
            <div className="flex flex-col gap-3 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <p
                className="font-appliance text-[0.72rem] leading-6"
                style={{ color: "var(--color-appliance-label-soft)" }}
              >
                {statusCopy.message}
              </p>
              <p
                className="appliance-panel-chip-muted"
              >
                {statusCopy.meta}
              </p>
            </div>
          </ApplianceInsetPanel>
        </div>
      </ApplianceShell>

      <div ref={viewportRef} className="overflow-hidden">
        <motion.div
          drag={canDragDeck ? "x" : false}
          dragConstraints={
            canDragDeck ? { left: minimumDragX, right: 0 } : undefined
          }
          dragElastic={0}
          dragMomentum={false}
          className={
            canDragDeck
              ? isDraggingDeck
                ? "flex cursor-grabbing"
                : "flex cursor-grab"
              : "flex"
          }
          style={{ x }}
          onDragStart={() => {
            setIsDraggingDeck(true);
            animationRef.current?.stop();
          }}
          onDragEnd={(_, info) => {
            setIsDraggingDeck(false);

            if (deckWidth === 0) {
              return;
            }

            const nearestIndex = clampIndex(Math.round(-x.get() / deckWidth));
            const nextIndex =
              info.velocity.x <= -DRAG_VELOCITY_THRESHOLD
                ? clampIndex(activeIndex + 1)
                : info.velocity.x >= DRAG_VELOCITY_THRESHOLD
                ? clampIndex(activeIndex - 1)
                : nearestIndex;

            settleToIndex(nextIndex);
          }}
        >
          {visibleModules.map((module, index) => (
            <div
              key={module?.id ?? "locked"}
              className="w-full shrink-0 basis-full px-1.5 md:px-2"
            >
              <AboutModuleCard
                module={module}
                isLive={
                  currentModule?.id === module?.id ||
                  (!module && !currentModule)
                }
                isLocked={!module}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3 px-1">
        <div className="flex items-center gap-2">
          {visibleModules.map((module, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={`${module?.id ?? "locked"}-${index}`}
                type="button"
                aria-label={`Open about card ${index + 1}`}
                className="h-2.5 w-2.5 rounded-full transition-transform duration-200"
                style={{
                  backgroundColor: isActive
                    ? "var(--color-appliance-label-soft)"
                    : "var(--color-secondary)",
                  opacity: isActive ? 1 : 0.35,
                }}
                onClick={() => {
                  settleToIndex(index);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
