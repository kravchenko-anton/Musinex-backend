import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  async search(query: string) {
    const results = await this.prisma.$transaction([
      this.prisma.song.findMany({
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
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } }
          ]
        }
      }),
      this.prisma.album.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } }
          ]
        }
      })
    ]);
    
    if (!results) throw new Error("Not Found");
    return results;
  }
  
  async getCatalog() {
    const catalog = await this.prisma.$transaction([
      this.prisma.song.findMany({
        take: 25,
        include: { artists: { take: 1 } }
      }),
      this.prisma.artist.findMany({ take: 25 }),
      this.prisma.playlist.findMany({ take: 25 }),
      this.prisma.album.findMany({ take: 25 })
    ]);
    return catalog;
  }
}
