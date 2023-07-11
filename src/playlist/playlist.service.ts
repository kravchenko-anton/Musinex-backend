import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PlaylistService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  getPlaylistById(id: number) {
    const playlist = this.prisma.playlist.findUnique({
      where: {
        id: +id
      }, include: {
        songs: {
          include: {
            artist: true
          }
        },
        genres: true,
        User: true
      }
    });
    
    if (!playlist) throw new Error("Playlist not found");
    return playlist;
  }
}
