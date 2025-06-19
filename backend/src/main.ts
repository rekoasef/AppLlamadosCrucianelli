import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // --- CORRECCIÓN ---
  // Añadimos la opción { transform: true } para que el ValidationPipe
  // convierta automáticamente los datos a los tipos definidos en los DTOs.
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  await app.listen(3000);
}
bootstrap();
