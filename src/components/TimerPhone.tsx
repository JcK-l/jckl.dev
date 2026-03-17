import { useState, type ReactNode } from "react";
import { setBit, isBitSet, GameStateFlags } from "../stores/gameStateStore";
import { $pastDate, $currentDate } from "../stores/stringStore";
import { setPhoneConnectionResult } from "../stores/phoneStore";
import { formatDate } from "../utility/formatDate";
import {
  getPhoneTargetEnd,
  getPhoneTargetStart,
  isInPhoneTargetWindow,
} from "../utility/phoneTargetDate";
import { PhonePad } from "./PhonePad";

type TimerFieldKey = "years" | "months";
type TimerValues = Record<TimerFieldKey, string>;

const TIMER_FIELDS = [
  { key: "years", label: "YEARS", shortLabel: "Y" },
  { key: "months", label: "MONTHS", shortLabel: "M" },
] as const satisfies ReadonlyArray<{
  key: TimerFieldKey;
  label: string;
  shortLabel: string;
}>;

const EMPTY_TIMER_VALUES: TimerValues = {
  years: "",
  months: "",
};

const getDisplayValue = (value: string) =>
  (value === "" ? "00" : value.slice(-2)).padStart(2, "0");

const getNumericValue = (value: string) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const getNextFieldValue = (
  field: TimerFieldKey,
  currentValue: string,
  digit: string
) => {
  if (currentValue.length >= 2) {
    return currentValue;
  }

  const nextValue = currentValue + digit;

  if (field !== "months" || nextValue.length < 2) {
    return nextValue;
  }

  return Math.min(getNumericValue(nextValue), 11).toString().padStart(2, "0");
};

const buildPastDate = (values: TimerValues, currentDate = new Date()) => {
  const pastDate = new Date(currentDate);

  pastDate.setFullYear(pastDate.getFullYear() - getNumericValue(values.years));
  pastDate.setMonth(pastDate.getMonth() - getNumericValue(values.months));

  return pastDate;
};

const formatTimerSummary = (values: TimerValues) =>
  `${getDisplayValue(values.years)}Y ${getDisplayValue(values.months)}M`;

const getTimerStatus = (values: TimerValues) => {
  const currentDate = new Date();
  const pastDate = buildPastDate(values, currentDate);
  const targetStart = getPhoneTargetStart();
  const targetEnd = getPhoneTargetEnd();

  const currentTime = currentDate.getTime();
  const pastTime = pastDate.getTime();
  const targetStartTime = targetStart.getTime();
  const targetEndTime = targetEnd.getTime();
  const notEnoughRange = Math.max(1, currentTime - targetEndTime);
  const tooMuchRange = Math.max(1, targetEndTime - targetStartTime);

  if (pastTime > targetEndTime) {
    return {
      color: "var(--color-baloon2)",
      mode: "not-enough" as const,
      progress: Math.max(0, 1 - (pastTime - targetEndTime) / notEnoughRange),
    };
  }

  if (pastTime < targetStartTime) {
    return {
      color: "var(--color-baloon1)",
      mode: "too-much" as const,
      progress: Math.max(0, 1 - (targetStartTime - pastTime) / tooMuchRange),
    };
  }

  return {
    color: "var(--color-green)",
    mode: "just-right" as const,
    progress: 1,
  };
};

const TimerDisplay = ({
  values,
  selectedField,
  statusColor,
  onSelect,
}: {
  values: TimerValues;
  selectedField: TimerFieldKey;
  statusColor: string;
  onSelect: (field: TimerFieldKey) => void;
}) => (
  <div className="flex w-full items-center justify-center gap-2 px-2">
    {TIMER_FIELDS.map(({ key, label, shortLabel }) => {
      const isSelected = key === selectedField;

      return (
        <button
          key={key}
          type="button"
          className="min-w-[6.7rem] rounded-[1.35rem] border px-3 py-2 text-center transition"
          onClick={() => onSelect(key)}
          style={{
            backgroundColor: isSelected ? statusColor : "rgba(255,255,255,0.08)",
            borderColor: isSelected ? statusColor : "rgba(255,255,255,0.22)",
            boxShadow: isSelected
              ? "0 0 0 1px rgba(255,255,255,0.18)"
              : "none",
          }}
        >
          <span className="block text-[1.1rem] font-semibold tracking-[0.28em] text-white">
            {getDisplayValue(values[key])}
          </span>
          <span className="mt-1 block text-[0.52rem] font-semibold uppercase tracking-[0.26em] text-white/70">
            {shortLabel}
          </span>
          <span className="sr-only">{label}</span>
        </button>
      );
    })}
  </div>
);

const TimerPhoneShell = ({
  children,
  status,
}: {
  children: ReactNode;
  status: ReturnType<typeof getTimerStatus>;
}) => {
  const fillPercent = status.mode === "not-enough" ? status.progress * 100 : 100;

  return (
    <div
      className={`relative mx-auto w-full max-w-[22rem] rounded-[2.8rem] bg-white/[0.08] p-[4px] ${
        status.mode === "too-much" ? "phone-timer-wiggle" : ""
      }`}
      style={{
        boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[2.8rem]">
        <div
          className="absolute inset-x-0 bottom-0 transition-[height,background-color] duration-300 ease-out"
          style={{
            backgroundColor: status.color,
            height: `${fillPercent}%`,
          }}
        />
      </div>
      <div
        className="relative overflow-hidden rounded-[2.55rem]"
        style={{
          backgroundColor: "var(--color-bg-color)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const TimerPhone = () => {
  const [values, setValues] = useState<TimerValues>(EMPTY_TIMER_VALUES);
  const [selectedField, setSelectedField] = useState<TimerFieldKey>("years");
  const status = getTimerStatus(values);

  const handleDigit = (digit: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [selectedField]: getNextFieldValue(
        selectedField,
        currentValues[selectedField],
        digit
      ),
    }));
  };

  const handleBack = () => {
    setValues((currentValues) => ({
      ...currentValues,
      [selectedField]: currentValues[selectedField].slice(0, -1),
    }));
  };

  const handleSubmit = () => {
    const currentDate = new Date();
    const pastDate = buildPastDate(values, currentDate);
    const isSuccess = isInPhoneTargetWindow(pastDate);

    setPhoneConnectionResult(
      formatTimerSummary(values),
      currentDate.getTime(),
      pastDate.getTime()
    );

    if (isSuccess && !isBitSet(GameStateFlags.FLAG_CONNECTION)) {
      setBit(GameStateFlags.FLAG_CONNECTION);
    }

    $currentDate.set(formatDate(currentDate));
    $pastDate.set(formatDate(pastDate));
  };

  return (
    <TimerPhoneShell status={status}>
      <PhonePad
        bottomLeftDanger={true}
        bottomRightHighlighted={true}
        className="mx-auto w-full max-w-[21rem]"
        compactBottom={true}
        display={
          <TimerDisplay
            values={values}
            selectedField={selectedField}
            statusColor={status.color}
            onSelect={setSelectedField}
          />
        }
        onBottomLeft={handleBack}
        onBottomRight={handleSubmit}
        onDigit={handleDigit}
      />
    </TimerPhoneShell>
  );
};
