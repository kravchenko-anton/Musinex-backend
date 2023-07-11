import { Injectable } from "@nestjs/common";
import { HistoryService } from "../history/history.service";
import { PrismaService } from "../prisma.service";

@Injectable()
export class RecommendationService {
  constructor(private readonly prisma: PrismaService, private readonly userHistory: HistoryService) {
  }
  
  async getRecommendation(id: number) {
    const history = await this.userHistory.getHistory(id, {
      songs: {
        include: {
          artist: true,
          relatedSongs: {
            include: {
              artist: true
            }
          }
        }
      }
    });
    const recommendations = [];
    for (const historyItem of history) {
      historyItem.songs.forEach((song) => {
        song.relatedSongs.forEach((relatedSong) => {
          if (recommendations.find((element) => element.title == relatedSong.title)) return;
          return recommendations.push(relatedSong);
        });
      });
    }
    return recommendations;
  }
  
  async getMix(id: number) {
    const recommendation = await this.getRecommendation(id);
    const mix = [];
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * recommendation.length);
      mix.push(recommendation[randomIndex]);
    }
    return mix;
  }
  
  async getMostRecentArtist(id: number) {
    const recommendation = await this.getRecommendation(id);
    const artistArray: string[] = recommendation.map((song) => {
      return song.artist.name;
    });
    const mostRecentArtist = artistArray.reduce((a, b, i, arr) =>
        (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b),
      null);
    return {
      mostRecentArtist,
      likeMostRecentArtist: recommendation.find((song) => song.artist.name == mostRecentArtist)
    };
  }
}
