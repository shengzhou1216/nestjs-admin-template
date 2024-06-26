import { Permission } from '@app/permissions/permission.entity';
import { Role } from '@app/roles/role.entity';
import { User } from '@app/users/user.entity';

export class UserInfoVo extends User {
  roles: Role[];
  permissions: Permission[];

  constructor(init?: Partial<UserInfoVo>) {
    super();
    Object.assign(this, init);
  }
}
