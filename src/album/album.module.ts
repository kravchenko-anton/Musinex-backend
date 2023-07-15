import { Module } from "@nestjs/common";
import { PrismaService } from "../utils/prisma.service";
import { AlbumController } from "./album.controller";
import { AlbumService } from "./album.service";

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, PrismaService]
})
export class AlbumModule {
}
