import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(graphqlUploadExpress());
  await app.listen(3001);
  console.log(`🚀 Auth Service running at http://localhost:3001/graphql`);
}
bootstrap();
