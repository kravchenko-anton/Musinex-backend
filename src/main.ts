import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: false });
  app.enableCors({
    credentials: true,
    origin: true
  });
  await app.use(helmet());
  await app.setGlobalPrefix("api");
  await app.listen(7777);
}

bootstrap();
