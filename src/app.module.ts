import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AlbumModule } from "./album/album.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ArtistModule } from "./artist/artist.module";
import { AuthModule } from "./auth/auth.module";
import { GenreModule } from "./genre/genre.module";
import { PlaylistModule } from "./playlist/playlist.module";
import { PrismaService } from "./prisma.service";
import { SearchModule } from "./search/search.module";
import { StatisticsModule } from "./statistics/statistics.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule, PlaylistModule, AlbumModule, ArtistModule, GenreModule, SearchModule, StatisticsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService]
})
export class AppModule {
}
