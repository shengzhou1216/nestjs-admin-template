import { Module } from '@nestjs/common';
import { PermissionsService } from '@app/permissions/permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '@app/permissions/permission.entity';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PermissionsController } from '@app/permissions/permissions.controller';

@Module({
  controllers: [PermissionsController],
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionsService, DiscoveryService, Reflector],
  exports: [PermissionsService],
})
export class PermissionsModule {}
