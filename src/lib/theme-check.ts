export function checkDarkModeContrast() {
  const isDark = document.documentElement.classList.contains('dark');
  return isDark;
}
