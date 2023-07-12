import { Injectable } from "@nestjs/common";
import { HistoryService } from "../history/history.service";
import { PrismaService } from "../prisma.service";


@Injectable()
export class RecommendationService {
  constructor(private readonly prisma: PrismaService, private readonly userHistory: HistoryService) {
  }
  
  async getRecommendation(id: number) {
    const otherSongs = await this.prisma.song.findMany({});
    const history = await this.userHistory.getHistory(id);
    const recommendations = [];
    for (const historyItem of history) {
      historyItem.songs.forEach((song) => {
        song.relatedSongs.forEach((relatedSong) => {
          if (recommendations.find((element) => element.title == relatedSong.title)) return;
          return recommendations.push(relatedSong);
        });
      });
    }
    if (recommendations.length < 60) {
      const songsToAdd = 60 - recommendations.length;
      for (let i = 0; i < songsToAdd; i++) {
        const randomIndex = Math.floor(Math.random() * otherSongs.length);
        recommendations.push(otherSongs[randomIndex]);
      }
    }
    return recommendations;
  }
  
  async getMix(id: number) {
    const recommendation = await this.getRecommendation(id);
    const mix1 = recommendation.slice(0, 10);
    const mix2 = recommendation.slice(10, 20);
    const mix3 = recommendation.slice(20, 30);
    const mix4 = recommendation.slice(30, 40);
    const mix5 = recommendation.slice(40, 50);
    const mix6 = recommendation.slice(50, 60);
    return {
      mix1,
      mix2,
      mix3,
      mix4,
      mix5,
      mix6
    };
  }
  
}
