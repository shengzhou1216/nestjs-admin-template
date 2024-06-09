import { IsOptional } from 'class-validator';

export class BaseQueryDto {
  @IsOptional()
  sort?: string = 'created_at:desc';

  get filters(): Record<string, any> {
    return Object.entries(this)
      .filter(([, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => {
        if (['sort'].includes(key)) {
          return acc;
        }
        acc[key] = value;
        return acc;
      }, {});
  }

  get sorts(): [string, 'ASC' | 'DESC'][] {
    const sorts = this.sort.split(';');
    return sorts
      .map((sort) => sort.trim())
      .filter((sort) => sort.length > 0)
      .map((sort) => {
        const [column, order] = sort.split(':');
        return [column, order.toUpperCase()] as [string, 'ASC' | 'DESC'];
      });
  }

  get sortsMap(): Record<string, 'ASC' | 'DESC'> {
    return this.sorts.reduce((acc, [column, order]) => {
      acc[column] = order;
      return acc;
    }, {});
  }
}
