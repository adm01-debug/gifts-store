export class ShippingService {
  async calculateShipping(zipcode: string, weight: number) {
    return {
      correios: { price: 25.00, days: 5 },
      sedex: { price: 45.00, days: 2 }
    };
  }
}

export const shippingService = new ShippingService();
