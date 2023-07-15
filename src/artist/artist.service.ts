import { Injectable } from "@nestjs/common";
import { PrismaService } from "../utils/prisma.service";
import { returnSongObject } from "../utils/return-song.object";
import { returnArtistObject } from "./utils/return-artist.object";

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  getArtistById(id: number) {
    const artist = this.prisma.artist.findUnique({
      where: {
        id: +id
      }, select: {
        ...returnArtistObject,
        songs: {
          select: returnSongObject
        }
      }
      
    });
    if (!artist) throw new Error("Artist not found");
    return artist;
    
  }
}
