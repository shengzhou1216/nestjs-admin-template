import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Base entity class that contains common fields for all response.
 */
export class BaseEntity {
  /**
   * Unique identifier for the entity.
   */
  @PrimaryGeneratedColumn('increment')
  id: bigint;

  /**
   * Date when the entity was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Date when the entity was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Date when the entity was deleted.
   */
  @DeleteDateColumn()
  deletedAt: Date;
}
