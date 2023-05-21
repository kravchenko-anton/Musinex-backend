import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { PrismaService } from './prisma.service'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: false })
	app.enableCors({
		credentials: true,
		origin: true
	})
	const prismaService = app.get(PrismaService)
	await prismaService.enableShutdownHooks(app)
	const config = new DocumentBuilder()
		.setTitle('Musinex API')
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('swagger', app, document)
	await app.listen(7777)
}

bootstrap()
