import Redis from 'ioredis';

export class CacheService {{
  private redis: Redis;
  private defaultTTL = 3600;

  constructor() {{
    this.redis = new Redis(process.env.VITE_REDIS_URL || 'redis://localhost:6379');
  }}

  async get<T>(key: string): Promise<T | null> {{
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }}

  async set(key: string, value: any, ttl?: number): Promise<void> {{
    await this.redis.setex(key, ttl || this.defaultTTL, JSON.stringify(value));
  }}

  async invalidate(pattern: string): Promise<void> {{
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) await this.redis.del(...keys);
  }}

  async flush(): Promise<void> {{
    await this.redis.flushall();
  }}
}}

export const cache = new CacheService();
