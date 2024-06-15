import { Controller, Get } from '@nestjs/common';

import { AppService } from '@app/app.service';
import { Public } from '@app/auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/health')
  health() {
    return 'ok';
  }
}
