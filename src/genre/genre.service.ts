import { Injectable } from "@nestjs/common";
import { PrismaService } from "../utils/prisma.service";
import { returnSongObject } from "../utils/return-song.object";

@Injectable()
export class GenreService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  getAll() {
    return this.prisma.genre.findMany({
      include: {
        songs: {
          take: 1,
          select: returnSongObject
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
            genres: {
              some: {
                id: +id
              }
            }
          }
        },
        songs: {
          select: returnSongObject
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
