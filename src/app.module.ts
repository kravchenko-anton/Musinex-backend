import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ThrottlerModule } from "@nestjs/throttler";
import { join } from "path";
import { AlbumModule } from "./album/album.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ArtistModule } from "./artist/artist.module";
import { AuthModule } from "./auth/auth.module";
import { GenreModule } from "./genre/genre.module";
import { HistoryModule } from "./history/history.module";
import { PlaylistModule } from "./playlist/playlist.module";
import { RecommendationModule } from "./recommendation/recommendation.module";
import { SearchModule } from "./search/search.module";
import { UsersModule } from "./users/users.module";
import { PrismaService } from "./utils/prisma.service";

@Module({
  imports: [ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public")
    }), UsersModule, AuthModule, PlaylistModule, AlbumModule, ArtistModule, GenreModule, SearchModule, RecommendationModule, HistoryModule],
  controllers: [AppController],
  providers: [AppService, PrismaService]
})
export class AppModule {
}
