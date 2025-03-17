import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';

import { IS_PUBLIC_KEY } from '@app/auth/decorators/public.decorator';
import { PolicyService } from '@app/policy/policy.service';
import { UserInfoVo } from '@app/users/vo/user-info.vo';

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(
    private readonly policyService: PolicyService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { path, method } = request;
    const userInfo = plainToInstance(UserInfoVo, request.user);
    try {
      if (userInfo.isAdmin()) {
        return true;
      }
      if (
        await this.policyService.hasPermissionForUser(userInfo.id, path, method)
      ) {
        return true;
      }
    } catch (e) {
      this.logger.error(e.stack);
    }
    throw new ForbiddenException('No permission to access');
  }
}
