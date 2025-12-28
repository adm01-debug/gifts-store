export const initMercadoPago = () => {
  const mp = new window.MercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);
  return mp;
};

export const createPreference = async (items: any[]) => {
  const response = await fetch('/api/mercadopago/preference', {
    method: 'POST',
    body: JSON.stringify({ items })
  });
  return response.json();
};
