export interface SAPOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  items: SAPOrderItem[];
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface SAPOrderItem {
  productId: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SyncResult {
  success: boolean;
  sapOrderId?: string;
  error?: string;
}

export const syncOrderToSAP = async (order: SAPOrder): Promise<SyncResult> => {
  try {
    const response = await fetch('/api/sap/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });

    if (!response.ok) {
      throw new Error(`SAP sync failed: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, sapOrderId: result.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
