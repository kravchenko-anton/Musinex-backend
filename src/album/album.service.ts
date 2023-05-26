import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  getAlbumById(id: number) {
    const album = this.prisma.album.findUnique({
      where: {
        id: +id
      }
    });
    if (!album) throw new Error("Album not found");
    return album;
  }
}
