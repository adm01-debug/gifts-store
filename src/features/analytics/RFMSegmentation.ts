export interface Customer {
  id: string;
  lastPurchaseDate?: Date | string;
  purchaseCount?: number;
  totalSpent?: number;
}

export interface RFMCustomer extends Customer {
  recency: number;
  frequency: number;
  monetary: number;
  segment: RFMSegment;
}

export type RFMSegment =
  | 'champion'
  | 'loyal'
  | 'potential'
  | 'new'
  | 'promising'
  | 'needs_attention'
  | 'about_to_sleep'
  | 'at_risk'
  | 'hibernating'
  | 'lost';

export function calculateRFM(customers: Customer[]): RFMCustomer[] {
  return customers.map(customer => ({
    ...customer,
    recency: calculateRecency(customer),
    frequency: calculateFrequency(customer),
    monetary: calculateMonetary(customer),
    segment: determineSegment(customer)
  }));
}

function calculateRecency(customer: Customer): number {
  if (!customer.lastPurchaseDate) return 0;
  const lastDate = new Date(customer.lastPurchaseDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, 100 - diffDays);
}

function calculateFrequency(customer: Customer): number {
  return customer.purchaseCount || 0;
}

function calculateMonetary(customer: Customer): number {
  return customer.totalSpent || 0;
}

function determineSegment(customer: Customer): RFMSegment {
  const recency = calculateRecency(customer);
  const frequency = calculateFrequency(customer);
  const monetary = calculateMonetary(customer);

  if (recency > 80 && frequency > 10 && monetary > 1000) return 'champion';
  if (recency > 60 && frequency > 5) return 'loyal';
  if (recency > 70 && frequency <= 2) return 'new';
  if (recency > 50 && frequency > 3) return 'potential';
  if (recency > 40 && frequency > 2) return 'promising';
  if (recency > 30 && recency <= 50) return 'needs_attention';
  if (recency > 20 && recency <= 30) return 'about_to_sleep';
  if (recency > 10 && recency <= 20) return 'at_risk';
  if (recency > 0 && recency <= 10) return 'hibernating';
  return 'lost';
}
