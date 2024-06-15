import { IsEmail, IsNotEmpty, Matches, MaxLength } from 'class-validator';

import { IsEqual } from '@app/common/validator/decorators/equal.decorator';

/**
 * Register dto
 */
export class RegisterDto {
  /**
   * username
   */
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  /**
   * password
   */
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter and one number',
  })
  password: string;

  /**
   * Confirm password
   */
  @IsEqual('password')
  rePassword: string;

  /**
   * email
   */
  @IsEmail()
  email: string;
}
