import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Konfigurasi CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Ganti dengan URL Vue.js Anda
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Izinkan pengiriman cookie dan otorisasi header
  });

  await app.listen(3000);
}
bootstrap();
