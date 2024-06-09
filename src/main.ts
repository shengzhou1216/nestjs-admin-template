import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import SystemConfig from '@app/config/system.config';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  // config
  const configService = app.get(ConfigService);
  const systemConfig = configService.get<SystemConfig>('system');

  // logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // cors
  app.enableCors();

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Nestjs Admin Template API')
    .setDescription('The Nestjs Admin Template API description')
    .setVersion('1.0')
    .addTag('Template')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // helmet
  app.use(helmet());

  await app.listen(systemConfig.port);
  return systemConfig;
}

bootstrap().then((config: SystemConfig) => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
