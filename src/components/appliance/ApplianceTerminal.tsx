import { type ReactNode } from "react";

export const ApplianceTerminal = ({
  children,
  className = "",
  bodyClassName = "",
  headerLabel,
  headerMeta,
}: {
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  headerLabel?: string;
  headerMeta?: string;
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.05rem] border px-4 py-4 ${className}`}
      style={{
        backgroundColor: "var(--color-appliance-screen-bg)",
        borderColor: "var(--color-appliance-screen-border)",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.03), 0 0.35rem 0.6rem rgba(29,53,87,0.08)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{ backgroundImage: "var(--color-appliance-screen-pattern)" }}
      />
      {headerLabel || headerMeta ? (
        <div
          className="relative mb-4 flex items-center justify-between gap-3 border-b pb-3 font-appliance"
          style={{ borderColor: "var(--color-appliance-screen-border)" }}
        >
          {headerLabel ? (
            <p
              className="text-[0.55rem] uppercase tracking-[0.24em]"
              style={{ color: "var(--color-appliance-screen-muted)" }}
            >
              {headerLabel}
            </p>
          ) : (
            <span />
          )}
          {headerMeta ? (
            <p
              className="text-[0.55rem] tracking-[0.1em]"
              style={{ color: "var(--color-appliance-screen-muted)" }}
            >
              {headerMeta}
            </p>
          ) : null}
        </div>
      ) : null}
      <div
        className={`relative font-appliance tabular-nums ${bodyClassName}`}
        style={{ color: "var(--color-appliance-screen-text)" }}
      >
        {children}
      </div>
    </div>
  );
};
