// Redis cache service - Browser-compatible version using Map
// In production, connect to Redis via Edge Function

interface CacheItem<T> {
  value: T;
  expires: number;
}

export class CacheService {
  private cache = new Map<string, CacheItem<unknown>>();
  private defaultTTL = 3600;

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key) as CacheItem<T> | undefined;
    if (!item) return null;
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const expires = Date.now() + ((ttl || this.defaultTTL) * 1000);
    this.cache.set(key, { value, expires });
  }

  async invalidate(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  async flush(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
}

export const cache = new CacheService();
