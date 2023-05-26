import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  // SELECT id, name FROM "Artist" WHERE name = ${query};
  //     SELECT id, title FROM "Playlist" WHERE title = ${query};
  //     SELECT id, title FROM "Album" WHERE title = ${query};
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
}
