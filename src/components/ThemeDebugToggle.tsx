import { useEffect, useState } from "react";
import { cycleDebugTheme, getCurrentThemeLabel } from "../utility/toggleTheme";

export const ThemeDebugToggle = () => {
  const [themeLabel, setThemeLabel] = useState("Original");

  useEffect(() => {
    const syncThemeLabel = () => {
      setThemeLabel(getCurrentThemeLabel());
    };

    syncThemeLabel();
    window.addEventListener("themechange", syncThemeLabel);

    return () => {
      window.removeEventListener("themechange", syncThemeLabel);
    };
  }, []);

  return (
    <button
      type="button"
      className="fixed bottom-4 left-4 z-[120] rounded-full border px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] transition hover:translate-y-[-1px] active:translate-y-0"
      onClick={() => {
        cycleDebugTheme();
      }}
      style={{
        backgroundColor: "var(--color-appliance-control-panel-top)",
        borderColor: "var(--color-appliance-panel-border)",
        color: "var(--color-primary)",
      }}
    >
      Theme: {themeLabel}
    </button>
  );
};
