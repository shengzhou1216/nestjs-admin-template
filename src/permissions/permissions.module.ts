import { Module } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission } from '@app/permissions/permission.entity';
import { PermissionsController } from '@app/permissions/permissions.controller';
import { PermissionsService } from '@app/permissions/permissions.service';

@Module({
  controllers: [PermissionsController],
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionsService, DiscoveryService, Reflector],
  exports: [PermissionsService],
})
export class PermissionsModule {}
