import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';
import { CacheModule } from '@app/cache/cache.module';
import JwtConfig from '@app/config/jwt.config';
import { UsersModule } from '@app/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<JwtConfig>('jwt').secret,
        signOptions: {
          expiresIn: configService.get<JwtConfig>('jwt').accessExpiresIn,
        },
      }),
    }),
    PassportModule,
    CacheModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
