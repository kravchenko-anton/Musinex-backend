import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  async search(query: string) {
    const results = await this.prisma.$transaction([
      this.prisma.song.findMany({
        include: {
          artist: true
        },
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } }
          ]
        }
      }),
      this.prisma.artist.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } }
          ]
        }
      }),
      this.prisma.playlist.findMany({
        include: {
          User: true
        },
        
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } }
          ]
        }
      }),
      this.prisma.album.findMany({
        include: {
          artist: true
        },
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } }
          ]
        }
      })
    ]);
    
    if (!results) throw new Error("Not Found");
    return {
      songs: results[0],
      artists: results[1],
      playlists: results[2],
      albums: results[3]
    };
  }
  
  async getCatalog() {
    const catalog = await this.prisma.$transaction([
      this.prisma.song.findMany({
        take: 25,
        include: { artist: true }
      }),
      this.prisma.artist.findMany({ take: 25 }),
      this.prisma.playlist.findMany({ take: 25, include: { User: true } }),
      this.prisma.album.findMany({ take: 25, include: { artist: true } })
    ]);
    return {
      songs: catalog[0],
      artists: catalog[1],
      playlists: catalog[2],
      albums: catalog[3]
    };
  }
}
