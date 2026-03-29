import { useEffect } from "react";
import { applyDebugSeed } from "../utility/debugState";

export const E2EStateBootstrap = () => {
  useEffect(() => {
    window.__jcklE2EReady__ = false;

    const params = new URLSearchParams(window.location.search);
    const seed = params.get("e2e-seed");

    if (
      seed === "contact-ready" ||
      seed === "crt-ready" ||
      seed === "crt-incomplete" ||
      seed === "ending-return-ready" ||
      seed === "final-unlocked"
    ) {
      applyDebugSeed(seed);
    } else {
      applyDebugSeed("reset");
    }

    window.__jcklE2EReady__ = true;
  }, []);

  return null;
};
