import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  getArtistById(id: number) {
    const artist = this.prisma.artist.findUnique({
      where: {
        id: +id
      }, include: {
        Song: true,
        Album: true
      }
      
    });
    if (!artist) throw new Error("Artist not found");
    return artist;
    
  }
}
