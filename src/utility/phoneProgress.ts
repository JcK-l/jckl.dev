import { $offScriptCount } from "../stores/offScriptCountStore";

export const getStoredOffScriptCount = (): number => {
  return $offScriptCount.get();
};
