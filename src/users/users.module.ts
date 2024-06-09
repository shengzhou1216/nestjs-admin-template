import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/users/user.entity';
import { UsersController } from '@app/users/users.controller';
import { RolesModule } from '@app/roles/roles.module';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
