import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import { CustomValidationPipeException } from '@common/exception/custom.exception';
import { HttpResponseInterceptor } from '@common/interceptors/http.res.inteceptor';
import { AllExceptionsFilter } from '@common/exception/all.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('PORT', 4000);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (e) => {
      throw new CustomValidationPipeException(e)
    }
  }));
  app.useGlobalFilters(new AllExceptionsFilter());
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
