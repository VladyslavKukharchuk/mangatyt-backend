import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from '@common/exceptions';
import { RequestInterceptor } from '@common/interceptors/request.iterceptor';
import { ValidationConfig } from '@common/config';
import swagger from '@src/swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  swagger(app);
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new RequestInterceptor());
  app.useGlobalPipes(new ValidationPipe(new ValidationConfig()));

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
