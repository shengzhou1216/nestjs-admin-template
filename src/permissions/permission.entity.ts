import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '@app/common/entities/base.entity';

/**
 * Permission entity
 */
@Entity()
@Index(['path', 'method'], { unique: true })
export class Permission extends BaseEntity {
  @Column({ comment: '路径' })
  path: string;

  @Column({ length: 100, comment: '方法' })
  method: string;

  @Column({ length: 100, comment: '权限名称' })
  name: string;

  @Column({ nullable: true, length: 255, comment: '描述' })
  description?: string;
}
