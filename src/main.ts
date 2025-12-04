import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { checkNodeVersion } from './check-node-version';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';

dotenv.config();

const loadSwaggerDocument = () => {
  const yamlPath = path.join(process.cwd(), 'doc', 'api.yaml');

  try {
    const yamlContent = fs.readFileSync(yamlPath, 'utf8');
    return yaml.load(yamlContent) as any;
  } catch (error) {
    console.error(`Error loading Swagger document from ${yamlPath}:`, error);
    throw error;
  }
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const port = process.env.PORT || 4000;
  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;

  const swaggerDocument = loadSwaggerDocument();

  if (swaggerDocument.servers && swaggerDocument.servers.length > 0) {
    swaggerDocument.servers[0].url = baseUrl;
  } else {
    swaggerDocument.servers = [{ url: baseUrl }];
  }

  SwaggerModule.setup('docs', app, swaggerDocument);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(port);
}
checkNodeVersion();
bootstrap();
