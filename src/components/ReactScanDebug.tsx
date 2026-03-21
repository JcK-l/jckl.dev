import { useEffect } from "react";

declare global {
  interface Window {
    __jcklReactScanStarted__?: boolean;
  }
}

const shouldEnableReactScan = () => {
  if (typeof window === "undefined" || !import.meta.env.DEV) {
    return false;
  }

  const searchParams = new URLSearchParams(window.location.search);

  return (
    searchParams.has("react-scan") ||
    import.meta.env.PUBLIC_ENABLE_REACT_SCAN === "true"
  );
};

export const ReactScanDebug = () => {
  useEffect(() => {
    if (!shouldEnableReactScan() || window.__jcklReactScanStarted__) {
      return;
    }

    let isCancelled = false;
    window.__jcklReactScanStarted__ = true;

    const startReactScan = async () => {
      try {
        const { scan } = await import("react-scan");

        if (isCancelled) {
          return;
        }

        scan({
          enabled: true,
          showToolbar: true,
          trackUnnecessaryRenders: true,
          _debug: "verbose",
        });
      } catch (error) {
        console.error("Failed to start react-scan", error);
        window.__jcklReactScanStarted__ = false;
      }
    };

    void startReactScan();

    return () => {
      isCancelled = true;
    };
  }, []);

  return null;
};
