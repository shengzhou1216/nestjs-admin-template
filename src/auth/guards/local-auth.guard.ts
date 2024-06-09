import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Local auth guard
 *
 * 采用本地策略进行身份验证
 *
 * 使用方法： @UseGuards(LocalAuthGuard) 装饰器来保护路由
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
