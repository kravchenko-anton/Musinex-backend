import { Module } from "@nestjs/common";
import { HistoryService } from "../history/history.service";
import { PrismaService } from "../prisma.service";
import { RecommendationController } from "./recommendation.controller";
import { RecommendationService } from "./recommendation.service";

@Module({
  controllers: [RecommendationController],
  providers: [RecommendationService, PrismaService, HistoryService]
})
export class RecommendationModule {
}
