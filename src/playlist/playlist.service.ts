import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { returnSongObject } from "../utils/return-song.object";
import { returnPlaylistObject } from "./return-playlist.object";

@Injectable()
export class PlaylistService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  getPlaylistById(id: number) {
    const playlist = this.prisma.playlist.findUnique({
      where: {
        id: +id
      }, select: {
        ...returnPlaylistObject,
        songs: {
          select: returnSongObject
        },
        genres: true
      }
    });
    
    if (!playlist) throw new Error("Playlist not found");
    return playlist;
  }
}
