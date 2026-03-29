import { type CSSProperties, type ElementType, type ReactNode } from "react";

export const ApplianceInsetPanel = ({
  as,
  children,
  className = "",
  patternOpacity = 0,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  patternOpacity?: number;
}) => {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component
      className={`relative overflow-hidden rounded-[1.1rem] border ${className}`}
      style={
        {
          backgroundColor: "var(--color-appliance-control-surface)",
          borderColor: "var(--color-appliance-control-border)",
        } as CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: patternOpacity,
          backgroundImage: "var(--color-appliance-control-pattern)",
        }}
      />
      <div className="relative">{children}</div>
    </Component>
  );
};
