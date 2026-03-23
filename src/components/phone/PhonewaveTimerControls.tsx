import {
  TIMER_FIELDS,
  getDisplayValue,
  type TimerFieldKey,
  type TimerStatusMode,
  type TimerValues,
} from "../../utility/phoneTimer";
import { ApplianceInsetPanel } from "../appliance/ApplianceInsetPanel";

const timerStatusLabels: Record<TimerStatusMode, string> = {
  "not-enough": "NOT ENOUGH",
  "too-much": "TOO MUCH",
  "just-right": "READY",
};

const keypadDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export const PhonewaveTimerControls = ({
  onBack,
  onDigit,
  onSelect,
  onSubmit,
  selectedField,
  shouldWiggle,
  statusColor,
  statusMode,
  values,
}: {
  onBack: () => void;
  onDigit: (digit: string) => void;
  onSelect: (field: TimerFieldKey) => void;
  onSubmit: () => void;
  selectedField: TimerFieldKey;
  shouldWiggle: boolean;
  statusColor: string;
  statusMode: TimerStatusMode;
  values: TimerValues;
}) => {
  const statusLabel = timerStatusLabels[statusMode];
  const statusStyles = {
    backgroundColor:
      statusMode === "just-right"
        ? "var(--color-appliance-status-ready-bg)"
        : statusMode === "too-much"
          ? "var(--color-appliance-status-too-much-bg)"
          : "var(--color-appliance-status-not-enough-bg)",
    borderColor:
      statusMode === "just-right"
        ? "var(--color-appliance-status-ready-border)"
        : statusMode === "too-much"
          ? "var(--color-appliance-status-too-much-border)"
          : "var(--color-appliance-status-not-enough-border)",
    color: statusColor,
  };

  return (
    <div
      className={`relative pt-1 ${shouldWiggle ? "appliance-wiggle" : ""}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ backgroundImage: "var(--color-appliance-control-pattern)" }}
      />
      <div className="relative lg:pl-1">
        <div className="mb-4 flex items-start justify-between gap-3">
          <p
            className="text-[0.56rem] uppercase tracking-[0.32em]"
            style={{ color: "var(--color-appliance-label)" }}
          >
            timer setting
          </p>
          <span
            className="rounded-full border px-2.5 py-1 text-[0.54rem] uppercase tracking-[0.2em]"
            style={statusStyles}
          >
            {statusLabel}
          </span>
        </div>
        <ApplianceInsetPanel className="p-3">
          <div className="mb-3">
            <p
              className="text-[0.54rem] uppercase tracking-[0.28em]"
              style={{ color: "var(--color-appliance-label)" }}
            >
              offset
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TIMER_FIELDS.map(({ key, label, shortLabel }) => {
              const isSelected = key === selectedField;

              return (
                <button
                  key={key}
                  type="button"
                  className="rounded-[1rem] border px-3 py-2.5 text-center transition active:translate-y-[1px]"
                  onClick={() => onSelect(key)}
                  style={{
                    backgroundColor: isSelected
                      ? statusColor
                      : "var(--color-appliance-control-panel-bottom)",
                    borderColor: isSelected
                      ? statusColor
                      : "var(--color-appliance-control-panel-border)",
                    boxShadow: isSelected
                      ? "inset 0 1px 0 rgba(255,255,255,0.22)"
                      : "inset 0 1px 0 rgba(255,255,255,0.58)",
                  }}
                >
                  <span
                    className="block tabular-nums text-[1.3rem] uppercase tracking-[0.24em]"
                    style={{
                      color: isSelected
                        ? "var(--color-white)"
                        : "var(--color-primary)",
                    }}
                  >
                    {getDisplayValue(values[key])}
                  </span>
                  <span
                    className="mt-1 block text-[0.54rem] uppercase tracking-[0.28em]"
                    style={{
                      color: isSelected
                        ? "var(--color-white-shade)"
                        : "var(--color-appliance-label)",
                    }}
                  >
                    {shortLabel}
                  </span>
                  <span className="sr-only">{label}</span>
                </button>
              );
            })}
          </div>
        </ApplianceInsetPanel>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {keypadDigits.map((digit) => (
            <button
              key={digit}
              type="button"
              className="rounded-[1rem] border px-0 py-3 tabular-nums text-[1rem] uppercase tracking-[0.18em] text-[var(--color-primary)] transition active:translate-y-[1px]"
              onClick={() => onDigit(digit)}
              style={{
                background:
                  "linear-gradient(180deg, var(--color-appliance-control-button-top), var(--color-appliance-control-button-bottom))",
                borderColor: "var(--color-appliance-control-button-border)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
              }}
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            className="rounded-[1rem] border px-0 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-[var(--color-baloon1)] transition active:translate-y-[1px]"
            onClick={onBack}
            style={{
              background:
                "linear-gradient(180deg, var(--color-appliance-control-danger-top), var(--color-appliance-control-danger-bottom))",
              borderColor: "var(--color-appliance-control-danger-border)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
            }}
          >
            BKSP
          </button>
          <button
            type="button"
            className="rounded-[1rem] border px-0 py-3 tabular-nums text-[1rem] uppercase tracking-[0.18em] text-[var(--color-primary)] transition active:translate-y-[1px]"
            onClick={() => onDigit("0")}
            style={{
              background:
                "linear-gradient(180deg, var(--color-appliance-control-button-top), var(--color-appliance-control-button-bottom))",
              borderColor: "var(--color-appliance-control-button-border)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
            }}
          >
            0
          </button>
          <button
            type="button"
            className="rounded-[1rem] border px-0 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-[var(--color-white)] transition active:translate-y-[1px]"
            onClick={onSubmit}
            style={{
              background: statusColor,
              borderColor: statusColor,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
};

