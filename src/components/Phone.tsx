import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $sentimentState } from "../stores/sentimentStateStore";
import { $gameState, GameStateFlags } from "../stores/gameStateStore";
import { hasUnlockedAllFlags } from "../utility/phoneProgress";
import { NumberPhone } from "./NumberPhone";
import { TimerPhone } from "./TimerPhone";

export const Phone = () => {
  const sentimentState = useStore($sentimentState);
  const gameState = useStore($gameState);
  const [isFinal, setIsFinal] = useState(false);

  useEffect(() => {
    setIsFinal(hasUnlockedAllFlags());
  }, [sentimentState]);

  const shouldShowNumberPhone =
    isFinal && (gameState & (1 << GameStateFlags.FLAG_CONNECTION)) !== 0;

  return shouldShowNumberPhone ? <NumberPhone /> : <TimerPhone />;
};
