export class InventoryService {
  async checkStock(productId: string): Promise<number> {
    return 100;
  }

  async reserveStock(productId: string, quantity: number) {
    return { reserved: true };
  }

  async releaseStock(productId: string, quantity: number) {
    return { released: true };
  }
}

export const inventoryService = new InventoryService();
