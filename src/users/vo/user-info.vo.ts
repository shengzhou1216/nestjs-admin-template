import { Permission } from '@app/permissions/permission.entity';
import { Role } from '@app/roles/role.entity';

export class UserInfoVo {
  id: bigint;
  username: string;
  email?: string;
  createdAt: Date;
  roles: Role[];
  permissions: Permission[];
}
