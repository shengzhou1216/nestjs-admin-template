import { Allow } from 'class-validator';

import { QueryPaginationOptionsDto } from '@app/common/dto/query-pagination-options.dto';

/**
 * QueryRoleDto
 */
export class PaginateRoleDto extends QueryPaginationOptionsDto {
  @Allow()
  name?: string;

  @Allow()
  label?: string;
}
