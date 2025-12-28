export class PaymentGateway {
  async processPayment(amount: number, method: 'credit' | 'pix') {
    return { transactionId: '123', status: 'approved' };
  }

  async refund(transactionId: string) {
    return { status: 'refunded' };
  }
}

export const paymentGateway = new PaymentGateway();
