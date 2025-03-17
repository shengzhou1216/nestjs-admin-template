import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';


@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set(key: string, value: any, ttl = 0) {
    return this.cacheManager.set(key, value, ttl);
  }

  async get(key: string) {
    return this.cacheManager.get(key);
  }

  async del(key: string) {
    return this.cacheManager.del(key);
  }

  async clear() {
    return this.cacheManager.clear();
  }
}
