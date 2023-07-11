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
          take: 1,
          include: {
            artist: true
          }
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
        albums: {
          where: {
            genre: {
              some: {
                id: +id
              }
            }
          }
        },
        songs: {
          include: {
            artist: true
          }
        },
        playlists: {
          include: {
            genres: true
          }
        }
      }
    });
    
    if (!genre) throw new Error("Genre not found");
    return genre;
  }
}
