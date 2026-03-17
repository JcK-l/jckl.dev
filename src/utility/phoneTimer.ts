import { getPhoneTargetEnd, getPhoneTargetStart } from "./phoneTargetDate";

export type TimerFieldKey = "years" | "months";
export type TimerStatusMode = "not-enough" | "too-much" | "just-right";
export type TimerValues = Record<TimerFieldKey, string>;

export const TIMER_FIELDS = [
  { key: "years", label: "YEARS", shortLabel: "Y" },
  { key: "months", label: "MONTHS", shortLabel: "M" },
] as const satisfies ReadonlyArray<{
  key: TimerFieldKey;
  label: string;
  shortLabel: string;
}>;

export const EMPTY_TIMER_VALUES: TimerValues = {
  years: "",
  months: "",
};

export const getDisplayValue = (value: string) =>
  (value === "" ? "00" : value.slice(-2)).padStart(2, "0");

const getNumericValue = (value: string) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

export const getNextFieldValue = (
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

export const buildPastDate = (values: TimerValues, currentDate = new Date()) => {
  const pastDate = new Date(currentDate);

  pastDate.setFullYear(pastDate.getFullYear() - getNumericValue(values.years));
  pastDate.setMonth(pastDate.getMonth() - getNumericValue(values.months));

  return pastDate;
};

export const formatTimerSummary = (values: TimerValues) =>
  `${getDisplayValue(values.years)}Y ${getDisplayValue(values.months)}M`;

export const getTimerStatus = (values: TimerValues) => {
  const pastDate = buildPastDate(values);
  const targetStartTime = getPhoneTargetStart().getTime();
  const targetEndTime = getPhoneTargetEnd().getTime();
  const pastTime = pastDate.getTime();

  if (pastTime > targetEndTime) {
    return {
      color: "var(--color-baloon2)",
      mode: "not-enough" as const satisfies TimerStatusMode,
    };
  }

  if (pastTime < targetStartTime) {
    return {
      color: "var(--color-baloon1)",
      mode: "too-much" as const satisfies TimerStatusMode,
    };
  }

  return {
    color: "var(--color-green)",
    mode: "just-right" as const satisfies TimerStatusMode,
  };
};
