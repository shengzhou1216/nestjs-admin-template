import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '@app/common/entities/base.entity';

/**
 * Permission entity
 */
@Entity()
@Index(['path', 'method'], { unique: true })
export class Permission extends BaseEntity {
  @Column({ comment: 'request path' })
  path: string;

  @Column({ length: 100, comment: 'request method' })
  method: string;

  @Column({ length: 100, comment: 'permission name' })
  name: string;

  @Column({ nullable: true, length: 255, comment: 'permission description' })
  description?: string;
}
