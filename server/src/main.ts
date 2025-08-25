import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(passport.initialize());
   app.useGlobalPipes(new ValidationPipe(
      {
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      }
  ));
  await app.listen(5000);
}
bootstrap();
