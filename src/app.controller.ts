import { Controller, Get } from '@nestjs/common';

import { AppService } from '@app/app.service';
import { Public } from '@app/auth/decorators/public.decorator';
import { ApiOperation } from '@nestjs/swagger';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/health')
  @ApiOperation({ summary: 'Health check' })
  health() {
    return 'ok';
  }
}
