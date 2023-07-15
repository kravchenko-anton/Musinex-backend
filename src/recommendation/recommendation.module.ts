import { Module } from "@nestjs/common";
import { PrismaService } from "../utils/prisma.service";
import { RecommendationController } from "./recommendation.controller";
import { RecommendationService } from "./recommendation.service";

@Module({
  controllers: [RecommendationController],
  providers: [RecommendationService, PrismaService]
})
export class RecommendationModule {
}
