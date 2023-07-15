import { Module } from "@nestjs/common";
import { PrismaService } from "../utils/prisma.service";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, PrismaService]
})
export class ArtistModule {
}
