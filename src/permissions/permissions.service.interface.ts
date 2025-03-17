import { Pagination } from '@app/common/pagination/pagination';
import { IBaseService } from '@app/core/service/base.service.interface';
import { PaginatePermissionDto } from '@app/permissions/dto/paginate-permission.dto';
import { Permission } from '@app/permissions/permission.entity';

/**
 * Permissions service interface
 */
export interface IPermissionsService extends IBaseService<Permission> {
  /**
   * paginate permission
   * @param query PaginatePermissionDto
   */
  paginate(query: PaginatePermissionDto): Promise<Pagination<Permission>>;

  /**
   * find permission by ids
   * @param ids
   */
  findByIds(ids: bigint[]): Promise<Permission[]>;
}
