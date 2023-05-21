import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from './prisma.service'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [ConfigModule.forRoot(), UsersModule, AuthModule],
	controllers: [AppController],
	providers: [AppService, PrismaService]
})
export class AppModule {}
