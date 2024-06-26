import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';

import { PermissionsService } from '@app/permissions/permissions.service';
import { PolicyService } from '@app/policy/policy.service';
import { UsersService } from '@app/users/users.service';

@Injectable()
export class AppService
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
    private readonly policyService: PolicyService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('App is starting...');
    await this.usersService.initAdmin();
    await this.permissionsService.initSystemPermissions();
    await this.policyService.init();
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log('App is stopping...', signal);
  }
}
