export const persistState = (key: string, state: any) => {
  localStorage.setItem(key, JSON.stringify(state));
};
