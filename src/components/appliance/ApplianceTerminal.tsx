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
          className="relative mb-3.5 flex flex-col gap-2 border-b pb-3 font-appliance sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--color-appliance-screen-border)" }}
        >
          {headerLabel ? (
            <p
              className="min-w-0 text-[0.56rem] uppercase leading-4 tracking-[0.24em]"
              style={{ color: "var(--color-appliance-screen-muted)" }}
            >
              {headerLabel}
            </p>
          ) : (
            <span />
          )}
          {headerMeta ? (
            <p
              className="break-words text-[0.56rem] leading-4 tracking-[0.12em] sm:text-right"
              style={{ color: "var(--color-appliance-screen-muted)" }}
            >
              {headerMeta}
            </p>
          ) : null}
        </div>
      ) : null}
      <div
        className={`relative font-appliance tabular-nums leading-6 ${bodyClassName}`}
        style={{ color: "var(--color-appliance-screen-text)" }}
      >
        {children}
      </div>
    </div>
  );
};
