import { IsArray } from 'class-validator';

/**
 * Data transfer object for setting role permissions
 */
export class SetRolePermissionsDto {
  @IsArray()
  permissionIds: bigint[];
}
