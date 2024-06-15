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

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(plainToInstance(Role, createRoleDto));
  }

  @Get()
  async paginate(@Query() query: PaginateRoleDto) {
    return this.rolesService.paginate(query);
  }

  @Get(':id')
  async findById(@Param('id') id: bigint) {
    return this.rolesService.findById(id);
  }

  @Put(':id')
  async updateById(
    @Param('id') id: bigint,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    await this.rolesService.updateById(id, updateRoleDto);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: bigint) {
    await this.rolesService.deleteById(id);
  }

  @Put(':id/permissions')
  async setPermissions(
    @Param('id') id: bigint,
    @Body() setRolePermissionsDto: SetRolePermissionsDto,
  ) {
    await this.rolesService.setRolePermissions(id, setRolePermissionsDto);
  }
}
