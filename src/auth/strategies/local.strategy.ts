import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '@app/auth/auth.service';

/**
 * Local strategy
 *
 * 通过用户名和密码验证用户。如果验证失败则抛出 UnauthorizedException，否则会将用户对象添加到请求对象中
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new NotFoundException('用户不存在或密码错误');
    }
    return user;
  }
}
