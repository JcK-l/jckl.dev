const defaultFlags = [true, false, false, false];

const parseStoredJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const getStoredFlags = (): boolean[] => {
  const flags = parseStoredJson<boolean[]>("flags", defaultFlags);
  return Array.isArray(flags) ? flags : defaultFlags;
};

export const hasUnlockedAllFlags = (): boolean => {
  const flags = getStoredFlags();
  return flags.length > 0 && flags.every((flag) => flag === true);
};

export const getStoredOffScriptCount = (): number => {
  const value = parseStoredJson<number>("offScriptCount", 0);
  return typeof value === "number" ? value : 0;
};

export const incrementStoredOffScriptCount = (): number => {
  const nextCount = getStoredOffScriptCount() + 1;

  if (typeof window !== "undefined") {
    sessionStorage.setItem("offScriptCount", JSON.stringify(nextCount));
  }

  return nextCount;
};
