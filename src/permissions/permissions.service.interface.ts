import { Permission } from '@app/permissions/permission.entity';
import { IBaseService } from '@app/core/service/base.service.interface';
import { PaginatePermissionDto } from '@app/permissions/dto/paginate-permission.dto';
import { Pagination } from '@app/common/pagination/pagination';

/**
 * Permissions service interface
 */
export interface IPermissionsService extends IBaseService<Permission, bigint> {
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
