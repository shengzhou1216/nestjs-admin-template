import { BaseEntity } from '@app/common/entities/base.entity';
import { Entity, Column, JoinTable, ManyToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '@app/roles/role.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true, length: 50 })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ length: 50 })
  @Exclude({ toPlainOnly: true })
  salt: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @ManyToMany(() => Role, {
    createForeignKeyConstraints: false,
  })
  @JoinTable()
  roles: Role[];
}
