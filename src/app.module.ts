import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AlbumModule } from "./album/album.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ArtistModule } from "./artist/artist.module";
import { AuthModule } from "./auth/auth.module";
import { GenreModule } from "./genre/genre.module";
import { PlaylistModule } from "./playlist/playlist.module";
import { PrismaService } from "./prisma.service";
import { SearchModule } from "./search/search.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [ConfigModule.forRoot(), ServeStaticModule.forRoot({
    rootPath: join(__dirname, "..", "public")
  }), UsersModule, AuthModule, PlaylistModule, AlbumModule, ArtistModule, GenreModule, SearchModule],
  controllers: [AppController],
  providers: [AppService, PrismaService]
})
export class AppModule {
}
