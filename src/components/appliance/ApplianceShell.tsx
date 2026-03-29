import { type CSSProperties, type ReactNode } from "react";

export const ApplianceShell = ({
  children,
  className = "",
  radius = "1.45rem",
  showHighlight = false,
  style,
}: {
  children: ReactNode;
  className?: string;
  radius?: string;
  showHighlight?: boolean;
  style?: CSSProperties;
}) => {
  const shellStyle = {
    "--appliance-shell-radius": radius,
    backgroundColor: "var(--color-appliance-shell-surface)",
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
      <div className="relative h-full">{children}</div>
    </div>
  );
};
