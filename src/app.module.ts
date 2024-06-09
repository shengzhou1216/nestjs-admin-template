import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { CommonModule } from './common/common.module';
import { CoreModule } from './core/core.module';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { validationSchema } from '@app/config/configuration';
import DbConfig from '@app/config/db.config';
import { ResponseInterceptor } from '@app/core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '@app/core/filters/http-exception.filter';
import { AllExceptionsFilter } from '@app/core/filters/all-exceptions.filter';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { PermissionsModule } from '@app/permissions/permissions.module';
import { HealthModule } from './health/health.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import SystemConfig from '@app/config/system.config';
import LoggerConfig from '@app/config/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const pid = process.pid;
        const systemConfig = configService.get<SystemConfig>('system');
        const loggerConfig = configService.get<LoggerConfig>('logger');
        return {
          level: 'verbose',
          format: winston.format.combine(
            winston.format.timestamp({
              format: loggerConfig.format || 'YYYY/MM/DD HH:mm:ss',
            }),
            winston.format.ms(),
            winston.format.colorize(),
            winston.format.label({
              label: `[${systemConfig.name}]`,
            }),
            winston.format.printf(
              ({ label, level, message, timestamp, ms, context }) => {
                return `${label} ${pid} - ${timestamp} ${level} [${context}] ${message} ${ms}`;
              },
            ),
          ),
          transports: [
            new winston.transports.Console({
              level: 'verbose',
            }),
            new winston.transports.File({
              level: loggerConfig.level || 'info',
              filename: loggerConfig.file || 'logs/combined.log',
            }),
          ],
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<DbConfig>('db').postgres;
        return {
          type: 'postgres',
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          database: config.database,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // Don't use this in production, otherwise you can lose data
          logging: true,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
    }),
    CoreModule,
    RolesModule,
    CommonModule,
    AuthModule,
    UsersModule,
    ConfigModule,
    PermissionsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
