import { Injectable } from "@nestjs/common";
import { PrismaService } from "../utils/prisma.service";
import { returnSongObject } from "../utils/return-song.object";


@Injectable()
export class RecommendationService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  async getRecommendation(id: number) {
    const otherSongs = await this.prisma.song.findMany({
      take: 60,
      orderBy: {
        artist: {
          followers: "desc"
        }
      }
    });
    const history = await this.prisma.history.findMany({
      where: {
        user: {
          id
        }
      },
      include: {
        songs: {
          include: {
            relatedSongs: {
              select: returnSongObject
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
    return {
      mix1: recommendation.slice(0, 10),
      mix2: recommendation.slice(10, 20),
      mix3: recommendation.slice(20, 30),
      mix4: recommendation.slice(30, 40),
      mix5: recommendation.slice(40, 50),
      mix6: recommendation.slice(50, 60)
    };
  }
  
}
