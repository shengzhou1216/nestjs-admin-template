import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { log } from 'winston';

import { AuthService } from '@app/auth/auth.service';
import { Public } from '@app/auth/decorators/public.decorator';
import { LoginDto } from '@app/auth/dto/login.dto';
import { RegisterDto } from '@app/auth/dto/register.dto';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { CacheService } from '@app/cache/cache.service';
import { CacheUtil } from '@app/cache/cache.util';
import { User } from '@app/users/user.entity';
import { UsersService } from '@app/users/users.service';

/**
 * Auth controller
 */
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly usersService: UsersService,
    private readonly cacheService: CacheService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register' })
  async register(@Body() registerDto: RegisterDto) {
    await this.service.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.service.login(loginDto);
    const info = await this.usersService.getUserInfoById(user.id);
    await this.cacheService.set(CacheUtil.getUserCacheKey(user.id), info);
    return this.service.sign(info);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get profile' })
  async getProfile(@Request() req: Request & { user: User }) {
    return req.user;
  }
}
