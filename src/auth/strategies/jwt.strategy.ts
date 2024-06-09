import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '@app/auth/auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import JwtConfig from '@app/config/jwt.config';
import { AuthPayloadInterface } from '@app/auth/interfaces/auth-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<JwtConfig>('jwt').secret,
    });
  }

  async validate(payload: AuthPayloadInterface) {
    const { id, username } = payload;
    return { uid: id, username };
  }
}
