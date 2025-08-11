import { unstable_cache } from 'next/cache';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(cleanupIntervalMs: number = 60000) {
    // Run cleanup every minute by default
    this.startCleanup(cleanupIntervalMs);
  }

  private startCleanup(intervalMs: number) {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, intervalMs) as any;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const data = this.get(key);
    return data !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }

  getEntries(): Array<[string, any]> {
    const entries: Array<[string, any]> = [];
    for (const [key, entry] of this.cache.entries()) {
      entries.push([key, entry.data]);
    }
    return entries;
  }
}

// Create singleton instance
export const memoryCache = new MemoryCache();

// Cache key generators
export const cacheKeys = {
  publicCollaborators: (page: number = 1, limit: number = 10) => 
    `collaborators:public:${page}:${limit}`,
  
  publicInnovators: (page: number = 1, limit: number = 10) => 
    `innovators:public:${page}:${limit}`,
  
  newsArticles: (page: number = 1, limit: number = 10) => 
    `news:articles:${page}:${limit}`,
  
  adminStats: () => 'admin:stats',
  
  userPermissions: (userId: string) => `user:permissions:${userId}`,
};

// Cache TTL values (in seconds)
export const cacheTTL = {
  public: 300, // 5 minutes for public data
  admin: 60, // 1 minute for admin data
  user: 120, // 2 minutes for user-specific data
  static: 3600, // 1 hour for static content
};

// Helper function for cached queries
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = cacheTTL.public
): Promise<T> {
  // Check cache first
  const cached = memoryCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Execute query
  const result = await queryFn();
  
  // Store in cache
  memoryCache.set(key, result, ttl);
  
  return result;
}

// Invalidation helpers
export const cacheInvalidation = {
  invalidateCollaborators() {
    // Clear all collaborator-related cache entries
    const entries = memoryCache.getEntries();
    for (const [key] of entries) {
      if (key.startsWith('collaborators:')) {
        memoryCache.delete(key);
      }
    }
  },

  invalidateInnovators() {
    // Clear all innovator-related cache entries
    const entries = memoryCache.getEntries();
    for (const [key] of entries) {
      if (key.startsWith('innovators:')) {
        memoryCache.delete(key);
      }
    }
  },

  invalidateNews() {
    // Clear all news-related cache entries
    const entries = memoryCache.getEntries();
    for (const [key] of entries) {
      if (key.startsWith('news:')) {
        memoryCache.delete(key);
      }
    }
  },

  invalidateAdminStats() {
    memoryCache.delete(cacheKeys.adminStats());
  },

  invalidateUser(userId: string) {
    memoryCache.delete(cacheKeys.userPermissions(userId));
  },
};

// Next.js unstable_cache wrapper for server components
export const getCachedNews = unstable_cache(
  async () => {
    const { db } = await import('@/lib/db');
    return db.news.findMany({
      where: { Active: true },
      orderBy: { createdAt: 'desc' },
    });
  },
  ['all-news'],
  { tags: ['news'], revalidate: 3600 }
);
