import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from './prisma.service'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module';
import { PlaylistModule } from './playlist/playlist.module';
import { AlbumModule } from './album/album.module';
import { SongModule } from './song/song.module';
import { ArtistModule } from './artist/artist.module';
import { GenreModule } from './genre/genre.module';
import { StatisticResolver } from './statistic/statistic.resolver';
import { StatiscticModule } from './statisctic/statisctic.module';

@Module({
	imports: [ConfigModule.forRoot(), UsersModule, AuthModule, PlaylistModule, AlbumModule, SongModule, ArtistModule, GenreModule, StatiscticModule],
	controllers: [AppController],
	providers: [AppService, PrismaService, StatisticResolver]
})
export class AppModule {}
