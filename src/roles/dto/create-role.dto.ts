import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * CreateRoleDto
 */
export class CreateRoleDto {
  /**
   * The name of the role
   * @example admin
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
  /**
   * The label of the role
   * @example Administrator
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  label: string;
  /**
   * The description of the role
   * @example This is the administrator role
   */
  @IsString()
  @MaxLength(255)
  description?: string;
}
