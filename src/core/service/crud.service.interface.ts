import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface ICrudService<T> {
  /**
   * Create entity. Return created entity
   * @param entity Entity
   */
  create(entity: T): Promise<T>;

  /**
   * Find all response
   * @returns Promise<T[] | null>
   */
  findAll(): Promise<T[] | null>;

  /**
   * Find entity by id
   * @param id Entity id
   * @returns Promise<T | null>
   */
  findById(id: string | number): Promise<T | null>;

  /**
   * Update entity by id
   * @param id Entity id
   * @param data Data to update
   * @returns Promise<void>
   */
  updateById(id: string | number, data: QueryDeepPartialEntity<T>): Promise<void>;

  /**
   * Delete entity by id
   *
   * If entity is not found, not throw exception
   * @param id Entity id
   * @returns Promise<void>
   */
  deleteById(id: string | number): Promise<void>;

  /**
   * Save or update entity
   * @param entity Entity
   * @returns Promise<T>
   */
  saveOrUpdate(entity: T): Promise<T>;
}
