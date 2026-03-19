import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { setBit, isBitSet, GameStateFlags } from "../../stores/gameStateStore";
import { $pastDate, $currentDate } from "../../stores/stringStore";
import {
  setPhonewaveResult,
  $phoneCurrentTimestamp,
  $phonePastTimestamp,
  $phoneResultMode,
  $phoneTimer,
} from "../../stores/phoneStore";
import { ApplianceShell } from "../ApplianceShell";
import { PhonewaveScreen, type PhonewaveLine } from "./PhonewaveScreen";
import { PhonewaveTimerControls } from "./PhonewaveTimerControls";
import { formatDate } from "../../utility/formatDate";
import {
  getPhoneTargetEnd,
  isInPhoneTargetWindow,
  PHONE_TARGET_LABEL,
} from "../../utility/phoneTargetDate";
import {
  EMPTY_TIMER_VALUES,
  buildPastDate,
  formatTimerSummary,
  getNextFieldValue,
  getTimerStatus,
  type TimerFieldKey,
  type TimerValues,
} from "../../utility/phoneTimer";

type PhonewaveVariant = "idle" | "result";

const getCorrectionHint = (pastDate: Date) =>
  pastDate.getTime() > getPhoneTargetEnd().getTime()
    ? "offset not far enough"
    : "offset overshot target";

export const Phonewave = ({
  className = "",
  variant = "result",
  onSequenceComplete,
}: {
  className?: string;
  onSequenceComplete?: () => void;
  variant?: PhonewaveVariant;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timerValues, setTimerValues] =
    useState<TimerValues>(EMPTY_TIMER_VALUES);
  const [selectedField, setSelectedField] = useState<TimerFieldKey>("years");
  const hasNotifiedSequenceCompleteRef = useRef(false);
  const mode = useStore($phoneResultMode);
  const timer = useStore($phoneTimer);
  const currentTimestamp = useStore($phoneCurrentTimestamp);
  const pastTimestamp = useStore($phonePastTimestamp);
  const timerStatus = getTimerStatus(timerValues);

  useEffect(() => {
    setCurrentStep(0);
    hasNotifiedSequenceCompleteRef.current = false;
  }, [currentTimestamp, pastTimestamp, timer, variant]);

  const handleDigit = (digit: string) => {
    setTimerValues((currentValues) => ({
      ...currentValues,
      [selectedField]: getNextFieldValue(
        selectedField,
        currentValues[selectedField],
        digit
      ),
    }));
  };

  const handleBack = () => {
    setTimerValues((currentValues) => ({
      ...currentValues,
      [selectedField]: currentValues[selectedField].slice(0, -1),
    }));
  };

  const handleSubmit = () => {
    const currentDate = new Date();
    const pastDate = buildPastDate(timerValues, currentDate);
    const isSuccess = isInPhoneTargetWindow(pastDate);

    setPhonewaveResult(
      formatTimerSummary(timerValues),
      currentDate.getTime(),
      pastDate.getTime()
    );

    if (isSuccess && !isBitSet(GameStateFlags.FLAG_CONNECTION)) {
      setBit(GameStateFlags.FLAG_CONNECTION);
    }

    $currentDate.set(formatDate(currentDate));
    $pastDate.set(formatDate(pastDate));
  };

  const currentDate =
    currentTimestamp === null ? null : new Date(currentTimestamp);
  const pastDate = pastTimestamp === null ? null : new Date(pastTimestamp);
  const isSuccess = pastDate !== null && isInPhoneTargetWindow(pastDate);

  const lines = useMemo<PhonewaveLine[]>(() => {
    if (variant === "idle") {
      return [
        {
          label: "boot",
          tone: "muted",
          value: "phone-linked microwave awaiting input",
        },
        { label: "window", value: PHONE_TARGET_LABEL },
        {
          label: "timer",
          tone: "muted",
          value: "set the added timer with years and months",
        },
        { label: "status", tone: "failure", value: "failed connection" },
        {
          label: "action",
          tone: "muted",
          value: "start the phonewave program",
        },
      ];
    }

    if (currentDate === null || pastDate === null) {
      return [];
    }

    return [
      {
        label: "boot",
        tone: "muted",
        value: "phonewave start-up complete",
      },
      { label: "window", value: PHONE_TARGET_LABEL },
      { label: "present", value: formatDate(currentDate, true) },
      { label: "offset", value: timer },
      { label: "arrival", value: formatDate(pastDate, true) },
      {
        label: "status",
        tone: isSuccess ? "success" : "failure",
        value: isSuccess ? "inside target window" : "outside target window",
      },
      ...(isSuccess
        ? [
            {
              label: "relay",
              tone: "success" as const,
              value: "linked phone input enabled",
            },
          ]
        : [
            {
              label: "correction",
              tone: "muted" as const,
              value: getCorrectionHint(pastDate),
            },
          ]),
    ];
  }, [currentDate, isSuccess, pastDate, timer, variant]);

  useEffect(() => {
    if (
      variant !== "result" ||
      lines.length === 0 ||
      currentStep !== lines.length ||
      hasNotifiedSequenceCompleteRef.current
    ) {
      return;
    }

    hasNotifiedSequenceCompleteRef.current = true;
    onSequenceComplete?.();
  }, [currentStep, lines.length, onSequenceComplete, variant]);

  if (variant === "result" && mode !== "connection") {
    return null;
  }

  if (variant === "result" && lines.length === 0) {
    return null;
  }

  return (
    <ApplianceShell
      className={`mx-auto flex min-h-[24rem] w-full flex-col px-5 py-5 md:px-7 lg:h-full ${className}`}
      radius="2rem"
      showHighlight
      ventClassName="right-7 top-[5.2rem] h-3.5 w-24"
    >
      <div
        className="flex items-start justify-between gap-4 border-b pb-4"
        style={{ borderColor: "var(--color-appliance-shell-border)" }}
      >
        <div className="space-y-1.5">
          <p
            className="font-mono text-[0.56rem] uppercase tracking-[0.3em]"
            style={{ color: "var(--color-appliance-label)" }}
          >
            future gadget no. 8
          </p>
          <p className="font-mono text-[0.86rem] tracking-[0.08em] text-[var(--color-primary)] sm:text-[0.98rem]">
            PhoneWave (name subject to change)
          </p>
        </div>
        <span
          className="shrink-0 rounded-full border px-3 py-1.5 font-mono text-[0.54rem] uppercase tracking-[0.22em]"
          style={{
            backgroundColor: "var(--color-appliance-control-panel-top)",
            borderColor: "var(--color-appliance-control-panel-border)",
            color: "var(--color-primary)",
          }}
        >
          phone microwave
        </span>
      </div>
      <div
        className="relative mt-4 flex flex-1 overflow-hidden rounded-[1.45rem] border p-4 sm:p-5"
        style={{
          background:
            "linear-gradient(180deg, var(--color-appliance-panel-top), var(--color-appliance-panel-bottom))",
          borderColor: "var(--color-appliance-panel-border)",
          boxShadow: "inset 0 0 0 1px var(--color-appliance-panel-highlight)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ backgroundImage: "var(--color-appliance-panel-pattern)" }}
        />
        <div className="relative flex flex-1 flex-col">
          <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_17.25rem] lg:gap-5">
            <PhonewaveScreen
              animate={variant === "result"}
              className="lg:mr-1"
              currentStep={currentStep}
              lines={lines}
              onStepComplete={setCurrentStep}
            />
            <PhonewaveTimerControls
              onBack={handleBack}
              onDigit={handleDigit}
              onSelect={setSelectedField}
              onSubmit={handleSubmit}
              selectedField={selectedField}
              shouldWiggle={timerStatus.mode === "too-much"}
              statusColor={timerStatus.color}
              statusMode={timerStatus.mode}
              values={timerValues}
            />
          </div>
        </div>
      </div>
    </ApplianceShell>
  );
};
