import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appService = app.get(AppService);
  await appService.seed();
  await app.listen(3333);

  app.useGlobalPipes(new ValidationPipe());
}
bootstrap();
