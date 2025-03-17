import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, ObjectLiteral, Repository } from 'typeorm';

import { Pagination } from '@app/common/pagination/pagination';
import { BaseService } from '@app/core/service/base.service';
import { PermissionsService } from '@app/permissions/permissions.service';
import { PaginateRoleDto } from '@app/roles/dto/paginate-role.dto';
import { SetRolePermissionsDto } from '@app/roles/dto/set-role-permissions.dto';
import { Role } from '@app/roles/role.entity';
import { IRolesService } from '@app/roles/roles.service.interface';

@Injectable()
export class RolesService
  extends BaseService<Role>
  implements IRolesService
{
  constructor(
    @InjectRepository(Role)
    protected readonly repository: Repository<Role>,
    private readonly permissionService: PermissionsService,
  ) {
    super(repository);
  }

  async paginate(query: PaginateRoleDto): Promise<Pagination<Role>> {
    const where: ObjectLiteral = {};
    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }
    if (query.label) {
      where.label = ILike(`%${query.label}%`);
    }
    const [data, total] = await this.repository
      .createQueryBuilder()
      .where(where)
      .skip(query.skip)
      .limit(query.take)
      .orderBy(query.sortsMap)
      .getManyAndCount();
    return new Pagination<Role>(query.page, query.limit, total, data);
  }

  async findByIds(ids: bigint[]): Promise<Role[]> {
    return this.repository.createQueryBuilder().whereInIds(ids).getMany();
  }

  async setRolePermissions(
    roleId: bigint,
    setRolePermissionsDto: SetRolePermissionsDto,
  ): Promise<void> {
    const role = await this.findById(roleId);
    const { permissionIds } = setRolePermissionsDto;
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    // check if permissions exist
    const permissions = await this.permissionService.findByIds(permissionIds);
    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('Some permissions not found');
    }
    role.permissions = permissions;
    await this.repository.save(role);
  }
}
