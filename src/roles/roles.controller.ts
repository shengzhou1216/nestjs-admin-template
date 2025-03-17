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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
export class RolesController extends BaseController {
  constructor(private readonly rolesService: RolesService) {
    super();
  }

  @Permission({ name: 'Create role' })
  @Post()
  @ApiOperation({ summary: 'Create role' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(plainToInstance(Role, createRoleDto));
  }

  @Permission({ name: 'Paginate roles' })
  @Get()
  @ApiOperation({ summary: 'Paginate roles' })
  async paginate(@Query() query: PaginateRoleDto) {
    return this.rolesService.paginate(query);
  }

  @Permission({ name: 'Get role by id' })
  @Get(':id')
  @ApiOperation({ summary: 'Get role by id' })
  async findById(@Param('id') id: bigint) {
    return this.rolesService.findById(id);
  }

  @Permission({ name: 'Update role by id' })
  @Put(':id')
  @ApiOperation({ summary: 'Update role by id' })
  async updateById(
    @Param('id') id: bigint,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    await this.rolesService.updateById(id, updateRoleDto);
  }

  @Permission({ name: 'Delete role by id' })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete role by id' })
  async deleteById(@Param('id') id: bigint) {
    await this.rolesService.deleteById(id);
  }

  @Permission({ name: 'Set role permissions by id' })
  @Put(':id/permissions')
  @ApiOperation({ summary: 'Set role permissions by id' })
  async setPermissions(
    @Param('id') id: bigint,
    @Body() setRolePermissionsDto: SetRolePermissionsDto,
  ) {
    await this.rolesService.setRolePermissions(id, setRolePermissionsDto);
  }
}
