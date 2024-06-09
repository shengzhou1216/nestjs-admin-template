import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from '@app/core/service/base.service';
import { User } from '@app/users/user.entity';
import { IUserService } from './users.service.interface';
import { ILike, ObjectLiteral, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateUserDto } from '@app/users/dto/paginate-user.dto';
import { Pagination } from '@app/common/pagination/pagination';
import { RolesService } from '@app/roles/roles.service';
import { SaltUtil } from '@app/common/utils/salt.util';
import { SetUserRolesDto } from '@app/users/dto/set-user-roles.dto';
import { UserInfoVo } from '@app/users/vo/user-info.vo';
import { Permission } from '@app/permissions/permission.entity';
import { query } from 'express';
import { Role } from '@app/roles/role.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService
  extends BaseService<User, bigint>
  implements IUserService
{
  constructor(
    @InjectRepository(User) readonly repository: Repository<User>,
    readonly roleService: RolesService,
  ) {
    super(repository);
  }

  async create(user: User): Promise<User> {
    const { username, email, password } = user;
    const userByName = await this.findByUsername(username);
    if (userByName) {
      throw new ConflictException('Username already exists');
    }
    const userByEmail = await this.findByEmail(email);
    if (userByEmail) {
      throw new ConflictException('Email already exists');
    }
    user.salt = SaltUtil.generateSalt();
    user.password = SaltUtil.hashPassword(password, user.salt);
    return this.repository.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({
      where: { username },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  async paginate(query: PaginateUserDto): Promise<Pagination<User>> {
    const { page, limit } = query;
    const where: ObjectLiteral = {};
    if (query.username) {
      where.username = ILike(`%${query.username}%`);
    }
    if (query.email) {
      where.email = ILike(`%${query.email}%`);
    }
    const [data, total] = await this.repository
      .createQueryBuilder()
      .where(where)
      .skip(query.skip)
      .take(query.take)
      .orderBy(query.sortsMap)
      .getManyAndCount();
    return new Pagination<User>(page, limit, total, data);
  }

  async setUserRoles(
    userId: bigint,
    setUserRolesDto: SetUserRolesDto,
  ): Promise<void> {
    const { roleIds } = setUserRolesDto;
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // 检查角色是否都存在
    const roles = await this.roleService.findByIds(roleIds);
    if (roles.length !== roleIds.length) {
      throw new BadRequestException('Some roles do not exist');
    }
    user.roles = roles;
    await this.repository.save(user);
  }

  async getUserInfoById(id: bigint): Promise<UserInfoVo> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const [roles, permissions] = await this.getUserRolePermissionsById(id);
    const userInfoVo = new UserInfoVo();
    userInfoVo.roles = roles;
    userInfoVo.permissions = permissions;
    userInfoVo.id = user.id;
    userInfoVo.username = user.username;
    userInfoVo.email = user.email;
    userInfoVo.createdAt = user.createdAt;
    return userInfoVo;
  }

  async getUserRolePermissionsById(
    id: bigint,
  ): Promise<[Role[], Permission[]]> {
    const user = await this.repository
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'role')
      .leftJoin('role.permissions', 'permission')
      .select('user.id')
      .addSelect(['role.id', 'role.name', 'role.label'])
      .addSelect(['permission.path', 'permission.method', 'permission.name'])
      .where({ id })
      .getOne();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const roles = user.roles;
    const permissions = roles.flatMap((role: Role) => role.permissions);
    const uniquePermissionIds = new Set(permissions.map((p) => p.id));
    const uniquePermissions = Array.from(uniquePermissionIds).map(
      (id) => permissions.find((p) => p.id === id) as Permission,
    );
    return Promise.resolve([roles, uniquePermissions]);
  }
}
