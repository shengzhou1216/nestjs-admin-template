import { Controller } from '@nestjs/common';

import { BaseService } from '@app/core/service/base.service';

@Controller()
export class BaseController<T, ID> {
  constructor(protected readonly baseService: BaseService<T, ID>) {}
}
