import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class GenreService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  getAll() {
    return this.prisma.genre.findMany({
      include: {
        songs: {
          take: 1
        }
      },
      orderBy: {
        id: "asc"
      }
    });
  }
  
  getById(id: number) {
    const genre = this.prisma.genre.findUnique({
      where: { id: +id },
      include: {
        albums: true,
        songs: true,
        playlists: true
      }
    });
    
    if (!genre) throw new Error("Genre not found");
    return genre;
  }
}
