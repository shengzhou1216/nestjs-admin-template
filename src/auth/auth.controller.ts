import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '@app/auth/auth.service';
import { Public } from '@app/auth/decorators/public.decorator';
import { LoginDto } from '@app/auth/dto/login.dto';
import { RegisterDto } from '@app/auth/dto/register.dto';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@app/auth/guards/local-auth.guard';
import { User } from '@app/users/user.entity';

/**
 * Auth controller
 */
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(readonly service: AuthService) {}

  /**
   * Register a new user
   * @param registerDto
   */
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    await this.service.register(registerDto);
  }

  /**
   * Login
   * @param loginDto
   * @param req
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request & { user: User },
  ) {
    // fixme: 也可以不使用 Local strategy，自己处理登录逻辑，而是直接调用 service.login
    return this.service.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: Request & { user: User }) {
    return req.user;
  }
}
