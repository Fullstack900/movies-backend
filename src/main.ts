import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import configureSwagger from './config/swagger.config';
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const protocol = req.protocol;
  const host = req.get('host') || 'localhost';
  const url = req.originalUrl;
  const method = req.method;
  const date = new Date().toDateString();

  console.log(`${protocol}://${host}${url}   ${method}   ${date}`);
  next();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = app.get(ConfigService);

  // app.enableCors({ origin: config.get<string>('app.frontendHostUrl') });

  app.use(loggerMiddleware)

  if (config.get<boolean>('app.enableSwagger')) {
    configureSwagger(app, config);
  }

  await app.listen(config.get<number>('app.port', 3001));
}
bootstrap();
