import {
  TIMER_FIELDS,
  getDisplayValue,
  type TimerFieldKey,
  type TimerStatusMode,
  type TimerValues,
} from "../../utility/phoneTimer";

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
      <div
        className="pointer-events-none absolute right-3 top-3 h-[5.25rem] w-[2.4rem] rounded-full opacity-55"
        style={{ backgroundImage: "var(--color-appliance-control-vent)" }}
      />
      <div className="relative lg:pl-1">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p
              className="font-mono text-[0.56rem] uppercase tracking-[0.32em]"
              style={{ color: "var(--color-appliance-label)" }}
            >
              phone microwave
            </p>
            <p className="font-mono text-[0.72rem] tracking-[0.08em] text-[var(--color-primary)]">
              timer setting
            </p>
          </div>
          <span
            className="rounded-full border px-2.5 py-1 font-mono text-[0.54rem] uppercase tracking-[0.2em]"
            style={statusStyles}
          >
            {statusLabel}
          </span>
        </div>
        <div
          className="rounded-[1.25rem] border p-3"
          style={{
            background:
              "linear-gradient(180deg, var(--color-appliance-control-panel-top), var(--color-appliance-control-panel-bottom))",
            borderColor: "var(--color-appliance-control-panel-border)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -0.85rem 1.15rem rgba(94,84,142,0.08), 0 0.9rem 1.4rem rgba(35,25,66,0.1)",
          }}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p
              className="font-mono text-[0.54rem] uppercase tracking-[0.28em]"
              style={{ color: "var(--color-appliance-label)" }}
            >
              time setting
            </p>
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: statusColor,
                boxShadow: `0 0 16px ${statusColor}`,
              }}
            />
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
                      ? `inset 0 1px 0 rgba(255,255,255,0.28), 0 0.7rem 1.1rem ${statusColor}33`
                      : "inset 0 1px 0 rgba(255,255,255,0.92), 0 0.55rem 0.9rem rgba(35,25,66,0.08)",
                  }}
                >
                  <span
                    className="block font-mono text-[1.3rem] uppercase tracking-[0.24em]"
                    style={{
                      color: isSelected ? "var(--color-white)" : "var(--color-primary)",
                    }}
                  >
                    {getDisplayValue(values[key])}
                  </span>
                  <span
                    className="mt-1 block font-mono text-[0.54rem] uppercase tracking-[0.28em]"
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
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {keypadDigits.map((digit) => (
            <button
              key={digit}
              type="button"
              className="rounded-[1rem] border px-0 py-3 font-mono text-[1rem] uppercase tracking-[0.18em] text-[var(--color-primary)] transition active:translate-y-[1px]"
              onClick={() => onDigit(digit)}
              style={{
                background:
                  "linear-gradient(180deg, var(--color-appliance-control-button-top), var(--color-appliance-control-button-bottom))",
                borderColor: "var(--color-appliance-control-button-border)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.92), 0 0.55rem 0.9rem rgba(35,25,66,0.08)",
              }}
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            className="rounded-[1rem] border px-0 py-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--color-baloon1)] transition active:translate-y-[1px]"
            onClick={onBack}
            style={{
              background:
                "linear-gradient(180deg, var(--color-appliance-control-danger-top), var(--color-appliance-control-danger-bottom))",
              borderColor: "var(--color-appliance-control-danger-border)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.85), 0 0.55rem 0.9rem rgba(172,57,49,0.14)",
            }}
          >
            BKSP
          </button>
          <button
            type="button"
            className="rounded-[1rem] border px-0 py-3 font-mono text-[1rem] uppercase tracking-[0.18em] text-[var(--color-primary)] transition active:translate-y-[1px]"
            onClick={() => onDigit("0")}
            style={{
              background:
                "linear-gradient(180deg, var(--color-appliance-control-button-top), var(--color-appliance-control-button-bottom))",
              borderColor: "var(--color-appliance-control-button-border)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.92), 0 0.55rem 0.9rem rgba(35,25,66,0.08)",
            }}
          >
            0
          </button>
          <button
            type="button"
            className="rounded-[1rem] border px-0 py-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--color-white)] transition active:translate-y-[1px]"
            onClick={onSubmit}
            style={{
              background: statusColor,
              borderColor: statusColor,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 0.7rem 1.1rem ${statusColor}3d`,
            }}
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
};

