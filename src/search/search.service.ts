import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  async search(query: string) {
    const results = await this.prisma.$transaction([
      this.prisma.$queryRaw`SELECT * FROM "Song" WHERE title LIKE ${query} OR title LIKE '%' || ${query} || '%';`,
      this.prisma.$queryRaw`SELECT * FROM "Artist" WHERE name LIKE ${query} OR name LIKE '%' || ${query} || '%';`,
      this.prisma.$queryRaw`SELECT * FROM "Playlist" WHERE title LIKE ${query} OR title LIKE '%' || ${query} || '%';`,
      this.prisma.$queryRaw`SELECT * FROM "Album" WHERE title LIKE ${query} OR title LIKE '%' || ${query} || '%';`
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
    const results = await this.prisma.$transaction([
      this.prisma.$queryRaw`SELECT * FROM "Song" ORDER BY RANDOM() LIMIT 40;`,
      this.prisma.$queryRaw`SELECT * FROM "Artist" ORDER BY RANDOM() LIMIT 40;`,
      this.prisma.$queryRaw`SELECT * FROM "Playlist" ORDER BY RANDOM() LIMIT 40;`,
      this.prisma.$queryRaw`SELECT * FROM "Album" ORDER BY RANDOM() LIMIT 40;`
    ]);
    
    if (!results) throw new Error("Not Found");
    return {
      songs: results[0],
      artists: results[1],
      playlists: results[2],
      albums: results[3]
    };
  }
}
