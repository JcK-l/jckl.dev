import { createElement, forwardRef, useEffect } from "react";
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
        forwardRef<HTMLElement, Record<string, unknown>>(function MockMotion(
          props,
          ref
        ) {
          const {
            animate,
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

          useEffect(() => {
            if (autoAnimationComplete) {
              onAnimationComplete?.();
            }
          }, [onAnimationComplete]);

          const dragControls = !exposeDragControls
            ? null
            : [
                onDragStart
                  ? createElement(
                      "button",
                      {
                        key: "drag-start",
                        type: "button",
                        "data-testid": `${dragControlTestIdPrefix}-drag-start`,
                        onClick: () => onDragStart(),
                      },
                      "drag-start"
                    )
                  : null,
                onDrag
                  ? createElement(
                      "button",
                      {
                        key: "drag",
                        type: "button",
                        "data-testid": `${dragControlTestIdPrefix}-drag`,
                        onClick: () => onDrag(),
                      },
                      "drag"
                    )
                  : null,
                onDragEnd
                  ? createElement(
                      "button",
                      {
                        key: "drag-end",
                        type: "button",
                        "data-testid": `${dragControlTestIdPrefix}-drag-end`,
                        onClick: () => onDragEnd(),
                      },
                      "drag-end"
                    )
                  : null,
              ];

          void onAnimationComplete;
          void onHoverEnd;
          void onHoverStart;

          if (VOID_TAGS.has(tag)) {
            return createElement(tag, { ref, ...domProps });
          }

          return createElement(tag, { ref, ...domProps }, props.children, dragControls);
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
