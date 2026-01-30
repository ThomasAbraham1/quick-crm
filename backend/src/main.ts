
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    console.log('Backend starting...');
    await app.listen(3000);
    console.log('Backend is running on http://localhost:3000');
}
bootstrap();
