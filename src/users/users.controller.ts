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
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
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
export class UsersController extends BaseController {
  constructor(private readonly service: UsersService) {
    super();
  }

  @Permission({ name: 'Create user' })
  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.service.create(plainToInstance(User, createUserDto));
  }

  @Permission({ name: 'Paginate users' })
  @Get()
  @ApiOperation({ summary: 'Paginate users' })
  async paginate(@Query() query: PaginateUserDto) {
    return this.service.paginate(query);
  }


  @Permission({ name: 'Get user by id' })
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  async getById(@Param('id') id: bigint) {
    const user = await this.service.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }


  @Permission({ name: 'Delete user by id' })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  async deleteById(@Param('id') id: bigint) {
    await this.service.deleteById(id);
  }

  @Permission({ name: 'Set user roles by id' })
  @Put(':id/roles')
  @ApiOperation({ summary: 'Set user roles by id' })
  async setRoles(
    @Param('id') id: bigint,
    @Body() setUserRolesDto: SetUserRolesDto,
  ) {
    await this.service.setUserRoles(id, setUserRolesDto);
  }


  @Permission({ name: 'Get user info by id' })
  @Get(':id/info')
  @ApiOperation({ summary: 'Get user info by id' })
  async getInfo(@Param('id') id: bigint) {
    return this.service.getUserInfoById(id);
  }
}
