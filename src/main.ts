import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule,DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Banking-System')
  .setDescription('This is a Banking System api Documentation')
  .setVersion('1.0')
  .addTag('Bank')
  .build()

  const documnetFactory = ()=> SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,documnetFactory)

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
