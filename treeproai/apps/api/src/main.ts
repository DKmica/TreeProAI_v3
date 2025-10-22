import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json, Request as ExpressRequest } from "express";

interface RequestWithRawBody extends ExpressRequest {
  rawBody: Buffer;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(json({
    limit: "10mb",
    verify: (req: RequestWithRawBody, res, buf) => {
      if (req.originalUrl.startsWith('/v1/webhooks/stripe')) {
        req.rawBody = buf;
      }
    },
  }));

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle("TreeProAI API")
    .setDescription("Backend API for TreeProAI")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
  console.log(`API Docs available at http://localhost:${port}/docs`);
}
bootstrap();