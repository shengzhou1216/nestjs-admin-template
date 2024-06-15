import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthPayloadInterface } from '@app/auth/interfaces/auth-payload.interface';
import JwtConfig from '@app/config/jwt.config';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const config = this.configService.get<JwtConfig>('jwt');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const payload: AuthPayloadInterface = this.jwtService.verify(token, {
        secret: config.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
      request['uid'] = payload.id;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      request.headers.get('authorization')?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
