import { QueryPaginationOptionsDto } from '@app/common/dto/query-pagination-options.dto';
import { Allow } from 'class-validator';

/**
 * QueryRoleDto
 */
export class PaginateRoleDto extends QueryPaginationOptionsDto {
  @Allow()
  name?: string;

  @Allow()
  label?: string;
}
