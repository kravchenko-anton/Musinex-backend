import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
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
      this.prisma.$queryRaw(Prisma.sql`
     SELECT
        "Song"."id",
        "Song"."created_at" AS "createdAt",
        "Song"."updated_at" AS "updatedAt",
        "Song"."title",
        "Song"."cover_big" AS "coverBig",
        "Song"."cover_medium" AS "coverMedium",
        "Song"."cover_small" AS "coverSmall",
        "Song"."duration",
        "Song"."release_date" AS "releaseDate",
        "Song"."mp3_path" AS "mp3Path",
        json_build_object(
          'id', "Artist"."id",
          'createdAt', "Artist"."created_at",
          'updatedAt', "Artist"."updated_at",
          'name', "Artist"."name",
          'followers', "Artist"."followers",
          'pictureBig', "Artist"."picture_big",
          'pictureMedium', "Artist"."picture_medium",
          'pictureSmall', "Artist"."picture_small"
        ) AS "artist"
      FROM
        "Song"
      JOIN
        "Artist" ON "Song"."artistId" = "Artist"."id"
      WHERE
        "Song".title LIKE ${query} OR "Song".title LIKE '%' || ${query} || '%';
      `),
      this.prisma.$queryRaw`
      SELECT
      "Album"."id",
      "Album"."created_at" AS "createdAt",
      "Album"."updated_at" AS "updatedAt",
      "Album"."title",
      "Album"."cover_big" AS "coverBig",
      "Album"."cover_medium" AS "coverMedium",
      "Album"."cover_small" AS "coverSmall",
      "Album"."release_date" AS "releaseDate",
      "Album"."fans",
      json_build_object(
        'id', "Artist"."id",
        'createdAt', "Artist"."created_at",
        'updatedAt', "Artist"."updated_at",
        'name', "Artist"."name",
        'followers', "Artist"."followers",
        'pictureBig', "Artist"."picture_big",
        'pictureMedium', "Artist"."picture_medium",
        'pictureSmall', "Artist"."picture_small"
      ) AS "artist"
      FROM "Album"
      LEFT JOIN "Artist" ON "Album"."artistId" = "Artist"."id"
      WHERE "Album".title LIKE ${query} OR "Album".title LIKE '%' || ${query} || '%';
      `,
      this.prisma.$queryRaw`
      SELECT
      "Playlist"."id",
      "Playlist"."created_at" AS "createdAt",
      "Playlist"."updated_at" AS "updatedAt",
      "Playlist"."title",
      "Playlist"."cover_big" AS "coverBig",
      "Playlist"."cover_medium" AS "coverMedium",
      "Playlist"."cover_small" AS "coverSmall",
      "Playlist"."fans",
      "Playlist"."release_date" AS "releaseDate"
      FROM "Playlist"
      WHERE "Playlist".title LIKE ${query} OR "Playlist".title LIKE '%' || ${query} || '%';
      `
      ,
      this.prisma.$queryRaw`
      SELECT
      "Artist"."id",
      "Artist"."created_at" AS "createdAt",
      "Artist"."updated_at" AS "updatedAt",
      "Artist"."name",
      "Artist"."followers",
      "Artist"."picture_big" AS "pictureBig",
      "Artist"."picture_medium" AS "pictureMedium",
      "Artist"."picture_small" AS "pictureSmall"
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
