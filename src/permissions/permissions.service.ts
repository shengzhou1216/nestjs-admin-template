import { Injectable, Logger, RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  ILike,
  ObjectLiteral,
  Repository,
} from 'typeorm';

import { Pagination } from '@app/common/pagination/pagination';
import { BaseService } from '@app/core/service/base.service';
import {
  PERMISSION_KEY,
  PermissionMetadata,
} from '@app/permissions/decorators/permission.decorator';
import { PaginatePermissionDto } from '@app/permissions/dto/paginate-permission.dto';
import { Permission } from '@app/permissions/permission.entity';
import { IPermissionsService } from '@app/permissions/permissions.service.interface';

@Injectable()
export class PermissionsService
  extends BaseService<Permission, bigint>
  implements IPermissionsService
{
  private readonly logger = new Logger(PermissionsService.name);

  constructor(
    @InjectRepository(Permission)
    protected readonly repository: Repository<Permission>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {
    super(repository);
  }

  async paginate(
    query: PaginatePermissionDto,
  ): Promise<Pagination<Permission>> {
    const { page, limit } = query;
    const where: ObjectLiteral = {};
    if (query.path) {
      where.path = ILike(`%${query.path}%`);
    }
    if (query.method) {
      where.method = query.method;
    }
    const [data, total] = await this.repository
      .createQueryBuilder()
      .where(where)
      .skip(query.skip)
      .take(query.take)
      .orderBy(query.sortsMap)
      .getManyAndCount();
    return new Pagination<Permission>(page, limit, total, data);
  }

  /**
   * 初始化系统权限
   *
   * 1. 扫描所有 @Permission 接口，获取所有的权限
   * 2. 将权限保存到数据库
   */
  async initSystemPermissions() {
    this.logger.log('Initializing system permissions...');
    // 1. 扫描所有的接口，获取所有的权限
    const controllers = this.discoveryService.getControllers();
    const scannedPermissions = controllers
      .map((wrapper) => {
        const { instance } = wrapper;
        const prefix = this.sanitizePath(
          this.reflector.get<string>(PATH_METADATA, instance.constructor),
        );
        const paths = this.scanForPathsWithPermission(instance);
        return paths.map((path) => ({
          method: path.method,
          path: this.joinPaths(prefix, path.path),
          name: path.permission?.name,
          description: path.permission?.description || path.permission?.name,
        }));
      })
      .flat();

    this.logger.log(
      `Scanned permission: ${JSON.stringify(scannedPermissions)}`,
    );
    // 2. 将权限保存到数据库
    const storedPermission = await this.repository.find();
    const updatedPermissions = [];
    const scannedPermissionPaths = new Set(
      scannedPermissions.map((p) => `${p.path}-${p.method}`),
    );
    // 遍历 scannedPermissions，更新或新增权限
    scannedPermissions.forEach((route) => {
      const existingPermission = storedPermission.find(
        (p) => p.path === route.path && p.method === route.method,
      );
      if (existingPermission) {
        updatedPermissions.push({ ...existingPermission, ...route });
      } else {
        updatedPermissions.push(route);
      }
    });
    const permissionsToDelete = storedPermission.filter(
      (p) => !scannedPermissionPaths.has(`${p.path}-${p.method}`),
    );
    try {
      await this.dataSource.transaction(
        async (transactionalEntityManager: EntityManager) => {
          await transactionalEntityManager
            .getRepository(Permission)
            .softRemove(permissionsToDelete);
          await transactionalEntityManager
            .getRepository(Permission)
            .save(updatedPermissions);
        },
      );
    } catch (e) {
      this.logger.error(
        `Failed to init system permissions. ${JSON.stringify(e)}`,
      );
    }
  }

  async findByIds(ids: bigint[]): Promise<Permission[]> {
    return this.repository.createQueryBuilder().whereInIds(ids).getMany();
  }

  /**
   * 扫描实例中的方法，获取带有Permission注解的的路径
   * @param instance
   * @private
   */
  private scanForPathsWithPermission(instance: any) {
    const prototype = Object.getPrototypeOf(instance);
    const methodsNames = Object.getOwnPropertyNames(prototype).filter(
      (method) =>
        method !== 'constructor' && typeof prototype[method] === 'function',
    );
    return methodsNames
      .filter((methodName) => {
        const methodRef = prototype[methodName];
        const permission = this.reflector.get<PermissionMetadata>(
          PERMISSION_KEY,
          methodRef,
        );
        return !!permission;
      })
      .map((methodName) => {
        const methodRef = prototype[methodName];
        const permission = this.reflector.get<Permission>(
          PERMISSION_KEY,
          methodRef,
        );
        const path = this.reflector.get<string>(PATH_METADATA, methodRef);
        const method = this.reflector.get<RequestMethod>(
          METHOD_METADATA,
          methodRef,
        );
        return {
          method: RequestMethod[method],
          path,
          permission,
        };
      })
      .filter((route) => route.path);
  }

  private sanitizePath(path: string): string {
    if (!path) {
      return '';
    }
    return path.replace(/^\/+|\/+$/g, ''); // 去除前后的 /
  }

  private joinPaths(prefix: string, path: string): string {
    const sanitizedPrefix = this.sanitizePath(prefix);
    const sanitizedPath = this.sanitizePath(path);
    if (sanitizedPath === '') {
      return `/${sanitizedPrefix}`;
    }
    return `/${sanitizedPrefix}/${sanitizedPath}`.replace(/\/+/g, '/'); // 确保中间只有一个 /
  }
}
