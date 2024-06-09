import { IsArray } from 'class-validator';

/**
 * Data transfer object for setting roles to a user.
 */
export class SetUserRolesDto {
  @IsArray()
  roleIds: bigint[];
}
