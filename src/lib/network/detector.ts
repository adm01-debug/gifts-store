export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const onConnectionChange = (callback: (online: boolean) => void) => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
};

export const checkNetworkSpeed = async (): Promise<'slow' | 'fast'> => {
  const connection = (navigator as any).connection;
  if (connection?.effectiveType) {
    return ['slow-2g', '2g', '3g'].includes(connection.effectiveType) ? 'slow' : 'fast';
  }
  return 'fast';
};
