import { Module } from '@nestjs/common';

import { PolicyService } from '@app/policy/policy.service';

@Module({
  imports: [],
  exports: [PolicyService],
  providers: [PolicyService],
})
export class PolicyModule {}
