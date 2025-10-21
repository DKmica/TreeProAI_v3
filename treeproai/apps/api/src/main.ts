import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, RequestMethod } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json } from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(json({ limit: "10mb" }));

  // Global validation pipe (we still use Zod inside controllers/services)
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Global prefix for versioned API, excluding health endpoints
  app.setGlobalPrefix("v1", {
    exclude: [{ path: "healthz", method: RequestMethod.GET }, { path: "readyz", method: RequestMethod.GET }]
  });

  // OpenAPI
  const config = new DocumentBuilder()
    .setTitle("TreeProAI API")
    .setDescription("TreeProAI backend API")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.API_PORT ? Number(process.env.API_PORT) : 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port} (docs at /docs)`);
}
bootstrap();