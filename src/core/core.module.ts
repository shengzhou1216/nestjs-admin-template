import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BaseController } from '@app/common/controller/base.controller';
import { BaseEntity } from '@app/common/entities/base.entity';
import { BaseService } from '@app/core/service/base.service';

@Module({
  imports: [TypeOrmModule.forFeature([BaseEntity])],
  controllers: [BaseController],
  providers: [BaseService],
  exports: [BaseService],
})
export class CoreModule {}
