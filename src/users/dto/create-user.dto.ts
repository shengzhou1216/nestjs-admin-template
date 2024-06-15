import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { IsEqual } from '@app/common/validator/decorators/equal.decorator';

/**
 * Create User DTO
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Password too weak',
  })
  password: string;

  /**
   * Confirm password
   */
  @IsEqual('password')
  rePassword: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
