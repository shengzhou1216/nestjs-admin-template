/**
 * Pagination class
 */
export class Pagination<T> {
  page: number;
  limit: number;
  total: number;
  data?: T[];
  constructor(page?: number, limit?: number, total?: number, data?: any[]) {
    this.page = page || 1;
    this.limit = limit || 10;
    this.total = total || 0;
    this.data = data;
  }

  setPage(page: number): Pagination<T> {
    this.page = page;
    return this;
  }

  setLimit(limit: number): Pagination<T> {
    this.limit = limit;
    return this;
  }

  setTotal(total: number): Pagination<T> {
    this.total = total;
    return this;
  }

  setData(data: T[]): Pagination<T> {
    this.data = data;
    return this;
  }
}
