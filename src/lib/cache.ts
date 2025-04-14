type CacheEntry = {
  data: any;
  expiresAt: number;
};

class MemoryCache {
  private store = new Map<string, CacheEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(cleanupIntervalMs = 60000) {
    this.cleanupInterval = setInterval(
      () => this.cleanupExpired(),
      cleanupIntervalMs
    );
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  async set(
    key: string,
    value: any,
    ttlSeconds: number
  ): Promise<void> {
    this.store.set(key, {
      data: value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt <= now) {
        this.store.delete(key);
      }
    }
  }
}

// Singleton instance
const cache = new MemoryCache();

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = 3600
): Promise<T> {
  const cached = await cache.get<T>(key);
  if (cached) return cached;
  
  const data = await fetchFn();
  await cache.set(key, data, ttl);
  return data;
}

export async function invalidateCache(keys: string | string[]): Promise<void> {
  if (Array.isArray(keys)) {
    await Promise.all(keys.map(key => cache.delete(key)));
  } else {
    await cache.delete(keys);
  }
}