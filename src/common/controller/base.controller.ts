import { BaseService } from '@app/core/service/base.service';
import { Controller } from '@nestjs/common';

@Controller()
export class BaseController<T, ID> {
  constructor(protected readonly baseService: BaseService<T, ID>) {}
}
