import { Allow } from 'class-validator';

import { QueryPaginationOptionsDto } from '@app/common/dto/query-pagination-options.dto';

/**
 * Query permission dto
 */
export class PaginatePermissionDto extends QueryPaginationOptionsDto {
  @Allow()
  method?: string;

  @Allow()
  path?: string;
}
