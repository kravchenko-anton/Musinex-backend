import { Injectable } from "@nestjs/common";
import { HistoryService } from "../history/history.service";
import { PrismaService } from "../prisma.service";
import { RecommendationService } from "../recommendation/recommendation.service";

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService,
              private readonly userHistory: HistoryService,
              private readonly recommendation: RecommendationService
  ) {
  }
  
  async search(query: string) {
    const results = await this.prisma.$transaction([
      this.prisma.$queryRaw`
      SELECT *
      FROM "Song"
      LEFT   JOIN "Artist" ON "Song"."artistId" = "Artist"."id"
      WHERE "Song".title LIKE ${query} OR "Song".title LIKE '%' || ${query} || '%';
      `,
      this.prisma.$queryRaw`
      SELECT *
      FROM "Album"
      LEFT JOIN "Artist" ON "Album"."artistId" = "Artist"."id"
      WHERE "Album".title LIKE ${query} OR "Album".title LIKE '%' || ${query} || '%';
      `,
      this.prisma.$queryRaw`
      SELECT *
      FROM "Playlist"
      WHERE "Playlist".title LIKE ${query} OR "Playlist".title LIKE '%' || ${query} || '%';
      `
      ,
      this.prisma.$queryRaw`
      SELECT *
      FROM "Artist"
      WHERE "Artist".name LIKE ${query} OR "Artist".name LIKE '%' || ${query} || '%';
      `
    ]);
    if (!results) throw new Error("Not Found");
    return {
      songs: results[0],
      albums: results[1],
      playlists: results[2],
      artists: results[3]
    };
  }
  
  async getCatalog(id: number) {
    const popularArtists = await this.prisma.artist.findMany({
      orderBy: {
        followers: "desc"
      },
      take: 10
    });
    const mixes = await this.recommendation.getMix(id);
    const lastReleases = await this.prisma.song.findMany({
      orderBy: {
        releaseDate: "desc"
      },
      take: 10,
      include: {
        artist: true
      }
    });
    const historyList = await this.userHistory.getHistoryList(id);
    return {
      mixes,
      lastReleases,
      popularArtists,
      historyList
    };
  }
}
