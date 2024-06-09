import { QueryPaginationOptionsDto } from '@app/common/dto/query-pagination-options.dto';
import { Allow } from 'class-validator';

/**
 * Query permission dto
 */
export class PaginatePermissionDto extends QueryPaginationOptionsDto {
  @Allow()
  method?: string;

  @Allow()
  path?: string;
}
