import { QueryPaginationOptionsDto } from '@app/common/dto/query-pagination-options.dto';
import { Allow } from 'class-validator';
/**
 * Query user dto
 */
export class PaginateUserDto extends QueryPaginationOptionsDto {
  /**
   * username
   */
  @Allow()
  username?: string;

  /**
   * email
   */
  @Allow()
  email?: string;
}
