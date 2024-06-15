import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { BaseEntity } from '@app/common/entities/base.entity';
import { Permission } from '@app/permissions/permission.entity';

@Entity()
export class Role extends BaseEntity {
  @Column({
    length: 50,
  })
  name: string;

  @Column({
    length: 50,
  })
  label: string;

  @Column({
    length: 255,
  })
  description: string;

  @ManyToMany(() => Permission, {
    createForeignKeyConstraints: false,
  })
  @JoinTable()
  permissions?: Permission[];
}
