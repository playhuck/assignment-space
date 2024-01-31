import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import { CustomValidationPipeException } from '@common/exception/custom.exception';
import { HttpResponseInterceptor } from '@common/interceptors/http.res.inteceptor';
import { AllExceptionsFilter } from '@common/exception/all.exception.filter';

import { TNODE_ENV } from '@models/types/t.node.env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('PORT', 3000);
  const stage: TNODE_ENV = config.get('STAGE')!;

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (e) => {
      throw new CustomValidationPipeException(e)
    }
  }));

  app.useGlobalFilters(new AllExceptionsFilter(stage))
  app.useGlobalInterceptors(new HttpResponseInterceptor());

  app.enableCors({
    origin: '*',
    exposedHeaders: ['Authorization']
  });

  app.setGlobalPrefix('/api');

  await app.listen(port, () =>
    console.log(`\nServer is running on ${port}`)
  );

}
bootstrap();
