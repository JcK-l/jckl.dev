import { type CSSProperties, type ReactNode } from "react";

export const ApplianceShell = ({
  children,
  className = "",
  radius = "1.45rem",
  showHighlight = false,
  style,
  ventClassName = "right-4 top-4 h-3 w-20",
}: {
  children: ReactNode;
  className?: string;
  radius?: string;
  showHighlight?: boolean;
  style?: CSSProperties;
  ventClassName?: string | null;
}) => {
  const shellStyle = {
    "--appliance-shell-radius": radius,
    background:
      "linear-gradient(180deg, var(--color-appliance-shell-top) 0%, var(--color-appliance-shell-bottom) 100%)",
    borderColor: "var(--color-appliance-shell-border)",
    ...style,
  } as CSSProperties;

  return (
    <div
      className={`relative overflow-hidden rounded-[var(--appliance-shell-radius)] border ${className}`}
      style={shellStyle}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "var(--color-appliance-shell-pattern)" }}
      />
      {showHighlight ? (
        <div
          className="pointer-events-none absolute inset-[1px] rounded-[calc(var(--appliance-shell-radius)-1px)] border"
          style={{ borderColor: "var(--color-appliance-panel-highlight)" }}
        />
      ) : null}
      {ventClassName ? (
        <div
          className={`pointer-events-none absolute ${ventClassName} rounded-full opacity-50`}
          style={{ backgroundImage: "var(--color-appliance-shell-vent)" }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
};
