import { Pagination } from '@app/common/pagination/pagination';
import { IBaseService } from '@app/core/service/base.service.interface';
import { Permission } from '@app/permissions/permission.entity';
import { Role } from '@app/roles/role.entity';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { PaginateUserDto } from '@app/users/dto/paginate-user.dto';
import { SetUserRolesDto } from '@app/users/dto/set-user-roles.dto';
import { User } from '@app/users/user.entity';
import { UserInfoVo } from '@app/users/vo/user-info.vo';

export interface IUserService extends IBaseService<User> {
  /**
   * find user by username
   * @param username string
   */
  findByUsername(username: string): Promise<User | null>;

  /**
   * find user by email
   * @param email string
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * paginate users
   * @param query QueryUserDto
   */
  paginate(query: PaginateUserDto): Promise<Pagination<User>>;

  /**
   * set user roles
   * @param userId bigint
   * @param setUserRolesDto SetUserRolesDto
   */
  setUserRoles(userId: bigint, setUserRolesDto: SetUserRolesDto): Promise<void>;

  /**
   * find user by ids
   * @param id bigint
   */
  getUserInfoById(id: bigint): Promise<UserInfoVo>;

  /**
   * find user roles and permissions by id
   * @param id
   */
  getUserRolePermissionsById(id: bigint): Promise<[Role[], Permission[]]>;
}
