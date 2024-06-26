import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import type { Milliseconds } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set(key: string, value: any, ttl: Milliseconds = 0) {
    return this.cacheManager.set(key, value, ttl);
  }

  async get(key: string) {
    return this.cacheManager.get(key);
  }

  async del(key: string) {
    return this.cacheManager.del(key);
  }

  async reset() {
    return this.cacheManager.reset();
  }
}
