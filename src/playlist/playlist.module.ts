import { Module } from "@nestjs/common";
import { PrismaService } from "../utils/prisma.service";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./playlist.service";

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService, PrismaService]
})
export class PlaylistModule {
}
