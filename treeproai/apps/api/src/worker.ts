import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { QueuesModule } from "./queues/queues.module";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(QueuesModule);
  console.log("Worker process started.");
  // The app will run indefinitely.
}

bootstrap();