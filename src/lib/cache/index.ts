export {{ CacheService, cache }} from './redis';

export const cacheKeys = {{
  products: (filters?: any) => `products:${{JSON.stringify(filters || {{}})}}`,
  product: (id: string) => `product:${{id}}`,
  quotes: (filters?: any) => `quotes:${{JSON.stringify(filters || {{}})}}`,
  quote: (id: string) => `quote:${{id}}`,
}};
