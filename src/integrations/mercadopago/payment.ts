declare global {
  interface Window {
    MercadoPago: new (publicKey: string) => MercadoPagoInstance;
  }
}

interface MercadoPagoInstance {
  checkout: (options: CheckoutOptions) => void;
}

interface CheckoutOptions {
  preference: { id: string };
  autoOpen?: boolean;
}

export interface PaymentItem {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
  currencyId?: string;
}

export interface PreferenceResponse {
  id: string;
  initPoint: string;
  sandboxInitPoint?: string;
}

export const initMercadoPago = (): MercadoPagoInstance | null => {
  const key = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
  if (!key || typeof window === 'undefined' || !window.MercadoPago) {
    return null;
  }
  return new window.MercadoPago(key);
};

export const createPreference = async (items: PaymentItem[]): Promise<PreferenceResponse> => {
  const response = await fetch('/api/mercadopago/preference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });

  if (!response.ok) {
    throw new Error('Failed to create payment preference');
  }

  return response.json();
};
