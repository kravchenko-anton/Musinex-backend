import { Module } from "@nestjs/common";
import { HistoryService } from "../history/history.service";
import { RecommendationService } from "../recommendation/recommendation.service";
import { PrismaService } from "../utils/prisma.service";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
  controllers: [SearchController],
  providers: [SearchService, PrismaService, RecommendationService, HistoryService]
})
export class SearchModule {
}
