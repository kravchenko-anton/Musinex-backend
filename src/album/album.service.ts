import { Injectable } from "@nestjs/common";
import { returnArtistObject } from "../artist/utils/return-artist.object";
import { PrismaService } from "../utils/prisma.service";
import { returnSongObject } from "../utils/return-song.object";
import { returnAlbumObject } from "./utils/return-album.object";

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  getAlbumById(id: number) {
    const album = this.prisma.album.findUnique({
      where: {
        id: +id
      }, select: {
        ...returnAlbumObject,
        songs: {
          select: returnSongObject
        },
        genres: true,
        artist: {
          select: returnArtistObject
        }
      }
    });
    if (!album) throw new Error("Album not found");
    return album;
  }
}
