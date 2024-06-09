import { Module } from '@nestjs/common';
import { BaseEntity } from '@app/common/entities/base.entity';
import { BaseService } from '@app/core/service/base.service';
import { BaseController } from '@app/common/controller/base.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BaseEntity])],
  controllers: [BaseController],
  providers: [BaseService],
  exports: [BaseService],
})
export class CoreModule {}
