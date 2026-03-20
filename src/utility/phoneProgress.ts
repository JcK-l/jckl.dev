import { $offScriptCount } from "../stores/offScriptCountStore";
import { hasUnlockedAllEndings } from "../stores/endingStore";

export const hasUnlockedAllFlags = (): boolean => {
  return hasUnlockedAllEndings();
};

export const getStoredOffScriptCount = (): number => {
  return $offScriptCount.get();
};

export const incrementStoredOffScriptCount = (): number => {
  const nextCount = getStoredOffScriptCount() + 1;

  $offScriptCount.set(nextCount);

  return nextCount;
};
