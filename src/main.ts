import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
//import * as csurf from 'csurf';

async function bootstrap() {
  console.log('================================');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', '..', '..', 'uploads'));
  console.log('++++++++++++++++++++++++++++++++');

  const appService = app.get(AppService);
  await appService.seed();

  const config = new DocumentBuilder()
    .setTitle('Zaza')
    .setDescription('This for Bassam because he is not in her sister')
    .setVersion('1.0')
    .addTag('by Qusai')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  // app.use(csurf());
  //  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(process.env.PORT || 3333);
}
bootstrap();
