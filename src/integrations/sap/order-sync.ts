export const syncOrderToSAP = async (order: any) => {
  await fetch('/api/sap/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
};
