import { NestFactory } from '@nestjs/core';
// import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);

  // Konfigurasi CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Ganti dengan URL Vue.js Anda
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Izinkan pengiriman cookie dan otorisasi header
  });

  // process.env.TZ = configService.get<string>('TIMEZONE') || 'UTC';

  await app.listen(3000);
}
bootstrap();
