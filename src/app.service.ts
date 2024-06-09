import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PermissionsService } from '@app/permissions/permissions.service';

@Injectable()
export class AppService
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  private readonly logger = new Logger(AppService.name);

  constructor(readonly permissionsService: PermissionsService) {}

  async onApplicationBootstrap() {
    this.logger.log('AppService is starting...');
    await this.permissionsService.initSystemPermissions();
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log('AppService is stopping...', signal);
  }
}
