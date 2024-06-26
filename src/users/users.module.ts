import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PolicyModule } from '@app/policy/policy.module';
import { RolesModule } from '@app/roles/roles.module';
import { User } from '@app/users/user.entity';
import { UsersController } from '@app/users/users.controller';

import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User]), RolesModule, PolicyModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
