import { IBaseService } from '@app/core/service/base.service.interface';
import { Role } from '@app/roles/role.entity';
import { PaginateRoleDto } from '@app/roles/dto/paginate-role.dto';
import { Pagination } from '@app/common/pagination/pagination';
import { SetRolePermissionsDto } from '@app/roles/dto/set-role-permissions.dto';
export interface IRolesService extends IBaseService<Role, bigint> {
  /**
   * paginate roles
   * @param query
   */
  paginate(query: PaginateRoleDto): Promise<Pagination<Role>>;

  /**
   * find role by name
   * @param ids
   */
  findByIds(ids: bigint[]): Promise<Role[]>;

  /**
   * set role permissions
   * @param roleId
   * @param setRolePermissionsDto SetRolePermissionsDto
   */
  setRolePermissions(
    roleId: bigint,
    setRolePermissionsDto: SetRolePermissionsDto,
  ): Promise<void>;
}
