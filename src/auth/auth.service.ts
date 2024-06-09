import { Injectable } from '@nestjs/common';
import { UsersService } from '@app/users/users.service';
import { SaltUtil } from '@app/common/utils/salt.util';
import { RegisterDto } from '@app/auth/dto/register.dto';
import { User } from '@app/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadInterface } from '@app/auth/interfaces/auth-payload.interface';
import { ConfigService } from '@nestjs/config';
import JwtConfig from '@app/config/jwt.config';
import { plainToInstance } from 'class-transformer';

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
   * @throws UnauthorizedException
   * @param user
   */
  // async login(loginDto: LoginDto) {
  //   const { username, password } = loginDto;
  //   const user = await this.usersService.findByUsername(username);
  //   if (!user || !SaltUtil.verifyPassword(password, user.salt, user.password)) {
  //     throw new UnauthorizedException('Invalid username or password');
  //   }
  //   return this.sign({ username: user.username, sub: user.id });
  // }
  async login(user: User) {
    return this.sign({ username: user.username, id: user.id });
  }

  /**
   * sign jwt token
   * @param payload
   */
  sign(payload: AuthPayloadInterface) {
    const config = this.configService.get<JwtConfig>('jwt');
    const access_token = this.jwtService.sign(payload, {
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
