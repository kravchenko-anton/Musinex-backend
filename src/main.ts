import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma.service";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: false });
  app.enableCors({
    credentials: true,
    origin: true
  });
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(7777);
}

bootstrap();
