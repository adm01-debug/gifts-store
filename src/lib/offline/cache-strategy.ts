export const cacheStrategies = {
  cacheFirst: async (request: Request): Promise<Response> => {
    const cache = await caches.open('app-cache');
    const cached = await cache.match(request);
    return cached || fetch(request);
  },
  networkFirst: async (request: Request): Promise<Response> => {
    try {
      const response = await fetch(request);
      const cache = await caches.open('app-cache');
      cache.put(request, response.clone());
      return response;
    } catch {
      return (await caches.match(request))!;
    }
  }
};
