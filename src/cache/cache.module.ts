import { CacheModule as CacheManagerModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { CacheService } from '@app/cache/cache.service';

@Module({
  imports: [CacheManagerModule.register()],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
