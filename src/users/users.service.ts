import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, ObjectLiteral, Repository } from 'typeorm';

import { Constants } from '@app/common/constants/constants';
import { Pagination } from '@app/common/pagination/pagination';
import { RandUtil } from '@app/common/utils/rand.util';
import { SaltUtil } from '@app/common/utils/salt.util';
import { BaseService } from '@app/core/service/base.service';
import { Permission } from '@app/permissions/permission.entity';
import { PolicyService } from '@app/policy/policy.service';
import { Role } from '@app/roles/role.entity';
import { RolesService } from '@app/roles/roles.service';
import { PaginateUserDto } from '@app/users/dto/paginate-user.dto';
import { SetUserRolesDto } from '@app/users/dto/set-user-roles.dto';
import { User } from '@app/users/user.entity';
import { IUserService } from '@app/users/users.service.interface';
import { UserInfoVo } from '@app/users/vo/user-info.vo';
import { ConfigService } from '@nestjs/config';
import SystemConfig from '@app/config/system.config';

@Injectable()
export class UsersService
  extends BaseService<User>
  implements IUserService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) protected readonly repository: Repository<User>,
    private readonly roleService: RolesService,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly policyService: PolicyService,
    private readonly configService: ConfigService,
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
    await this.policyService.addRolesForUser(userId, ...roleIds);
  }

  async getUserInfoById(id: bigint): Promise<UserInfoVo> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const [roles, permissions] = await this.getUserRolePermissionsById(id);
    return new UserInfoVo({
      roles,
      permissions,
      ...user,
    });
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
    const permissions = user.roles.flatMap((role: Role) => role.permissions);
    const roles = user.roles.map((role: Role) => {
      delete role.permissions;
      return role;
    });
    const uniquePermissionIds = new Set(
      permissions.map((p) => {
        return `${p.method}-${p.path}`;
      }),
    );
    const uniquePermissions = Array.from(uniquePermissionIds).map(
      (identifier) =>
        permissions.find(
          (p) => `${p.method}-${p.path}` === identifier,
        ) as Permission,
    );
    return Promise.resolve([roles, uniquePermissions]);
  }

  async initAdmin() {
    try {
      await this.dataSource.transaction(async (manager) => {
        let adminRole = await manager.getRepository(Role).findOneBy({
          label: Constants.ADMIN_ROLE_LABEL,
        });
        if (!adminRole) {
          adminRole = await manager.getRepository(Role).save({
            name: 'Admin',
            label: Constants.ADMIN_ROLE_LABEL,
            description: 'Admin role with all permissions',
          });
        }
        const exists = await manager
          .getRepository(User)
          .createQueryBuilder('user')
          .innerJoin('user.roles', 'role', 'role.label = :label', {
            label: Constants.ADMIN_ROLE_LABEL,
          })
          .getExists();
        if (exists) {
          return;
        }
        const initAdmin = this.configService.get<SystemConfig['initAdmin']>('system.initAdmin');
        let admin = await manager.getRepository(User).findOneBy({
          username: initAdmin.username,
        });
        if (!admin) {
          const salt = SaltUtil.generateSalt();
          const password = SaltUtil.hashPassword(initAdmin.password, salt);
          admin = await manager.getRepository(User).save({
            username: initAdmin.username,
            password,
            salt,
            email: `${initAdmin.username}@nat.com`,
          } as User);
          this.logger.log(`Admin ${initAdmin.username} created!`);
        }
        admin.roles = [adminRole];
        await manager.getRepository(User).save(admin);
      });
    } catch (e) {
      this.logger.error(`Init admin failed. ${e.stack}`);
    }
  }
}
