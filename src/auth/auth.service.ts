import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToInstance } from 'class-transformer';

import { LoginDto } from '@app/auth/dto/login.dto';
import { RegisterDto } from '@app/auth/dto/register.dto';
import { SaltUtil } from '@app/common/utils/salt.util';
import JwtConfig from '@app/config/jwt.config';
import { User } from '@app/users/user.entity';
import { UsersService } from '@app/users/users.service';
import { UserInfoVo } from '@app/users/vo/user-info.vo';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user
   * @param registerDto RegisterDto
   * @throws ConflictException
   */
  async register(registerDto: RegisterDto) {
    return await this.usersService.create(plainToInstance(User, registerDto));
  }

  /**
   * Login user
   * @throws NotFoundException
   * @param loginDto LoginDto
   */
  // async login(loginDto: LoginDto) {
  //   const { username, password } = loginDto;
  //   const user = await this.usersService.findByUsername(username);
  //   if (!user || !SaltUtil.verifyPassword(password, user.salt, user.password)) {
  //     throw new UnauthorizedException('Invalid username or password');
  //   }
  //   return this.sign({ username: user.username, sub: user.id });
  // }
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new NotFoundException('用户不存在或密码错误');
    }
    return user;
  }

  /**
   * sign jwt token
   * @param payload
   */
  sign(payload: UserInfoVo) {
    const config = this.configService.get<JwtConfig>('jwt');
    const access_token = this.jwtService.sign(instanceToPlain(payload), {
      secret: config.secret,
      expiresIn: config.accessExpiresIn,
    });
    return { access_token };
  }

  /**
   * Validate user
   * @param username
   * @param password
   * @returns User
   */
  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user || !SaltUtil.verifyPassword(password, user.salt, user.password)) {
      return null;
    }
    return user;
  }
}
