export const persistState = <T>(key: string, state: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error(`Failed to persist state for key "${key}":`, error);
  }
};

export const loadState = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
};

export const clearState = (key: string): void => {
  localStorage.removeItem(key);
};
