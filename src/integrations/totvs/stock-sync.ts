export const syncStockFromTOTVS = async () => {
  const response = await fetch('/api/totvs/stock');
  return response.json();
};
