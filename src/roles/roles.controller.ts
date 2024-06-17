import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { BaseController } from '@app/common/controller/base.controller';
import { Permission } from '@app/permissions/decorators/permission.decorator';
import { PaginateRoleDto } from '@app/roles/dto/paginate-role.dto';
import { SetRolePermissionsDto } from '@app/roles/dto/set-role-permissions.dto';
import { Role } from '@app/roles/role.entity';
import { RolesService } from '@app/roles/roles.service';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
@ApiTags('roles')
export class RolesController extends BaseController<Role, bigint> {
  constructor(readonly rolesService: RolesService) {
    super(rolesService);
  }

  @Permission({ name: '创建角色' })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(plainToInstance(Role, createRoleDto));
  }

  @Permission({ name: '分页获取角色' })
  @Get()
  async paginate(@Query() query: PaginateRoleDto) {
    return this.rolesService.paginate(query);
  }

  @Permission({ name: '根据ID获取角色' })
  @Get(':id')
  async findById(@Param('id') id: bigint) {
    return this.rolesService.findById(id);
  }

  @Permission({ name: '根据ID更新角色' })
  @Put(':id')
  async updateById(
    @Param('id') id: bigint,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    await this.rolesService.updateById(id, updateRoleDto);
  }

  @Permission({ name: '根据ID删除角色' })
  @Delete(':id')
  async deleteById(@Param('id') id: bigint) {
    await this.rolesService.deleteById(id);
  }

  @Permission({ name: '根据ID设置角色权限' })
  @Put(':id/permissions')
  async setPermissions(
    @Param('id') id: bigint,
    @Body() setRolePermissionsDto: SetRolePermissionsDto,
  ) {
    await this.rolesService.setRolePermissions(id, setRolePermissionsDto);
  }
}
