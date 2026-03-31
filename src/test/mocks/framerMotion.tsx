import { createElement, forwardRef, useEffect, type ReactNode } from "react";
import { vi } from "vitest";

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

type MotionProxyOptions = {
  autoAnimationComplete?: boolean;
  dragControlTestIdPrefix?: string;
  exposeDragControls?: boolean;
};

type MotionHookOptions = {
  scrollYProgress?: number;
  transformValue?: (outputRange: unknown[]) => unknown;
};

type MockMotionProps = Record<string, unknown> & {
  animate?: unknown;
  children?: ReactNode;
  custom?: unknown;
  drag?: unknown;
  dragConstraints?: unknown;
  dragElastic?: unknown;
  dragMomentum?: unknown;
  exit?: unknown;
  initial?: unknown;
  onAnimationComplete?: (() => void) | undefined;
  onDrag?: (() => void) | undefined;
  onDragEnd?: (() => void) | undefined;
  onDragStart?: (() => void) | undefined;
  onHoverEnd?: (() => void) | undefined;
  onHoverStart?: (() => void) | undefined;
  transition?: unknown;
  variants?: unknown;
  viewport?: unknown;
  whileHover?: unknown;
  whileTap?: unknown;
};

export const createMockMotionValue = <T,>(initialValue: T) => {
  let currentValue = initialValue;

  return {
    get: () => currentValue,
    set: (nextValue: T) => {
      currentValue = nextValue;
    },
  };
};

export const createMotionProxy = ({
  autoAnimationComplete = false,
  dragControlTestIdPrefix = "motion",
  exposeDragControls = false,
}: MotionProxyOptions = {}) =>
  new Proxy(
    {},
    {
      get: (_, tag: string) =>
        forwardRef<HTMLElement, MockMotionProps>(function MockMotion(
          props,
          ref
        ) {
          const {
            animate,
            children,
            custom,
            drag,
            dragConstraints,
            dragElastic,
            dragMomentum,
            exit,
            initial,
            onAnimationComplete,
            onDrag,
            onDragEnd,
            onDragStart,
            onHoverEnd,
            onHoverStart,
            transition,
            variants,
            viewport,
            whileHover,
            whileTap,
            ...domProps
          } = props;

          void animate;
          void custom;
          void drag;
          void dragConstraints;
          void dragElastic;
          void dragMomentum;
          void exit;
          void initial;
          void transition;
          void variants;
          void viewport;
          void whileHover;
          void whileTap;

          const animationCompleteHandler = onAnimationComplete as
            | (() => void)
            | undefined;
          const dragStartHandler = onDragStart as (() => void) | undefined;
          const dragHandler = onDrag as (() => void) | undefined;
          const dragEndHandler = onDragEnd as (() => void) | undefined;

          useEffect(() => {
            if (autoAnimationComplete) {
              animationCompleteHandler?.();
            }
          }, [animationCompleteHandler]);

          const dragControls: ReactNode = !exposeDragControls
            ? null
            : [
                dragStartHandler
                  ? createElement(
                      "button",
                      {
                        key: "drag-start",
                        type: "button",
                        "data-testid": `${dragControlTestIdPrefix}-drag-start`,
                        onClick: () => dragStartHandler(),
                      },
                      "drag-start"
                    )
                  : null,
                dragHandler
                  ? createElement(
                      "button",
                      {
                        key: "drag",
                        type: "button",
                        "data-testid": `${dragControlTestIdPrefix}-drag`,
                        onClick: () => dragHandler(),
                      },
                      "drag"
                    )
                  : null,
                dragEndHandler
                  ? createElement(
                      "button",
                      {
                        key: "drag-end",
                        type: "button",
                        "data-testid": `${dragControlTestIdPrefix}-drag-end`,
                        onClick: () => dragEndHandler(),
                      },
                      "drag-end"
                    )
                  : null,
              ];

          void animationCompleteHandler;
          void onHoverEnd;
          void onHoverStart;

          if (VOID_TAGS.has(tag)) {
            return createElement(tag, { ref, ...domProps });
          }

          return createElement(
            tag,
            { ref, ...domProps },
            children as ReactNode,
            dragControls
          );
        }),
    }
  );

export const createAnimationControls = () => ({
  set: vi.fn(),
  start: vi.fn(() => Promise.resolve()),
  stop: vi.fn(),
});

export const createDragControls = () => ({
  start: vi.fn(),
});

export const createMotionHooks = ({
  scrollYProgress = 0,
  transformValue = (outputRange) => outputRange[0],
}: MotionHookOptions = {}) => ({
  useMotionValue: <T,>(value: T) => createMockMotionValue(value),
  useScroll: () => ({
    scrollYProgress: createMockMotionValue(scrollYProgress),
  }),
  useTransform: (
    _value: unknown,
    _inputRange: number[],
    outputRange: unknown[]
  ) => createMockMotionValue(transformValue(outputRange)),
});

export const createFramerMotionMock = ({
  controls,
  dragControls,
  hooks,
  motion,
}: {
  controls?: ReturnType<typeof createAnimationControls>;
  dragControls?: ReturnType<typeof createDragControls>;
  hooks?: MotionHookOptions;
  motion?: MotionProxyOptions;
} = {}) => ({
  motion: createMotionProxy(motion),
  ...(controls ? { useAnimation: () => controls } : {}),
  ...(dragControls ? { useDragControls: () => dragControls } : {}),
  ...(hooks ? createMotionHooks(hooks) : {}),
});
