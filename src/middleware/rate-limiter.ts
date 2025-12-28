import { RateLimiterMemory } from 'rate-limiter-flexible';

export class APIGateway {
  private limiters = {
    api: new RateLimiterMemory({ points: 100, duration: 60 }),
    auth: new RateLimiterMemory({ points: 5, duration: 60 }),
    export: new RateLimiterMemory({ points: 10, duration: 3600 })
  };

  async checkLimit(key: string, type: 'api' | 'auth' | 'export'): Promise<boolean> {
    try {
      await this.limiters[type].consume(key);
      return true;
    } catch {
      throw new Error('Rate limit exceeded');
    }
  }
}

export const apiGateway = new APIGateway();
