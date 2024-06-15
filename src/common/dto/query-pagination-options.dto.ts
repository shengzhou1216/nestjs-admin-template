import { Allow } from 'class-validator';

import { BaseQueryDto } from '@app/common/dto/base-query.dto';

/**
 * QueryPageOptionsDto
 */
export class QueryPaginationOptionsDto extends BaseQueryDto {
  @Allow()
  page?: number = 1;

  @Allow()
  limit?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  get take(): number {
    return this.limit;
  }

  /**
   * query fields
   */
  get filters(): Record<string, any> {
    return Object.entries(this)
      .filter(([, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => {
        if (['page', 'limit', 'sort'].includes(key)) {
          return acc;
        }
        acc[key] = value;
        return acc;
      }, {});
  }
}
