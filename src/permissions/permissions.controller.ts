import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@app/common/controller/base.controller';
import { Permission as PermissionDecorator } from '@app/permissions/decorators/permission.decorator';
import { PaginatePermissionDto } from '@app/permissions/dto/paginate-permission.dto';
import { PermissionsService } from '@app/permissions/permissions.service';

@ApiTags('Permission')
@Controller('permissions')
export class PermissionsController extends BaseController {
  constructor(private readonly service: PermissionsService) {
    super();
  }

  @Get()
  @PermissionDecorator({ name: '获取权限列表' })
  async paginate(@Query() query: PaginatePermissionDto) {
    return this.service.paginate(query);
  }
}
