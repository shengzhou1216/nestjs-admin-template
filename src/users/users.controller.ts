import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { BaseController } from '@app/common/controller/base.controller';
import { Permission } from '@app/permissions/decorators/permission.decorator';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { PaginateUserDto } from '@app/users/dto/paginate-user.dto';
import { SetUserRolesDto } from '@app/users/dto/set-user-roles.dto';
import { User } from '@app/users/user.entity';
import { UsersService } from '@app/users/users.service';

/**
 * Users controller
 */
@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController<User, bigint> {
  constructor(readonly service: UsersService) {
    super(service);
  }

  /**
   * @param createUserDto CreateUserDto
   */
  @Permission({ name: '创建用户' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.service.create(plainToInstance(User, createUserDto));
  }

  /**
   * @param query
   */
  @Permission({ name: '分页获取用户' })
  @Get()
  async paginate(@Query() query: PaginateUserDto) {
    return this.service.paginate(query);
  }

  /**
   * @param id
   */
  @Permission({ name: '根据ID获取用户' })
  @Get(':id')
  async getById(@Param('id') id: bigint) {
    const user = await this.service.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * @param id
   */
  @Permission({ name: '根据ID删除用户' })
  @Delete(':id')
  async deleteById(@Param('id') id: bigint) {
    await this.service.deleteById(id);
  }

  /**
   * @param id
   * @param setUserRolesDto
   */
  @Permission({ name: '根据ID设置用户的角色' })
  @Put(':id/roles')
  async setRoles(
    @Param('id') id: bigint,
    @Body() setUserRolesDto: SetUserRolesDto,
  ) {
    await this.service.setUserRoles(id, setUserRolesDto);
  }

  /**
   * @param id
   */
  @Permission({ name: '根据ID获取用户的信息' })
  @Get(':id/info')
  async getInfo(@Param('id') id: bigint) {
    return this.service.getUserInfoById(id);
  }
}
